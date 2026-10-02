/**
 * Renders the navigation landmark around the trail.
 *
 * @remarks
 *   The element is `nav`. Its `aria-label` defaults to `Breadcrumb`, because a page with a site
 *   navigation and a breadcrumb has two navigation landmarks, and screen readers list an unnamed
 *   one as `navigation`. A caller passes a translated label through `aria-label`.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#breadcrumb/context.ts";

/**
 * Renders a `nav` and provides the size and variant to every part inside it.
 */
export const Root = withProvider("nav", "root", {
  defaultProps: { "aria-label": "Breadcrumb" },
});

/**
 * Describes the props of Breadcrumb.Root: the recipe's variants and the props of a nav element.
 */
export type RootProps = ComponentProps<typeof Root>;
