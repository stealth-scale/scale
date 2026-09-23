/**
 * Declares the card slot recipe: a panel of bands, with a picture, a header, content, sections and
 * a footer.
 *
 * @remarks
 *   The root is a flex column in both orientations. In the horizontal orientation the picture is
 *   positioned along the leading third and the root pads its start past it, so every other band
 *   still stacks in one column. The header is a three-column grid: the indicator and the aside each
 *   span the title and the description rows and are centred on them. The root clips its content, so
 *   a bled picture takes the root's corners.
 */

import {
  cornerVariants,
  defineSlotRecipe,
  dense,
  justifyVariants,
  motionVariants,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  sizeVariants,
  surface,
} from "@stealthscale/theme/authoring";

import {
  asided,
  bled,
  CLASS,
  INSET,
  marked,
  ruled,
  sectioned,
  spaced,
  STEPS,
  titled,
} from "#card/metrics.ts";

/**
 * Width of the picture along the leading side of a horizontal card.
 */
const SIDE = "33%";

/**
 * Selects the link in the title that an interactive card stretches over its whole face.
 */
const TITLE_LINK = `.${CLASS}__title > a`;

/**
 * Styles a card as an elevated panel at the md size, in the palette of its surroundings.
 */
export const recipe = defineSlotRecipe({
  base: {
    aside: {
      alignItems: "center",
      display: "flex",
      flex: "0 0 auto",
      gridColumn: "3",
      gridRow: "1 / span 2",
    },
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
    header: { alignItems: "center", display: "grid", gridTemplateColumns: "auto 1fr auto" },
    indicator: {
      alignItems: "center",
      display: "flex",
      flex: "0 0 auto",
      gridColumn: "1",
      gridRow: "span 2",
    },
    media: {
      "& > img": { display: "block", inlineSize: "full" },
      overflow: "hidden",
      position: "relative",
    },

    /**
     * The overlay covers the picture and places its content at the bottom-start corner.
     *
     * @remarks
     *   The overlay passes the pointer through, and its children take it back. The `scrim` axis
     *   darkens the picture behind text.
     */
    overlay: {
      "& > *": { pointerEvents: "auto" },
      alignItems: "flex-start",
      display: "flex",
      flexDirection: "column",
      gap: dense("{spacing.gap.sm}"),
      inset: "0",
      justifyContent: "flex-end",
      padding: `var(${INSET})`,
      pointerEvents: "none",
      position: "absolute",
    },
    root: {
      ...surface(),
      [`& > .${CLASS}__section + :is(.${CLASS}__content, .${CLASS}__footer)`]: ruled(),
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
    },
    section: sectioned(),
    title: { fontWeight: "semibold", gridColumn: "2" },
  },
  className: CLASS,
  compoundVariants: [
    /**
     * Sets the border of an outline card in a palette to the palette's border role.
     */
    {
      css: { root: { borderColor: "colorPalette.border" } },
      name: "toned",
      palette: [...PALETTES],
      variant: "outline",
    },

    /**
     * Fills a subtle card in a palette with the palette's subtle role and sets its border to the
     * palette's border role.
     */
    {
      css: { root: { background: "colorPalette.subtle", borderColor: "colorPalette.border" } },
      name: "tinted",
      palette: [...PALETTES],
      variant: "subtle",
    },

    /**
     * An interactive elevated card raises its shadow one step under the pointer.
     */
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
    "overlay",
    "header",
    "indicator",
    "title",
    "description",
    "aside",
    "content",
    "section",
    "footer",
  ],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Unavailable look: the card at the disabled opacity, with no pointer events on any band.
     *
     * @remarks
     *   The styles do not remove the title's link from the tab order. Render the title without a
     *   link, or give the link `aria-disabled` and no `href`.
     */
    disabled: { true: { root: { opacity: "disabled", pointerEvents: "none" } } },

    /**
     * Rules under the header and above the footer.
     *
     * @remarks
     *   The band after the header and the footer each render the rule above them through `ruled`,
     *   so both rules span the card's full width with the inset on both sides, like a section's.
     */
    divided: {
      true: {
        footer: ruled(),
        root: {
          [`& > .${CLASS}__header + :is(.${CLASS}__content, .${CLASS}__section, .${CLASS}__footer)`]:
            ruled(),
        },
      },
    },

    /**
     * Halo around the card in the palette's solid at half opacity.
     *
     * @remarks
     *   The axis offers `glow` and no `pulse`. A pulse animates `box-shadow` on the root, whose
     *   `animation` the `motion` axis already sets, and the root clips a pseudo-element's shadow.
     */
    effect: onSlot("root", { glow: { layerStyle: "glow.lg" } }),

    /**
     * Whole-card press through the link in the title.
     *
     * @remarks
     *   The title's link stretches a pseudo-element over the root, so a click anywhere follows the
     *   link and the link keeps the focus and the accessible name. Every other link and button in
     *   the card is positioned, so it paints over the pseudo-element and takes its own clicks. The
     *   root renders the focus ring while the title's link is focused, in the palette's
     *   `focusRing`.
     */
    interactive: {
      true: {
        root: {
          _hover: { borderColor: "border.emphasized" },
          [`&:has(${TITLE_LINK}:focus-visible)`]: {
            outlineColor: "colorPalette.focusRing",
            outlineOffset: "ring",
            outlineStyle: "solid",
            outlineWidth: "ring",
          },
          [`& :is(a[href], button):not(${TITLE_LINK})`]: { position: "relative" },
          cursor: "button",
          transitionDuration: "press",
          transitionProperty: "common",
          transitionTimingFunction: "press",
        },
        title: { "& > a::after": { content: '""', inset: "0", position: "absolute" } },
      },
    },

    /**
     * Alignment of the footer's controls along the row.
     */
    justify: onSlot("footer", justifyVariants()),
    motion: onSlot("root", motionVariants(["fade", "rise", "reveal"])),

    /**
     * Placement of the picture: bled across the top of a vertical card, or along the leading third
     * of a horizontal one.
     *
     * @remarks
     *   A horizontal card pads its start by the picture's width plus the inset only when it
     *   contains a picture, and the picture fills its full height with `object-fit: cover`.
     */
    orientation: {
      horizontal: {
        media: {
          "& > img": { blockSize: "full", objectFit: "cover" },
          inlineSize: SIDE,
          insetBlock: "0",
          insetInlineStart: "0",
          position: "absolute",
        },
        root: {
          [`&:has(> .${CLASS}__media)`]: { paddingInlineStart: `calc(${SIDE} + var(${INSET}))` },
        },
      },
      vertical: { media: bled() },
    },

    /**
     * Palette of the card's tint, border, focus ring and glow.
     *
     * @remarks
     *   The outline look sets its border to the palette's border role, and the subtle look also
     *   fills with the palette's subtle role. Without a palette the card inherits the palette of
     *   its surroundings.
     */
    palette: onSlot("root", paletteVariants()),
    radius: onSlot("root", cornerVariants()),

    /**
     * Scrim behind the overlay: 64% black across the lower half of the picture, fading to
     * transparent at the top.
     *
     * @remarks
     *   The scrim declares the dark color scheme on the overlay, so `fg` and every semantic color
     *   in it take their dark-mode values in both modes. Set it for text over a picture. A badge
     *   has its own fill and does not need it.
     */
    scrim: {
      true: {
        overlay: {
          backgroundImage:
            "linear-gradient(to top, {colors.blackAlpha.700}, {colors.blackAlpha.700} 50%, transparent)",
          color: "fg",
          colorScheme: "dark",
        },
      },
    },

    /**
     * Inset, gap, title style, header gaps and indicator media at each size.
     */
    size: onSlots({
      aside: sizeVariants(asided, STEPS),
      indicator: sizeVariants(marked, STEPS),
      root: sizeVariants(spaced, STEPS),
      title: sizeVariants(titled, STEPS),
    }),

    /**
     * Treatment of the panel.
     *
     * @remarks
     *   `plain` removes the fill, the border and the shadow, and keeps the bands and the inset.
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
