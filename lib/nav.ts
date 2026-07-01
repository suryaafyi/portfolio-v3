// `href` for route links; `onClick` for in-page actions (e.g. the Works detail
// dock — "← Works" / "Next →" don't navigate, they swap the in-page view).
export type NavItem = { label: string; href?: string; onClick?: () => void; cta?: boolean };

// Per-route dock config. Home shows the primary nav; project routes (later)
// swap to index/next. Falls back to the home set.
export const NAV: Record<string, NavItem[]> = {
  "/": [
    { label: "Works", href: "/works" },
    { label: "About", href: "/about" },
    { label: "Lab", href: "/lab" },
    { label: "Contact", href: "/contact" },
  ],
};

export function getNav(pathname: string): NavItem[] {
  if (NAV[pathname]) return NAV[pathname];
  // Future project pages e.g. /works/<slug>
  if (pathname.startsWith("/works/")) {
    return [
      { label: "← Index", href: "/works" },
      { label: "Next →", href: "#" },
    ];
  }
  return NAV["/"];
}
