/**
 * Renders a file upload's group and runs the machine its parts share.
 *
 * @remarks
 *   The element is a `fieldset` with no edge of its own, which stacks the label, the dropzone, the
 *   buttons and the lists of files. `useGrouping` resolves the group's name, its description and
 *   the state it takes from a field or a fieldset. A disabled upload disables the `fieldset`, and
 *   with it every button inside. The root renders the hidden file `input` a form submits after its
 *   children, so a caller cannot leave it out, and gives its size to `FileUpload.Trigger` and
 *   `FileUpload.ClearTrigger` through the button's props provider. A size the caller states on a
 *   button overrides it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { ButtonPropsProvider } from "@stealthscale/component-actions";

import { type Announcements } from "#file-upload/announced.ts";
import { withProvider } from "#file-upload/context.ts";
import { useGrouping } from "#file-upload/grouping.ts";
import { ApiProvider, type FileUploadOptions, splitFileUploadProps } from "#file-upload/machine.ts";
import { LabellingProvider, SharedProvider } from "#file-upload/state.ts";

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
    FileUploadOptions,
    Omit<ComponentProps<typeof Grouped>, keyof FileUploadOptions> {}

/**
 * Renders the group and provides the machine's api, the size and the states to the parts.
 *
 * @param props - The machine's options, the announcements, the recipe's variants and the props of
 *   a `fieldset`.
 * @returns The `fieldset` element, which contains the parts and the `input` a form reads.
 */
export function Root({
  addedMessage,
  rejectedMessage,
  removedMessage,
  ...props
}: RootProps): ReactElement {
  const [options, rest] = splitFileUploadProps(props);
  const { children, size, ...attributes } = rest;
  const { api, naming, setLabelled, shared } = useGrouping(
    options,
    { addedMessage, rejectedMessage, removedMessage },
    size,
  );

  return (
    <ApiProvider value={api}>
      <LabellingProvider value={setLabelled}>
        <SharedProvider value={shared}>
          <ButtonPropsProvider value={{ size: shared.size }}>
            <Grouped
              {...mergeProps(api.getRootProps(), naming, attributes)}
              disabled={shared.disabled}
              size={shared.size}
            >
              {children}
              <input {...api.getHiddenInputProps()} />
            </Grouped>
          </ButtonPropsProvider>
        </SharedProvider>
      </LabellingProvider>
    </ApiProvider>
  );
}
