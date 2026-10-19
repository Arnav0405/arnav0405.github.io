export const chapters = [
  { href: "/", label: "Cover", numeral: "00" },
  { href: "/about", label: "Prologue", numeral: "01" },
  { href: "/experience", label: "Experience", numeral: "02" },
  { href: "/projects", label: "Works", numeral: "03" },
];

// `trailingSlash: true` in next.config makes the router report paths as "/about/".
// Normalize both sides so lookups work regardless of the trailing slash.
export function normalizePath(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function chapterIndex(pathname: string) {
  return chapters.findIndex((c) => c.href === normalizePath(pathname));
}
