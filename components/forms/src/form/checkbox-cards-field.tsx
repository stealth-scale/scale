/**
 * Renders a set of checkbox cards bound to a field whose value is the strings a person picked.
 *
 * @remarks
 *   Each card is the library's `CheckboxCard`, inside the library's `Fieldset` named by the
 *   field's label, which stretches every card to the column's width. A
 *   presentation picks the set for an array of `enum` strings with `control: "cards"`. Each card
 *   reads its words from the catalogue under `<id>.fields.<path>.options.<value>`, and the words
 *   under them from `<id>.fields.<path>.descriptions.<value>`, which a card leaves out where the
 *   catalogue has none. The field's value lists the picked values in the order a person picked
 *   them, and no card is required on its own, because the schema's `minItems` asks for a count. A
 *   checked card shows the form's checkbox glyph, else its fill alone. The field counts as left
 *   once focus leaves the set, and its blur validators run then.
 */

import { type ReactElement } from "react";

import { choicesOf, isSchema, useProperty, useWords } from "@stealthscale/provider-form";

import * as CheckboxCard from "#checkbox-card/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { useBoundField } from "#form/bound.ts";
import { type FieldProps } from "#form/frame.tsx";
import { GroupFrame } from "#form/group-frame.tsx";
import { isLeaving } from "#form/leaving.ts";
import { useFormScope } from "#form/scope.ts";

/**
 * Describes what a checkbox cards field is given.
 */
export interface CheckboxCardsFieldProps extends FieldProps {
  /**
   * The choices. The `enum` of the array's `items` where the caller states none.
   */
  readonly options?: readonly string[] | undefined;
}

/**
 * Renders a set of checkbox cards bound to the multi-choice field in scope.
 *
 * @param props - The words of the label, whether a value is required, and the choices.
 * @returns The field, with the cards and their texts inside it.
 */
export function CheckboxCardsField({
  label,
  options,
  required,
}: CheckboxCardsFieldProps): ReactElement {
  const field = useBoundField<readonly string[] | undefined>();
  const { schema } = useProperty();
  const words = useWords();
  const { glyphs } = useFormScope();
  const items = schema?.["items"];
  const values = options ?? (isSchema(items) ? choicesOf(items) : []);
  const picked = field.state.value ?? [];

  return (
    <GroupFrame label={label} required={required}>
      {({ "aria-labelledby": labelledBy, name }) => (
        <Fieldset.Root
          aria-labelledby={labelledBy}
          onBlur={(event) => {
            if (isLeaving(event)) field.handleBlur();
          }}
        >
          {values.map((choice) => {
            const description = words.optionDescription(field.name, choice);

            return (
              <CheckboxCard.Root
                checked={picked.includes(choice)}
                key={choice}
                name={name}
                onCheckedChange={({ checked }) => {
                  field.handleChange(
                    checked === true
                      ? [...picked, choice]
                      : picked.filter((value) => value !== choice),
                  );
                }}
                required={false}
                value={choice}
              >
                <CheckboxCard.Content>
                  <CheckboxCard.Label>{words.option(field.name, choice)}</CheckboxCard.Label>
                  {description === "" ? null : (
                    <CheckboxCard.Description>{description}</CheckboxCard.Description>
                  )}
                  <CheckboxCard.Control>
                    {glyphs.checkbox === undefined ? null : (
                      <CheckboxCard.Indicator>{glyphs.checkbox}</CheckboxCard.Indicator>
                    )}
                  </CheckboxCard.Control>
                </CheckboxCard.Content>
              </CheckboxCard.Root>
            );
          })}
        </Fieldset.Root>
      )}
    </GroupFrame>
  );
}
