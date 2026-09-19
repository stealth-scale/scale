/**
 * Runs a branch's machine and carries what it answers down to the three parts that draw it.
 *
 * @remarks
 *   A branch runs the collapsible machine rather than a flag of its own, because the machine
 *   measures the list beneath the row and writes its height as a custom property, which is what
 *   the list's motion runs to, and keeps the list in the document until that motion has ended. It
 *   borrows the machine alone and none of the collapsible's recipe: a collapsible's trigger reads
 *   the control scale, which would put a second height on a row that already states one, and the
 *   height a reader saw would come down to the order the stylesheet was written in.
 *   The machine is connected once, at the branch, so every part reads one api from one running
 *   machine. A part drawn outside a branch throws where it was written rather than drawing wrongly
 *   and saying nothing.
 */

import { useId } from "react";

import * as collapsible from "@zag-js/collapsible";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext } from "@stealthscale/hooks";

import { stated } from "#stated.ts";

/**
 * Describes what the machine answers: a prop getter per part, beside its state and its methods.
 *
 * @remarks
 *   Inferred off `connect` rather than named, so the parts take exactly what the machine hands
 *   them. The inferred type reaches `@zag-js/types`, which this package declares for that reason
 *   alone: a declaration file naming a type from a package nobody declared is not portable.
 */
export type BranchApi = ReturnType<typeof collapsible.connect>;

/**
 * Describes what a caller sets on the machine, less the id it is given.
 */
export type BranchOptions = Partial<collapsible.Props>;

/**
 * Hands the running machine to every part, and reads it back.
 */
export const [BranchProvider, useBranch] = createRequiredContext<BranchApi>("NavList.Branch");

/**
 * Starts the machine and connects it.
 *
 * @param options - The settings the caller handed the branch, less the id where it named none.
 * @returns The api every part reads.
 */
export function useBranchMachine(options: BranchOptions): BranchApi {
  const generated = useId();

  return collapsible.connect(
    useMachine(collapsible.machine, { ...stated(options), id: options.id ?? generated }),
    normalizeProps,
  );
}

/**
 * Splits what the machine reads from what the element does.
 *
 * @remarks
 *   The machine states which props are its own, so the branch never lists them and never drifts
 *   from the version it is built against.
 */
export const splitBranchProps = collapsible.splitProps;
