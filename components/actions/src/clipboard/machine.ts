/**
 * Connects the clipboard machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so the input, the
 *   trigger and the indicator report the same state. The machine derives the label and input ids
 *   from `id`, so an id the caller passes appears in the `for` reference between them.
 */

import { useId } from "react";

import * as clipboard from "@zag-js/clipboard";
import { normalizeProps, useMachine } from "@zag-js/react";
import { createSplitProps } from "@zag-js/utils";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `clipboard.connect` returns: a prop getter per part plus the machine's state
 * and methods.
 *
 * @remarks
 *   The type is inferred from `connect`, so it follows the installed machine version. The inferred
 *   type references `@zag-js/types`, so the package declares that package as a dependency. A
 *   declaration file that references an undeclared package does not resolve for a consumer.
 */
export type ClipboardApi = ReturnType<typeof clipboard.connect>;

/**
 * Describes the machine settings a caller can pass to the root, `id` included, all optional.
 */
export type ClipboardOptions = Partial<clipboard.Props>;

/**
 * Creates the context through which the root provides the connected api to its parts.
 *
 * @remarks
 *   `useClipboard` throws when no `Clipboard.Root` is mounted above the calling part.
 */
export const [ApiProvider, useClipboard] = createRequiredContext<ClipboardApi>("Clipboard");

/**
 * Starts the clipboard machine and returns its connected api.
 *
 * @param options - Machine settings split from the root's props. A generated id is used when `id`
 *   is absent.
 */
export function useClipboardMachine(options: ClipboardOptions): ClipboardApi {
  const generated = useId();

  return clipboard.connect(
    useMachine(clipboard.machine, { ...omitUndefined(options), id: options.id ?? generated }),
    normalizeProps,
  );
}

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list is `clipboard.props`, so it follows the installed machine version. The machine's
 *   own splitter types `id` as required, and the root generates the id after splitting, so the
 *   splitter is rebuilt over `ClipboardOptions` with `createSplitProps`.
 */
export const splitClipboardProps = splitEnumerable(
  createSplitProps<ClipboardOptions>(clipboard.props),
);
