/**
 * Connects the collapsible machine for a branch and provides its api to the branch's parts.
 *
 * @remarks
 *   A branch uses the collapsible machine because the machine measures the nested list, writes its
 *   height to a custom property that the collapse animation reads, and keeps the list mounted
 *   until that animation ends. The branch takes the machine and not the collapsible recipe. The
 *   collapsible trigger's control sizing would conflict with the row height the nav-list recipe
 *   sets. The branch starts one machine, and its trigger, indicator and content read the api from
 *   context.
 */

import { useId } from "react";

import * as collapsible from "@zag-js/collapsible";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `collapsible.connect` returns: a prop getter per part plus the machine's state
 * and methods.
 *
 * @remarks
 *   The type is inferred from `connect`, so it follows the installed machine version. The inferred
 *   type references `@zag-js/types`, so the package declares that package as a dependency. A
 *   declaration file that references an undeclared package does not resolve for a consumer.
 */
export type BranchApi = ReturnType<typeof collapsible.connect>;

/**
 * Describes the machine settings a caller can pass to a branch, all optional.
 */
export type BranchOptions = Partial<collapsible.Props>;

/**
 * Creates the context through which a branch provides the connected api to its parts.
 *
 * @remarks
 *   `useBranch` throws when no `NavList.Branch` is mounted above the calling part.
 */
export const [BranchProvider, useBranch] = createRequiredContext<BranchApi>("NavList.Branch");

/**
 * Starts the collapsible machine for a branch and returns its connected api.
 *
 * @param options - Machine settings split from the branch's props. A generated id is used when
 *   `id` is absent.
 */
export function useBranchMachine(options: BranchOptions): BranchApi {
  const generated = useId();

  return collapsible.connect(
    useMachine(collapsible.machine, { ...omitUndefined(options), id: options.id ?? generated }),
    normalizeProps,
  );
}

/**
 * Splits a branch's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 */
export const splitBranchProps = splitEnumerable(collapsible.splitProps);
