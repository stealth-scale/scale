/**
 * Renders one toast of a region: it starts the toast's machine and provides the machine's api to
 * the parts the region's render function returns.
 */

import { type ReactElement, type ReactNode } from "react";

import { type GroupService } from "@zag-js/toast";

import { ApiProvider, type ToastOptions, useToastMachine } from "#toast/machine.ts";

/**
 * Describes the props of an actor: the toast, its place in the region, the region's service and
 * the region's render function.
 */
export interface ActorProps {
  /**
   * The toast's place in the region, the newest first.
   */
  readonly index: number;

  /**
   * The group machine's service, which the toast's machine reports its height and its removal to.
   */
  readonly parent: GroupService;

  /**
   * The region's render function.
   */
  readonly render: (toast: ToastOptions) => ReactNode;

  /**
   * The toast as the toaster holds it.
   */
  readonly value: ToastOptions;
}

/**
 * Runs the toast's machine and renders what the render function returns for the toast.
 *
 * @param props - The toast, its place, the region's service and the render function.
 * @returns The rendered toast inside the api's provider.
 */
export function Actor({ index, parent, render, value }: ActorProps): ReactElement {
  const api = useToastMachine(value, parent, index);

  return <ApiProvider value={api}>{render(value)}</ApiProvider>;
}
