/**
 * Renders a section of a page, names it after its title and measures its own width.
 *
 * @remarks
 *   The element is `section`. While a `Section.Title` is mounted, the root sets `aria-labelledby`
 *   to the title's id, so a section with a title is a landmark and the caller writes no id, and a
 *   section without one points at no missing element. Pass `aria-label` on the root when the
 *   section's name is elsewhere on the screen. The size defaults to the page's size, so one size on
 *   `Page.Root` sets every section under it, and to `md` outside a page. The root measures its own
 *   width rather than the window's, so a section beside an open sidebar folds on its own room. A
 *   section folds below 40rem, and an annotated section below 48rem, because its header and body
 *   share the row.
 */

import { type ComponentProps, type ReactElement, useId, useMemo, useRef, useState } from "react";

import { useNarrow, widthOf } from "@stealthscale/provider-viewport";

import { useOptionalPage } from "#page/state.ts";
import { withProvider } from "#section/context.ts";
import { SectionProvider } from "#section/state.ts";

/**
 * Breakpoint whose start width the root compares its own width against: `sm`, or `md` when the
 * section is annotated.
 *
 * @remarks
 *   The root compares widths and asks no media query, because a section beside an open sidebar is
 *   narrow while the window is wide.
 */
const FOLDS_BELOW = { annotated: "md", plain: "sm" } as const;

/**
 * Renders the `section` with the recipe's root class, which provides the variants to the parts.
 */
const Block = withProvider("section", "root");

/**
 * Describes the props of the section: the recipe's variants and the props of a `section`, without
 * `aria-labelledby`, which the root sets.
 */
export type RootProps = Omit<ComponentProps<typeof Block>, "aria-labelledby">;

/**
 * Renders the section with its title's id and its measured width.
 *
 * @param props - The recipe's variants and the props of a `section`.
 * @returns The `section` element, with `data-narrow` while it is narrow.
 */
export function Root({ size, ...rest }: RootProps): ReactElement {
  const measured = useRef<HTMLElement>(null);
  const below = FOLDS_BELOW[rest.annotated === true ? "annotated" : "plain"];
  const narrow = useNarrow(measured, widthOf(below), below);
  const page = useOptionalPage();
  const titleId = useId();
  const [titled, setTitled] = useState(false);
  const sized = size ?? page?.size ?? "md";
  const state = useMemo(
    () => ({ narrow, setTitled, size: sized, titleId }),
    [narrow, sized, titleId],
  );

  return (
    <SectionProvider value={state}>
      <Block
        aria-labelledby={titled ? titleId : undefined}
        size={sized}
        {...rest}
        data-narrow={narrow ? "" : undefined}
        ref={measured}
      />
    </SectionProvider>
  );
}
