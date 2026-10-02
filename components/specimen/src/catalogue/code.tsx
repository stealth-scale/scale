/**
 * Renders a code sample in the library's code block, with a title and a copy control in the header.
 */

import { type ReactElement } from "react";

import { CheckIcon, CopyIcon } from "lucide-react";

import { CodeBlock } from "@stealthscale/component-content";

import { useWords } from "#words.ts";

/**
 * Props of `Code`: the source, its language and the header text.
 */
export interface CodeProps {
  /**
   * Source code to render.
   */
  readonly code: string;

  /**
   * Language name the highlighter uses. Defaults to `tsx`.
   */
  readonly language?: string | undefined;

  /**
   * Header text that describes the code.
   */
  readonly title: string;
}

/**
 * Renders the code block at the small size, with the block's copy control in its header.
 *
 * @remarks
 *   The copy control reads the code from the root, so the sample is passed once. The catalogue
 *   passes the two icons and the translated accessible names, because the library ships no icon set
 *   and the code block package ships no words.
 */
export function Code({ code, language = "tsx", title }: CodeProps): ReactElement {
  const { t } = useWords();

  return (
    <CodeBlock.Root code={code} language={language} size="sm">
      <CodeBlock.Header>
        <CodeBlock.Title>{title}</CodeBlock.Title>
        <CodeBlock.Control>
          <CodeBlock.Copy
            copied={<CheckIcon aria-hidden size="1em" />}
            copiedLabel={t("code.copied")}
            label={t("code.copy")}
          >
            <CopyIcon aria-hidden size="1em" />
          </CodeBlock.Copy>
        </CodeBlock.Control>
      </CodeBlock.Header>
      <CodeBlock.Content>
        <CodeBlock.Code />
      </CodeBlock.Content>
    </CodeBlock.Root>
  );
}
