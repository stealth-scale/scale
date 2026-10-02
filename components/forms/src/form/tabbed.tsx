/**
 * Renders a form whose steps are tabs: a tab per step, the fields of the tab a person is on, and
 * the form's submit button.
 *
 * @remarks
 *   The tabs are the library's `Tabs`, one panel per step. The current tab's panel contains the
 *   fields, inside the element with the step's id. A person moves between tabs in any order, and
 *   focus remains on the tab a person activated. The submit button follows the panels, so a person
 *   submits from any tab.
 */

import { type ReactElement } from "react";

import { Tabs } from "@stealthscale/component-disclosure";
import { omitUndefined } from "@stealthscale/hooks";
import { type StepProps } from "@stealthscale/provider-form";

import { withContext } from "#form/context.ts";
import { useFormScope } from "#form/scope.ts";
import { Submit } from "#form/submit.tsx";

/**
 * Renders the step's `div` with the form's group class, a column of its fields.
 */
const Body = withContext("div", "group");

/**
 * Renders the row of buttons with the form's actions class.
 */
const Actions = withContext("div", "actions");

/**
 * Renders the tabs of a form, with the fields of the current tab.
 *
 * @param props - The step's fields, its index, its id, the labels of every step and the function
 *   that moves to a step.
 * @returns The tabs and the submit button.
 */
export function Tabbed({ children, current, id, labels, onGo }: StepProps): ReactElement {
  const { size } = useFormScope();
  const sized = omitUndefined({ size });

  return (
    <>
      <Tabs.Root
        onValueChange={({ value }) => {
          onGo(Number(value));
        }}
        value={String(current)}
        {...sized}
      >
        <Tabs.List>
          {labels.map((label, index) => (
            <Tabs.Trigger key={label} value={String(index)}>
              {label}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
        {labels.map((label, index) => (
          <Tabs.Content key={label} value={String(index)}>
            {index === current ? <Body id={id}>{children}</Body> : null}
          </Tabs.Content>
        ))}
      </Tabs.Root>
      <Actions>
        <Submit {...sized} />
      </Actions>
    </>
  );
}
