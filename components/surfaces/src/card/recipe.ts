/**
 * Styles the nine slots of the card.
 *
 * @remarks
 *   The root publishes its own inset as a custom property. The media reads it back as a negative
 *   margin, and a divided band as the space between its rule and its text; writing either as a
 *   literal length would mean one value per step, and so a compound variant for every pair of the
 *   size axis and the axis beside it. The header is a single grid rather than a row of stacks, so
 *   the indicator spans both rows of the title block and the aside stays at the end whatever that
 *   block holds. Stacks inside a row would need a wrapper the anatomy does not name.
 */

import {
  below,
  cornerVariants,
  defineSlotRecipe,
  dense,
  justifyVariants,
  motionVariants,
  onSlot,
  onSlots,
  sizeVariants,
  statusEmitted,
  statusVariants,
  surface,
} from "@stealthscale/theme/authoring";

/**
 * The custom property carrying the root's inset, which the media and the rules read back.
 */
const INSET = "--card-inset";

/**
 * The four sizes the card is styled at.
 */
const STEPS = ["sm", "md", "lg", "xl"] as const;

/**
 * The negative margin that cancels the root's inset.
 */
const BLEED = `calc(-1 * var(${INSET}))`;

/**
 * The border style a divided band is separated by.
 */
const RULE = { borderColor: "border", borderStyle: "solid" };

/**
 * Declares the slot styles and the card's variant axes, defaulting to an elevated panel at the md
 * size.
 */
export const recipe = defineSlotRecipe({
  base: {
    aside: { alignItems: "center", display: "flex", flex: "0 0 auto", gridColumn: "3" },
    content: {
      display: "flex",
      flex: "1",
      flexDirection: "column",
      gap: dense("{spacing.gap.sm}"),
    },
    description: { color: "fg.muted", gridColumn: "2", textStyle: "body.sm" },
    footer: {
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      gap: dense("{spacing.gap.sm}"),
    },
    header: {
      alignItems: "center",
      columnGap: dense("{spacing.gap.sm}"),
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
    },
    indicator: { alignItems: "center", display: "flex", flex: "0 0 auto", gridColumn: "1" },
    media: { display: "block", overflow: "hidden" },
    root: { ...surface(), display: "flex", overflow: "hidden", position: "relative" },
    title: { fontWeight: "semibold", gridColumn: "2" },
  },
  className: "card",
  compoundVariants: [
    {
      css: { root: { borderColor: "colorPalette.border" } },
      name: "toned",
      status: ["error", "info", "success", "warning"],
      variant: ["outline", "subtle"],
    },
    {
      css: { root: { _hover: { boxShadow: "lg" } } },
      interactive: true,
      name: "lifted",
      variant: "elevated",
    },
  ],
  defaultVariants: {
    justify: "end",
    orientation: "vertical",
    radius: "l2",
    size: "md",
    variant: "elevated",
  },
  jsx: [/^Card(\.\w+)?$/u],
  slots: [
    "root",
    "media",
    "header",
    "indicator",
    "title",
    "description",
    "aside",
    "content",
    "footer",
  ],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * The pattern painted behind the card's content.
     *
     * @remarks
     *   Each of the nine values is a layer style the theme already defines, so restating one in a
     *   theme moves every card wearing it. A pattern paints the root's background image and leaves
     *   its fill untouched, which lets it compose with any look: a grid behind a panel, dots behind
     *   a glass card, stars behind a plain one. `aurora` animates, since a gradient that large
     *   reads as a smear when it holds still, and its animation style stops for a reader who asked
     *   for less motion.
     */
    backdrop: onSlot("root", {
      aurora: { animationStyle: "aurora", layerStyle: "backdrop.aurora" },

      checker: { layerStyle: "backdrop.checker" },

      dots: { layerStyle: "backdrop.dots" },

      grid: { layerStyle: "backdrop.grid" },

      noise: { layerStyle: "backdrop.noise" },

      spotlight: { layerStyle: "backdrop.spotlight" },

      stars: { layerStyle: "backdrop.stars" },

      stripes: { layerStyle: "backdrop.stripes" },

      vignette: { layerStyle: "backdrop.vignette" },
    }),

    /**
     * The halo drawn around the card.
     *
     * @remarks
     *   The glow takes the palette's solid token at half opacity, so a status or a theme carries it
     *   along. It is the larger of the two glows the theme defines; the button takes the smaller
     *   one, and a spread measured against a control reads as a smudge around something card-sized.
     */
    effect: onSlot("root", { glow: { layerStyle: "glow.lg" } }),

    /**
     * Whether the header and the footer are ruled off from the content between them.
     */
    divided: {
      true: {
        footer: { ...RULE, borderBlockStartWidth: "hairline", paddingBlockStart: `var(${INSET})` },
        header: { ...RULE, borderBlockEndWidth: "hairline", paddingBlockEnd: `var(${INSET})` },
      },
    },

    /**
     * Whether the whole card responds to a pointer, for a card whose title holds the link.
     *
     * @remarks
     *   The link inside the title stretches a pseudo-element across the root, the card's only
     *   positioned ancestor, so a click anywhere on the card follows the link while the link itself
     *   keeps the focus and the accessible name. A click handler on the root would leave the card
     *   reachable by pointer alone. The ring is written out instead of taken from
     *   `focusVisibleRing` because that utility styles whichever element took focus: nested under a
     *   descendant condition it asks the card to be `:focus-visible`, which a div never is, and the
     *   card then draws no ring at all. Matching the title's link rather than any focus inside also
     *   keeps a secondary control's ring its own, so a button in the footer rings itself and leaves
     *   the card alone. The colour is the palette's focus ring named directly, the way the utility
     *   names it, so the two rings agree.
     */
    interactive: {
      true: {
        root: {
          _hover: { borderColor: "border.emphasized" },
          "&:has(.card__title a:focus-visible)": {
            outlineColor: "colorPalette.focusRing",
            outlineOffset: "ring",
            outlineStyle: "solid",
            outlineWidth: "ring",
          },
          cursor: "button",
          focusRingColor: "colorPalette.focusRing",
          transitionDuration: "press",
          transitionProperty: "common",
          transitionTimingFunction: "press",
        },
        title: { "& > a::after": { content: '""', inset: "0", position: "absolute" } },
      },
    },

    /**
     * Where the footer's controls sit along the row.
     */
    justify: onSlot("footer", justifyVariants()),

    motion: onSlot("root", motionVariants(["fade", "rise", "reveal"])),

    /**
     * The axis the bands run along, which also picks the edges the media bleeds to.
     */
    orientation: {
      horizontal: {
        media: { marginBlock: BLEED, marginInlineStart: BLEED },
        root: { flexDirection: "row" },
      },
      vertical: {
        media: { marginBlockStart: BLEED, marginInline: BLEED },
        root: { flexDirection: "column" },
      },
    },

    radius: onSlot("root", cornerVariants()),
    status: onSlot("root", statusVariants()),

    /**
     * The room the panel leaves around its bands, and the weight of its title.
     *
     * @remarks
     *   The title sits one step below the panel's own size, because a card's title heads a panel
     *   rather than a section of the page. The smallest card takes the label role instead: one step
     *   under `heading.sm` is body text, and a title set in body text no longer reads as a title.
     */
    size: onSlots({
      root: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          [INSET]: `{spacing.inset.${size}}`,
          padding: dense(`{spacing.inset.${size}}`),
        }),
        STEPS,
      ),
      title: sizeVariants(
        (size) => ({ textStyle: size === "sm" ? "label.lg" : `heading.${below(size)}` }),
        STEPS,
      ),
    }),

    /**
     * The treatment of the panel behind the content.
     *
     * @remarks
     *   The plain look draws no panel at all: no fill, no border and no shadow, so the content
     *   stands on whatever is behind it. The card still lays out its bands and still publishes its
     *   inset, so a plain card is the anatomy without the surface, which is what a stretch of
     *   content needing a header and a footer but no panel asks for.
     */
    variant: {
      elevated: { root: { borderColor: "transparent", boxShadow: "md" } },
      glass: { root: { boxShadow: "none", layerStyle: "glass" } },
      outline: { root: { boxShadow: "none" } },
      plain: {
        root: { background: "transparent", borderColor: "transparent", boxShadow: "none" },
      },
      subtle: { root: { background: "bg.subtle", borderColor: "transparent", boxShadow: "none" } },
    },
  },
});
