/**
 * Recipe for the tour: a card that walks a person through a page one step at a time, over a dimmed
 * page with a ring around the element the step points at.
 *
 * @remarks
 *   The machine has no root part. The recipe adds a root with `display: contents`, because the
 *   backdrop, the spotlight and the positioner are portalled siblings and a slot recipe passes its
 *   variants from an element above all three. The machine writes `--tour-layer` on the backdrop,
 *   the spotlight and the positioner, 0 to 2, and each part stacks that far above the modal level.
 *   On a tooltip step the machine places the positioner, the spotlight and the backdrop's cutout
 *   in the document's coordinates, so the backdrop is as tall as the document it measures. A dialog
 *   step's positioner covers the window and centres the card, and a floating step's is fixed to
 *   the edge of the window its placement names. The recipe has no `effect` axis, because a card is
 *   not a control.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  interactive,
  motion,
  onSlot,
  onSlots,
  overlay,
  paletteVariants,
  sizeVariants,
  textSizes,
} from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe, which the selectors across parts are built from.
 */
const CLASS = "tour";

/**
 * Custom property on the backdrop that contains the height of the document the machine measures.
 */
export const BOUNDARY = "--tour-boundary";

/**
 * Custom property on the backdrop, the spotlight and the positioner that contains the stacking
 * level the parts stack above.
 */
const LEVEL = "--tour-z-index";

/**
 * Stacking level of a part: the modal level plus the layer the machine writes on the part.
 */
const LAYERED = `calc(var(--tour-layer, 0) + var(${LEVEL}))`;

/**
 * Custom property on the card that contains its surface, which the arrow's tip shares.
 */
const SURFACE = "--tour-surface";

/**
 * Custom property the size axis sets to the room the title leaves for the close trigger.
 */
const CLOSED = "--tour-closed";

/**
 * Distance of a floating step's card from the edges of the window.
 */
const EDGE = "{spacing.inset.lg}";

/**
 * Steps of the size axis.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Defines the tour recipe: the elevated card at size `md`, with the ring in the primary palette.
 */
export const recipe = defineSlotRecipe({
  base: {
    actionTrigger: interactive(),
    arrow: { "--arrow-background": `var(${SURFACE})`, "--arrow-size": "sizes.icon.sm" },
    arrowTip: { borderInlineStartWidth: "hairline", borderTopWidth: "hairline" },
    backdrop: {
      ...overlay(),
      "&:not([data-type=dialog])": { blockSize: `var(${BOUNDARY})` },
      [LEVEL]: "{zIndex.modal}",
      zIndex: LAYERED,
    },
    closeTrigger: {
      ...interactive(),
      _hover: { color: "fg" },
      alignItems: "center",
      borderRadius: "l1",
      color: "fg.muted",
      display: "inline-flex",
      justifyContent: "center",
      position: "absolute",
    },
    content: {
      ...motion("scale-fade.in", "scale-fade.out"),
      _focusVisible: { focusVisibleRing: "outside" },
      "&[data-type=dialog]": { inlineSize: "min({sizes.md}, 100%)" },
      "&[data-type=floating]": { inlineSize: "min({sizes.sm}, 100%)", pointerEvents: "auto" },
      color: "fg",
      display: "flex",
      flexDirection: "column",
      gap: dense("{spacing.gap.sm}"),
      inlineSize: "min({sizes.sm}, var(--available-width, {sizes.sm}))",
      position: "relative",
      transformOrigin: "var(--transform-origin)",
      zIndex: LAYERED,
    },
    control: {
      [`& > .${CLASS}__progressText`]: { marginInlineEnd: "auto" },
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      gap: dense("{spacing.gap.sm}"),
      justifyContent: "flex-end",
      marginBlockStart: dense("{spacing.gap.xs}"),
    },
    description: { color: "fg.muted" },
    positioner: {
      "&[data-type=dialog]": {
        alignItems: "center",
        display: "flex",
        inset: "0",
        justifyContent: "center",
        padding: "{spacing.inset.md}",
        position: "fixed",
      },
      "&[data-type=floating]": {
        "&[data-placement^=top]": { insetBlockEnd: "auto", insetBlockStart: EDGE },
        "&[data-placement$=-end]": { justifyContent: "flex-end" },
        "&[data-placement$=-start]": { justifyContent: "flex-start" },
        display: "flex",
        insetBlockEnd: EDGE,
        insetInline: EDGE,
        justifyContent: "center",
        pointerEvents: "none",
        position: "fixed",
      },
      [LEVEL]: "{zIndex.modal}",
      zIndex: LAYERED,
    },
    progressText: { color: "fg.muted" },
    root: { display: "contents" },
    spotlight: {
      ...motion("fade.in", "fade.out"),
      _motionReduce: { transitionDuration: "0s" },
      borderColor: "colorPalette.solid",
      borderStyle: "solid",
      borderWidth: "indicator",
      [LEVEL]: "{zIndex.modal}",
      transitionDuration: "move",
      transitionProperty: "left, top, width, height",
      transitionTimingFunction: "move",
      zIndex: LAYERED,
    },
    title: {
      [`.${CLASS}__content:has(> .${CLASS}__closeTrigger) > &`]: {
        paddingInlineEnd: `var(${CLOSED})`,
      },
      fontWeight: "semibold",
    },
  },
  className: CLASS,
  defaultVariants: { palette: "primary", size: "md", variant: "elevated" },
  jsx: [/^Tour(\.\w+)?$/u],
  slots: [
    "root",
    "backdrop",
    "spotlight",
    "positioner",
    "content",
    "arrow",
    "arrowTip",
    "title",
    "description",
    "progressText",
    "control",
    "actionTrigger",
    "closeTrigger",
  ],
  variants: {
    /**
     * Palette of the ring around the target.
     */
    palette: onSlot("spotlight", paletteVariants()),

    /**
     * Padding of the card, text of the title, the description and the progress, and size of the
     * close trigger.
     */
    size: onSlots({
      /**
       * Close trigger: a square two sizes smaller on the control scale, with a mark one size
       * smaller on the icon scale, centred on the title's first line with its mark on the card's
       * padding edge.
       */
      closeTrigger: sizeVariants((size) => {
        const box = dense(`{sizes.control.${below(below(size))}}`);
        const mark = dense(`{sizes.icon.${below(size)}}`);
        const inset = dense(`{spacing.inset.${size}}`);

        return {
          "& > svg": { boxSize: mark },
          boxSize: box,
          insetBlockStart: `calc(${inset} + (1lh - ${box}) / 2)`,
          insetInlineEnd: `calc(${inset} - (${box} - ${mark}) / 2)`,
          textStyle: `heading.${size}`,
        };
      }, SIZES),
      content: sizeVariants(
        (size) => ({
          [CLOSED]: `calc(${dense(`{sizes.control.${below(below(size))}}`)} + ${dense(`{spacing.gap.${size}}`)})`,
          padding: dense(`{spacing.inset.${size}}`),
        }),
        SIZES,
      ),
      description: textSizes("body", SIZES),
      progressText: sizeVariants((size) => ({ textStyle: `body.${below(size)}` }), SIZES),
      title: textSizes("heading", SIZES),
    }),

    /**
     * Surface of the card: the panel surface with an extra-large shadow, or the popover surface
     * inside a hairline edge.
     *
     * @remarks
     *   The elevated card has a transparent hairline edge, which forced colors paint in
     *   `CanvasText`, so the card keeps its outline where the shadow is not drawn.
     */
    variant: {
      elevated: {
        arrowTip: { borderColor: `var(${SURFACE})` },
        content: {
          background: `var(${SURFACE})`,
          borderColor: "transparent",
          borderRadius: "l3",
          borderStyle: "solid",
          borderWidth: "hairline",
          boxShadow: "xl",
          [SURFACE]: "colors.bg.panel",
        },
      },
      surface: {
        arrowTip: { borderColor: "border" },
        content: {
          background: `var(${SURFACE})`,
          borderColor: "border",
          borderRadius: "l3",
          borderWidth: "hairline",
          boxShadow: "lg",
          [SURFACE]: "colors.bg.popover",
        },
      },
    },
  },
});
