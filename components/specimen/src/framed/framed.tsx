/**
 * Renders one sample of one scene and nothing else, for the iframe a page shows it in at a
 * device's size.
 *
 * @remarks
 *   An application routes its framed page to this component. The frame loads the application at
 *   that page with a sample's address in the fragment, so everything in the document, the styling
 *   engine's media queries and the parts that portal to the body included, sees a window of the
 *   device's size. The address is read from the fragment and followed as it changes, because the
 *   frame runs no router of its own. The document root is marked as framed, so the kit's preset
 *   makes it transparent and the sample sits on the card around the frame.
 */

import { type ReactElement, useEffect, useSyncExternalStore } from "react";

import { useDeclared } from "#catalogue/loaded.ts";
import { type Indexed } from "#catalogue/types.ts";
import { type Address, readAddress } from "#framed/address.ts";
import { FRAMED_ATTRIBUTE } from "#framed/attribute.ts";
import { FramedProvider } from "#framed/context.ts";
import { Pane } from "#framed/pane.ts";
import { type Frame, type Scene } from "#page.ts";

/**
 * The props {@link Framed} accepts.
 */
export interface FramedProps {
  /**
   * Every page the index found, searched for the one the address names.
   */
  readonly pages: readonly Indexed[];
}

/**
 * Subscribes to `hashchange` for `useSyncExternalStore`.
 *
 * @returns The function that removes the listener again.
 */
function subscribe(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);

  return (): void => {
    window.removeEventListener("hashchange", onChange);
  };
}

/**
 * Reads the current fragment, as the client snapshot for `useSyncExternalStore`.
 */
function snapshot(): string {
  return window.location.hash;
}

/**
 * Supplies the empty fragment as the server snapshot for `useSyncExternalStore`.
 *
 * @remarks
 *   A server has no `window` to read a fragment from, and the address only matters once the
 *   component has hydrated.
 */
function absent(): string {
  return "";
}

/**
 * Chooses the frame a scene takes in the pane.
 *
 * @returns `bleed` for a viewport scene, and otherwise the scene's own frame, defaulting to
 *   `inset`.
 */
function framing(scene: Scene): Frame {
  if (scene.viewport === true) return "bleed";

  return scene.frame ?? "inset";
}

/**
 * Marks the document root as framed for as long as the component is mounted.
 */
function useMarked(): void {
  useEffect(() => {
    document.documentElement.setAttribute(FRAMED_ATTRIBUTE, "");

    return (): void => {
      document.documentElement.removeAttribute(FRAMED_ATTRIBUTE);
    };
  }, []);
}

/**
 * Renders the sample the fragment addresses, and nothing else.
 *
 * @remarks
 *   The address is re-read on every `hashchange`, so the frame follows the sample a page picks
 *   without reloading the document.
 * @param props - Every page the index found.
 * @returns The sample, or null while the module is pending and when the address names no scene.
 */
export function Framed({ pages }: FramedProps): null | ReactElement {
  const fragment = useSyncExternalStore(subscribe, snapshot, absent);
  const address: Address | undefined = readAddress(fragment);
  const entry = pages.find((page) => page.id === address?.page);
  const { page } = useDeclared(entry);
  const scene = address === undefined ? undefined : page?.scenes[address.scene];

  useMarked();

  if (address === undefined || scene === undefined) return null;

  return (
    <FramedProvider value={address.pick}>
      <Pane frame={framing(scene)}>
        <scene.draw />
      </Pane>
    </FramedProvider>
  );
}
