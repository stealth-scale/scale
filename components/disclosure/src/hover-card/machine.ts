/**
 * Connects the hover card machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so the triggers, the
 *   positioner and the content report the same state. The machine derives every part's id from
 *   `id`, and a trigger's id from its `value` as well.
 */

import { useId } from "react";

import * as hoverCard from "@zag-js/hover-card";
import { normalizeProps, useMachine } from "@zag-js/react";

import {
  createRequiredContext,
  omitUndefined,
  type Presence,
  splitEnumerable,
} from "@stealthscale/hooks";

/**
 * Describes the api `hoverCard.connect` returns: a prop getter per part plus the machine's state
 * and methods.
 *
 * @remarks
 *   The type comes from `connect`, so it follows the installed machine version. It references
 *   `@zag-js/types`, so the package declares that package as a dependency.
 */
export type HoverCardApi = ReturnType<typeof hoverCard.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 */
export type HoverCardOptions = Partial<hoverCard.Props>;

/**
 * Creates the context through which the root provides the connected api to its parts.
 *
 * @remarks
 *   `useHoverCard` throws when no `HoverCard.Root` is mounted above the calling part.
 */
export const [ApiProvider, useHoverCard] = createRequiredContext<HoverCardApi>("HoverCard");

/**
 * Creates the context through which the root provides the panel's presence to the positioner and
 * the content.
 */
export const [PresenceProvider, useCardPresence] = createRequiredContext<Presence>("HoverCard");

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 */
export const splitHoverCardProps = splitEnumerable(hoverCard.splitProps);

/**
 * Starts the hover card machine and returns its connected api.
 *
 * @param options - Machine settings split from the root's props. A generated id is used when `id`
 *   is absent.
 */
export function useHoverCardMachine(options: HoverCardOptions): HoverCardApi {
  const generated = useId();

  return hoverCard.connect(
    useMachine(hoverCard.machine, { ...omitUndefined(options), id: options.id ?? generated }),
    normalizeProps,
  );
}
