/**
 * Draws one part of a switcher inside the control that hands down the variants.
 */

import { type ReactElement, type ReactNode } from "react";

import { Root } from "#switcher/root.tsx";
import { Trigger } from "#switcher/trigger.tsx";

/**
 * Draws whatever a case wants measured inside the control.
 *
 * @param children - The part under test.
 * @returns The switcher, holding the control, holding it.
 */
export function held(children: ReactNode): ReactElement {
  return (
    <Root>
      <Trigger label="Workspace">{children}</Trigger>
    </Root>
  );
}
