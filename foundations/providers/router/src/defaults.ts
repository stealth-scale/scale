/**
 * How a router in this design system behaves before an application says otherwise.
 */

/**
 * The options every application's router starts from, spread before its own.
 *
 * @remarks
 *   A route preloads on intent, which is when the pointer rests on a link or the link takes focus,
 *   so a page is usually loaded before it is asked for.
 *   A preloaded route never counts as fresh on its own. The query client decides freshness for
 *   everything it loads, and a router keeping its own staleness would serve a copy the client had
 *   already replaced.
 *   Scroll position is restored on the way back, because a person returning to a list expects to be
 *   where they left it rather than at the top.
 *   The window is moved in one step, on the way back and to the top of a new page alike. The
 *   library moves it with the page's own scroll behaviour by default, and the foundation sets that
 *   to smooth for a link into the page, so a page opened from a scrolled one glided in from above.
 */
export const routerDefaults = {
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  scrollRestorationBehavior: "instant",
} as const;
