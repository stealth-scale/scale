/**
 * Draws a passage of code in the library's code block, headed by what it is and the control that
 * copies it.
 */

import { type ReactElement } from "react";

import { CodeBlock } from "@stealthscale/component-content";
import { useTranslation } from "@stealthscale/provider-i18n";

import { Check } from "#catalogue/check.tsx";
import { Copy } from "#catalogue/copy.tsx";

/**
 * Describes what a passage takes.
 */
export interface CodeProps {
  /**
   * The code, as written.
   */
  readonly code: string;

  /**
   * The language the code is in, as the highlighter names it. Default: `tsx`.
   */
  readonly language?: string | undefined;

  /**
   * The words at the head of the block, saying what the code is.
   */
  readonly title: string;
}

/**
 * Draws the code block at the small size, with the block's own copy control in its header.
 *
 * @remarks
 *   The control reads the code off the root, so the passage is written once. The catalogue hands
 *   it the two marks and the words it is named with, because the library ships no icon set and the
 *   block's package ships no words.
 */
export function Code({ code, language = "tsx", title }: CodeProps): ReactElement {
  const { t } = useTranslation("specimen");

  return (
    <CodeBlock.Root code={code} language={language} size="sm">
      <CodeBlock.Header>
        <CodeBlock.Title>{title}</CodeBlock.Title>
        <CodeBlock.Control>
          <CodeBlock.Copy
            copied={<Check />}
            translations={{ triggerLabel: (copied) => t(copied ? "code.copied" : "code.copy") }}
          >
            <Copy />
          </CodeBlock.Copy>
        </CodeBlock.Control>
      </CodeBlock.Header>
      <CodeBlock.Content>
        <CodeBlock.Code />
      </CodeBlock.Content>
    </CodeBlock.Root>
  );
}
