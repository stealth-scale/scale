/**
 * Renders the actions that match the query, grouped under their headings.
 *
 * @remarks
 *   The rows are listbox items, so the listbox sets their roles, the highlight and what a screen
 *   reader announces as the highlight moves. The list groups the actions and lays out each row's
 *   glyph, label and shortcut. It renders its children in place of the rows when nothing matches,
 *   which is where `Command.Empty` goes. A group's id comes from its index, because the machine
 *   derives a DOM id from it and a heading with a space would make an id no selector can query. The
 *   rows scroll in the scroll area of the listbox's content, which fills the room the panel leaves
 *   below the field.
 */

import { type ComponentProps, type ReactElement } from "react";

import { Listbox } from "@stealthscale/component-collections";

import { type CommandAction, gathered } from "#command/action.ts";
import { withContext } from "#command/context.ts";
import { useCommand } from "#command/state.ts";

/**
 * Renders the `div` with the recipe's list class, which the listbox's content fills.
 */
const Listed = withContext("div", "list");

/**
 * Renders the `kbd` with the recipe's shortcut class, at the end of a row.
 */
const Struck = withContext("kbd", "shortcut");

/**
 * Describes the props of the list: the props of a `div`.
 */
export type ListProps = ComponentProps<typeof Listed>;

/**
 * Renders one action as a listbox item, with its shortcut when it has one.
 */
function row(action: CommandAction): ReactElement {
  return (
    <Listbox.Item item={action} key={action.value}>
      {action.icon}
      <Listbox.ItemText item={action}>{action.label}</Listbox.ItemText>
      {action.shortcut === undefined ? null : <Struck>{action.shortcut}</Struck>}
    </Listbox.Item>
  );
}

/**
 * Renders the matching actions grouped by heading, or the children when nothing matches.
 *
 * @param props - The message for no match as children, and the props of a `div`.
 * @returns The `div` element that contains the listbox.
 */
export function List({ children, ...rest }: ListProps): ReactElement {
  const palette = useCommand();
  const left = palette.collection.items;

  return (
    <Listed {...rest}>
      {left.length === 0 ? (
        children
      ) : (
        <Listbox.Content aria-label={palette.label}>
          {gathered(left).map(([heading, actions], index) => (
            <Listbox.ItemGroup id={`group-${String(index)}`} key={heading}>
              {heading === "" ? null : (
                <Listbox.ItemGroupLabel htmlFor={`group-${String(index)}`}>
                  {heading}
                </Listbox.ItemGroupLabel>
              )}
              {actions.map((action) => row(action))}
            </Listbox.ItemGroup>
          ))}
        </Listbox.Content>
      )}
    </Listed>
  );
}
