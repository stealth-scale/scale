/**
 * Connects the popover machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so the trigger, the
 *   positioner and the content report the same state. The machine derives the ids of the content,
 *   the title and the description from `id`. It looks for the title and the description once, a
 *   frame after it starts, while a panel that mounts on opening has neither, so the title and the
 *   description report themselves to the root and the content names the panel from those reports.
 */

import { useId } from "react";

import * as popover from "@zag-js/popover";
import { normalizeProps, useMachine } from "@zag-js/react";

import {
  createLabelling,
  createRequiredContext,
  omitUndefined,
  type Presence,
  splitEnumerable,
} from "@stealthscale/hooks";

import { dismissNested } from "#nesting.ts";

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
 * Creates the context through which the root provides the panel's presence to the positioner and
 * the content.
 */
export const [PresenceProvider, usePanelPresence] = createRequiredContext<Presence>("Popover");

/**
 * Creates the context through which a mounted title reports itself to the root.
 */
export const [TitleLabelling, useTitled] = createLabelling("Popover");

/**
 * Creates the context through which a mounted description reports itself to the root.
 */
export const [DescriptionLabelling, useDescribed] = createLabelling("Popover");

/**
 * Describes which of the parts that name the panel are mounted.
 */
export interface Naming {
  /**
   * Whether a description is mounted.
   */
  readonly described: boolean;

  /**
   * Whether a title is mounted.
   */
  readonly titled: boolean;
}

/**
 * Creates the context through which the root tells the content which naming parts are mounted.
 */
export const [NamingProvider, useNaming] = createRequiredContext<Naming>("Popover");

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
  const service = useMachine(popover.machine, {
    ...omitUndefined(options),
    id: options.id ?? generated,

    /**
     * Keeps the popover open when Zag closes it with an overlay it is not nested in, then calls the
     * caller's handler.
     */
    onRequestDismiss(event) {
      dismissNested(event);
      options.onRequestDismiss?.(event);
    },
  });

  return popover.connect(service, normalizeProps);
}
