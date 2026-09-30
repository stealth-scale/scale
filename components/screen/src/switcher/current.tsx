/**
 * Renders the current choice inside the switcher's trigger: its mark, its name and its detail.
 */

import { type ReactElement } from "react";

import { type Choice, initialsOf } from "#switcher/choice.ts";
import { Detail } from "#switcher/detail.ts";
import { Label } from "#switcher/label.ts";
import { Mark } from "#switcher/mark.ts";
import { Name } from "#switcher/name.ts";

/**
 * Describes the props of `Current`.
 */
export interface CurrentProps {
  /**
   * The current choice.
   */
  readonly choice: Choice;
}

/**
 * Renders the mark, and the name over the detail.
 *
 * @param props - The current choice.
 * @returns The mark and the label.
 */
export function Current({ choice }: CurrentProps): ReactElement {
  return (
    <>
      <Mark>{choice.mark ?? initialsOf(choice.label)}</Mark>
      <Label>
        <Name>{choice.label}</Name>
        {choice.detail === undefined ? null : <Detail>{choice.detail}</Detail>}
      </Label>
    </>
  );
}
