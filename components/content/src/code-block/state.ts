/**
 * Carries the source text from the root down to the parts that render it.
 *
 * @remarks
 *   The root is the single place a caller supplies the code and its language; every part reads
 *   both from here rather than taking them as props. The context is required, so a part rendered
 *   outside a root throws at the call site instead of silently rendering nothing.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * The value every part of a code block reads from the root.
 */
export interface CodeState {
  /**
   * The source text, exactly as the caller supplied it.
   */
  readonly code: string;

  /**
   * The language identifier the highlighter recognises, or undefined for plain text.
   */
  readonly language: string | undefined;
}

/**
 * The provider a root renders and the hook each part calls to read the code.
 */
export const [CodeProvider, useCode] = createRequiredContext<CodeState>("CodeBlock.Root");
