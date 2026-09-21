/**
 * Draws one sample: a component, the line that names the value it was drawn for, and the box it
 * sits in.
 */

import { type ReactElement } from "react";

import { Caption } from "#caption.tsx";
import { bare } from "#framed/bare.ts";
import { useFramed } from "#framed/context.ts";
import { type Display, useDisplay } from "#sample/display.ts";
import { Body, Head, Root, type RootProps } from "#sample/parts.ts";

/**
 * Describes what a sample takes: the words that name it, how many of a board's columns it reaches
 * across, and everything a styled div element takes.
 *
 * @remarks
 *   The two axes a container can set are taken from {@link Display} rather than from the root, so
 *   a sample and the board or matrix above it describe them in one place.
 */
export interface SampleProps extends Display, Omit<RootProps, "place" | "span" | "variant"> {
  /**
   * The prop the value was set on, written before it in the muted ink.
   */
  knob?: string | undefined;

  /**
   * The value the component was drawn for, which captions the sample. Left uncaptioned when
   * absent, for a cell whose row or column is captioned already.
   */
  of?: string | undefined;

  /**
   * How many of a board's columns the sample reaches across. Read only inside a board, because a
   * sample elsewhere is not the child of a grid.
   */
  span?: RootProps["span"];
}

/**
 * Draws a component in a captioned box.
 *
 * @remarks
 *   The one cell a matrix and a board are both built from, so a page that crosses two axes and a
 *   page laid out by hand read alike. How the box is drawn and where the drawing sits in it come
 *   from the container unless the sample states them itself.
 *   Each axis is written onto the root only where it has a value. A prop written as undefined is a
 *   selection to the compiler's runtime, which would take the axis away from the sample rather
 *   than leave the recipe's own default in place.
 *   In a framed document the sample draws what it holds and nothing round it, because the frame
 *   is the window and a caption or a box would be something the window does not show.
 * @param props - The words that name the sample, its axes, and what to draw in it.
 * @returns The caption and the drawing, in a box.
 */
export function Sample({
  children,
  knob,
  of,
  place,
  span,
  variant,
  ...rest
}: SampleProps): ReactElement {
  const shown: Display = useDisplay({ place, variant });
  const framed = useFramed() !== undefined;

  if (framed) return bare(children);

  return (
    <Root
      {...rest}
      {...(shown.place === undefined ? {} : { place: shown.place })}
      {...(span === undefined ? {} : { span })}
      {...(shown.variant === undefined ? {} : { variant: shown.variant })}
    >
      {of === undefined ? null : (
        <Head>
          <Caption knob={knob}>{of}</Caption>
        </Head>
      )}
      <Body>{children}</Body>
    </Root>
  );
}
