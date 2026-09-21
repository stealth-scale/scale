/**
 * Resolves what a frame is loaded with: the address of the sample, the location of the framed page
 * under the base the application is served at, and the key that loads the frame again when the
 * page changes its theme, its mode or its language.
 */

import { type AnyRouter, useRouter } from "@stealthscale/provider-router";

import { useRootAttributes } from "#device/root-attributes.ts";
import { type Framable } from "#device/scene.ts";
import { type Pick, writeAddress } from "#framed/address.ts";

/**
 * Describes what a frame is loaded with.
 */
export interface Framed {
  /**
   * The fragment naming the sample, which the document inside reports its axes under.
   */
  readonly address: string;

  /**
   * The theme, the mode and the language on the document root, joined, which the frame is keyed
   * by.
   */
  readonly key: string;

  /**
   * The location the frame loads, the framed page at the sample's address.
   */
  readonly src: string;
}

/**
 * Returns the location a frame loads the framed page at, with the router's base in front of it.
 *
 * @remarks
 *   Built by the router where the device is drawn under one, so an application served under a
 *   base frames the page the base is on, the way every link the catalogue draws does. A device
 *   drawn under no router, as a specification draws one, loads the path from the root.
 * @param path - The path the application serves the framed page at, from the root.
 * @returns The location, without its fragment.
 */
function useLocation(path: string): string {
  const router: AnyRouter | null = useRouter({ warn: false });

  return router === null ? `/${path}` : router.buildLocation({ to: `/${path}` }).href;
}

/**
 * Resolves what a frame showing one sample of a scene is loaded with.
 *
 * @param scene - The scene, with the path its frame loads.
 * @param pick - Which sample of the scene.
 * @returns The address, the key and the location.
 */
export function useFrame(scene: Framable, pick: Pick): Framed {
  const address = writeAddress({ page: scene.page, pick, scene: scene.scene });
  const location = useLocation(scene.path);
  const key = useRootAttributes();

  return { address, key, src: `${location}${address}` };
}
