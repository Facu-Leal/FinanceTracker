export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'financeTracker.theme';

export function getStoredTheme(): ThemePreference {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === 'light' || value === 'dark' ? value : 'system';
}

function resolveTheme(pref: ThemePreference): 'light' | 'dark' {
  if (pref !== 'system') return pref;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(pref: ThemePreference): void {
  document.documentElement.setAttribute('data-bs-theme', resolveTheme(pref));
}

export function setStoredTheme(pref: ThemePreference): void {
  localStorage.setItem(STORAGE_KEY, pref);
  applyTheme(pref);
}

/** Call once at startup (before or during initial render) to apply the saved/system theme and keep it in sync with OS changes. */
export function initTheme(): void {
  applyTheme(getStoredTheme());
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getStoredTheme() === 'system') applyTheme('system');
  });
}
