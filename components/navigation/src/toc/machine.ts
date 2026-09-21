/**
 * Runs the table of contents' machine and carries what it answers down to the parts.
 *
 * @remarks
 *   The machine watches the headings the items name with an intersection observer, keeps the ids
 *   of the ones on screen, and measures the rows that name them so the indicator can be placed
 *   over them. It is connected once, at the root, so every part reads one api from one running
 *   machine. A part drawn outside the root throws where it was written rather than drawing wrongly
 *   and saying nothing.
 *   The id is the machine's and never an element's. It builds the reference between the landmark
 *   and its title from it, so a caller naming their own passes it here and the reference follows.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as toc from "@zag-js/toc";

import { createRequiredContext, splitEnumerable } from "@stealthscale/hooks";

import { stated } from "#stated.ts";

/**
 * Describes what the machine answers: a prop getter per part, beside its state and its methods.
 *
 * @remarks
 *   Inferred off `connect` rather than named, so the parts take exactly what the machine hands
 *   them. The inferred type reaches `@zag-js/types`, which this package declares for that reason.
 */
export type TocApi = ReturnType<typeof toc.connect>;

/**
 * Describes what a caller sets on the machine, every setting of it optional.
 */
export type TocOptions = Partial<toc.Props>;

/**
 * Describes one heading the table of contents lists: the id of the heading in the document, and
 * how deep it sits.
 */
export type TocItem = toc.TocItem;

/**
 * Hands the running machine to every part, and reads it back.
 */
export const [ApiProvider, useToc] = createRequiredContext<TocApi>("Toc");

/**
 * Splits what the machine reads from what the element does.
 *
 * @remarks
 *   The machine states which props are its own, so the root never lists them and never drifts from
 *   the version it is built against.
 */
export const splitTocProps = splitEnumerable(toc.splitProps);

/**
 * Starts the machine and connects it.
 *
 * @param options - The settings the caller handed the root, less the id where it named none.
 * @returns The api every part reads.
 */
export function useTocMachine(options: TocOptions): TocApi {
  const generated = useId();

  return toc.connect(
    useMachine(toc.machine, { ...stated(options), id: options.id ?? generated }),
    normalizeProps,
  );
}
