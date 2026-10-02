/**
 * Renders the button a rail shows in place of the search field, with its label in a tooltip.
 *
 * @remarks
 *   The button is square and named by the label. The tooltip is portalled to the document, because
 *   the sidebar's scrolling column clips what overflows it.
 */

import { type ReactElement, type ReactNode } from "react";

import { Button } from "@stealthscale/component-actions";
import { Tooltip } from "@stealthscale/component-disclosure";
import { Portal } from "@stealthscale/component-primitives";

/**
 * Placement of the tooltip: beside the button, towards the page.
 */
const BESIDE = { placement: "right" } as const;

/**
 * Describes the props of the button.
 */
export interface OpenerProps {
  /**
   * Mark the button shows.
   */
  readonly icon: ReactNode;

  /**
   * Name of the button and the words of its tooltip.
   */
  readonly label: string;

  /**
   * Handler the button calls when pressed.
   */
  readonly onOpen: () => void;

  /**
   * Size of the button.
   */
  readonly size: "md" | "sm" | "xs";
}

/**
 * Renders the square button and its tooltip.
 *
 * @param props - The mark, the label, the handler and the size.
 * @returns The tooltip's root around the button.
 */
export function Opener({ icon, label, onOpen, size }: OpenerProps): ReactElement {
  return (
    <Tooltip.Root positioning={BESIDE}>
      <Tooltip.Trigger
        aria-label={label}
        as={Button}
        onClick={onOpen}
        {...{ shape: "square", size, variant: "ghost" }}
      >
        {icon}
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>{label}</Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
}
