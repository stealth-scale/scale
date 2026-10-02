/**
 * Builds the control the part specifications render inside.
 */

import { type ReactElement, type ReactNode } from "react";

import { Root } from "#switcher/root.tsx";
import { Trigger } from "#switcher/trigger.tsx";

/**
 * Renders a part inside a trigger labelled `Workspace`.
 *
 * @param children - The part under test.
 * @returns The switcher with the part inside its trigger.
 */
export function held(children: ReactNode): ReactElement {
  return (
    <Root>
      <Trigger label="Workspace">{children}</Trigger>
    </Root>
  );
}
