/**
 * Carries which scene of which page is being drawn, so the page can address it for a frame, and
 * reads the device a reader picked.
 */

import { createContext, useContext } from "react";

import { useViewport } from "@stealthscale/provider-viewport";

import { useSettings } from "#catalogue/settings.ts";
import { type Device, deviceOf } from "#device/devices.ts";

/**
 * Locates the scene being drawn, and says where a frame of it loads.
 */
export interface SceneAddress {
  /**
   * The page's identifier.
   */
  readonly page: string;

  /**
   * The path the application serves the framed page at, from the root, or nothing where it
   * serves none, in which case no scene is shown in a device.
   */
  readonly path?: string | undefined;

  /**
   * The position of the scene on the page.
   */
  readonly scene: number;

  /**
   * The scene's title, worded, which names a frame for a screen reader.
   */
  readonly title: string;
}

/**
 * A scene whose frame has somewhere to load.
 */
export interface Framable extends SceneAddress {
  /**
   * The path the application serves the framed page at, from the root.
   */
  readonly path: string;
}

/**
 * Pairs the device a reader picked with the scene to show in it.
 */
export interface Held {
  /**
   * The device.
   */
  readonly device: Device;

  /**
   * The scene, with the path its frame loads.
   */
  readonly scene: Framable;
}

/**
 * Carries the scene being drawn, or nothing outside a page.
 */
const Scene = createContext<SceneAddress | undefined>(undefined);

/**
 * Puts the scene being drawn in scope.
 */
export const SceneProvider = Scene.Provider;

/**
 * Reads the scene being drawn, or undefined outside a page.
 *
 * @returns The scene's address, or undefined.
 */
export function useScene(): SceneAddress | undefined {
  return useContext(Scene);
}

/**
 * Reads the device a reader picked and the scene to show in it, or nothing while the window
 * decides, outside a page, or where the application serves no framed page.
 *
 * @remarks
 *   The width is the viewport's, which the switcher in an application's bar sets, and the height
 *   is the one the catalogue's settings give that width.
 * @returns The device and the scene, or undefined.
 */
export function useDevice(): Held | undefined {
  const { sizes, width } = useViewport();
  const { heights } = useSettings();
  const scene = useScene();
  const device = deviceOf(width, sizes, heights);

  if (scene?.path === undefined || device === undefined) return undefined;

  return { device, scene: { ...scene, path: scene.path } };
}
