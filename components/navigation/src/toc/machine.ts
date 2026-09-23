/**
 * Connects the table of contents machine and provides its api to the parts.
 *
 * @remarks
 *   The machine observes the listed headings with an `IntersectionObserver`, tracks the ids of the
 *   visible ones, and measures their items to position the indicator. The root starts one machine
 *   and every part reads its api from context. The machine derives the title's id from `id`, and
 *   the landmark references that id.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as toc from "@zag-js/toc";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `toc.connect` returns: a prop getter per part plus the machine's state and
 * methods.
 *
 * @remarks
 *   The type is derived from the return type of `connect`, so it follows the installed machine
 *   version. The derived type references `@zag-js/types`, so the package declares that package as
 *   a dependency.
 */
export type TocApi = ReturnType<typeof toc.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 */
export type TocOptions = Partial<toc.Props>;

/**
 * Describes one listed heading: its element id and its depth.
 */
export type TocItem = toc.TocItem;

/**
 * Creates the context through which the root provides the connected api to its parts.
 *
 * @remarks
 *   `useToc` throws when no `Toc.Root` is mounted above the calling part.
 */
export const [ApiProvider, useToc] = createRequiredContext<TocApi>("Toc");

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 */
export const splitTocProps = splitEnumerable(toc.splitProps);

/**
 * Starts the table of contents machine and returns its connected api.
 *
 * @param options - Machine settings split from the root's props. A generated id is used when `id`
 *   is absent.
 */
export function useTocMachine(options: TocOptions): TocApi {
  const generated = useId();

  return toc.connect(
    useMachine(toc.machine, { ...omitUndefined(options), id: options.id ?? generated }),
    normalizeProps,
  );
}
