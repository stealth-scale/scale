/**
 * Renders the button that switches the page between light and dark.
 *
 * @remarks
 *   The button reads the resolved mode from `useColorMode`, so while the choice follows the
 *   operating system it shows the mode the system resolved to, and a press stores an explicit
 *   choice of the other mode. It is a toggle: `aria-pressed` is true while the page is dark, and
 *   its name, "Dark mode" unless the caller passes `label`, stays the same in both states. The
 *   caller passes both glyphs, which change places through `Swap`. `useColorMode` throws outside a
 *   `ColorModeProvider`.
 */

import { type ReactElement, type ReactNode } from "react";

import { useColorMode } from "@stealthscale/provider-color-mode";

import { Button, type ButtonProps } from "#button/index.ts";
import * as Swap from "#swap/index.ts";

/**
 * Describes the props of the toggle: its two glyphs, its name and the props of a `Button`.
 */
export interface ColorModeToggleProps extends Omit<
  ButtonProps,
  "aria-label" | "aria-labelledby" | "aria-pressed" | "children"
> {
  /**
   * Glyph shown while the page is dark.
   */
  readonly dark: ReactNode;

  /**
   * Name of the button in both states, "Dark mode" unless the caller passes another.
   */
  readonly label?: string | undefined;

  /**
   * Glyph shown while the page is light.
   */
  readonly light: ReactNode;
}

/**
 * Renders the actions `Button` as a ghost, neutral square that sets the other color mode on a press
 * the caller did not cancel.
 *
 * @param props - The two glyphs, the name and the props of a `Button`.
 * @returns The `button` element.
 */
export function ColorModeToggle({
  dark,
  label = "Dark mode",
  light,
  onClick,
  ...props
}: ColorModeToggleProps): ReactElement {
  const { colorMode, setColorMode } = useColorMode();
  const darkened = colorMode === "dark";

  return (
    <Button
      palette="neutral"
      shape="square"
      variant="ghost"
      {...props}
      aria-label={label}
      aria-pressed={darkened}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) setColorMode(darkened ? "light" : "dark");
      }}
    >
      <Swap.Root swap={darkened}>
        <Swap.Indicator type="on">{dark}</Swap.Indicator>
        <Swap.Indicator type="off">{light}</Swap.Indicator>
      </Swap.Root>
    </Button>
  );
}
