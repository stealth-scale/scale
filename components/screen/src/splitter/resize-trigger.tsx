/**
 * Renders the resize trigger between two panels: the `separator` a person drags, or focuses and
 * moves with the keys.
 *
 * @remarks
 *   The WAI-ARIA window splitter pattern names the trigger and points it at its primary pane, the
 *   panel before it. The machine gives the trigger no name, reports the panels' orientation as the
 *   trigger's, and points it at both panels. The trigger takes its name from `label`, "Resize" by
 *   default, reports its line's orientation, which is vertical between panels in a row, and points
 *   `aria-controls` at the panel before it. Its value is that panel's percentage of the root. The
 *   arrows move it by one percent, and by ten with Shift, Home and End move it to the panel's
 *   minimum and maximum, Enter collapses a collapsible panel before it and restores it, and F6
 *   moves focus to the next trigger. Without children it renders the line and the pill.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";
import { type ResizeTriggerProps as MachineTriggerProps } from "@zag-js/splitter";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#splitter/context.ts";
import { TriggerProvider, useSplitterContext } from "#splitter/machine.ts";
import { ResizeTriggerIndicator } from "#splitter/resize-trigger-indicator.tsx";
import { ResizeTriggerSeparator } from "#splitter/resize-trigger-separator.tsx";

/**
 * Renders the `div` with the recipe's resize trigger class.
 */
const Drawn = withContext("div", "resizeTrigger");

/**
 * Describes the props of a trigger: the panels it sits between, whether it is disabled, its name
 * and the props of a `div`.
 */
export interface ResizeTriggerProps extends Omit<ComponentProps<typeof Drawn>, "id"> {
  /**
   * Whether the trigger ignores the pointer and the keys. A disabled trigger leaves the tab order.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Ids of the panels before and after the trigger, joined by a colon, such as `files:editor`.
   */
  readonly id: `${string}:${string}`;

  /**
   * Accessible name of the trigger. Defaults to "Resize".
   */
  readonly label?: string | undefined;
}

/**
 * Returns the id of the first element an `aria-controls` value lists, the primary pane.
 *
 * @param controls - The machine's `aria-controls` value.
 */
function primaryOf(controls: unknown): string | undefined {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the machine writes both panels' ids, or nothing for a trigger without a panel on one side
  return (controls as string | undefined)?.split(" ")[0];
}

/**
 * Renders the trigger with the machine's trigger props, its name, its line's orientation and its
 * primary pane merged under the caller's.
 *
 * @param props - The panels, the disabled state, the name and the props of a `div`.
 * @returns The `div` element.
 */
export function ResizeTrigger({
  children,
  disabled,
  id,
  label = "Resize",
  ...props
}: ResizeTriggerProps): ReactElement {
  const api = useSplitterContext();
  const trigger: MachineTriggerProps = { disabled, id };
  const machine = api.getResizeTriggerProps(trigger);
  const own = omitUndefined({
    "aria-controls": primaryOf(machine["aria-controls"]),
    "aria-label": label,
    "aria-orientation": api.orientation === "horizontal" ? "vertical" : "horizontal",
  });

  return (
    <TriggerProvider value={trigger}>
      <Drawn {...mergeProps(machine, own, props)}>
        {children ?? (
          <>
            <ResizeTriggerSeparator />
            <ResizeTriggerIndicator />
          </>
        )}
      </Drawn>
    </TriggerProvider>
  );
}
