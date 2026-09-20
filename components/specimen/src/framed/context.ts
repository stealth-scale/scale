/**
 * Carries the sample a framed document was asked for down to the matrix, the board or the sample
 * that draws it.
 *
 * @remarks
 *   A framed document is the catalogue loaded in a frame at one sample's address. The scene is
 *   drawn as it is on the page, and the matrix or the board inside it reads the pick and draws
 *   that one sample bare, with no caption and no box, so the frame shows the component as a window
 *   of that size would.
 */

import { createContext, useContext } from "react";

import { type Pick } from "#framed/address.ts";

/**
 * Carries the pick a framed document was asked for, or nothing on the page itself.
 */
const Framed = createContext<Pick | undefined>(undefined);

/**
 * Puts the pick a framed document was asked for in scope.
 */
export const FramedProvider = Framed.Provider;

/**
 * Reads the pick a framed document was asked for, or undefined on the page itself.
 *
 * @returns The pick, or undefined outside a framed document.
 */
export function useFramed(): Pick | undefined {
  return useContext(Framed);
}
