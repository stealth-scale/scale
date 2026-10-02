/**
 * Catalogue page for the command palette.
 *
 * @remarks
 *   `scenesOf` generates the sizes and the palettes from the commands example. The narrowed,
 *   keyword and empty scenes open the same example with a query, which the Source shows as `query`.
 *   Every palette renders in an `md` room. The machine marks the highlighted row only while the
 *   field has keyboard focus, so the specimen sets `data-highlighted` on the first row. The room
 *   and the highlight never appear in the example. The words are keys under `command` in
 *   `locales/en/specimen/command.json`.
 */

import { type ReactElement, type ReactNode, useEffect, useState } from "react";

import { Room, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import * as examples from "#command/examples/index.ts";
import type * as Command from "#command/index.ts";
import { recipe } from "#command/recipe.ts";

/**
 * Describes the props of the highlight staging.
 */
interface HighlightedProps {
  /**
   * The palette to stage.
   */
  readonly children: ReactNode;
}

/**
 * Renders a palette in an `md` room and sets `data-highlighted` on its first row after it mounts.
 *
 * @remarks
 *   The machine sets the attribute only while the field has keyboard focus, and one field on a page
 *   has focus at a time. The staging never appears in an example.
 */
function Highlighted({ children }: HighlightedProps): ReactElement {
  const [box, setBox] = useState<HTMLDivElement | null>(null);

  useEffect((): (() => void) | undefined => {
    const row = box?.querySelector<HTMLElement>('[role="option"][data-value="new"]');

    if (row === undefined || row === null) return undefined;

    row.dataset["highlighted"] = "";

    return () => {
      delete row.dataset["highlighted"];
    };
  }, [box]);

  return (
    <Room size="md">
      <div ref={setBox}>{children}</div>
    </Room>
  );
}

/**
 * Describes the props of a palette opened with a query.
 */
interface QueriedProps {
  /**
   * The scene whose query the palette opens with, a key under `command.queries`.
   */
  readonly query: "empty" | "keywords" | "narrowed";
}

/**
 * Renders the commands example opened with a scene's query, in the reader's language.
 */
function Queried({ query }: QueriedProps): ReactElement {
  const { t } = useWords("command");

  return (
    <Highlighted>
      <examples.commands.Commands query={t(`queries.${query}`)} />
    </Highlighted>
  );
}

/**
 * Hand-written scene for a query that narrows the list.
 */
export const narrowed: Scene = {
  about: "command.narrowed.about",
  draw: () => <Queried query="narrowed" />,
  example: examples.commands,
  props: { query: "invoice" },
  title: "command.narrowed.title",
};

/**
 * Hand-written scene for a query that matches an action through its keywords.
 */
export const keywords: Scene = {
  about: "command.keywords.about",
  draw: () => <Queried query="keywords" />,
  example: examples.commands,
  props: { query: "add" },
  title: "command.keywords.title",
};

/**
 * Hand-written scene for a query that matches no action.
 */
export const empty: Scene = {
  about: "command.empty.about",
  draw: () => <Queried query="empty" />,
  example: examples.commands,
  props: { query: "reconcile" },
  title: "command.empty.title",
};

export default specimen({
  about: "command.about",
  id: "components/modals/command",
  imports: 'import { Command } from "@stealthscale/component-modals";',
  scenes: [
    ...scenesOf<Omit<Command.RootProps, "actions" | "aria-label">>(recipe, {
      draw: (props) => (
        <Highlighted>
          <examples.commands.Commands {...props} />
        </Highlighted>
      ),
      example: examples.commands,
      namespace: "command",
      order: ["size", "palette"],
    }),
    narrowed,
    keywords,
    empty,
  ],
  title: "command.title",
});
