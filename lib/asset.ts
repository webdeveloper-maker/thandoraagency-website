/**
 * Base path the site is served under: "" locally, "/thandoraagency-website"
 * on GitHub Pages (set by the deploy workflow). Next adds it to <Link> and
 * /_next files itself, but not to plain <img src> / data strings, so wrap
 * every file from /public in asset().
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${basePath}${path}`;
