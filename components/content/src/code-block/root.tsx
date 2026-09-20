/**
 * Draws the panel a code block is set in, and holds the code its parts read.
 *
 * @remarks
 *   The element is `div` and carries no role. The passage inside it is a `pre`, which is what a
 *   screen reader reads as preformatted text, and whatever a page puts in the control names
 *   itself. The panel is switched to the dark mode whatever the page is in, through the attribute
 *   the theme reads a mode from, so a block of code reads as one thing on every page and every
 *   token the recipe reads resolves to the dark side of the theme inside it. A caller states
 *   `mode="light"` for a light panel on any page, and `mode="inherit"` for the page's own mode,
 *   which leaves the attribute off.
 */

import { type ComponentProps, type ReactElement, useMemo } from "react";

import { COLOR_MODE_ATTRIBUTE } from "@stealthscale/theme";

import { withProvider } from "#code-block/context.ts";
import { CodeProvider } from "#code-block/state.ts";

/**
 * Draws the panel and sets the variants every part below it reads.
 */
const Panelled = withProvider("div", "root");

/**
 * Selects the mode the panel is drawn in: the dark side or the light side whatever the page is
 * in, or the page's own.
 */
export type CodeBlockMode = "dark" | "inherit" | "light";

/**
 * Describes what the root takes: the code, its language, the mode, the recipe's variants, and
 * the element's.
 */
export interface RootProps extends ComponentProps<typeof Panelled> {
  /**
   * The code, as written.
   */
  readonly code: string;

  /**
   * The language the code is in, as the highlighter names it: `tsx`, `json`, `shell`. Plain text
   * where it is absent or where the highlighter knows no language of that name.
   */
  readonly language?: string | undefined;

  /**
   * The mode the panel is drawn in. Default: `dark`.
   */
  readonly mode?: CodeBlockMode | undefined;
}

/**
 * Draws the panel and hands the code to the parts inside it.
 *
 * @param props - The code, its language, the mode, the recipe's variants and the element's props
 *   together.
 * @returns The panel, in the mode named, with the code in scope for the parts.
 */
export function Root({ code, language, mode = "dark", ...rest }: RootProps): ReactElement {
  const state = useMemo(() => ({ code, language }), [code, language]);

  return (
    <CodeProvider value={state}>
      <Panelled {...rest} {...(mode === "inherit" ? {} : { [COLOR_MODE_ATTRIBUTE]: mode })} />
    </CodeProvider>
  );
}
