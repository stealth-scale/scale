/**
 * Connects the tabs machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so the list, the
 *   triggers and the panels report the same selection. The machine derives the id of every tab and
 *   panel, and the ARIA references between them, from `id`.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as tabs from "@zag-js/tabs";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `tabs.connect` returns: a prop getter per part plus the machine's state and
 * methods.
 *
 * @remarks
 *   The type is inferred from `connect`, so it follows the installed machine version. The inferred
 *   type references `@zag-js/types`, so the package declares that package as a dependency.
 */
export type TabsApi = ReturnType<typeof tabs.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 */
export type TabsOptions = Partial<tabs.Props>;

/**
 * Creates the context through which the root provides the connected api to its parts.
 *
 * @remarks
 *   `useTabs` throws when no `Tabs.Root` is mounted above the calling part.
 */
export const [ApiProvider, useTabs] = createRequiredContext<TabsApi>("Tabs");

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 */
export const splitTabsProps = splitEnumerable(tabs.splitProps);

/**
 * Starts the tabs machine and returns its connected api.
 *
 * @param options - Machine settings split from the root's props. A generated id is used when `id`
 *   is absent.
 */
export function useTabsMachine(options: TabsOptions): TabsApi {
  const generated = useId();

  return tabs.connect(
    useMachine(tabs.machine, { ...omitUndefined(options), id: options.id ?? generated }),
    normalizeProps,
  );
}
