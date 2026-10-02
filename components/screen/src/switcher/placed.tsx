/**
 * Renders the switcher's trigger in the form its placement asks for.
 *
 * @remarks
 *   In a toolbar the trigger is one of the row's controls, so the arrow keys reach it. On a rail
 *   the trigger shows the current name in a tooltip, because its mark is all a sighted reader sees.
 *   The tooltip's machine and the menu's machine share the trigger's id, so both find the one
 *   element. The tooltip is portalled to the document, because the sidebar's column clips what
 *   overflows it.
 */

import { type ReactElement, type ReactNode } from "react";

import { Tooltip } from "@stealthscale/component-disclosure";
import { Portal } from "@stealthscale/component-primitives";

import { useSwitcher } from "#switcher/state.ts";
import { Trigger } from "#switcher/trigger.tsx";
import { Item } from "#toolbar/item.tsx";

/**
 * Placement of the tooltip: beside the rail, towards the page.
 */
const BESIDE = { placement: "right" } as const;

/**
 * Describes the props of `Placed`.
 */
export interface PlacedProps {
  /**
   * The trigger's content: the current choice and the indicator.
   */
  readonly children: ReactNode;

  /**
   * Kind of thing the switcher switches, which the trigger announces before the name.
   */
  readonly label: string;

  /**
   * Name of the current choice, which the tooltip shows on a rail.
   */
  readonly name?: string | undefined;

  /**
   * Id the menu's machine gives the trigger, which the tooltip's machine shares.
   */
  readonly triggerId: string;
}

/**
 * Renders the trigger as a toolbar control, with a tooltip on a rail, or on its own.
 *
 * @param props - The trigger's content and label, the current name and the trigger's id.
 * @returns The trigger in its placement's form.
 */
export function Placed({ children, label, name, triggerId }: PlacedProps): ReactElement {
  const { iconic, roving } = useSwitcher();

  if (roving) {
    return (
      <Item as={Trigger} label={label}>
        {children}
      </Item>
    );
  }

  if (!iconic || name === undefined) return <Trigger label={label}>{children}</Trigger>;

  return (
    <Tooltip.Root ids={{ trigger: triggerId }} positioning={BESIDE}>
      <Tooltip.Trigger as={Trigger} {...{ label }}>
        {children}
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>{name}</Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
}
