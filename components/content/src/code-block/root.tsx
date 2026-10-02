/**
 * Renders the panel of a code block and provides the code to its parts.
 *
 * @remarks
 *   The element is a `div` with no role. The `pre` inside it is announced as preformatted text, and
 *   each control names itself. The panel sets the theme's colour mode attribute to `dark` by
 *   default, so a block renders the same on a light page and a dark one. `mode="light"` sets it to
 *   light, and `mode="inherit"` omits the attribute so the panel follows the page. The root gives
 *   the title an ID and records whether a title renders, so the scrolling region of the code is
 *   named by the title while one renders. With `before`, the root compares the earlier version to
 *   the code once, and `CodeBlock.Diff` and `CodeBlock.DiffStat` render the result.
 */

import { type ComponentProps, type ReactElement, useId, useMemo, useState } from "react";

import { COLOR_MODE_ATTRIBUTE } from "@stealthscale/theme";

import { changesOf } from "#code-block/changes.ts";
import { withProvider } from "#code-block/context.ts";
import { CodeProvider, LabellingProvider } from "#code-block/state.ts";

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
   * Earlier version of the code, which `CodeBlock.Diff` compares the code against.
   */
  readonly before?: string | undefined;

  /**
   * Source text, rendered exactly as given, and the later version of a diff.
   */
  readonly code: string;

  /**
   * Language name as the highlighter knows it, such as `tsx`, `json` or `shell`, or `ansi` for
   * terminal output.
   *
   * @remarks
   *   The code renders as plain text when the language is absent or unknown to the highlighter.
   *   With `ansi`, the code renders in the colours its SGR escapes set, and every escape is
   *   dropped from the rendered and the copied text.
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
export function Root({ before, code, language, mode = "dark", ...rest }: RootProps): ReactElement {
  const titleId = useId();
  const [titled, setTitled] = useState(false);
  const changes = useMemo(
    () => (before === undefined ? undefined : changesOf(before, code)),
    [before, code],
  );
  const state = useMemo(
    () => ({ before, changes, code, language, titled, titleId }),
    [before, changes, code, language, titled, titleId],
  );

  return (
    <LabellingProvider value={setTitled}>
      <CodeProvider value={state}>
        <Panelled {...rest} {...(mode === "inherit" ? {} : { [COLOR_MODE_ATTRIBUTE]: mode })} />
      </CodeProvider>
    </LabellingProvider>
  );
}
