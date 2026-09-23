/**
 * Renders the panel, owns the palette state and reports the action a user runs.
 *
 * @remarks
 *   The palette is modelled as a combobox rather than a menu, and assistive technology treats the
 *   two differently. In a menu a letter key jumps to a matching item instead of filtering, so a
 *   user cannot type and navigate at the same time. Here typing moves the active option while focus
 *   stays in the input, which is the pattern the APG documents for a combobox owning a listbox.
 *   Selection is held empty deliberately: running a command is not the same as picking a value, and
 *   a palette that remembered the last command would announce it as still selected the next time it
 *   opened.
 *   The size is handed to the listbox as well as to the panel. The rows are the listbox's, so a
 *   palette that kept its size to itself moved the query bar and the padding and left every row at
 *   the listbox's own default: the three sizes differed by the height of one bar.
 *   The bar and the rows go inside the listbox's own box, which is what that box is for. Written
 *   straight under the list they were two of its parts, and a list spaces its parts a step of the
 *   scale apart: the bar's rule was followed by a band of dead space before the first row.
 */

import { type ComponentProps, type ReactElement } from "react";

import { Listbox } from "@stealthscale/component-collections";

import { type CommandAction } from "#command/action.ts";
import { withProvider } from "#command/context.ts";
import { CommandProvider, useCommandState } from "#command/state.ts";

/**
 * The styled element carrying the recipe's root slot, which resolves the variants for the parts
 * below it.
 */
const Panelled = withProvider("div", "root");

/**
 * Formats the result count in English, used when the caller supplies no formatter of their own.
 */
function counted(matches: number): string {
  return matches === 1 ? "1 result" : `${String(matches)} results`;
}

/**
 * Props of the palette root, plus everything the styled element accepts.
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
   * Called with the value of the action the user ran.
   */
  readonly onRun?: ((value: string) => void) | undefined;

  /**
   * The query the palette opens holding, for a page that opens one from something a reader has
   * already typed. Empty when absent.
   */
  readonly query?: string | undefined;
}

/**
 * Lists every action a page offers and narrows the list as the user types.
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
