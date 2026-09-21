/**
 * Renders the actions still matching the query, grouped under their headings.
 *
 * @remarks
 *   The rows come from the listbox, which owns the roles, the active option and everything
 *   assistive technology announces as it moves. This component only buckets the actions and lays
 *   out the glyph, the label and the shortcut within each row. The children are rendered in place
 *   of the rows when nothing matches, which is where a `Command.Empty` goes. Groups are identified
 *   by index rather than by heading, because the machine derives a DOM id from the value it is
 *   given and a heading containing a space produces an id no selector can query.
 */

import { type ComponentProps, type ReactElement } from "react";

import { Listbox } from "@stealthscale/component-collections";

import { type CommandAction, gathered } from "#command/action.ts";
import { withContext } from "#command/context.ts";
import { useCommand } from "#command/state.ts";

/**
 * The styled element carrying the recipe's list slot, which is the scrolling region.
 */
const Scrolled = withContext("div", "list");

/**
 * The styled element carrying the recipe's shortcut slot, set at the end of a row.
 */
const Struck = withContext("kbd", "shortcut");

/**
 * Props accepted by `List`, which are the props of the styled scrolling element.
 */
export type ListProps = ComponentProps<typeof Scrolled>;

/**
 * Renders one action as a listbox item, omitting the shortcut when the action declares none.
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
 */
export function List({ children, ...rest }: ListProps): ReactElement {
  const palette = useCommand();
  const left = palette.collection.items;

  return (
    <Scrolled {...rest}>
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
    </Scrolled>
  );
}
