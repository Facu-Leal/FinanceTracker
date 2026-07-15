import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db';
import type { Account } from '../../../db/types';

export function useAccounts(includeArchived = false): Account[] {
  return (
    useLiveQuery(async () => {
      const all = await db.accounts.toArray();
      return includeArchived ? all : all.filter((a) => !a.archived);
    }, [includeArchived]) ?? []
  );
}
