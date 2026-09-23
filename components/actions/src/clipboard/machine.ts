/**
 * Connects the Zag clipboard machine and provides its API to the parts.
 *
 * @remarks
 *   The root starts one machine, and every part reads the API from context, so the input, the
 *   trigger and the indicator report the same state. The machine derives the label and input IDs
 *   from `id`, so a caller's ID appears in the label's `for` attribute.
 */

import { useId } from "react";

import * as clipboard from "@zag-js/clipboard";
import { normalizeProps, useMachine } from "@zag-js/react";
import { createSplitProps } from "@zag-js/utils";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * API returned by `clipboard.connect`: a prop getter per part, the machine state and its methods.
 *
 * @remarks
 *   The type derives from `connect`, so it follows the installed machine version. The derived type
 *   references `@zag-js/types`, so the package declares that package as a dependency. A
 *   declaration file that references an undeclared package does not resolve for a consumer.
 */
export type ClipboardApi = ReturnType<typeof clipboard.connect>;

/**
 * Machine settings a caller passes to the root, `id` included, all optional.
 *
 * @remarks
 *   `translations` is omitted. The trigger takes its accessible names as the props `label` and
 *   `copiedLabel`, because a component's words are props with English defaults.
 */
export type ClipboardOptions = Omit<Partial<clipboard.Props>, "translations">;

/**
 * Context through which the root provides the connected API to its parts.
 *
 * @remarks
 *   `useClipboard` throws when no `Clipboard.Root` is mounted above the calling part.
 */
export const [ApiProvider, useClipboard] = createRequiredContext<ClipboardApi>("Clipboard");

/**
 * Starts the clipboard machine and returns its connected API.
 *
 * @param options - Machine settings split from the root's props. A generated ID is used when `id`
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
 *   The key list is `clipboard.props` without `translations`, so it follows the installed machine
 *   version. The machine's own splitter types `id` as required, and the root generates the ID after
 *   splitting, so the splitter is rebuilt over `ClipboardOptions` with `createSplitProps`.
 */
export const splitClipboardProps = splitEnumerable(
  createSplitProps<ClipboardOptions>(
    clipboard.props.filter((key): key is keyof ClipboardOptions => key !== "translations"),
  ),
);
