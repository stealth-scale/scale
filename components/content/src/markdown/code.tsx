/**
 * Renders a fenced block with the content `CodeBlock`, or the caller's replacement.
 *
 * @remarks
 *   The block highlights the language the fence names and renders an unknown language as plain
 *   text. A fence that states a title or a file name renders it in the block's header, which names
 *   the scrolling region; any other fence's region is named by `codeLabel`, from the language. The
 *   header renders a copy control where the caller passes its glyphs.
 */

import { type ReactElement } from "react";

import { type CodeBlockNode } from "@tanstack/markdown";

import { omitUndefined } from "@stealthscale/hooks";

import * as CodeBlock from "#code-block/index.ts";
import { type Scope } from "#markdown/scope.ts";

/**
 * Renders the header of a block with a title or a copy control, and nothing otherwise.
 */
function headerOf(title: string | undefined, scope: Scope): null | ReactElement {
  const { copy } = scope.glyphs;

  if (title === undefined && copy === undefined) return null;

  return (
    <CodeBlock.Header>
      {title === undefined ? null : <CodeBlock.Title>{title}</CodeBlock.Title>}
      {copy === undefined ? null : (
        <CodeBlock.Control>
          <CodeBlock.Copy
            copied={copy.copied}
            copiedLabel={scope.words.copiedLabel}
            label={scope.words.copyLabel}
          >
            {copy.idle}
          </CodeBlock.Copy>
        </CodeBlock.Control>
      )}
    </CodeBlock.Header>
  );
}

/**
 * Renders a fenced block.
 *
 * @param node - The fenced block.
 * @param scope - The document's components, glyphs, words and ids.
 */
export function renderCode(node: CodeBlockNode, scope: Scope): ReactElement {
  const title = node.title ?? node.file;
  const Replacement = scope.components.code;

  if (Replacement !== undefined) {
    return (
      <Replacement
        code={node.value}
        {...omitUndefined({
          highlightLines: node.highlightLines,
          language: node.lang,
          meta: node.meta,
          title,
        })}
      />
    );
  }

  return (
    <CodeBlock.Root code={node.value} size={scope.size} {...omitUndefined({ language: node.lang })}>
      {headerOf(title, scope)}
      <CodeBlock.Content label={scope.words.codeLabel(node.lang)}>
        <CodeBlock.Code />
      </CodeBlock.Content>
    </CodeBlock.Root>
  );
}
