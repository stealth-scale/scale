/**
 * Defines the looks a recipe reads by name: the fills and outlines a control is drawn in, the
 * edges a field is drawn with, the indicators along an edge, the disabled look, the glass and the
 * ripple, with the effects a page is dressed with beside them.
 *
 * @remarks
 *   Every look reads the virtual palette, so one look draws in every palette an application
 *   installs, and a fill carries its hover, so a theme that changes what solid means or how it
 *   hovers changes it once for every solid thing. There is no ring here: the focus ring is the
 *   compiler's `focusVisibleRing` utility over the global focus-ring property, and the
 *   `interactive` helper sets its color from the palette. A look holds still. The ripple is the
 *   one look that moves on its own.
 *   A press states the ripple small and at full opacity with no transition at all, and the
 *   release is what carries it out to full size and down to nothing. The press is the instant
 *   half because a press has no length a rule can rely on: a transition that grew the ripple
 *   while the button was held was cancelled the moment it was let go, and a click of a few
 *   milliseconds drew an opacity of zero and a circle that never moved. The release runs on the
 *   rest state, which nothing cancels, so the whole animation plays however briefly the button
 *   was held. It leaves from where the press put it, so a press held long enough to be seen and a
 *   click too fast to see both end in the same ripple.
 *   The circle is the background of a box the size of the control rather than a box of its own,
 *   and it is the background's size that grows. A background is painted inside the box that
 *   carries it and no further, so the control's own corner is what the circle is cut back to and
 *   nothing has to clip it. A circle drawn as a box over the control needs a clip nothing here
 *   can write: `clip-path: inset(0 round inherit)` was the attempt, `inherit` is no radius a
 *   shape accepts, the whole declaration computed to `none`, and a 62 by 32 button drew a 181
 *   pixel circle across the page behind it. Hiding the control's overflow clips it, and also
 *   clips the pseudo-element a coarse pointer's target is drawn with, which left an xs button's
 *   forty-pixel area cut back to its thirty-two-pixel box.
 *   `--ripple-start` is the circle a press states and `--ripple-scale` is what the release
 *   carries it out to. Each is a background size, so each reads as a share of the control's own
 *   box and a circle drawn `closest-side` inside it comes out as wide as the shorter of the two.
 *   A control states neither, however tall or wide it is. The circle grows from `--ripple-x` and
 *   `--ripple-y` where a component writes them and from the center where it writes none. Its rim
 *   is soft, because a circle with a hard edge reads as a disc laid on the control rather than as
 *   a ripple through it, and it carries the state-layer opacity a pressed surface is tinted by.
 *   `--ripple-pace` scales every duration at once, and a reader who asked for less motion sets it
 *   to zero. The ripple then holds still, and the press needs no second rule written over it at a
 *   higher specificity.
 */

import { type LayerStyle, type LayerStyles } from "#pandacss.ts";
import { effects } from "#preset/styles/effects.ts";
import { fieldLooks, wrappedFieldLooks } from "#preset/styles/field-looks.ts";
import { type Look } from "#preset/styles/look.ts";

/**
 * Writes a fill: a background, the ink on it, the background it hovers to, and the background it
 * is pressed to.
 *
 * @remarks
 *   A solid fill is pressed to the background it hovers to, because the palette states no role
 *   below its solid, and the squeeze an interactive control draws carries the press there.
 */
function fill(background: string, color: string, hovered: string, pressed = hovered): Look {
  return {
    value: { _active: { background: pressed }, _hover: { background: hovered }, background, color },
  };
}

/**
 * Writes an outline: a line round the box at the control's stroke width, the ink inside it, and
 * the background it fills with as a pointer hovers and presses.
 *
 * @remarks
 *   An outline reads as pressed by filling in rather than by changing its line, because a line
 *   one step darker is the same change a hover makes and a press that looks like a hover reads
 *   as nothing happening. The fill is clipped to the padding box, so a rounded corner is drawn
 *   as one antialiased curve: a fill that runs under the line lays a second curve over the first,
 *   and the two read as a corner heavier than the edges it joins.
 */
function outlined(line: string, hovered: string): Look {
  return {
    value: {
      _active: { background: "colorPalette.muted", borderColor: hovered },
      _hover: { background: "colorPalette.subtle", borderColor: hovered },
      backgroundClip: "padding-box",
      borderColor: line,
      borderWidth: "control",
      color: "colorPalette.fg",
    },
  };
}

/**
 * Writes a flat look: a background and the ink on it, and nothing a pointer changes.
 *
 * @remarks
 *   A badge, a tag and a chip read as part of what they label rather than as something to press,
 *   so they repaint under no pointer. A badge inside a row that hovers is under the pointer
 *   whenever the row is, so a fill would repaint it there, and a badge that lights up on its own
 *   reads as a control a reader can press and then cannot.
 */
function flat(background: string, color = "colorPalette.fg"): Look {
  return { value: { background, color } };
}

/**
 * Writes an indicator: a bar in the palette's solid along one edge of a positioned box, at the
 * indicator's stroke width.
 */
function indicator(edge: LayerStyle): Look {
  return {
    value: {
      _before: {
        background: "colorPalette.solid",
        content: '""',
        position: "absolute",
        ...edge,
      },
      position: "relative",
    },
  };
}

/**
 * Lists the looks, the effects among them.
 */
export const layerStyles: LayerStyles = {
  ...effects,
  disabled: { value: { cursor: "disabled", opacity: "disabled" } },
  field: { ...fieldLooks, wrapped: wrappedFieldLooks },
  fill: {
    ghost: fill("transparent", "colorPalette.fg", "colorPalette.muted", "colorPalette.emphasized"),
    muted: fill("colorPalette.muted", "colorPalette.fg", "colorPalette.emphasized"),
    plain: {
      value: { _active: { background: "colorPalette.subtle" }, color: "colorPalette.fg" },
    },
    solid: fill("colorPalette.solid", "colorPalette.contrast", "colorPalette.solid.hover"),
    subtle: fill(
      "colorPalette.subtle",
      "colorPalette.fg",
      "colorPalette.muted",
      "colorPalette.emphasized",
    ),
    surface: {
      value: {
        ...fill(
          "colorPalette.subtle",
          "colorPalette.fg",
          "colorPalette.muted",
          "colorPalette.emphasized",
        ).value,
        backgroundClip: "padding-box",
        borderColor: "colorPalette.border",
        borderWidth: "control",
      },
    },
  },
  flat: {
    outline: {
      value: {
        backgroundClip: "padding-box",
        borderColor: "colorPalette.border",
        borderWidth: "control",
        color: "colorPalette.fg",
      },
    },
    plain: { value: { color: "colorPalette.fg" } },
    solid: flat("colorPalette.solid", "colorPalette.contrast"),
    subtle: flat("colorPalette.subtle"),
    surface: {
      value: {
        ...flat("colorPalette.subtle").value,
        backgroundClip: "padding-box",
        borderColor: "colorPalette.border",
        borderWidth: "control",
      },
    },
  },
  glass: {
    value: {
      _reducedTransparency: { backdropFilter: "none", background: "bg.panel" },
      backdropFilter: "blur({blurs.md})",
      background: "bg.panel/70",
      borderColor: "border.subtle",
      borderWidth: "control",
    },
  },
  indicator: {
    bottom: indicator({ bottom: "0", height: "{borderWidths.indicator}", insetInline: "0" }),
    end: indicator({ insetBlock: "0", insetInlineEnd: "0", width: "{borderWidths.indicator}" }),
    start: indicator({
      insetBlock: "0",
      insetInlineStart: "0",
      width: "{borderWidths.indicator}",
    }),
    top: indicator({ height: "{borderWidths.indicator}", insetInline: "0", top: "0" }),
  },
  outline: {
    solid: outlined("colorPalette.solid", "colorPalette.solid"),
    subtle: outlined("colorPalette.border", "colorPalette.border.hover"),
  },
  ripple: {
    value: {
      _active: {
        _after: {
          backgroundSize: "var(--ripple-start, 30%) var(--ripple-start, 30%)",
          opacity: "0.12",
          transition: "none",
        },
      },
      _after: {
        backgroundImage:
          "radial-gradient(circle closest-side, currentColor 0 70%, transparent 100%)",
        backgroundPosition: "var(--ripple-x, 50%) var(--ripple-y, 50%)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "var(--ripple-scale, 170%) var(--ripple-scale, 170%)",
        borderRadius: "inherit",
        content: '""',
        inset: "0",
        opacity: "0",
        pointerEvents: "none",
        position: "absolute",
        transition:
          "opacity calc(var(--ripple-pace) * {durations.slower}) {easings.linear}, background-size calc(var(--ripple-pace) * {durations.slower}) {easings.out}",
      },
      _motionReduce: { "--ripple-pace": "0" },
      "--ripple-pace": "1",
      position: "relative",
    },
  },
};
