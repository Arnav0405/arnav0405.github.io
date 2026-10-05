export const chapters = [
  { href: "/", label: "Cover" },
  { href: "/about", label: "Prologue" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Works" },
];

// `trailingSlash: true` in next.config makes the router report paths as "/about/".
// Normalize both sides so lookups work regardless of the trailing slash.
export function normalizePath(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function chapterIndex(pathname: string) {
  return chapters.findIndex((c) => c.href === normalizePath(pathname));
}