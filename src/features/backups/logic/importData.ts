import { db } from '../../../db';
import { backupFileSchema, type BackupData } from './schema';
import { migrateToLatest, CURRENT_SCHEMA_VERSION } from './migrations';
import { downloadBackup } from './exportData';

export class ImportError extends Error {}

export interface ImportPreview {
  data: BackupData;
  counts: Record<keyof BackupData, number>;
  exportedAt: string;
}

/** Parses, migrates, and validates an uploaded backup file's text. Throws ImportError with a user-facing message. */
export function parseBackupFile(jsonText: string): ImportPreview {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new ImportError('El archivo no es un JSON válido.');
  }

  const result = backupFileSchema.safeParse(parsed);
  if (!result.success) {
    throw new ImportError('El archivo no tiene el formato de un respaldo de Finance Tracker.');
  }

  const file = result.data;
  if (file.schemaVersion > CURRENT_SCHEMA_VERSION) {
    throw new ImportError('Este respaldo fue exportado por una versión más nueva de la app. Actualizá la app antes de importarlo.');
  }

  const data = migrateToLatest(file.data, file.schemaVersion);
  validateReferentialIntegrity(data);

  const counts = Object.fromEntries(
    Object.entries(data).map(([key, list]) => [key, (list as unknown[]).length]),
  ) as Record<keyof BackupData, number>;

  return { data, counts, exportedAt: file.exportedAt };
}

function validateReferentialIntegrity(data: BackupData): void {
  const accountIds = new Set(data.accounts.map((a) => a.id));
  const categoryIds = new Set(data.categories.map((c) => c.id));

  for (const t of data.transactions) {
    if (!accountIds.has(t.accountId)) {
      throw new ImportError(`El movimiento "${t.description}" referencia una cuenta que no existe en el archivo.`);
    }
    if (t.toAccountId && !accountIds.has(t.toAccountId)) {
      throw new ImportError(`El movimiento "${t.description}" referencia una cuenta destino que no existe.`);
    }
    if (t.categoryId && !categoryIds.has(t.categoryId)) {
      throw new ImportError(`El movimiento "${t.description}" referencia una categoría que no existe.`);
    }
  }
}

/** Replaces all on-device data with the imported set. Exports the current data first as a safety net. */
export async function commitImport(data: BackupData): Promise<void> {
  await downloadBackup();

  await db.transaction(
    'rw',
    [
      db.accounts,
      db.categories,
      db.transactions,
      db.fixedExpenses,
      db.fixedExpenseOccurrences,
      db.installmentPurchases,
      db.installments,
      db.budgets,
    ],
    async () => {
      await Promise.all([
        db.accounts.clear(),
        db.categories.clear(),
        db.transactions.clear(),
        db.fixedExpenses.clear(),
        db.fixedExpenseOccurrences.clear(),
        db.installmentPurchases.clear(),
        db.installments.clear(),
        db.budgets.clear(),
      ]);
      await Promise.all([
        db.accounts.bulkAdd(data.accounts),
        db.categories.bulkAdd(data.categories),
        db.transactions.bulkAdd(data.transactions),
        db.fixedExpenses.bulkAdd(data.fixedExpenses),
        db.fixedExpenseOccurrences.bulkAdd(data.fixedExpenseOccurrences),
        db.installmentPurchases.bulkAdd(data.installmentPurchases),
        db.installments.bulkAdd(data.installments),
        db.budgets.bulkAdd(data.budgets),
      ]);
    },
  );
}
