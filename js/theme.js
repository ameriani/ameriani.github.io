export const THEME_STORAGE_KEY = 'am-theme';

export function resolveInitialTheme({ stored, prefersDark }) {
  if (stored === 'light' || stored === 'dark') return stored;
  return prefersDark ? 'dark' : 'light';
}

export function toggleTheme(current) {
  return current === 'dark' ? 'light' : 'dark';
}

export function applyTheme(theme, root = globalThis.document?.documentElement) {
  if (!root) return;
  root.dataset.theme = theme;
}

export function persistTheme(theme, storage = globalThis.localStorage) {
  storage?.setItem(THEME_STORAGE_KEY, theme);
}

export function readStoredTheme(storage = globalThis.localStorage) {
  const value = storage?.getItem(THEME_STORAGE_KEY);
  return value === 'light' || value === 'dark' ? value : null;
}
