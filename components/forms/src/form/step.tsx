/**
 * Renders the step of a form a person is on, as a wizard or as tabs.
 */

import { type ReactElement } from "react";

import { type StepProps } from "@stealthscale/provider-form";

import { Tabbed } from "#form/tabbed.tsx";
import { Wizard } from "#form/wizard.tsx";

/**
 * Renders a wizard's step with its progress and buttons, or the tabs of a tabbed form.
 *
 * @param props - The step's fields, its index, its id, the kind of steps, the labels of every step
 *   and the function that moves to a step.
 * @returns The step as its kind renders it.
 */
export function Step(props: StepProps): ReactElement {
  return props.kind === "tabs" ? <Tabbed {...props} /> : <Wizard {...props} />;
}
