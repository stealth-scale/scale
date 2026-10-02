/**
 * Renders a set of radio cards bound to a string field of a form whose schema lists its choices.
 *
 * @remarks
 *   The set is the library's `RadioCard`, one card per choice, named by the field's label. A
 *   presentation picks it for a string `enum` with `control: "cards"`. Each card reads its words
 *   from the catalogue under `<id>.fields.<path>.options.<value>`, and the words under them from
 *   `<id>.fields.<path>.descriptions.<value>`, which a card leaves out where the catalogue has
 *   none. Nothing is chosen until a person chooses. The field counts as left once focus leaves the
 *   set, and its blur validators run then.
 */

import { type ReactElement } from "react";

import { choicesOf, useProperty, useWords } from "@stealthscale/provider-form";

import { useBoundField } from "#form/bound.ts";
import { type FieldProps } from "#form/frame.tsx";
import { GroupFrame } from "#form/group-frame.tsx";
import { isLeaving } from "#form/leaving.ts";
import * as RadioCard from "#radio-card/index.ts";

/**
 * Describes what a radio cards field is given.
 */
export interface RadioCardsFieldProps extends FieldProps {
  /**
   * The choices. The schema's `enum` where the caller states none.
   */
  readonly options?: readonly string[] | undefined;
}

/**
 * Renders a set of radio cards bound to the string field in scope.
 *
 * @param props - The words of the label, whether a value is required, and the choices.
 * @returns The field, with the cards and their texts inside it.
 */
export function RadioCardsField({ label, options, required }: RadioCardsFieldProps): ReactElement {
  const field = useBoundField<string | undefined>();
  const { schema } = useProperty();
  const words = useWords();
  const values = options ?? (schema === undefined ? [] : choicesOf(schema));
  const value = field.state.value;

  return (
    <GroupFrame label={label} required={required}>
      {({ name }) => (
        <RadioCard.Root
          name={name}
          onBlur={(event) => {
            if (isLeaving(event)) field.handleBlur();
          }}
          onValueChange={({ value: chosen }) => {
            field.handleChange(chosen ?? "");
          }}
          value={value === undefined || value === "" ? null : value}
        >
          {values.map((choice) => {
            const description = words.optionDescription(field.name, choice);

            return (
              <RadioCard.Item key={choice} value={choice}>
                <RadioCard.ItemContent>
                  <RadioCard.ItemText>{words.option(field.name, choice)}</RadioCard.ItemText>
                  {description === "" ? null : (
                    <RadioCard.ItemDescription>{description}</RadioCard.ItemDescription>
                  )}
                  <RadioCard.ItemIndicator />
                </RadioCard.ItemContent>
              </RadioCard.Item>
            );
          })}
        </RadioCard.Root>
      )}
    </GroupFrame>
  );
}
