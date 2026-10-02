/**
 * Renders one group of the development panel's controls under its legend.
 */

import { type ReactElement, type ReactNode } from "react";

import { Fieldset } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";

/**
 * Describes the props of a panel group.
 */
export interface GroupProps {
  /**
   * The group's controls.
   */
  readonly children?: ReactNode;

  /**
   * The legend, which names the group.
   */
  readonly title: string;
}

/**
 * Renders a small fieldset with its legend and its controls stacked under it.
 *
 * @param props - The legend and the controls.
 * @returns The fieldset.
 */
export function Group({ children, title }: GroupProps): ReactElement {
  return (
    <Fieldset.Root size="sm">
      <Fieldset.Legend>{title}</Fieldset.Legend>
      <Stack gap="sm">{children}</Stack>
    </Fieldset.Root>
  );
}
