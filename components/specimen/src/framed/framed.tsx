/**
 * Draws one sample of one scene and nothing else, for the frame a page shows it in at a device's
 * size.
 *
 * @remarks
 *   What an application routes its framed page to. The frame loads the application at that page
 *   with a sample's address in the fragment, so everything in the document, the styling engine's
 *   media queries and the parts that portal to the body included, sees a window of the device's
 *   size. The address is read off the fragment and followed as it changes, because the frame has
 *   no router of its own to follow it with. The scene is drawn in a pane that meets the window
 *   the way the scene meets its card, or at the window's edges for a scene that fills the window,
 *   and the matrix or the board inside it draws the one sample the address picks, bare, and tells
 *   the page holding the frame which samples it offers. The
 *   document's root is marked as framed, so the kit's preset makes it see-through and the sample
 *   sits on the card that holds the frame.
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
 * Describes what the framed page takes.
 */
export interface FramedProps {
  /**
   * Every page the index found.
   */
  readonly pages: readonly Indexed[];
}

/**
 * Tells React when the fragment changes.
 */
function subscribe(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);

  return (): void => {
    window.removeEventListener("hashchange", onChange);
  };
}

/**
 * Reads the fragment as it stands.
 */
function snapshot(): string {
  return window.location.hash;
}

/**
 * Reads the fragment as it stands, on a server: none.
 */
function absent(): string {
  return "";
}

/**
 * Says how a scene meets the window: at its edges for one that fills the window, whatever frame
 * it meets its card with, and otherwise the way it meets its card.
 */
function framing(scene: Scene): Frame {
  if (scene.viewport === true) return "bleed";

  return scene.frame ?? "inset";
}

/**
 * Marks the document's root as framed while the page is drawn.
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
 * Draws the sample the fragment addresses, bare.
 *
 * @param props - Every page the index found.
 * @returns The sample, or nothing while the page loads or where the address names none.
 */
export function Framed({ pages }: FramedProps): null | ReactElement {
  const fragment = useSyncExternalStore(subscribe, snapshot, absent);
  const address: Address | undefined = readAddress(fragment);
  const entry = pages.find((page) => page.id === address?.page);
  const page = useDeclared(entry);
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
