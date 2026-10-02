/**
 * Connects the toast machines and provides a toast's api to its parts.
 *
 * @remarks
 *   A toaster is the store an application raises toasts into. `Toast.Region` runs the group machine
 *   for one toaster, and each toast in the region runs a machine of its own, whose api the toast's
 *   parts read from context. The group machine derives the region's id from the toaster's
 *   placement, so a page renders one region per placement.
 */

import { type ReactNode, useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as toast from "@zag-js/toast";

import { createRequiredContext, omitUndefined } from "@stealthscale/hooks";

/**
 * Describes the store an application raises toasts into.
 */
export type Toaster = toast.Store;

/**
 * Describes one toast as the toaster holds it: its id, type, title, description, duration and
 * action.
 */
export type ToastOptions = toast.Options<ReactNode>;

/**
 * Describes the api `toast.connect` returns: a prop getter per part plus the toast's state and
 * methods.
 */
export type ToastApi = ReturnType<typeof toast.connect>;

/**
 * Describes the api `toast.group.connect` returns: the region's props and the toasts it holds.
 */
export type RegionApi = ReturnType<typeof toast.group.connect>;

/**
 * Creates the context through which each toast provides its api to its parts.
 *
 * @remarks
 *   `useToast` throws when no toast of a `Toast.Region` is rendering the calling part.
 */
export const [ApiProvider, useToast] = createRequiredContext<ToastApi>("Toast");

/**
 * Describes what the region's machine returns: its api and the service each toast's machine names
 * as its parent.
 */
export interface Region {
  /**
   * The region's connected api.
   */
  readonly api: RegionApi;

  /**
   * The group machine's service.
   */
  readonly service: toast.GroupService;
}

/**
 * Starts the group machine for one toaster and returns its api and service.
 *
 * @param toaster - The store the region renders the toasts of.
 * @param dir - The text direction, which mirrors the start and end placements.
 */
export function useRegionMachine(toaster: Toaster, dir?: "ltr" | "rtl"): Region {
  const service = useMachine(toast.group.machine, {
    ...omitUndefined({ dir }),
    id: useId(),
    store: toaster,
  });

  return { api: toast.group.connect(service, normalizeProps), service };
}

/**
 * Starts the machine of one toast and returns its connected api.
 *
 * @param options - The toast as the toaster holds it.
 * @param parent - The group machine's service.
 * @param index - The toast's place in the region, the newest first.
 */
export function useToastMachine(
  options: ToastOptions,
  parent: toast.GroupService,
  index: number,
): ToastApi {
  const service = useMachine(toast.machine, { ...omitUndefined(options), index, parent });

  return toast.connect(service, normalizeProps);
}
