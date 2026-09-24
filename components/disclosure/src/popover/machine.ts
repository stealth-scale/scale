/**
 * Connects the popover machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so the trigger, the
 *   positioner and the content report the same state. The machine derives the ids of the content,
 *   the title and the description from `id`, and points the content's `aria-labelledby` and
 *   `aria-describedby` at the last two.
 */

import { useId } from "react";

import * as popover from "@zag-js/popover";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `popover.connect` returns: a prop getter per part plus the machine's state and
 * methods.
 *
 * @remarks
 *   The type comes from `connect`, so it follows the installed machine version. It references
 *   `@zag-js/types`, so the package declares that package as a dependency.
 */
export type PopoverApi = ReturnType<typeof popover.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 *
 * @remarks
 *   `translations` is omitted, because a component's words are props. The close trigger takes its
 *   accessible name as `aria-label` on `Popover.CloseTrigger`.
 */
export type PopoverOptions = Omit<Partial<popover.Props>, "translations">;

/**
 * Creates the context through which the root provides the connected api to its parts.
 *
 * @remarks
 *   `usePopover` throws when no `Popover.Root` is mounted above the calling part.
 */
export const [ApiProvider, usePopover] = createRequiredContext<PopoverApi>("Popover");

/**
 * Splits the root's props into machine settings and element props, without `translations`.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 *   `splitEnumerable` hands it a copy of the props, so React's `key` getter is never read.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine settings and the element props.
 */
export function splitPopoverProps<Props extends PopoverOptions>(
  props: Props,
): [PopoverOptions, Omit<Props, keyof popover.Props>] {
  const [options, rest] = splitEnumerable(popover.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}

/**
 * Starts the popover machine and returns its connected api.
 *
 * @param options - Machine settings split from the root's props. A generated id is used when `id`
 *   is absent.
 */
export function usePopoverMachine(options: PopoverOptions): PopoverApi {
  const generated = useId();

  return popover.connect(
    useMachine(popover.machine, { ...omitUndefined(options), id: options.id ?? generated }),
    normalizeProps,
  );
}
