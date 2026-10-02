/**
 * Renders the control that adds a reaction: a button that opens the disclosure `Popover` with the
 * caller's choices.
 *
 * @remarks
 *   The trigger is the actions `IconButton`, extra small in the ghost look, named by `label`, with
 *   the caller's glyph. The panel is portalled, named by `choicesLabel`, and lays the choices out
 *   in a row that wraps. A choice reports its value through `onSelect` and closes the panel, and
 *   the popover returns focus to the trigger. A reaction is one act, so a panel left open would
 *   invite a second press that removes it again.
 */

import { type ReactElement, type ReactNode, useState } from "react";

import { ButtonPropsProvider, IconButton } from "@stealthscale/component-actions";
import { Popover } from "@stealthscale/component-disclosure";
import { Portal } from "@stealthscale/component-primitives";

import { withContext } from "#reactions/context.ts";
import { PickerProvider } from "#reactions/state.ts";

/**
 * Renders the `div` that lays the choices out.
 */
const Choices = withContext("div", "choices");

/**
 * Describes the props of the picker: the trigger's glyph and name, the panel's name, the handler of
 * a choice, and the popover root's props without its open state, which the picker keeps, and
 * without the element's `onSelect` event, which the choice handler replaces.
 */
export interface PickerProps extends Omit<
  Popover.RootProps,
  "children" | "defaultOpen" | "onOpenChange" | "onSelect" | "open"
> {
  /**
   * The choices, each a `Reactions.Choice`.
   */
  readonly children?: ReactNode;

  /**
   * Accessible name of the panel, "Choose a reaction" unless stated.
   */
  readonly choicesLabel?: string | undefined;

  /**
   * Glyph of the trigger.
   */
  readonly icon: ReactNode;

  /**
   * Accessible name of the trigger, "Add a reaction" unless stated.
   */
  readonly label?: string | undefined;

  /**
   * Called with the value of the choice pressed.
   */
  readonly onSelect?: ((value: string) => void) | undefined;
}

/**
 * Renders the trigger and the panel, and closes the panel on a choice.
 *
 * @param props - The trigger's glyph and name, the panel's name, the handler of a choice and the
 *   popover root's props.
 * @returns The popover's root.
 */
export function Picker({
  children,
  choicesLabel = "Choose a reaction",
  icon,
  label = "Add a reaction",
  onSelect,
  ...props
}: PickerProps): ReactElement {
  const [open, setOpen] = useState(false);

  /**
   * Reports the value and closes the panel.
   *
   * @param value - The value of the choice pressed.
   */
  function choose(value: string): void {
    onSelect?.(value);
    setOpen(false);
  }

  return (
    <Popover.Root
      {...props}
      onOpenChange={(details) => {
        setOpen(details.open);
      }}
      open={open}
    >
      <ButtonPropsProvider value={{ size: "xs", variant: "ghost" }}>
        <Popover.Trigger aria-label={label} as={IconButton}>
          {icon}
        </Popover.Trigger>
      </ButtonPropsProvider>
      <Portal>
        <Popover.Positioner>
          <Popover.Content aria-label={choicesLabel}>
            <PickerProvider value={{ choose }}>
              <Choices>{children}</Choices>
            </PickerProvider>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
