/**
 * Writes the selectors and the size geometry the navigation menu's recipe is written from.
 *
 * @remarks
 *   The module covers the bar's controls, the place a panel opens at and a panel's links. It is a
 *   separate module so the recipe is under the 300-line limit.
 */

import {
  below,
  controlSizes,
  dense,
  interactive,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe, from which the binding writes each part's class.
 */
export const CLASS = "navigation-menu";

/**
 * Selects one of the three sizes the menu offers.
 */
export type Step = "lg" | "md" | "sm";

/**
 * Lists the sizes the menu offers, in reading order.
 */
export const SIZES: readonly Step[] = ["sm", "md", "lg"];

/**
 * Selects a link in the bar, beside the triggers, from a rule on the link.
 */
export const BARRED = `.${CLASS}__item > &`;

/**
 * Fill and ink of a trigger or a link in the bar under the pointer.
 */
export const HOVERED = { background: "bg.subtle", color: "fg" };

/**
 * Selects a panel shown inside the viewport, from a rule on the panel.
 */
export const VIEWED = `.${CLASS}__viewport > &`;

/**
 * Selects a trigger in a vertical menu from its item, because the machine writes the orientation
 * on the item and not on the trigger.
 */
export const UPRIGHT = "[data-orientation=vertical] > &";

/**
 * Selects a list that renders an indicator.
 */
const INDICATED = `.${CLASS}__list:has(> .${CLASS}__indicator)`;

/**
 * Selects an item in a list that renders an indicator, which is not positioned, because the machine
 * measures a trigger against its positioned ancestor and the indicator reads that place against
 * the list.
 */
export const UNANCHORED = `${INDICATED} > &`;

/**
 * Selects a panel in place in a list that renders an indicator, which reads its trigger's measured
 * place, because its item is not positioned.
 */
const MEASURED = `${INDICATED} &`;

/**
 * Selects a panel in place in a horizontal list that renders an indicator, which reads its
 * trigger's measured inline place.
 */
const ACROSS = `.${CLASS}__list[data-orientation=horizontal]:has(> .${CLASS}__indicator) &`;

/**
 * Selects a panel in place in a list that renders an indicator while another item is open, which
 * hides at once, because the measured place it reads is the open trigger's.
 */
export const REPLACED = `${INDICATED}:has(> .${CLASS}__item[data-state=open]) &`;

/**
 * Selects an element whose first element is an icon: a panel link with a leading icon, and the
 * control that `controlSizes` gives one step less inset at its start, which a trigger leaves out,
 * because its icon trails its words.
 */
export const LEADING = "&:has(> svg:first-child)";

/**
 * Moves an element back by one hairline.
 */
const HAIRLINE_BACK = "calc({borderWidths.hairline} * -1)";

/**
 * Moves an element back by two hairlines.
 */
const HAIRLINES_BACK = "calc({borderWidths.hairline} * -2)";

/**
 * Returns the viewport's correction for its two hairline edges, which the machine leaves out when
 * it aligns the panel's width to the open trigger.
 *
 * @remarks
 *   The viewport's content box is the panel's size, so its edges make it two hairlines wider and
 *   taller than the box the machine places. A centred viewport moves back by one hairline and an
 *   end-aligned one by two, along the bar's axis. The machine's place is physical, so the
 *   correction is too.
 */
export function aligned(): SystemStyleObject {
  return {
    "&[data-align=center]": {
      _vertical: { marginLeft: "0", marginTop: HAIRLINE_BACK },
      marginLeft: HAIRLINE_BACK,
    },
    "&[data-align=end]": {
      _vertical: { marginLeft: "0", marginTop: HAIRLINES_BACK },
      marginLeft: HAIRLINES_BACK,
    },
  };
}

/**
 * Returns what a trigger and a link in the bar share: a control in the muted ink, laid out in a
 * row, that fills under the pointer.
 */
export function barred(): SystemStyleObject {
  return {
    ...interactive(),
    _hover: HOVERED,
    alignItems: "center",
    borderRadius: "l2",
    color: "fg.muted",
    display: "inline-flex",
    flexDirection: "row",
    fontWeight: "medium",
    textDecoration: "none",
    whiteSpace: "nowrap",
  };
}

/**
 * Returns a trigger's size: a control's height, text and insets, the end inset one step less
 * before a trailing icon, and the icon one step smaller on the icon scale.
 *
 * @param size - The size of the menu.
 */
export function triggered(size: Step): SystemStyleObject {
  const { [LEADING]: _leading, ...control } = controlSizes()[size];

  return {
    ...control,
    "&:has(> svg:last-child)": { paddingInlineEnd: dense(`{spacing.inset.${below(size)}}`) },
    "& > svg": { boxSize: dense(`{sizes.icon.${below(size)}}`) },
  };
}

/**
 * Returns where a panel in place opens: one gap under its trigger, or one gap beside it in a
 * vertical menu.
 *
 * @remarks
 *   A panel is placed against its item. In a list that renders an indicator it reads the trigger's
 *   measured place against the list instead. Inside the viewport a panel is not positioned, so no
 *   offset here applies to it.
 * @param size - The size of the menu.
 */
export function placed(size: Step): SystemStyleObject {
  const gap = dense(`{spacing.gap.${size}}`);
  const beside = `calc(100% + ${gap})`;

  return {
    _vertical: { insetBlockStart: "0", insetInlineStart: beside },
    [ACROSS]: { left: "var(--trigger-x, 0px)", right: "auto" },
    insetBlockStart: beside,
    [MEASURED]: {
      _vertical: { insetBlockStart: "var(--trigger-y, 0px)" },
      insetBlockStart: `calc(var(--trigger-y, 0px) + var(--trigger-height, 0px) + ${gap})`,
    },
  };
}

/**
 * Returns a link's size: a row of the panel with its icon on the icon scale, or a trigger's size
 * for a link in the bar.
 *
 * @param size - The size of the menu.
 */
export function linked(size: Step): SystemStyleObject {
  return {
    "& > svg": { boxSize: dense(`{sizes.icon.${size}}`) },
    [BARRED]: { ...triggered(size), paddingBlock: "0" },
    columnGap: dense(`{spacing.gap.${size}}`),
    paddingBlock: dense(`{spacing.gap.${size}}`),
    paddingInline: dense(`{spacing.inset.${below(size)}}`),
    rowGap: dense("{spacing.gap.xs}"),
    textStyle: `body.${below(size)}`,
  };
}
