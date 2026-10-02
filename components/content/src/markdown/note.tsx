/**
 * Renders one footnote: its blocks and its back links.
 *
 * @remarks
 *   A note ends with one back link per reference to it, named "Back to reference 1", then "Back to
 *   reference 1-2", and appended to the note's last paragraph where it ends with one, as GitHub
 *   renders them. A note that ends with another block puts its links in a line after it.
 */

import { type ReactNode } from "react";

import { type FootnoteItemNode } from "@tanstack/markdown";

import { Link } from "@stealthscale/component-navigation";
import { Text } from "@stealthscale/component-typography";

import { renderFlow } from "#markdown/flow.tsx";
import { renderInlines } from "#markdown/inlines.tsx";
import { each } from "#markdown/keyed.tsx";
import { referenceId, type Scope } from "#markdown/scope.ts";

/**
 * Renders a note's back links, one per reference to it.
 */
function backLinksOf(item: FootnoteItemNode, scope: Scope): ReactNode[] {
  const references = Array.from({ length: item.referenceCount ?? 1 }, (_, index) => index + 1);

  return each(references, (reference) => (
    <>
      {" "}
      <Link
        aria-label={scope.words.footnoteBackLabel(item.number, reference)}
        href={`#${referenceId(scope, item.id, reference)}`}
      >
        ↩
      </Link>
    </>
  ));
}

/**
 * Renders a note's blocks with its back links after its last paragraph's words, or after its
 * blocks where it ends with another block.
 *
 * @param item - The footnote.
 * @param scope - The document's components, glyphs, words and ids.
 */
export function renderNote(item: FootnoteItemNode, scope: Scope): ReactNode {
  const last = item.children.at(-1);
  const links = backLinksOf(item, scope);
  const size = scope.size === "md" ? "sm" : "xs";

  if (last?.type !== "paragraph") {
    return (
      <>
        {renderFlow(item.children, scope)}
        <Text size={size}>{links}</Text>
      </>
    );
  }

  return (
    <>
      {item.children.length > 1 ? renderFlow(item.children.slice(0, -1), scope) : null}
      <Text size={size}>
        {renderInlines(last.children, scope)}
        {links}
      </Text>
    </>
  );
}
