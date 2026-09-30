/**
 * Connects the pagination machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so the pages, the
 *   triggers and the page text report the same page. The machine counts pages from one.
 */

import { useId } from "react";

import * as pagination from "@zag-js/pagination";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `pagination.connect` returns: a prop getter per part plus the machine's state
 * and methods.
 *
 * @remarks
 *   The type comes from `connect`, so it follows the installed machine version. It references
 *   `@zag-js/types`, so the package declares that package as a dependency.
 */
export type PaginationApi = ReturnType<typeof pagination.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 *
 * @remarks
 *   `translations` is left out, because a component's words are props: the root takes its name as
 *   `aria-label`, and each trigger and page takes its own `label`.
 */
export type PaginationOptions = Omit<Partial<pagination.Props>, "translations">;

/**
 * Describes what the root provides to its parts: the connected api and whether the pages are
 * links.
 */
export interface PaginationMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: PaginationApi;

  /**
   * Whether the pages and triggers render links to `getPageUrl` or buttons.
   */
  readonly type: "button" | "link";
}

/**
 * Creates the context through which the root provides the running machine to its parts.
 *
 * @remarks
 *   `usePagination` throws when no `Pagination.Root` is mounted above the calling part.
 */
export const [MachineProvider, usePagination] =
  createRequiredContext<PaginationMachine>("Pagination");

/**
 * Starts the pagination machine and returns its connected api and the kind of its pages.
 *
 * @param options - Machine settings split from the root's props. React generates `id` when the
 *   caller states none.
 */
export function usePaginationMachine(options: PaginationOptions): PaginationMachine {
  const generated = useId();
  const service = useMachine(pagination.machine, {
    ...omitUndefined(options),
    id: options.id ?? generated,
  });

  return { api: pagination.connect(service, normalizeProps), type: options.type ?? "button" };
}

/**
 * Splits the root's props into machine settings and element props, without `translations`.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine settings and the element props.
 */
export function splitPaginationProps<Props extends PaginationOptions>(
  props: Props,
): [PaginationOptions, Omit<Props, keyof pagination.Props>] {
  const [options, rest] = splitEnumerable(pagination.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}
