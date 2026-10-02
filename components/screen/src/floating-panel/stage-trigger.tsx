/**
 * Renders a button that minimizes, maximizes or restores the panel.
 *
 * @remarks
 *   The element is the actions `Button` as a square, the `IconButton`'s shape, ghost and `xs`
 *   unless the caller sets a variant or a size, with the caller's glyph. The machine hides Minimize
 *   and Maximize while the panel is minimized or maximized, and Restore while it is neither, so a
 *   header shows two of the three. The trigger is also hidden while the panel cannot be resized,
 *   because the machine then ignores the press. A trigger hidden while it has focus hands focus on:
 *   Minimize and Maximize to Restore, and Restore to the trigger of the stage the panel left. The
 *   trigger takes its name from `label`, "Minimize", "Maximize" or "Restore" by default.
 */

import { type ReactElement, useLayoutEffect, useRef } from "react";

import { type Stage } from "@zag-js/floating-panel";
import { mergeProps } from "@zag-js/react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";

import { withContext } from "#floating-panel/context.ts";
import { handOff, track, untrack } from "#floating-panel/handoff.ts";
import { useFloatingPanel } from "#floating-panel/machine.ts";

/**
 * Renders the actions `Button` as a square with the floating panel's stage trigger class, ghost and
 * `xs` unless the caller sets a variant or a size: the `IconButton`, whose name the trigger sets.
 */
const Drawn: (props: ButtonProps) => ReactElement = withContext(Button, "stageTrigger", {
  defaultProps: { shape: "square", size: "xs", variant: "ghost" },
});

/**
 * Maps each stage to the name of the trigger that sets it.
 */
const LABELS: Readonly<Record<Stage, string>> = {
  default: "Restore",
  maximized: "Maximize",
  minimized: "Minimize",
};

/**
 * Describes the props of a stage trigger: the stage, the name and the props of the icon button.
 */
export interface StageTriggerProps extends Omit<
  ButtonProps,
  "aria-label" | "aria-labelledby" | "ref"
> {
  /**
   * Accessible name of the button. Defaults to "Minimize", "Maximize" or "Restore" by `stage`.
   */
  readonly label?: string | undefined;

  /**
   * Stage a press sets: `minimized`, `maximized`, or `default`, which restores the panel.
   */
  readonly stage: Stage;
}

/**
 * Renders the trigger with the machine's stage trigger props, its name and its focus records
 * merged under the caller's.
 *
 * @param props - The stage, the name, the glyph and the props of the icon button.
 * @returns The `button` element.
 */
export function StageTrigger({ label, stage, ...props }: StageTriggerProps): ReactElement {
  const { api, service } = useFloatingPanel();
  const ref = useRef<HTMLButtonElement>(null);
  const left = useRef<Stage>("minimized");
  const current = service.context.get("stage");
  const machine = api.getStageTriggerProps({ stage });
  const hidden = machine["hidden"] === true || !api.resizable;
  const own: ButtonProps = {
    ...machine,
    "aria-label": label ?? LABELS[stage],
    hidden,
    onBlur: untrack,
    onFocus: track,
  };

  useLayoutEffect(() => {
    if (current !== "default") left.current = current;
  }, [current]);

  useLayoutEffect(() => {
    if (hidden && ref.current !== null) {
      handOff(ref.current, stage === "default" ? left.current : "default");
    }
  }, [hidden, stage]);

  return <Drawn {...mergeProps(own, props)} ref={ref} />;
}
