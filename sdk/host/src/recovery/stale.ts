/**
 * Reloads a page once per build version after a plugin's module failed to import, because a page
 * that loaded before a deployment asks for chunks the deployment replaced.
 */

import { type Product } from "@stealthscale/sdk-core";

/**
 * Records the version under the key in the tab's session storage, and returns true where it did.
 *
 * @returns False where the key contains the version already, or where the browser refuses the
 *   storage.
 */
function recordReload(key: string, version: string): boolean {
  try {
    if (window.sessionStorage.getItem(key) === version) return false;

    window.sessionStorage.setItem(key, version);

    return true;
  } catch {
    return false;
  }
}

/**
 * Returns the function that reloads the page after a module failed to import, once per build
 * version, and returns true while the page reloads.
 *
 * @remarks
 *   The function records the product's version under `stealth.<productId>.reloaded` before it
 *   reloads. For a version recorded before, it returns false, so a chunk the new build lacks as
 *   well renders the error component instead of a second reload. A server has no page to reload,
 *   and a page whose storage the browser refuses cannot record the version, so both return false.
 * @param product - The product: its id names the storage key, and its version is the build's.
 */
export function staleRecovery({
  productId,
  version,
}: Pick<Product, "productId" | "version">): () => boolean {
  const key = `stealth.${productId}.reloaded`;
  let reloading = false;

  return () => {
    if (reloading) return true;

    if (typeof window === "undefined" || !recordReload(key, version)) return false;

    reloading = true;
    window.location.reload();

    return true;
  };
}

/**
 * Listens for Vite's `vite:preloadError` event until the returned function is called, and cancels
 * the event where the page reloads.
 *
 * @remarks
 *   Vite's preload helper dispatches the cancelable event on the window for a stylesheet that
 *   failed to preload and for a module that failed to import. A cancelled event makes the import
 *   resolve with no module, which the host's importers keep pending while the page reloads. An
 *   event the listener does not cancel rejects the import.
 * @param recover - Reloads the page once per build version, and returns true while it reloads.
 */
export function listenForStaleChunks(recover: () => boolean): () => void {
  /**
   * Reloads the page for the failed import, and cancels the event where it does.
   */
  const listener = (event: Event): void => {
    if (recover()) event.preventDefault();
  };

  window.addEventListener("vite:preloadError", listener);

  return () => {
    window.removeEventListener("vite:preloadError", listener);
  };
}
