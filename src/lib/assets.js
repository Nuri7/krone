/**
 * Resolves a public asset path using Vite's base URL.
 * On GitHub Pages with base: '/krone/', this turns
 *   "/images/hero.png" → "/krone/images/hero.png"
 * In dev (base: '/'), it stays "/images/hero.png".
 */
export function asset(path) {
  const base = import.meta.env.BASE_URL || '/';
  // Remove leading slash from path to avoid double-slash
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${clean}`;
}
