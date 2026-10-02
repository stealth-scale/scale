/**
 * Renders a combobox bound to a string field of a form whose schema lists many choices.
 *
 * @remarks
 *   The combobox is the library's `Combobox`: a text box that narrows the list to the choices whose
 *   words contain the typed text. A schema picks it for a string `enum` of more than ten choices,
 *   and a presentation for any `enum` with `control: "combobox"`. Each choice reads its words from
 *   the catalogue under `<id>.fields.<path>.options.<value>`, and its value where the catalogue has
 *   none. The list shows `<id>.actions.noMatch`, else "No match", when no choice contains the text.
 *   The trigger and the chosen row show the field's glyphs, else the form's select glyphs, else no
 *   mark. Closing the list counts as leaving the field, and its blur validators run then. In a form
 *   whose labels float, the label rests inside the empty box.
 */

import { type ReactElement, useState } from "react";

import { Portal } from "@stealthscale/component-primitives";
import { choicesOf, useProperty, useWords } from "@stealthscale/provider-form";

import * as Combobox from "#combobox/index.ts";
import { useBoundField } from "#form/bound.ts";
import { type Choice, collectionOf } from "#form/choices.ts";
import { Frame, type FramedFieldProps } from "#form/frame.tsx";
import { type SelectGlyphs, useFormScope } from "#form/scope.ts";

/**
 * Describes what a combobox field is given.
 */
export interface ComboboxFieldProps extends FramedFieldProps {
  /**
   * Glyphs of the trigger and the chosen row, in place of the form's.
   */
  readonly glyphs?: SelectGlyphs | undefined;

  /**
   * The choices. The schema's `enum` where the caller states none.
   */
  readonly options?: readonly string[] | undefined;
}

/**
 * Keeps the choices whose words contain the typed text, ignoring case.
 */
function narrowed(choices: readonly Choice[], query: string): readonly Choice[] {
  const typed = query.toLocaleLowerCase();

  return choices.filter((choice) => choice.label.toLocaleLowerCase().includes(typed));
}

/**
 * Renders the list the combobox opens: a row per choice shown, each with the chosen row's glyph,
 * and the words for no match.
 */
function listOf(
  shown: readonly Choice[],
  marks: SelectGlyphs | undefined,
  empty: string,
): ReactElement {
  return (
    <Portal>
      <Combobox.Positioner>
        <Combobox.Content>
          <Combobox.Empty>{empty}</Combobox.Empty>
          {shown.map((choice) => (
            <Combobox.Item item={choice} key={choice.value}>
              <Combobox.ItemText item={choice}>{choice.label}</Combobox.ItemText>
              {marks === undefined ? null : (
                <Combobox.ItemIndicator item={choice}>{marks.selected}</Combobox.ItemIndicator>
              )}
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox.Positioner>
    </Portal>
  );
}

/**
 * Renders a combobox in a frame, bound to the string field in scope.
 *
 * @param props - The words of the label, whether a value is required, the glyphs, the choices, the
 *   presentation and the width.
 * @returns The field, with the combobox inside it.
 */
export function ComboboxField({
  glyphs,
  label,
  options,
  presentation,
  required,
  width,
}: ComboboxFieldProps): ReactElement {
  const field = useBoundField<string | undefined>();
  const { schema } = useProperty();
  const words = useWords();
  const scope = useFormScope();
  const [query, setQuery] = useState("");
  const marks = glyphs ?? scope.glyphs.select;
  const values = options ?? (schema === undefined ? [] : choicesOf(schema));
  const shown = narrowed(
    values.map((value) => ({ label: words.option(field.name, value), value })),
    query,
  );
  const value = field.state.value;

  return (
    <Frame floats label={label} required={required} width={width ?? presentation?.width}>
      {({ name, placeholder }) => (
        <Combobox.Root
          collection={collectionOf(shown)}
          inputBehavior="autohighlight"
          name={name}
          onInputValueChange={({ inputValue, reason }) => {
            setQuery(reason === "input-change" ? inputValue : "");
          }}
          onOpenChange={({ open }) => {
            if (!open) field.handleBlur();
          }}
          onValueChange={({ value: [chosen] }) => {
            field.handleChange(chosen ?? "");
          }}
          openOnClick
          value={value === undefined || value === "" ? [] : [value]}
        >
          <Combobox.Control>
            <Combobox.Input placeholder={placeholder} />
            {marks === undefined ? null : (
              <Combobox.Trigger label={words.action("showChoices", "Show the choices")}>
                {marks.indicator}
              </Combobox.Trigger>
            )}
          </Combobox.Control>
          {listOf(shown, marks, words.action("noMatch", "No match"))}
        </Combobox.Root>
      )}
    </Frame>
  );
}
