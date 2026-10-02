/**
 * Renders the step of a wizard a person is on: the steps as a progress list, the step's heading and
 * fields, and the buttons that move between steps.
 *
 * @remarks
 *   The progress list is the library's `Steps`, with a numbered disc and a title per step and no
 *   triggers, because the foundation decides where a person may go. The heading has `tabIndex={-1}`
 *   and opens the element with the step's id, so focus moves to it after a move and a screen
 *   reader reads the step's name before its first field. Back moves to the step before, from
 *   every step but the first. Next moves to the step after, which the foundation refuses while a
 *   field of the step is refused. The last step shows the form's submit button in Next's place. The
 *   words read `<id>.actions.back` and `<id>.actions.next`.
 */

import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Steps } from "@stealthscale/component-disclosure";
import { omitUndefined } from "@stealthscale/hooks";
import { type StepProps, useWords } from "@stealthscale/provider-form";

import { withContext } from "#form/context.ts";
import { useFormScope } from "#form/scope.ts";
import { Submit } from "#form/submit.tsx";

/**
 * Renders the step's `div` with the form's group class, a column of its heading and fields.
 */
const Body = withContext("div", "group");

/**
 * Renders the step's heading with the form's heading class.
 */
const Heading = withContext("h2", "heading");

/**
 * Renders the row of buttons with the form's actions class.
 */
const Actions = withContext("div", "actions");

/**
 * Maps each heading level to the element that renders it.
 */
const HEADINGS = { 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" } as const;

/**
 * Renders the current step of a wizard.
 *
 * @param props - The step's fields, its index, its id, the labels of every step and the function
 *   that moves to a step.
 * @returns The progress list, the step and the buttons.
 */
export function Wizard({ children, current, id, labels, onGo }: StepProps): ReactElement {
  const words = useWords();
  const { headingLevel, size } = useFormScope();
  const sized = omitUndefined({ size });

  return (
    <>
      <Steps.Root count={labels.length} step={current} {...sized}>
        <Steps.List>
          {labels.map((label, index) => (
            <Steps.Item index={index} key={label}>
              <Steps.Indicator>
                <Steps.Status />
              </Steps.Indicator>
              <Steps.Title>{label}</Steps.Title>
              <Steps.Separator />
            </Steps.Item>
          ))}
        </Steps.List>
      </Steps.Root>
      <Body id={id}>
        <Heading as={HEADINGS[headingLevel]} tabIndex={-1}>
          {labels[current]}
        </Heading>
        {children}
      </Body>
      <Actions>
        {current > 0 ? (
          <Button
            onClick={() => {
              onGo(current - 1);
            }}
            variant="outline"
            {...sized}
          >
            {words.action("back", "Back")}
          </Button>
        ) : null}
        {current === labels.length - 1 ? (
          <Submit {...sized} />
        ) : (
          <Button
            onClick={() => {
              onGo(current + 1);
            }}
            {...sized}
          >
            {words.action("next", "Next")}
          </Button>
        )}
      </Actions>
    </>
  );
}
