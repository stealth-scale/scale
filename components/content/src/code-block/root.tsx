/**
 * Renders the panel a code block sits in and publishes the code to the parts inside it.
 *
 * @remarks
 *   The element is a `div` with no role; the `pre` further down is what assistive technology
 *   announces as preformatted text, and any control the caller adds names itself. By default the
 *   panel pins itself to the theme's dark side with the attribute the theme resolves modes from,
 *   so code reads the same on a light page as on a dark one and every token the recipe references
 *   resolves darkly within it. Pass `mode="light"` to pin it the other way, or `mode="inherit"` to
 *   follow the page, which omits the attribute altogether.
 */

import { type ComponentProps, type ReactElement, useMemo } from "react";

import { COLOR_MODE_ATTRIBUTE } from "@stealthscale/theme";

import { withProvider } from "#code-block/context.ts";
import { CodeProvider } from "#code-block/state.ts";

/**
 * The styled element carrying the recipe's root slot, which resolves the variants for the parts
 * below it.
 */
const Panelled = withProvider("div", "root");

/**
 * The colour mode a panel renders in: pinned dark, pinned light, or whatever the page is using.
 */
export type CodeBlockMode = "dark" | "inherit" | "light";

/**
 * Props of the code block root, plus everything the styled element accepts.
 */
export interface RootProps extends ComponentProps<typeof Panelled> {
  /**
   * The source text, exactly as it should appear.
   */
  readonly code: string;

  /**
   * The language identifier the highlighter recognises, such as `tsx`, `json` or `shell`. The code
   * renders as plain text when this is omitted or names a language the highlighter does not know.
   */
  readonly language?: string | undefined;

  /**
   * The colour mode of the panel, dark unless the caller says otherwise.
   */
  readonly mode?: CodeBlockMode | undefined;
}

/**
 * Renders the panel and puts the code in scope for the parts inside it.
 */
export function Root({ code, language, mode = "dark", ...rest }: RootProps): ReactElement {
  const state = useMemo(() => ({ code, language }), [code, language]);

  return (
    <CodeProvider value={state}>
      <Panelled {...rest} {...(mode === "inherit" ? {} : { [COLOR_MODE_ATTRIBUTE]: mode })} />
    </CodeProvider>
  );
}
