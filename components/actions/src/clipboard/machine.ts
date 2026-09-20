/**
 * Runs the clipboard's machine and hands what it returns down to the parts.
 *
 * @remarks
 *   The machine is connected once, at the root, so every part reads one api from one running
 *   machine. A part drawn outside the root throws where it was written rather than drawing wrongly
 *   and saying nothing.
 *   The id is the machine's and never an element's. It builds the reference between the label and
 *   the input from it, so a caller naming their own passes it here and the reference follows.
 */

import { useId } from "react";

import * as clipboard from "@zag-js/clipboard";
import { normalizeProps, useMachine } from "@zag-js/react";
import { createSplitProps } from "@zag-js/utils";

import { createRequiredContext } from "@stealthscale/hooks";

import { stated } from "#stated.ts";

/**
 * Describes what the machine returns: a prop getter per part, beside its state and its methods.
 *
 * @remarks
 *   Inferred off `connect` rather than named, so the parts take exactly what the machine hands
 *   them. The inferred type reaches `@zag-js/types`, which this package declares for that reason
 *   alone: a declaration file naming a type from a package nobody declared is not portable.
 */
export type ClipboardApi = ReturnType<typeof clipboard.connect>;

/**
 * Describes what a caller sets on the machine, less the id it is given.
 */
export type ClipboardOptions = Partial<clipboard.Props>;

/**
 * Hands the running machine to every part, and reads it back.
 */
export const [ApiProvider, useClipboard] = createRequiredContext<ClipboardApi>("Clipboard");

/**
 * Starts the machine and connects it.
 *
 * @param options - The settings the caller handed the root, less the id where it named none.
 * @returns The api every part reads.
 */
export function useClipboardMachine(options: ClipboardOptions): ClipboardApi {
  const generated = useId();

  return clipboard.connect(
    useMachine(clipboard.machine, { ...stated(options), id: options.id ?? generated }),
    normalizeProps,
  );
}

/**
 * Splits what the machine reads from what the element does.
 *
 * @remarks
 *   The machine states which props are its own, so the root never lists them and never drifts from
 *   the version it is built against. The machine's own splitter is typed over its full props, id
 *   included, and the root names the id after the split, so the split is built here over the same
 *   key list with every setting optional.
 */
export const splitClipboardProps = createSplitProps<ClipboardOptions>(clipboard.props);
