/**
 * Renders where the page is among the pages above it: a breadcrumb trail on a wide page and one
 * link back on a narrow one.
 *
 * @remarks
 *   The items are the pages above this one, the nearest last. The page itself is not an item,
 *   because the title names it. On a wide page the trail is the navigation package's breadcrumb in
 *   the context row, one size smaller than the page, named by `label`. On a narrow page the trail
 *   folds to one link back to the nearest item, with `backIcon` before its words, so the link names
 *   the page it opens.
 */

import { Fragment, type MouseEvent, type ReactElement, type ReactNode } from "react";

import { Breadcrumb } from "@stealthscale/component-navigation";

import { Context } from "#page/context-band.tsx";
import { type PageSize, usePage } from "#page/state.ts";
import { Trail } from "#page/trail.ts";

/**
 * Describes one page above this one.
 */
export interface Crumb {
  /**
   * Address of the page.
   */
  readonly href: string;

  /**
   * Words that name the page.
   */
  readonly label: string;

  /**
   * Handler the link calls when a reader presses it, for a router that handles the navigation.
   */
  readonly onClick?: ((event: MouseEvent<HTMLAnchorElement>) => void) | undefined;
}

/**
 * Describes the props of the breadcrumbs: the pages above this one, the trail's name and the marks.
 */
export interface BreadcrumbsProps {
  /**
   * Mark before the words of the narrow page's link back, such as an arrow.
   */
  readonly backIcon?: ReactNode | undefined;

  /**
   * Pages above this one, the nearest last.
   */
  readonly items: readonly Crumb[];

  /**
   * Accessible name of the trail's navigation landmark. Defaults to `Breadcrumb`.
   */
  readonly label?: string | undefined;

  /**
   * Content of the separator between two items. Defaults to `/`.
   */
  readonly separator?: ReactNode | undefined;
}

/**
 * Size of the breadcrumb per page size, one size smaller than the page.
 */
const CRUMBS: Readonly<Record<PageSize, "md" | "sm" | "xs">> = { lg: "md", md: "sm", sm: "xs" };

/**
 * Renders the trail, or the link back on a narrow page.
 *
 * @param props - The pages above this one, the trail's name and the marks.
 * @returns The context row with the trail, the link back, or nothing without an item.
 */
export function Breadcrumbs({
  backIcon,
  items,
  label = "Breadcrumb",
  separator = "/",
}: BreadcrumbsProps): null | ReactElement {
  const page = usePage();
  const parent = items.at(-1);

  if (parent === undefined) return null;

  if (page.narrow) {
    return (
      <Trail href={parent.href} onClick={parent.onClick}>
        {backIcon}
        {parent.label}
      </Trail>
    );
  }

  return (
    <Context>
      <Breadcrumb.Root aria-label={label} size={CRUMBS[page.size]}>
        <Breadcrumb.List>
          {items.map((crumb, at) => (
            <Fragment key={crumb.href}>
              {at === 0 ? null : <Breadcrumb.Separator>{separator}</Breadcrumb.Separator>}
              <Breadcrumb.Item>
                <Breadcrumb.Link href={crumb.href} onClick={crumb.onClick}>
                  {crumb.label}
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Fragment>
          ))}
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </Context>
  );
}
