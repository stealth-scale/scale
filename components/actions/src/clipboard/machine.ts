/**
 * Runs the clipboard state machine at the root and distributes its api to the parts.
 *
 * @remarks
 *   One machine is connected per root, so every part below it reads the same api. A part rendered
 *   with no root above it throws at its own call site rather than rendering something inert and
 *   silent. The `id` belongs to the machine and not to any element: the machine derives the
 *   association between the label and the input from it, so an id a caller supplies carries into
 *   that association.
 */

import { useId } from "react";

import * as clipboard from "@zag-js/clipboard";
import { normalizeProps, useMachine } from "@zag-js/react";
import { createSplitProps } from "@zag-js/utils";

import { createRequiredContext, splitEnumerable } from "@stealthscale/hooks";

import { stated } from "#stated.ts";

/**
 * Mirrors the return type of `clipboard.connect`: one prop getter per part, plus the machine's
 * state and methods.
 *
 * @remarks
 *   Inferring the type instead of writing one keeps the parts in step with the installed machine.
 *   The inference reaches into `@zag-js/types`, which is the only reason this package depends on it
 *   directly: a declaration file referring to a type from an undeclared package does not resolve
 *   for a consumer.
 */
export type ClipboardApi = ReturnType<typeof clipboard.connect>;

/**
 * Relaxes the machine's props so that every setting is optional, the id included.
 */
export type ClipboardOptions = Partial<clipboard.Props>;

/**
 * Publishes the connected api at the root and reads it back in a part, throwing where no root is
 * above.
 */
export const [ApiProvider, useClipboard] = createRequiredContext<ClipboardApi>("Clipboard");

/**
 * Starts the clipboard machine and connects it to React.
 *
 * @param options - The machine settings taken from the root's props. A generated id stands in
 *   where the caller supplies none.
 * @returns The api the parts below the root read.
 */
export function useClipboardMachine(options: ClipboardOptions): ClipboardApi {
  const generated = useId();

  return clipboard.connect(
    useMachine(clipboard.machine, { ...stated(options), id: options.id ?? generated }),
    normalizeProps,
  );
}

/**
 * Divides the root's props into the machine's settings and everything the element takes.
 *
 * @remarks
 *   The key list is `clipboard.props`, published by the machine itself, so nothing here restates it
 *   and it cannot drift from the installed version. The splitter shipped with the machine is typed
 *   over the full props with the id required, while the root supplies the id after splitting;
 *   rebuilding the splitter over `ClipboardOptions` makes every setting optional.
 */
export const splitClipboardProps = splitEnumerable(
  createSplitProps<ClipboardOptions>(clipboard.props),
);
