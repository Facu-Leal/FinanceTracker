import type { BackupData } from './schema';

/**
 * The version of the BACKUP DATA SHAPE — bumped only when an entity's fields change,
 * independent of Dexie's own structural version (see db/schema.ts). Empty for now:
 * this is the first shape, so there's nothing to migrate from yet.
 */
export const CURRENT_SCHEMA_VERSION = 1;

const migrations: Record<number, (data: BackupData) => BackupData> = {
  // 2: (data) => ({ ...data, transactions: data.transactions.map((t) => ({ ...t, newField: 'default' })) }),
};

/** Applies every migration between fromVersion and CURRENT_SCHEMA_VERSION, in order. Always additive. */
export function migrateToLatest(data: BackupData, fromVersion: number): BackupData {
  let result = data;
  for (let v = fromVersion; v < CURRENT_SCHEMA_VERSION; v++) {
    const migrate = migrations[v + 1];
    if (migrate) result = migrate(result);
  }
  return result;
}
