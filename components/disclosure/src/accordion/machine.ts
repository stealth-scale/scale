/**
 * Connects the accordion machine and provides its api to the items.
 *
 * @remarks
 *   The root starts one machine and every item reads its api from context, so the triggers report
 *   one set of open items and the arrow keys move focus between them. The machine derives the ID of
 *   every item, trigger and content from `id` and the item's value.
 */

import { useId } from "react";

import * as accordion from "@zag-js/accordion";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `accordion.connect` returns: a prop getter per part plus the machine's state
 * and methods.
 *
 * @remarks
 *   The type comes from `connect`, so it follows the installed machine version. It references
 *   `@zag-js/types`, so the package declares that package as a dependency.
 */
export type AccordionApi = ReturnType<typeof accordion.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 */
export type AccordionOptions = Partial<accordion.Props>;

/**
 * Describes what an item passes the machine: its value and whether it is disabled.
 */
export type ItemOptions = accordion.ItemProps;

/**
 * Describes what the root provides to its items: the connected api and the IDs of the contents.
 */
export interface AccordionMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: AccordionApi;

  /**
   * Returns the ID the machine gives the content of the item whose value is passed.
   */
  readonly contentId: (value: string) => string;
}

/**
 * Creates the context through which the root provides the running machine to its items.
 *
 * @remarks
 *   `useAccordion` throws when no `Accordion.Root` is mounted above the calling part.
 */
export const [MachineProvider, useAccordion] = createRequiredContext<AccordionMachine>("Accordion");

/**
 * Returns the function that builds the ID of one part of an item from the item's value.
 *
 * @remarks
 *   The value is percent-encoded, so an ID never contains a space. `aria-controls` and
 *   `aria-labelledby` read a list of IDs separated by spaces, and the machine's own IDs keep the
 *   value as written, so a value such as "Returns policy" would point at two IDs that do not exist.
 * @param accordionId - The machine's `id`, which starts every ID the function returns.
 * @param part - Name of the part, such as `content`.
 * @returns The function from a value to the part's ID.
 */
export function itemIds(accordionId: string, part: string): (value: string) => string {
  return (value) => `accordion-${accordionId}-${part}-${encodeURIComponent(value)}`;
}

/**
 * Starts the accordion machine and returns its connected api and the IDs of the contents.
 *
 * @remarks
 *   The IDs of an item's parts come from {@link itemIds}. A function the caller passes in `ids`
 *   replaces each.
 * @param options - Machine settings split from the root's props. React generates `id` when the
 *   caller states none.
 */
export function useAccordionMachine(options: AccordionOptions): AccordionMachine {
  const generated = useId();
  const id = options.id ?? generated;
  const ids = {
    ...options.ids,
    item: options.ids?.item ?? itemIds(id, "item"),
    itemContent: options.ids?.itemContent ?? itemIds(id, "content"),
    itemTrigger: options.ids?.itemTrigger ?? itemIds(id, "trigger"),
  };
  const service = useMachine(accordion.machine, { ...omitUndefined(options), id, ids });

  return { api: accordion.connect(service, normalizeProps), contentId: ids.itemContent };
}

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 */
export const splitAccordionProps = splitEnumerable(accordion.splitProps);

/**
 * Splits an item's props into its value and disabled flag and the element's props.
 */
export const splitItemProps = splitEnumerable(accordion.splitItemProps);
