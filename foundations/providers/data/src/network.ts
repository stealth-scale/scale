/**
 * Reports whether the page is online, and how many changes wait to be sent.
 */

import { useSyncExternalStore } from "react";

import { type Mutation, onlineManager, useIsMutating } from "@tanstack/react-query";

/**
 * Describes the page's connection, as a product's frame renders it.
 */
export interface Network {
  /**
   * True while the page is online.
   */
  readonly online: boolean;

  /**
   * Mutations waiting to be sent: paused while the page is offline, or queued behind another
   * mutation of their scope.
   */
  readonly paused: number;
}

/**
 * Subscribes to the library's online state.
 *
 * @param onChange - Called when the page goes online or offline.
 * @returns The function that ends the subscription.
 */
function subscribed(onChange: () => void): () => void {
  return onlineManager.subscribe(onChange);
}

/**
 * Returns the library's online state.
 */
function isOnline(): boolean {
  return onlineManager.isOnline();
}

/**
 * Returns the online state a server renders, which is online.
 */
function isOnlineOnServer(): boolean {
  return true;
}

/**
 * Returns true for a mutation that waits to be sent.
 */
function isPaused(mutation: Mutation): boolean {
  return mutation.state.isPaused;
}

/**
 * Returns whether the page is online, and how many mutations wait to be sent.
 *
 * @remarks
 *   A fetch made while offline waits, and a mutation made while offline is paused. The client sends
 *   the paused mutations, in order, once the page is online or focused again.
 * @returns The page's connection.
 */
export function useNetwork(): Network {
  const online = useSyncExternalStore(subscribed, isOnline, isOnlineOnServer);
  const paused = useIsMutating({ predicate: isPaused });

  return { online, paused };
}
