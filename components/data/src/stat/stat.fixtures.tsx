/**
 * Builds the stats the part specs render their subjects in.
 */

import { type ReactElement, type ReactNode } from "react";

import { HelpText } from "#stat/help-text.ts";
import { Indicator } from "#stat/indicator.ts";
import { Label } from "#stat/label.ts";
import { Root, type RootProps } from "#stat/root.ts";
import { ValueText } from "#stat/value-text.ts";
import { ValueUnit } from "#stat/value-unit.ts";

/**
 * Renders a part inside a stat root that provides the variants.
 *
 * @param children - The part under test.
 * @param props - The root's props.
 * @returns The root, which contains the part.
 */
export function stated(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Renders a complete stat: a label, a figure with a unit, and help text with an indicator.
 *
 * @param props - The root's props.
 * @returns The stat.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Label>Time to settle</Label>
      <ValueText>
        3<ValueUnit>hr</ValueUnit>
      </ValueText>
      <HelpText>
        <Indicator>
          <svg aria-hidden />
        </Indicator>
        +12% from last month
      </HelpText>
    </Root>
  );
}
