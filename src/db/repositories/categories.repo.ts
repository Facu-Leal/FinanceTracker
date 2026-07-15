import { v4 as uuid } from 'uuid';
import { db } from '../schema';
import type { Category } from '../types';

export interface CreateCategoryInput {
  name: string;
  icon: string;
  color: string;
  kind: Category['kind'];
  monthlyBudget?: number;
  warningThresholdPercent?: number;
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const category: Category = {
    id: uuid(),
    archived: false,
    ...input,
  };
  await db.categories.add(category);
  return category;
}

export async function updateCategory(id: string, changes: Partial<CreateCategoryInput>): Promise<void> {
  await db.categories.update(id, changes);
}

export async function archiveCategory(id: string): Promise<void> {
  await db.categories.update(id, { archived: true });
}
