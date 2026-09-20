/**
 * Hands the code a block holds down to the passage that sets it.
 *
 * @remarks
 *   The root holds the code and the language once, so a caller writes each on the root and a part
 *   below reads them there. A part drawn outside a root throws where it was written rather than
 *   drawing nothing and saying so nowhere.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes what the parts of a code block read.
 */
export interface CodeState {
  /**
   * The code, as written.
   */
  readonly code: string;

  /**
   * The language the code is in, as the highlighter names it, or nothing for plain text.
   */
  readonly language: string | undefined;
}

/**
 * Hands the code to every part, and reads it back.
 */
export const [CodeProvider, useCode] = createRequiredContext<CodeState>("CodeBlock.Root");
