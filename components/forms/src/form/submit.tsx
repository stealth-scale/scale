/**
 * Renders the button that submits the form in scope.
 *
 * @remarks
 *   The button is the library's `Button`. It is enabled while the form is invalid, so a press runs
 *   the submit that moves focus to the first refused field. While the form submits, the button is
 *   `aria-disabled` and refuses a second press. It keeps focus, which `disabled` would drop to the
 *   page.
 */

import { type ReactElement } from "react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";
import { useFormContext, useWords } from "@stealthscale/provider-form";

/**
 * Describes what a submit button is given: the props of the library's `Button`, less its `type`.
 */
export type SubmitProps = Omit<ButtonProps, "type">;

/**
 * Renders a submit button, which reads `<id>.actions.submit`, or "Submit", without children.
 *
 * @param props - The button's words and props.
 * @returns The button.
 */
export function Submit({ children, onClick, ...rest }: SubmitProps): ReactElement {
  const form = useFormContext();
  const words = useWords();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(submitting) => (
        <Button
          {...rest}
          aria-disabled={submitting || undefined}
          onClick={(event) => {
            if (submitting) event.preventDefault();
            onClick?.(event);
          }}
          type="submit"
        >
          {children ?? words.action("submit", "Submit")}
        </Button>
      )}
    </form.Subscribe>
  );
}
