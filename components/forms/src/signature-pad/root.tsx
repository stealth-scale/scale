/**
 * Renders a signature pad's group and runs the machine its parts share.
 *
 * @remarks
 *   The element is a `fieldset` with no edge of its own, which stacks the label and the control.
 *   `useGrouping` resolves the group's name and the state it takes from a field or a fieldset. A
 *   disabled pad disables the `fieldset`, and with it the clear trigger. The root renders the
 *   hidden input a form submits after its children, so a caller cannot leave it out. Its value is
 *   the strokes as an SVG image cropped to them, empty while nothing is drawn, and it is not
 *   read-only, so `required` blocks a form while the pad is blank. It submits only under a stated
 *   `name`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withProvider } from "#signature-pad/context.ts";
import { type Size, useGrouping } from "#signature-pad/grouping.ts";
import { imageOf } from "#signature-pad/image.ts";
import {
  ApiProvider,
  type SignaturePadOptions,
  splitSignaturePadProps,
} from "#signature-pad/machine.ts";
import { LabellingProvider, SharedProvider } from "#signature-pad/state.ts";

/**
 * Renders the root `fieldset` with the recipe's variants.
 */
const Grouped = withProvider("fieldset", "root");

/**
 * Keeps the hidden input's value where the root sets it, because the input takes no typing.
 */
function kept(): void {}

/**
 * Describes the props of the root: the machine's options, the invalid state, the recipe's variants
 * and the props of a `fieldset`.
 *
 * @remarks
 *   The element's own props of the same names as the machine's options are left out, so no prop
 *   has two types.
 */
export interface RootProps
  extends
    Omit<ComponentProps<typeof Grouped>, "size" | keyof SignaturePadOptions>,
    SignaturePadOptions {
  /**
   * Whether the signature is invalid, which renders the control's error edge and sets
   * `aria-invalid` on it.
   */
  readonly invalid?: boolean | undefined;

  /**
   * Size of the pad: the control's height, the text and the clear trigger's square.
   */
  readonly size?: Size | undefined;
}

/**
 * Renders the group, the hidden input, and provides the machine's api and the shared state to the
 * parts.
 *
 * @param props - The machine's options, the invalid state, the recipe's variants and the props of a
 *   `fieldset`.
 * @returns The `fieldset` element, which contains the parts and the `input` a form reads.
 */
export function Root({ invalid, size: stated, ...props }: RootProps): ReactElement {
  const [options, rest] = splitSignaturePadProps(props);
  const { children, ...attributes } = rest;
  const { api, disabled, named, setLabelled, shared, size } = useGrouping(options, invalid, stated);
  const { readOnly: _readOnly, ...input } = api.getHiddenInputProps({
    value: imageOf(api.paths, options.drawing?.fill),
  });

  return (
    <ApiProvider value={api}>
      <LabellingProvider value={setLabelled}>
        <SharedProvider value={shared}>
          <Grouped
            {...mergeProps(api.getRootProps(), named, attributes)}
            disabled={disabled}
            size={size}
          >
            {children}
            <input {...input} {...omitUndefined({ name: options.name })} onChange={kept} />
          </Grouped>
        </SharedProvider>
      </LabellingProvider>
    </ApiProvider>
  );
}
