/**
 * Renders the gradient of the area's two channels.
 *
 * @remarks
 *   The machine writes the gradient inline from the color, so the area repaints as the hue moves.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#color-picker/context.ts";
import { useAreaChannels } from "#color-picker/contexts.ts";
import { useColorPicker } from "#color-picker/machine.ts";

/**
 * Renders the `div` with the color picker's area background class.
 */
const Gradient = withContext("div", "areaBackground");

/**
 * Describes the props of the area background: the props of a `div`.
 */
export type AreaBackgroundProps = ComponentProps<typeof Gradient>;

/**
 * Renders the background with the machine's props for the area's channels.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function AreaBackground(props: AreaBackgroundProps): ReactElement {
  const api = useColorPicker();

  return <Gradient {...mergeProps(api.getAreaBackgroundProps(useAreaChannels()), props)} />;
}
