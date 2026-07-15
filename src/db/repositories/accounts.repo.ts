import { v4 as uuid } from 'uuid';
import { db } from '../schema';
import type { Account } from '../types';

export interface CreateAccountInput {
  name: string;
  type: Account['type'];
  initialBalance: number;
  color?: string;
  icon?: string;
}

export async function createAccount(input: CreateAccountInput): Promise<Account> {
  const now = new Date().toISOString();
  const account: Account = {
    id: uuid(),
    name: input.name,
    type: input.type,
    initialBalance: input.initialBalance,
    currentBalance: input.initialBalance,
    color: input.color,
    icon: input.icon,
    archived: false,
    createdAt: now,
    updatedAt: now,
  };
  await db.accounts.add(account);
  return account;
}

export async function updateAccount(id: string, changes: Partial<CreateAccountInput>): Promise<void> {
  await db.accounts.update(id, { ...changes, updatedAt: new Date().toISOString() });
}

export async function archiveAccount(id: string): Promise<void> {
  await db.accounts.update(id, { archived: true, updatedAt: new Date().toISOString() });
}
