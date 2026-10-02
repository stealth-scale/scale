/**
 * Renders the message the panel shows while no row matches the text.
 *
 * @remarks
 *   The element renders only while the collection is empty. It announces its text through the
 *   document's polite live region as it appears, because focus stays on the input and a screen
 *   reader reads nothing when the rows disappear. It is an unselected, disabled `option`, because
 *   a `listbox` contains only rows and groups, so a screen reader reads it as the one row of the
 *   list and a person cannot pick it. The machine finds rows by their value, so the arrow keys
 *   never highlight it. An open panel with no rows and no empty message is hidden.
 */

import { type ComponentProps, type ReactElement, useEffect, useState } from "react";

import { useAnnounce } from "@stealthscale/hooks";

import { withContext } from "#combobox/context.ts";
import { useCombobox } from "#combobox/machine.ts";

/**
 * Renders the `div` with the combobox's empty class.
 */
const Unmatched = withContext("div", "empty");

/**
 * Describes the props of the empty message: its words and the props of a `div`, without `ref`,
 * which the announcement takes.
 */
export type EmptyProps = Omit<ComponentProps<typeof Unmatched>, "ref">;

/**
 * Renders the message while the collection is empty, and announces it as it appears.
 *
 * @param props - The words and the props of a `div`.
 * @returns The `div` element, or nothing while a row matches.
 */
export function Empty(props: EmptyProps): null | ReactElement {
  const api = useCombobox();
  const announce = useAnnounce();
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (node === null) return;

    announce(node.textContent);
  }, [announce, node]);

  if (api.collection.size > 0) return null;

  return (
    <Unmatched
      {...props}
      aria-disabled="true"
      aria-selected="false"
      ref={setNode}
      // eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- an option element is valid only inside a select, and the panel is a div listbox
      role="option"
    />
  );
}
