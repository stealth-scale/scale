/**
 * Renders a narrow page's tabs as a picker: a button that names the selected tab, and a list of the
 * tabs under it that a reader filters by typing.
 *
 * @remarks
 *   The list is the modals package's command palette in a popover at the button's width. Focus
 *   moves to its field when it opens, and the arrow keys move between the rows. Choosing a row, the
 *   selected one included, closes the list, and the popover returns focus to the button. The rows
 *   mark no selection, because the button names the selected tab.
 */

import { type ReactElement, type ReactNode, useState } from "react";

import { Popover } from "@stealthscale/component-disclosure";
import { Command } from "@stealthscale/component-modals";
import { Portal } from "@stealthscale/component-primitives";

import { Palette } from "#page/palette.ts";
import { Picker } from "#page/picker.ts";
import { buttonSizeOf, usePage } from "#page/state.ts";
import { type ListedTab } from "#page/tabs-state.ts";

/**
 * Describes the props of the picker.
 */
export interface TabPickerProps {
  /**
   * Words the list shows while no tab matches the filter.
   */
  readonly emptyLabel: string;

  /**
   * Words the empty filter field shows.
   */
  readonly filterLabel: string;

  /**
   * Mark at the end of the button.
   */
  readonly icon?: ReactNode | undefined;

  /**
   * Accessible name of the list, which the button shows while no tab is selected.
   */
  readonly label: string;

  /**
   * Called with the value of the tab a reader chooses.
   */
  readonly onPick: (value: string) => void;

  /**
   * Tabs in the order they render.
   */
  readonly tabs: readonly ListedTab[];

  /**
   * Value of the selected tab.
   */
  readonly value: string | undefined;
}

/**
 * Returns a tab's words with its count after them.
 */
function named(tab: ListedTab): string {
  return tab.count === undefined ? tab.label : `${tab.label} (${String(tab.count)})`;
}

/**
 * Renders the button and the list it opens.
 *
 * @param props - The words, the mark, the tabs and the selected value.
 * @returns The popover with the button and the list.
 */
export function TabPicker({
  emptyLabel,
  filterLabel,
  icon,
  label,
  onPick,
  tabs,
  value,
}: TabPickerProps): ReactElement {
  const page = usePage();
  const [open, setOpen] = useState(false);
  const picked = tabs.find((tab) => tab.value === value);

  return (
    <Popover.Root
      onOpenChange={(details) => {
        setOpen(details.open);
      }}
      open={open}
      positioning={{ placement: "bottom-start", sameWidth: true }}
    >
      <Popover.Trigger as={Picker} {...{ size: buttonSizeOf(page) }}>
        <span>{picked === undefined ? label : named(picked)}</span>
        {icon}
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content aria-label={label} as={Palette}>
            <Command.Root
              actions={tabs.map((tab) => ({
                disabled: tab.disabled,
                label: named(tab),
                value: tab.value,
              }))}
              aria-label={label}
              onRun={(next) => {
                onPick(next);
                setOpen(false);
              }}
              size="sm"
            >
              <Command.Input aria-label={filterLabel} placeholder={filterLabel} />
              <Command.List>
                <Command.Empty>{emptyLabel}</Command.Empty>
              </Command.List>
            </Command.Root>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
