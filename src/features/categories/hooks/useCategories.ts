import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db';
import type { Category } from '../../../db/types';

export function useCategories(kind?: Category['kind']): Category[] {
  return (
    useLiveQuery(async () => {
      const all = await db.categories.toArray();
      return all.filter((c) => !c.archived && (!kind || c.kind === kind || c.kind === 'both'));
    }, [kind]) ?? []
  );
}
