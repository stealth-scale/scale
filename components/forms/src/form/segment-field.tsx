/**
 * Renders a segment group bound to a string field of a form whose schema lists its choices.
 *
 * @remarks
 *   The group is the library's `SegmentGroup`, a row of choices with a sliding thumb under the
 *   chosen one, named by the field's label. A presentation picks it for a string `enum` with
 *   `control: "segments"`, which suits two to five short choices. Each choice reads its words from
 *   the catalogue under `<id>.fields.<path>.options.<value>`, and its value where the catalogue
 *   has none. Nothing is chosen until a person chooses. The field counts as left once focus leaves
 *   the group, and its blur validators run then.
 */

import { type ReactElement } from "react";

import { choicesOf, useProperty, useWords } from "@stealthscale/provider-form";

import { useBoundField } from "#form/bound.ts";
import { type FieldProps } from "#form/frame.tsx";
import { GroupFrame } from "#form/group-frame.tsx";
import { isLeaving } from "#form/leaving.ts";
import * as SegmentGroup from "#segment-group/index.ts";

/**
 * Describes what a segment field is given.
 */
export interface SegmentFieldProps extends FieldProps {
  /**
   * The choices. The schema's `enum` where the caller states none.
   */
  readonly options?: readonly string[] | undefined;
}

/**
 * Renders a segment group bound to the string field in scope.
 *
 * @param props - The words of the label, whether a value is required, and the choices.
 * @returns The field, with the group and its texts inside it.
 */
export function SegmentField({ label, options, required }: SegmentFieldProps): ReactElement {
  const field = useBoundField<string | undefined>();
  const { schema } = useProperty();
  const words = useWords();
  const values = options ?? (schema === undefined ? [] : choicesOf(schema));
  const value = field.state.value;

  return (
    <GroupFrame label={label} required={required}>
      {({ name }) => (
        <SegmentGroup.Root
          name={name}
          onBlur={(event) => {
            if (isLeaving(event)) field.handleBlur();
          }}
          onValueChange={({ value: chosen }) => {
            field.handleChange(chosen ?? "");
          }}
          value={value === undefined || value === "" ? null : value}
        >
          {values.map((choice) => (
            <SegmentGroup.Item key={choice} value={choice}>
              <SegmentGroup.ItemText>{words.option(field.name, choice)}</SegmentGroup.ItemText>
            </SegmentGroup.Item>
          ))}
        </SegmentGroup.Root>
      )}
    </GroupFrame>
  );
}
