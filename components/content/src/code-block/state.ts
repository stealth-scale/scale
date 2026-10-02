/**
 * Provides the code, its language and the title's naming from the root to the parts.
 *
 * @remarks
 *   The root is the only part that takes the code and the language. The context is required, so a
 *   part rendered outside a root throws an error that names `CodeBlock.Root`. The title reports
 *   itself to the root while it renders, so the scrolling region of the code is named by the
 *   title's ID only while that element exists.
 */

import { createLabelling, createRequiredContext } from "@stealthscale/hooks";

import { type DiffLine } from "#code-block/changes.ts";

/**
 * Describes the value every part of a code block reads from the root.
 */
export interface CodeState {
  /**
   * Earlier version of the code, which a diff compares the code against, or undefined.
   */
  readonly before: string | undefined;

  /**
   * Lines of the diff from `before` to the code, or undefined while the root has no `before`.
   */
  readonly changes: readonly DiffLine[] | undefined;

  /**
   * Source text, exactly as the caller passed it.
   */
  readonly code: string;

  /**
   * Language name as the highlighter knows it, or undefined for plain text.
   */
  readonly language: string | undefined;

  /**
   * Whether a `CodeBlock.Title` renders, which then names the scrolling region.
   */
  readonly titled: boolean;

  /**
   * ID the title takes, which the scrolling region references while the title renders.
   */
  readonly titleId: string;
}

/**
 * Provider the root renders, and the hook each part calls to read the code.
 */
export const [CodeProvider, useCode] = createRequiredContext<CodeState>("CodeBlock.Root");

/**
 * Provider through which the title reports that it renders, and the hook the title calls.
 */
export const [LabellingProvider, useLabelled] = createLabelling("CodeBlock.Root");
