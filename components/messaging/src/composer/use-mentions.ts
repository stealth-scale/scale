/**
 * Keeps the mention a reader types in the composer's textarea: the query at the caret, the
 * suggestion the keys highlight, and the insertion of the one chosen.
 *
 * @remarks
 *   Focus stays in the textarea. The arrows move the highlight, which the textarea reports through
 *   `aria-activedescendant`, Enter and Tab insert the highlighted suggestion, and Escape closes the
 *   list without changing the text and without reaching a dialog around the composer. The list is
 *   open while the caret is in a query and there are suggestions. A new query moves the highlight
 *   back to the first suggestion, and a list that shrinks keeps it on its last suggestion. A key
 *   pressed while an input method composes text is left to the input method.
 */

import { type KeyboardEvent, useId, useState } from "react";
import { flushSync } from "react-dom";

import { mentioned, type Query, queryAt } from "#composer/mentions.ts";

/**
 * Describes one suggestion: the name inserted and a line that tells two names apart.
 */
export interface Suggestion {
  /**
   * Line under the name, such as a team or an email address.
   */
  readonly description?: string | undefined;

  /**
   * Identifier of the suggestion, unique among the suggestions.
   */
  readonly id: string;

  /**
   * The name listed and inserted after the trigger.
   */
  readonly label: string;
}

/**
 * Describes the mention options the textarea takes.
 */
export interface MentionOptions {
  /**
   * Called with the suggestion inserted and the query it replaced.
   */
  readonly onMention?: ((suggestion: Suggestion, query: Query) => void) | undefined;

  /**
   * Called with the query at the caret whenever it changes, undefined outside every mention.
   */
  readonly onQueryChange?: ((query: Query | undefined) => void) | undefined;

  /**
   * The suggestions for the query, which the caller finds from the term.
   */
  readonly suggestions?: readonly Suggestion[] | undefined;

  /**
   * The characters that open a mention, such as `@` and `#`.
   */
  readonly triggers?: readonly string[] | undefined;
}

/**
 * Describes what the hook returns to the textarea and the list.
 */
export interface Mentions {
  /**
   * Inserts the suggestion at the index given.
   */
  readonly choose: (index: number) => void;

  /**
   * Closes the list until the caret moves into a query again.
   */
  readonly dismiss: () => void;

  /**
   * Index of the highlighted suggestion.
   */
  readonly highlight: number;

  /**
   * Handles a key the list acts on, and returns whether it did.
   */
  readonly keyed: (event: KeyboardEvent<HTMLTextAreaElement>) => boolean;

  /**
   * Identifier of the list.
   */
  readonly listId: string;

  /**
   * Reads the query at the textarea's caret again.
   */
  readonly moved: (input: HTMLTextAreaElement) => void;

  /**
   * Whether the list is open.
   */
  readonly open: boolean;

  /**
   * Returns the identifier of the suggestion at the index given.
   */
  readonly optionId: (index: number) => string;

  /**
   * Highlights the suggestion at the index given.
   */
  readonly setHighlight: (index: number) => void;

  /**
   * The suggestions for the query.
   */
  readonly suggestions: readonly Suggestion[];
}

/**
 * Lists no suggestions.
 */
const NONE: readonly Suggestion[] = [];

/**
 * Lists no triggers.
 */
const UNTRIGGERED: readonly string[] = [];

/**
 * Lists what a key does to the open list: move the highlight by a step, choose, or close.
 */
type ListKey = "choose" | "close" | number;

/**
 * Maps each key the open list uses to what it does.
 */
const KEYS: Readonly<Record<string, ListKey>> = {
  ArrowDown: 1,
  ArrowUp: -1,
  Enter: "choose",
  Escape: "close",
  Tab: "choose",
};

/**
 * Describes what a choice reads: the query, the textarea and the suggestion chosen.
 */
type Chosen = [Query, HTMLTextAreaElement, Suggestion];

/**
 * Returns whether two queries name the same mention.
 */
function same(one: Query | undefined, other: Query | undefined): boolean {
  return one?.from === other?.from && one?.term === other?.term && one?.trigger === other?.trigger;
}

/**
 * Returns the mention state of the composer's textarea.
 *
 * @param options - The triggers, the suggestions and the handlers.
 * @param input - The textarea, once it renders.
 * @param setText - Replaces the composer's text.
 * @returns The list's state and the handlers the textarea and the list call.
 */
export function useMentions(
  options: MentionOptions,
  input: HTMLTextAreaElement | null,
  setText: (text: string) => void,
): Mentions {
  const { onMention, onQueryChange, suggestions = NONE, triggers = UNTRIGGERED } = options;
  const listId = useId();
  const [query, setQuery] = useState<Query | undefined>();
  const [stored, setHighlight] = useState(0);
  const open = query !== undefined && suggestions.length > 0;
  const highlight = Math.min(stored, suggestions.length - 1);

  /**
   * Stores the query and reports a change of it.
   *
   * @param next - The query at the caret, none outside every mention.
   */
  function queried(next?: Query): void {
    if (same(next, query)) return;

    setHighlight(0);
    setQuery(next);
    onQueryChange?.(next);
  }

  /**
   * Inserts the suggestion at an index in place of the query, and puts the caret after it.
   *
   * @remarks
   *   The open list is the only caller, with an index it lists, and it is open only with a query
   *   and a rendered textarea. The text is committed at once, so the caret is placed in the
   *   textarea's new value rather than moved to its end by the next render.
   * @param index - The suggestion's index.
   */
  function choose(index: number): void {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the open list has a query, a rendered textarea and a suggestion at every index it passes
    const [at, element, suggestion] = [query, input, suggestions[index]] as Chosen;
    const next = mentioned(element.value, at, element.selectionStart, suggestion.label);

    flushSync(() => {
      setText(next.text);
    });
    element.setSelectionRange(next.caret, next.caret);
    queried();
    onMention?.(suggestion, at);
  }

  /**
   * Moves the highlight, inserts the highlighted suggestion or closes the list.
   *
   * @param event - The key press, which the hook cancels when it acts on it.
   * @returns Whether the list acted on the key.
   */
  function keyed(event: KeyboardEvent<HTMLTextAreaElement>): boolean {
    const action = open && !event.nativeEvent.isComposing ? KEYS[event.key] : undefined;

    if (action === undefined) return false;

    event.preventDefault();

    if (typeof action === "number") {
      setHighlight((highlight + action + suggestions.length) % suggestions.length);
    } else if (action === "choose") {
      choose(highlight);
    } else {
      event.stopPropagation();
      queried();
    }

    return true;
  }

  return {
    choose,
    dismiss: () => {
      queried();
    },
    highlight,
    keyed,
    listId,
    moved: (element) => {
      queried(queryAt(element.value, element.selectionStart, triggers));
    },
    open,
    optionId: (index) => `${listId}-${String(index)}`,
    setHighlight,
    suggestions,
  };
}
