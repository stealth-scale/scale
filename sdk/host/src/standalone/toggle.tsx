/**
 * Renders one switch of the development panel, with its words before it.
 */

import { type ReactElement } from "react";

import { Switch } from "@stealthscale/component-forms";

/**
 * Describes the props of a panel switch.
 */
export interface ToggleProps {
  /**
   * True where the switch is on.
   */
  readonly checked: boolean;

  /**
   * The words before the switch, which name it.
   */
  readonly label: string;

  /**
   * Receives the state a press asks for.
   */
  readonly onCheckedChange: (checked: boolean) => void;
}

/**
 * Renders a small switch that spreads across the panel, its words at the start and its control at
 * the end.
 *
 * @param props - The state, the words and the callback a press calls.
 * @returns The switch.
 */
export function Toggle({ checked, label, onCheckedChange }: ToggleProps): ReactElement {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={(details) => {
        onCheckedChange(details.checked);
      }}
      size="sm"
      spread
    >
      <Switch.Label>{label}</Switch.Label>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch.Root>
  );
}
