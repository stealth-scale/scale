/**
 * Starts the tour machine and provides its api and the presences of its card and backdrop to the
 * parts.
 *
 * @remarks
 *   A caller starts the machine with `useTour` and passes the api to `Tour.Root`, because a tour
 *   starts from application code, such as a button outside the tour or the first visit to a page.
 *   The root provides that one api, so every part reports the same step. The machine derives the
 *   ids of the card, the title and the description from `id`, and points the card's
 *   `aria-labelledby` and `aria-describedby` at the last two.
 */

import { useId } from "react";

import { mergeProps, normalizeProps, useMachine } from "@zag-js/react";
import * as tour from "@zag-js/tour";

import { createRequiredContext, omitUndefined, type Presence } from "@stealthscale/hooks";

import { recordStatus, useReturnedFocus } from "#tour/focus.ts";
import { BOUNDARY } from "#tour/recipe.ts";

/**
 * Describes the api `useTour` returns, which contains a prop getter per part and the machine's
 * state and methods.
 *
 * @remarks
 *   The type comes from `connect`, so it follows the installed machine version. It references
 *   `@zag-js/types`, so the package declares that package as a dependency.
 */
export type TourApi = ReturnType<typeof tour.connect>;

/**
 * Describes the machine settings a caller passes to `useTour`, all optional.
 *
 * @remarks
 *   The machine's `translations` are left out. The parts take their words as props: the close
 *   trigger its `aria-label`, an action trigger its label, the progress text its children.
 */
export type TourOptions = Omit<Partial<tour.Props>, "translations">;

/**
 * Creates the context through which the root provides the api to its parts.
 *
 * @remarks
 *   `useTourContext` throws when no `Tour.Root` is mounted above the calling part.
 */
export const [ApiProvider, useTourContext] = createRequiredContext<TourApi>("Tour");

/**
 * Creates the context through which the root provides the card's presence to the positioner and
 * the content.
 */
export const [PanelProvider, usePanelPresence] = createRequiredContext<Presence>("Tour");

/**
 * Creates the context through which the root provides the backdrop's presence to the backdrop and
 * the spotlight.
 */
export const [BackdropProvider, useBackdropPresence] = createRequiredContext<Presence>("Tour");

/**
 * Starts the tour machine and returns its connected api.
 *
 * @remarks
 *   The api's backdrop props contain the height of the document the machine measures, so a backdrop
 *   placed in the document's coordinates covers the window at a tooltip step's target however far
 *   the page has scrolled. Once the tour ends, focus returns to the element that had it when the
 *   tour started.
 * @param options - Machine settings. A generated id is used when `id` is absent.
 */
export function useTour(options: TourOptions = {}): TourApi {
  const generated = useId();
  const id = options.id ?? generated;
  const { onStatusChange } = options;
  const service = useMachine(tour.machine, {
    ...omitUndefined(options),
    id,
    /**
     * Records the status for the focus the tour returns, then calls the caller's handler.
     *
     * @param details - The status and the step the machine reports.
     */
    onStatusChange(details) {
      recordStatus(id, details.status);
      onStatusChange?.(details);
    },
  });
  const api = tour.connect(service, normalizeProps);
  const style: Record<string, string> = {
    [BOUNDARY]: `${String(service.context.get("boundarySize").height)}px`,
  };

  useReturnedFocus(id, api.open);

  return { ...api, getBackdropProps: () => mergeProps(api.getBackdropProps(), { style }) };
}
