/**
 * Renders a tags input's group and runs the machine its parts share.
 *
 * @remarks
 *   The element is a `fieldset` with no edge of its own, which stacks the label above the control
 *   and groups the tags, their delete triggers and the input. The group is named by
 *   `TagsInput.Label` while one is rendered, and otherwise by the label of a field or the legend of
 *   a fieldset around it. A disabled tags input disables the `fieldset`, and with it every control
 *   inside. The root renders the hidden `input` a form submits after its children, so a caller
 *   cannot leave it out. The hidden input holds the tags joined by a comma and a space. Inside a
 *   field the input takes the field's control ID and the tags input takes the field's disabled,
 *   invalid, read-only and required states and size. Inside a fieldset without a field it takes the
 *   group's disabled state and size. A prop the caller states overrides each. Every tag takes the
 *   tags input's size.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { inherited, sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset, useOptionalFieldset } from "#fieldset/state.ts";
import { type Announcements, messagesOf } from "#tags-input/announced.ts";
import { withProvider } from "#tags-input/context.ts";
import {
  ApiProvider,
  splitTagsInputProps,
  type TagsInputOptions,
  useTagsInputMachine,
} from "#tags-input/machine.ts";
import { LabellingProvider, SharedProvider } from "#tags-input/state.ts";

/**
 * Renders the root `fieldset` with the recipe's variants.
 */
const Grouped = withProvider("fieldset", "root");

/**
 * Describes the props of the root: the machine's options, the announcements, the recipe's
 * variants and the props of a `fieldset`.
 *
 * @remarks
 *   The element's own props of the same names as the machine's options are left out, so no prop
 *   has two types.
 */
export interface RootProps
  extends
    Announcements,
    Omit<ComponentProps<typeof Grouped>, keyof TagsInputOptions>,
    TagsInputOptions {}

/**
 * Renders the group and provides the machine's api, the size and the states to the parts.
 *
 * @param props - The machine's options, the announcements, the recipe's variants and the props of
 *   a `fieldset`.
 * @returns The `fieldset` element, which contains the parts and the `input` a form reads.
 */
export function Root({
  addedMessage,
  changedMessage,
  highlightedMessage,
  removedMessage,
  ...props
}: RootProps): ReactElement {
  const field = useOptionalField();
  const group = useFieldset();
  const legend = useOptionalFieldset()?.ids.label;
  const [labelled, setLabelled] = useState(false);
  const [options, rest] = splitTagsInputProps(props);
  const { children, size, ...attributes } = rest;
  const stated = { ...inherited(field, group), ...options };
  const messages = messagesOf(
    { addedMessage, changedMessage, highlightedMessage, removedMessage },
    stated.editable === true,
  );
  const { api, labelId } = useTagsInputMachine(stated, messages, field?.ids.control);
  const shared = {
    disabled: stated.disabled === true,
    readOnly: stated.readOnly === true,
    size: sized(size, field, group) ?? "md",
  };
  const naming = { "aria-labelledby": labelled ? labelId : (field?.ids.label ?? legend) };

  return (
    <ApiProvider value={api}>
      <LabellingProvider value={setLabelled}>
        <SharedProvider value={shared}>
          <Grouped
            {...mergeProps(api.getRootProps(), omitUndefined(naming), attributes)}
            disabled={shared.disabled}
            size={shared.size}
          >
            {children}
            <input {...api.getHiddenInputProps()} />
          </Grouped>
        </SharedProvider>
      </LabellingProvider>
    </ApiProvider>
  );
}
