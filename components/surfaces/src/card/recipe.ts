/**
 * Defines the styles a card is drawn with.
 *
 * @remarks
 *   Nine parts. The root is the panel, the media bleeds to its edges, and the header lays an
 *   indicator, a title, a description and an aside out on one grid. The content is the band between
 *   the header and the footer, and the footer holds whatever a reader acts on. The root states its
 *   own inset as a property, which the media reads back as a negative margin and the divided bands
 *   read as the room between a rule and the words. Both would otherwise be a length per step, which
 *   is a compound for every pair of the size axis and the axis beside it. The header is a grid
 *   rather than a row of stacks, so an indicator spans both lines of the title block and an aside
 *   sits against the end of the header whatever the block holds. A stack inside a row would need a
 *   wrapper the anatomy does not name. An interactive card draws its ring when the link in its
 *   title takes focus, selecting that link from the root. The compiler's focus utility nested under
 *   a descendant condition asks the card itself to be focus-visible, which a div never is, so the
 *   card drew no ring at all. Selecting the title's link rather than any focus inside keeps a
 *   supplementary control's own ring its own: a button in the footer rings itself and leaves the
 *   card alone. The card once drew its focus ring from `_focusWithin`, because the thing a keyboard
 *   reaches is the link inside the card and not the card. A press handler on the root would leave
 *   the card reachable by pointer alone.
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
 * The property the root states its own inset in, which the media and the rules read back.
 */
const INSET = "--card-inset";

/**
 * The steps a card is drawn at.
 */
const STEPS = ["sm", "md", "lg", "xl"] as const;

/**
 * Writes the room the root leaves, taken back.
 */
const BLEED = `calc(-1 * var(${INSET}))`;

/**
 * Writes the rule a divided band is separated by.
 */
const RULE = { borderColor: "border", borderStyle: "solid" };

/**
 * Draws a card on the panel surface, elevated and medium until a caller says otherwise.
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
     * The pattern drawn behind what the card holds.
     *
     * @remarks
     *   The nine the theme draws, each one a layer style, so a theme that restates a pattern moves
     *   every card wearing it. They were drawn by the theme and reachable from no component at all
     *   until this axis named them.
     *   A pattern paints the root's background image and leaves its fill alone, so it composes with
     *   every look: a grid behind a panel, dots behind a glass card, stars behind a plain one.
     *   `aurora` carries the drift that moves it. A gradient that big standing still reads as a
     *   smear rather than as light, and the animation style holds it back under a reader who asked
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
     * The light a card is drawn under.
     *
     * @remarks
     *   The glow reads the palette's solid at half strength, so a status or a theme moves it. It
     *   is the larger of the two the theme draws: the button takes the smaller one, and a spread
     *   measured against a control reads as a smudge round something the size of a card.
     */
    effect: onSlot("root", { glow: { layerStyle: "glow.lg" } }),

    /**
     * Whether a rule separates the header and the footer from the band between them.
     */
    divided: {
      true: {
        footer: { ...RULE, borderBlockStartWidth: "hairline", paddingBlockStart: `var(${INSET})` },
        header: { ...RULE, borderBlockEndWidth: "hairline", paddingBlockEnd: `var(${INSET})` },
      },
    },

    /**
     * Whether the whole card answers to a pointer, for one whose title holds the link.
     *
     * @remarks
     *   The link in the title stretches a pseudo-element over the root, which is the card's one
     *   positioned ancestor, so a press anywhere on the card follows the link while the link alone
     *   holds the focus and the name.
     *   The ring is written out rather than taken from `focusVisibleRing`, because the utility
     *   draws on the element that took the focus and the element that took it here is the link
     *   inside the title. It names the palette's focus colour directly, the way the utility does,
     *   so the two rings are one colour.
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
     * How the footer's controls are spread across it.
     */
    justify: onSlot("footer", justifyVariants()),

    motion: onSlot("root", motionVariants(["fade", "rise", "reveal"])),

    /**
     * Which way the bands run, and which edges the media bleeds to.
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
     * How much room the card leaves round its bands, and how loud the title is set.
     */
    /**
     * How much room the panel leaves round what it holds, and how loud its title is.
     *
     * @remarks
     *   The title steps down one from the panel, because a card's title heads a panel rather than a
     *   section of the page. The smallest card titles at the label role instead: a heading at the
     *   step under `heading.sm` is body text, and a title set in body text is not a title.
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
     * How the panel is drawn.
     *
     * @remarks
     *   The plain look draws no panel at all: no fill, no edge and no shadow, so what the card
     *   holds stands on whatever is behind it. The card still lays its bands out and still states
     *   its inset, so a plain card is the anatomy without the surface, which is what a band of
     *   content that needs a header and a footer but no panel asks for.
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
