/**
 * Provides the code and its language from the root to the parts.
 *
 * @remarks
 *   The root is the only part that takes the code and the language. The context is required, so a
 *   part rendered outside a root throws an error that names `CodeBlock.Root`.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes the value every part of a code block reads from the root.
 */
export interface CodeState {
  /**
   * Source text, exactly as the caller passed it.
   */
  readonly code: string;

  /**
   * Language name as the highlighter knows it, or undefined for plain text.
   */
  readonly language: string | undefined;
}

/**
 * Provider the root renders, and the hook each part calls to read the code.
 */
export const [CodeProvider, useCode] = createRequiredContext<CodeState>("CodeBlock.Root");
