/**
 * Renders a document's footnotes: a section after a divider, labelled by a visually hidden heading,
 * with a numbered list of the notes.
 *
 * @remarks
 *   The heading is one level below the document's top level, and every footnote reference is
 *   described by it, as GitHub renders them. Each note's id takes the document's prefix, which its
 *   references link to.
 */

import { type ReactElement } from "react";

import { type FootnotesNode } from "@tanstack/markdown";

import { VisuallyHidden } from "@stealthscale/component-a11y";
import { Divider } from "@stealthscale/component-layout";
import { List } from "@stealthscale/component-typography";

import { withContext } from "#markdown/context.ts";
import { each } from "#markdown/keyed.tsx";
import { renderNote } from "#markdown/note.tsx";
import { footnoteId, footnotesId, type Scope, tagOf } from "#markdown/scope.ts";

/**
 * Renders the footnotes' `section` with the recipe's footnotes class.
 */
const Section = withContext("section", "footnotes");

/**
 * Renders the footnotes section.
 *
 * @param node - The footnotes block, which the parser puts at the document's end.
 * @param scope - The document's components, glyphs, words and ids.
 */
export function renderFootnotes(node: FootnotesNode, scope: Scope): ReactElement {
  return (
    <Section aria-labelledby={footnotesId(scope)}>
      <Divider />
      <VisuallyHidden as={tagOf(scope.headingLevel + 1)} id={footnotesId(scope)}>
        {scope.words.footnotesLabel}
      </VisuallyHidden>
      <List.Root as="ol" gap="xs">
        {each(node.items, (item) => (
          <List.Item id={footnoteId(scope, item.id)}>{renderNote(item, scope)}</List.Item>
        ))}
      </List.Root>
    </Section>
  );
}
