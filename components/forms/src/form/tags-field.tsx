/**
 * Renders a tags input bound to a field whose value is the strings a person typed.
 *
 * @remarks
 *   The input is the library's `TagsInput`: Enter or a comma turns the typed text into a tag, and
 *   Backspace in an empty box removes the last one. A schema picks it for an array of strings
 *   without an `enum`, where the presentation names the array. Each tag has a button that removes
 *   it where the field or the form gives the remove glyph. The button is named by
 *   `<id>.actions.removeTag` with the tag's words as `value`, else in English. The schema's
 *   `minItems` and `maxItems` bound the count. The field counts as left once focus leaves the box,
 *   and its blur validators run then.
 */

import { type ReactElement, type ReactNode } from "react";

import { useWords } from "@stealthscale/provider-form";

import { useBoundField } from "#form/bound.ts";
import { Frame, type FramedFieldProps } from "#form/frame.tsx";
import { isLeaving } from "#form/leaving.ts";
import { useFormScope } from "#form/scope.ts";
import * as TagsInput from "#tags-input/index.ts";

/**
 * Describes what a tags field is given.
 */
export interface TagsFieldProps extends FramedFieldProps {
  /**
   * Glyph of the button that removes a tag, in place of the form's.
   */
  readonly remove?: ReactNode;
}

/**
 * Renders a tags input in a frame, bound to the list of strings in scope.
 *
 * @param props - The words of the label, whether a value is required, the remove glyph, the
 *   presentation and the width.
 * @returns The field, with the tags input inside it.
 */
export function TagsField({
  label,
  presentation,
  remove,
  required,
  width,
}: TagsFieldProps): ReactElement {
  const field = useBoundField<readonly string[] | undefined>();
  const words = useWords();
  const scope = useFormScope();
  const mark = remove ?? scope.glyphs.remove;

  return (
    <Frame label={label} required={required} width={width ?? presentation?.width}>
      {({ name, placeholder }) => (
        <TagsInput.Root
          name={name}
          onBlur={(event) => {
            if (isLeaving(event)) field.handleBlur();
          }}
          onValueChange={({ value }) => {
            field.handleChange(value);
          }}
          placeholder={placeholder}
          value={[...(field.state.value ?? [])]}
        >
          <TagsInput.Control>
            <TagsInput.Items>
              {(value, index) => (
                <TagsInput.Item index={index} value={value}>
                  <TagsInput.ItemPreview>
                    <TagsInput.ItemText />
                    {mark === undefined ? null : (
                      <TagsInput.ItemDeleteTrigger
                        label={words.action("removeTag", "Remove {{value}}", { value })}
                      >
                        {mark}
                      </TagsInput.ItemDeleteTrigger>
                    )}
                  </TagsInput.ItemPreview>
                </TagsInput.Item>
              )}
            </TagsInput.Items>
            <TagsInput.Input />
          </TagsInput.Control>
        </TagsInput.Root>
      )}
    </Frame>
  );
}
