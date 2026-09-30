/**
 * Builds the password inputs the part specifications render.
 */

import { type ReactElement } from "react";

import { act } from "@testing-library/react";

import { Indicator } from "#password-input/indicator.ts";
import { Input } from "#password-input/input.tsx";
import { Root, type RootProps } from "#password-input/root.tsx";
import {
  VisibilityTrigger,
  type VisibilityTriggerProps,
} from "#password-input/visibility-trigger.tsx";

/**
 * Props of the toggle when the case sets none.
 */
const PLAIN: VisibilityTriggerProps = {};

/**
 * Renders a password field named `Password` with its toggle, with the props the case sets on the
 * root and on the toggle.
 *
 * @param props - The props of the root.
 * @param trigger - The props of the toggle.
 * @returns The password input.
 */
export function composed(
  props: RootProps = {},
  trigger: VisibilityTriggerProps = PLAIN,
): ReactElement {
  return (
    <Root {...props}>
      <Input aria-label="Password" />
      <VisibilityTrigger {...trigger}>
        <Indicator fallback={<span data-glyph="eye" />}>
          <span data-glyph="eye-off" />
        </Indicator>
      </VisibilityTrigger>
    </Root>
  );
}

/**
 * Waits one animation frame inside `act`, for the announcement a change writes.
 *
 * @returns A promise that resolves after the frame.
 */
export async function framed(): Promise<void> {
  await act(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          resolve();
        });
      }),
  );
}
