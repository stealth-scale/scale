/**
 * Fixtures for the color mode toggle specs: the toggle inside a color mode provider that keeps the
 * choice in memory, so no case reads another's.
 */

import { type ReactElement } from "react";

import { ColorModeProvider } from "@stealthscale/provider-color-mode";
import { memoryStore } from "@stealthscale/settings";

import { ColorModeToggle, type ColorModeToggleProps } from "#color-mode-toggle/index.ts";

/**
 * Renders the toggle with the glyphs "Moon" and "Sun" inside a provider with a store of its own.
 *
 * @param props - The props the case sets on the toggle.
 * @returns The provider around the toggle.
 */
export function provided(props: Partial<ColorModeToggleProps> = {}): ReactElement {
  return (
    <ColorModeProvider app="actions" store={memoryStore()}>
      <ColorModeToggle dark="Moon" light="Sun" {...props} />
    </ColorModeProvider>
  );
}
