/**
 * Renders the panel of a code block and provides the code to its parts.
 *
 * @remarks
 *   The element is a `div` with no role. The `pre` inside it is announced as preformatted text, and
 *   each control names itself. The panel sets the theme's colour mode attribute to `dark` by
 *   default, so a block renders the same on a light page and a dark one. `mode="light"` sets it to
 *   light, and `mode="inherit"` omits the attribute so the panel follows the page.
 */

import { type ComponentProps, type ReactElement, useMemo } from "react";

import { COLOR_MODE_ATTRIBUTE } from "@stealthscale/theme";

import { withProvider } from "#code-block/context.ts";
import { CodeProvider } from "#code-block/state.ts";

/**
 * Renders the root slot and resolves the variants for the parts below it.
 */
const Panelled = withProvider("div", "root");

/**
 * Selects the colour mode of the panel: dark, light, or the page's own.
 */
export type CodeBlockMode = "dark" | "inherit" | "light";

/**
 * Describes the props of `Root`: the code, its language, the colour mode, and the props of the
 * styled `div`.
 */
export interface RootProps extends ComponentProps<typeof Panelled> {
  /**
   * Source text, rendered exactly as given.
   */
  readonly code: string;

  /**
   * Language name as the highlighter knows it, such as `tsx`, `json` or `shell`.
   *
   * @remarks
   *   The code renders as plain text when the language is absent or unknown to the highlighter.
   */
  readonly language?: string | undefined;

  /**
   * Colour mode of the panel. Defaults to `dark`.
   */
  readonly mode?: CodeBlockMode | undefined;
}

/**
 * Renders the panel and provides the code and the language to its parts.
 */
export function Root({ code, language, mode = "dark", ...rest }: RootProps): ReactElement {
  const state = useMemo(() => ({ code, language }), [code, language]);

  return (
    <CodeProvider value={state}>
      <Panelled {...rest} {...(mode === "inherit" ? {} : { [COLOR_MODE_ATTRIBUTE]: mode })} />
    </CodeProvider>
  );
}
