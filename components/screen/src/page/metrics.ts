/**
 * Computes the rules the page recipe writes for the tabs in the navigation band, the panel the tab
 * picker opens and the title's heading role.
 *
 * @remarks
 *   The module is separate from the recipe so the recipe is under the 300-line limit. It imports no
 *   React, because the theme plugin evaluates the recipe in Node.
 */

import {
  CONTROL_INSET_END,
  CONTROL_INSET_START,
  dense,
  type Scale,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Class name of the page's recipe, which a selector across bands reads.
 *
 * @remarks
 *   The binding writes one class per band, such as `page__nav`, and no attribute that names the
 *   band. A selector for another band builds that class from this constant.
 */
export const CLASS = "page";

/**
 * Class name of the tabs' recipe, whose root the navigation band shrinks to its tabs.
 */
export const TABS = "tabs";

/**
 * Class name of the command palette's recipe, whose root the palette panel renders flat.
 */
export const COMMAND = "command";

/**
 * Selects the root of the tabs in the navigation band.
 */
export const TABS_IN_NAV = `& > .${TABS}__root`;

/**
 * Selects every tab of a strip in the navigation band.
 */
const TAB_IN_NAV = `& .${TABS}__trigger`;

/**
 * Selects one of the page's three sizes.
 */
type Step = "lg" | "md" | "sm";

/**
 * Tab height and inline inset per page size: a medium or large page's tabs are 48px tall and inset
 * by the `md` inset, a small page's 44px and the `sm` inset.
 */
const TABBED: Readonly<Record<Step, readonly [height: Scale, inset: Scale]>> = {
  lg: ["xl", "md"],
  md: ["xl", "md"],
  sm: ["lg", "sm"],
};

/**
 * Returns the navigation band's rules for its tabs at a page size.
 *
 * @remarks
 *   The tabs are taller than a control of their text's size, so the band's other controls centre
 *   on them with room above and below. Each tab reads its inline inset from the control inset
 *   properties, and the strip starts one inset before the gutter, so the first tab's words start
 *   where the title starts. The recipe writes the rules in its size variant, because the tabs' own
 *   size variant sets the height in the same layer and these selectors outweigh it.
 * @param size - The page's size.
 */
export function tabbed(size: Step): SystemStyleObject {
  const [height, inset] = TABBED[size];
  const room = dense(`{spacing.inset.${inset}}`);

  return {
    [TAB_IN_NAV]: {
      [CONTROL_INSET_END]: room,
      [CONTROL_INSET_START]: room,
      height: dense(`{sizes.control.${height}}`),
    },
    [TABS_IN_NAV]: { marginInlineStart: `calc(${room} * -1)` },
  };
}

/**
 * Styles the panel the tab picker opens as one box: the popover's edge and shadow around the
 * command palette's rows, with neither the popover's padding nor the palette's own edge.
 *
 * @remarks
 *   The popover pads its content and the palette draws a raised panel, so without these rules the
 *   list renders as a box inside a box. The padding rule selects the machine's `data-state` too,
 *   because the popover's size variant sets the padding in the same layer.
 */
export const FLAT_PALETTE = {
  "&[data-state]": { padding: "0" },
  [`& > .${COMMAND}__root`]: {
    borderRadius: "0",
    borderWidth: "0",
    boxShadow: "none",
    maxBlockSize: "inherit",
  },
  maxBlockSize: "min(var(--available-height), {sizes.60})",
};

/**
 * Selects the title of a narrow page.
 */
const NARROW_TITLE = `.${CLASS}__root[data-narrow] > .${CLASS}__header > &`;

/**
 * Heading role of the title at each size, one size larger than a section title's at that size, and
 * one size smaller on a narrow page.
 *
 * @remarks
 *   The page title is the one heading above every section title on the page, so it reads a larger
 *   role than theirs. A narrow page gives the title's row less room, so the title reads one role
 *   smaller there.
 */
export const TITLES = {
  lg: { [NARROW_TITLE]: { textStyle: "heading.lg" }, textStyle: "heading.xl" },
  md: { [NARROW_TITLE]: { textStyle: "heading.md" }, textStyle: "heading.lg" },
  sm: { [NARROW_TITLE]: { textStyle: "heading.sm" }, textStyle: "heading.md" },
};
