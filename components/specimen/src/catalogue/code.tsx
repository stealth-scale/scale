/**
 * Draws a passage of code in the library's code block, headed by what it is and the control that
 * copies it.
 */

import { type ReactElement } from "react";

import { ButtonPropsProvider, Clipboard, IconButton } from "@stealthscale/component-actions";
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
 * Draws the code block at the small size, with the clipboard's trigger in its control.
 *
 * @remarks
 *   The trigger is the library's icon button on the neutral palette, so it reads in the ink of the
 *   title beside it, and the clipboard names it with the catalogue's words. The block sets the
 *   copied value from the same text the passage shows.
 */
export function Code({ code, language = "tsx", title }: CodeProps): ReactElement {
  const { t } = useTranslation("specimen");

  return (
    <CodeBlock.Root code={code} language={language} size="sm">
      <CodeBlock.Header>
        <CodeBlock.Title>{title}</CodeBlock.Title>
        <CodeBlock.Control>
          <Clipboard.Root
            translations={{ triggerLabel: (copied) => t(copied ? "code.copied" : "code.copy") }}
            value={code}
          >
            <ButtonPropsProvider value={{ size: "xs", status: "neutral", variant: "ghost" }}>
              <Clipboard.Trigger as={IconButton}>
                <Clipboard.Indicator copied={<Check />}>
                  <Copy />
                </Clipboard.Indicator>
              </Clipboard.Trigger>
            </ButtonPropsProvider>
          </Clipboard.Root>
        </CodeBlock.Control>
      </CodeBlock.Header>
      <CodeBlock.Content>
        <CodeBlock.Code />
      </CodeBlock.Content>
    </CodeBlock.Root>
  );
}
