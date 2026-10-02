/**
 * Renders a Markdown list with the typography `List`, task items included.
 *
 * @remarks
 *   A tight list's item renders its paragraph's words directly in the `li`, and a loose list keeps
 *   each paragraph, as the author's blank lines ask. An ordered list starts at the number the
 *   author wrote. A task item renders its mark in a `List.Indicator`, hidden from a screen reader,
 *   and its state as visually hidden words before its text, "Completed task" or "Incomplete task".
 *   The mark is the caller's glyph, else the recipe's box. A list of task items only drops the
 *   bullets.
 */

import { type ReactElement, type ReactNode } from "react";

import { type ListItemNode, type ListNode } from "@tanstack/markdown";

import { VisuallyHidden } from "@stealthscale/component-a11y";
import { List } from "@stealthscale/component-typography";

import { withContext } from "#markdown/context.ts";
import { renderFlow } from "#markdown/flow.tsx";
import { renderInlines } from "#markdown/inlines.tsx";
import { each } from "#markdown/keyed.tsx";
import { type Scope } from "#markdown/scope.ts";

/**
 * Renders the recipe's box of a task without a glyph.
 */
const TaskMark = withContext("span", "taskMark");

/**
 * Renders an item's content: a tight item's words directly, a loose item's blocks in a column.
 */
function contentOf(item: ListItemNode, loose: boolean, scope: Scope): ReactNode {
  const [first, ...rest] = item.children;

  if (loose || first?.type !== "paragraph") return renderFlow(item.children, scope);

  return rest.length === 0 ? (
    renderInlines(first.children, scope)
  ) : (
    <>
      {renderInlines(first.children, scope)}
      {renderFlow(rest, scope)}
    </>
  );
}

/**
 * Renders a task item's mark: the caller's glyph, else the recipe's box.
 */
function markOf(done: boolean, scope: Scope): ReactNode {
  const glyph = done ? scope.glyphs.tasks?.done : scope.glyphs.tasks?.open;

  return glyph ?? <TaskMark data-checked={done ? "" : undefined} />;
}

/**
 * Renders one item, with its mark and its state's words where it is a task.
 */
function itemOf(item: ListItemNode, loose: boolean, scope: Scope): ReactElement {
  if (item.checked === undefined) return <List.Item>{contentOf(item, loose, scope)}</List.Item>;

  return (
    <List.Item>
      <List.Indicator>{markOf(item.checked, scope)}</List.Indicator>
      <VisuallyHidden>
        {`${item.checked ? scope.words.taskDoneLabel : scope.words.taskOpenLabel} `}
      </VisuallyHidden>
      {contentOf(item, loose, scope)}
    </List.Item>
  );
}

/**
 * Renders a list: numbered from its start where ordered, without bullets where every item is a
 * task.
 *
 * @param node - The list block.
 * @param scope - The document's components, glyphs, words and ids.
 */
export function renderList(node: ListNode, scope: Scope): ReactElement {
  const tasks = node.items.every((item) => item.checked !== undefined);
  const loose = node.loose === true;

  return (
    <List.Root
      as={node.ordered ? "ol" : "ul"}
      gap={scope.size === "md" ? "sm" : "xs"}
      variant={tasks ? "plain" : "marker"}
      {...(node.start === undefined ? {} : { start: node.start })}
    >
      {each(node.items, (item) => itemOf(item, loose, scope))}
    </List.Root>
  );
}
