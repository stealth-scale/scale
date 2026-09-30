/**
 * Renders the browser's `select` behind the trigger, which a form submits and a browser fills.
 *
 * @remarks
 *   The element is visually hidden, `aria-hidden` and out of the tab order, and focus that reaches
 *   it moves to the trigger. It has one option per item of the collection, which the machine
 *   selects to match the value, so a form submits the value under `name` and a browser's autofill
 *   through `autoComplete` sets it. A single select has an empty first option, so nothing is
 *   selected before a person chooses and `required` refuses an empty value.
 */

import { type ReactElement } from "react";

import { useSelect } from "#select/machine.ts";

/**
 * Empty first option of a single select, selected while nothing is chosen.
 */
// eslint-disable-next-line jsx-a11y/control-has-associated-label -- the select is aria-hidden and the option has no words
const NONE = <option value="" />;

/**
 * Renders the hidden `select` with an option per item.
 *
 * @returns The `select` element.
 */
export function HiddenSelect(): ReactElement {
  const api = useSelect();
  const { collection } = api;

  return (
    <select {...api.getHiddenSelectProps()}>
      {api.multiple ? null : NONE}
      {collection.items.map((item) => {
        // eslint-disable-next-line typescript/no-unsafe-type-assertion -- an item of the collection always has a value
        const value = collection.getItemValue(item) as string;

        return (
          <option disabled={collection.getItemDisabled(item)} key={value} value={value}>
            {collection.stringifyItem(item)}
          </option>
        );
      })}
    </select>
  );
}
