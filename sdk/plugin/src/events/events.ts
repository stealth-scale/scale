/**
 * Subscribes a component to events and emits them, as the component's plugin.
 *
 * @remarks
 *   The bus checks who may emit an event, so a component reads its plugin from the scope it renders
 *   in and cannot emit as another plugin. Code outside every plugin's scope acts as the product.
 */

import { use, useEffect, useEffectEvent } from "react";

import { type EventPayload, type EventReference } from "@stealthscale/sdk-core";

import { useHost } from "#host/use-host.ts";
import { PluginContext } from "#scope/context.ts";

/**
 * Subscribes the component to an event for as long as it is mounted, as its plugin.
 *
 * @remarks
 *   The subscription is made once per event. The bus calls the handler of the latest render, so a
 *   handler that closes over new state needs no new subscription.
 * @param event - The event, by reference.
 * @param handler - Function the bus calls with each payload.
 */
export function useEvent<E extends EventReference>(
  event: E,
  handler: (payload: EventPayload<E>) => void,
): void {
  const { events } = useHost("useEvent");
  const pluginId = use(PluginContext)?.pluginId;
  const handle = useEffectEvent(handler);

  useEffect(
    () =>
      events.subscribe(pluginId, event.id, (payload) => {
        // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the bus delivers the payload the event's emitter passed, which the reference types
        handle(payload as EventPayload<E>);
      }),
    [event.id, events, pluginId],
  );
}

/**
 * Returns a function that emits an event as the component's plugin.
 *
 * @remarks
 *   The function throws where no installed plugin declares the event, or where the component's
 *   plugin may not emit it.
 * @param event - The event, by reference.
 */
export function useEmit<E extends EventReference>(event: E): (payload: EventPayload<E>) => void {
  const { events } = useHost("useEmit");
  const pluginId = use(PluginContext)?.pluginId;

  return (payload) => {
    events.emit(pluginId, event.id, payload);
  };
}
