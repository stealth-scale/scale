/**
 * Fixtures for the tooltip specs: a closed root around a part and a whole tooltip.
 */

import { type ReactElement, type ReactNode } from "react";

import { ArrowTip } from "#tooltip/arrow-tip.tsx";
import { Arrow } from "#tooltip/arrow.tsx";
import { Content } from "#tooltip/content.tsx";
import { Positioner } from "#tooltip/positioner.tsx";
import { Root, type RootProps } from "#tooltip/root.tsx";
import { Trigger } from "#tooltip/trigger.tsx";

/**
 * Renders a part inside a root that runs the machine.
 *
 * @param children - The part under test.
 * @returns The root with the part inside it.
 */
export function hinted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Renders a trigger and its positioned content with an arrow, with the props the case sets on the
 * root.
 *
 * @param props - The props the case sets on the root.
 * @returns The tooltip.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger>Save</Trigger>
      <Positioner>
        <Content>
          <Arrow>
            <ArrowTip />
          </Arrow>
          Saves without closing
        </Content>
      </Positioner>
    </Root>
  );
}
