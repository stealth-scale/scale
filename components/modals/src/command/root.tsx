/**
 * Renders the palette's panel, filters its actions and reports the action a reader runs.
 *
 * @remarks
 *   The palette is a combobox that controls a listbox, the pattern the APG documents for a list a
 *   reader filters by typing. Focus remains in the field, the arrow keys move the highlight, and
 *   the machine points `aria-activedescendant` at the highlighted row. A menu would move to a row
 *   on a letter key instead of filtering. The listbox's selection is always empty, because running
 *   a command picks no value, and a kept selection would announce the last command as selected when
 *   the palette opens again. The root passes its size to the listbox, so the rows follow the
 *   palette's size. The field and the list render inside `Listbox.Frame`, because the listbox root
 *   spaces its parts a gap apart and the frame does not.
 */

import { type ComponentProps, type ReactElement } from "react";

import { Listbox } from "@stealthscale/component-collections";

import { type CommandAction } from "#command/action.ts";
import { withProvider } from "#command/context.ts";
import { CommandProvider, useCommandState } from "#command/state.ts";

/**
 * Renders the `div` with the recipe's root class, which provides the variants to the parts below
 * it.
 */
const Panelled = withProvider("div", "root");

/**
 * Formats the result count in English, the default of `count`.
 */
function counted(matches: number): string {
  return matches === 1 ? "1 result" : `${String(matches)} results`;
}

/**
 * Describes the props of the palette: its actions, the list's name, the announcement, the handler,
 * the opening query, the recipe's variants and the props of a `div`.
 */
export interface RootProps extends Omit<ComponentProps<typeof Panelled>, "onSelect"> {
  /**
   * Every command the palette can run.
   */
  readonly actions: readonly CommandAction[];

  /**
   * The accessible name of the list, required because the palette renders no visible label for it.
   */
  readonly "aria-label": string;

  /**
   * Formats the announcement made after each keystroke, given the number of remaining matches.
   * English by default.
   */
  readonly count?: ((matches: number) => string) | undefined;

  /**
   * Called with the value of the action the reader ran.
   */
  readonly onRun?: ((value: string) => void) | undefined;

  /**
   * The query the palette opens with, such as text a reader typed before opening it. Empty when
   * absent.
   */
  readonly query?: string | undefined;
}

/**
 * Renders the panel, provides the palette state to the parts and runs the listbox.
 *
 * @param props - The actions, the list's name, the announcement, the handler, the opening query,
 *   the recipe's variants and the props of a `div`.
 * @returns The `div` element inside the state provider.
 */
export function Root({
  actions,
  "aria-label": label,
  children,
  count = counted,
  onRun,
  query,
  size,
  ...rest
}: RootProps): ReactElement {
  const palette = useCommandState({ actions, count, label, query });

  return (
    <CommandProvider value={palette}>
      <Panelled {...(size === undefined ? {} : { size })} {...rest}>
        <Listbox.Root
          collection={palette.collection}
          onSelect={(details) => {
            onRun?.(details.value);
          }}
          selectionMode="single"
          {...(size === undefined ? {} : { size })}
          value={[]}
        >
          <Listbox.Frame>{children}</Listbox.Frame>
        </Listbox.Root>
      </Panelled>
    </CommandProvider>
  );
}
