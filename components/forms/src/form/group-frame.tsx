/**
 * Renders what every group control of a form shares: the label that names the group, the help
 * text, the error, and the field that ties them to the group.
 *
 * @remarks
 *   A group of choices takes focus on each choice, so no `label` element can point at one control.
 *   The frame renders the field's label as a `span` and hands the group the label's id, which the
 *   group names itself by. The library's group controls read the same id from the field around
 *   them. The label ends in the mark the form asks for, and the group takes the field's size.
 */

import { type ReactElement, type ReactNode } from "react";

import { useFieldAria } from "@stealthscale/provider-form";

import * as Field from "#field/index.ts";
import { type FieldProps } from "#form/frame.tsx";
import { Mark } from "#form/mark.tsx";
import { useFormScope } from "#form/scope.ts";
import { Texts } from "#form/texts.tsx";

/**
 * Describes what a group takes from its frame.
 */
export interface FramedGroupProps {
  /**
   * Identifier of the label that names the group.
   */
  readonly "aria-labelledby": string;

  /**
   * Path of the field, by which the foundation moves focus to a refused field.
   */
  readonly name: string;
}

/**
 * Describes what a group frame is given.
 */
export interface GroupFrameProps extends FieldProps {
  /**
   * Renders the group, given what it takes from the frame.
   */
  readonly children: (group: FramedGroupProps) => ReactNode;
}

/**
 * Renders the frame around one group: the label above it and the texts under it.
 *
 * @param props - The words of the label, whether a value is required and the group.
 * @returns The field, with the group inside it.
 */
export function GroupFrame({ children, label, required }: GroupFrameProps): ReactElement {
  const aria = useFieldAria({ label, required });
  const { size } = useFormScope();

  return (
    <Field.Root
      id={aria.control.id}
      invalid={aria.error !== undefined}
      required={aria.control["aria-required"]}
      {...(size === undefined ? {} : { size })}
    >
      <Field.Label as="span" htmlFor={undefined}>
        {aria.label.text}
        <Mark />
      </Field.Label>
      {children({ "aria-labelledby": aria.label.props.id, name: aria.control.name })}
      <Texts description={aria.description} error={aria.error} />
    </Field.Root>
  );
}
