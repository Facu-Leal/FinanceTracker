const STORAGE_KEY = 'financeTracker.defaultAccountId';

export function getStoredDefaultAccountId(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredDefaultAccountId(accountId: string): void {
  localStorage.setItem(STORAGE_KEY, accountId);
}
