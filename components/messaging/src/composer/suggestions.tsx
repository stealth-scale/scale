/**
 * Renders the list of suggestions for the mention a reader types, above the composer's box.
 *
 * @remarks
 *   The list is a `listbox` named by `label`, and each suggestion an `option` with its name and an
 *   optional line under it. Focus stays in the textarea, which points `aria-activedescendant` at
 *   the highlighted option. A press on an option inserts it: the press is cancelled on
 *   `mousedown`, so the textarea keeps focus and its caret. A pointer over an option highlights it.
 *   The list renders nothing while it is closed.
 */

import { type ReactElement } from "react";

import { withContext } from "#composer/context.ts";
import { type Mentions } from "#composer/use-mentions.ts";

/**
 * Renders the list's `div`.
 */
const Listed = withContext("div", "suggestions");

/**
 * Renders one suggestion's `div`.
 */
const Option = withContext("div", "suggestion");

/**
 * Renders the line under a suggestion's name.
 */
const Detail = withContext("span", "detail");

/**
 * Describes the props of the list: its name and the mention state.
 */
export interface SuggestionsProps {
  /**
   * Accessible name of the list.
   */
  readonly label: string;

  /**
   * The textarea's mention state.
   */
  readonly mentions: Mentions;
}

/**
 * Renders the open list, or nothing.
 *
 * @param props - The list's name and the mention state.
 * @returns The `listbox`, or nothing while the list is closed.
 */
export function Suggestions({ label, mentions }: SuggestionsProps): null | ReactElement {
  if (!mentions.open) return null;

  return (
    <Listed
      aria-label={label}
      id={mentions.listId}
      // eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- a select would take focus from the textarea that keeps the caret
      role="listbox"
    >
      {mentions.suggestions.map((suggestion, index) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- the textarea handles the keys through aria-activedescendant
        <Option
          aria-selected={index === mentions.highlight}
          id={mentions.optionId(index)}
          key={suggestion.id}
          onClick={() => {
            mentions.choose(index);
          }}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onPointerMove={() => {
            mentions.setHighlight(index);
          }}
          // eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- an option element is valid only inside a select
          role="option"
        >
          {suggestion.label}
          {suggestion.description === undefined ? null : <Detail>{suggestion.description}</Detail>}
        </Option>
      ))}
    </Listed>
  );
}
