import { db } from '../../../db';
import { CURRENT_SCHEMA_VERSION } from './migrations';
import type { BackupFile } from './schema';

const LAST_BACKUP_KEY = 'financeTracker.lastBackupAt';

export async function buildBackup(): Promise<BackupFile> {
  const [
    accounts,
    categories,
    transactions,
    fixedExpenses,
    fixedExpenseOccurrences,
    installmentPurchases,
    installments,
    budgets,
  ] = await Promise.all([
    db.accounts.toArray(),
    db.categories.toArray(),
    db.transactions.toArray(),
    db.fixedExpenses.toArray(),
    db.fixedExpenseOccurrences.toArray(),
    db.installmentPurchases.toArray(),
    db.installments.toArray(),
    db.budgets.toArray(),
  ]);

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion: '0.1.0',
    data: {
      accounts,
      categories,
      transactions,
      fixedExpenses,
      fixedExpenseOccurrences,
      installmentPurchases,
      installments,
      budgets,
    },
  };
}

/** Builds the backup and triggers a browser download of it as a .json file. */
export async function downloadBackup(): Promise<void> {
  const backup = await buildBackup();
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `finance-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);

  localStorage.setItem(LAST_BACKUP_KEY, backup.exportedAt);
}

export function getLastBackupAt(): string | null {
  return localStorage.getItem(LAST_BACKUP_KEY);
}
