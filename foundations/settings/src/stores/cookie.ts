/**
 * Keeps settings in a cookie, which a server reads before it renders.
 */

import { cache, type SettingStore, watchers } from "#store.ts";

/**
 * Describes the part of the Cookie Store API this store uses, which is the change event alone.
 *
 * @remarks
 *   Declared here rather than taken from the DOM library, because the interface became Baseline in
 *   June 2025 and the library this repository compiles against does not declare it yet. Only the
 *   event is used: reading goes through `document.cookie`, which returns at once, where the Cookie
 *   Store returns a promise and a snapshot has to be read during a render.
 */
interface CookieChanges {
  /**
   * Starts telling a listener whenever any cookie changes.
   */
  addEventListener: (type: "change", listener: () => void) => void;

  /**
   * Stops telling a listener.
   */
  removeEventListener: (type: "change", listener: () => void) => void;
}

/**
 * Describes the global the Cookie Store hangs on, which is the window and a service worker alike.
 */
interface CookieGlobal {
  /**
   * The browser's cookie store, where it has shipped one.
   */
  cookieStore?: CookieChanges;
}

/**
 * Finds the Cookie Store, where the browser has one.
 *
 * @remarks
 *   Absent in a browser that has not shipped it and outside a secure context, where a cookie
 *   changed by another document is seen on the next load instead.
 */
function changes(): CookieChanges | undefined {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the global is read for its event target alone, and the declaration above names what is read
  return (globalThis as CookieGlobal).cookieStore;
}

/**
 * Describes how a cookie store writes, and where it reads on a server.
 */
export interface CookieStoreOptions {
  /**
   * The `Cookie` header of the request being served, for a store built on a server. The
   * document's own cookies are read where this is absent.
   */
  header?: string | undefined;

  /**
   * How long a setting outlives the visit, in seconds. A year where this is absent.
   */
  maxAge?: number | undefined;

  /**
   * The path the cookie is sent for. The whole origin where this is absent.
   */
  path?: string | undefined;

  /**
   * How the cookie travels on a cross-site request. `lax` where this is absent, which is what a
   * setting wants: it rides on a link somebody followed and not on a form another site posted.
   */
  sameSite?: "lax" | "strict" | undefined;
}

/**
 * Fixes how long a setting outlives the visit where the caller states nothing, which is a year in
 * seconds.
 */
const YEAR = 31_536_000;

/**
 * Reads one cookie out of a header.
 *
 * @param header - The whole `Cookie` header, as pairs separated by semicolons.
 * @returns The value, decoded, or `null` where the header names no such cookie.
 */
function valueIn(header: string, name: string): null | string {
  const wanted = `${encodeURIComponent(name)}=`;
  const found = header
    .split(";")
    .map((pair) => pair.trim())
    .find((pair) => pair.startsWith(wanted));

  return found === undefined ? null : decodeURIComponent(found.slice(wanted.length));
}

/**
 * Builds a store that keeps its settings in a cookie.
 *
 * @remarks
 *   A cookie is the one place a setting is visible to the server, so the first response already
 *   contains the remembered value and no script has to correct the page after it paints. A store
 *   reports its own writes. A browser without the Cookie Store reports no change to a cookie, so
 *   there a change made in another tab arrives on the next load rather than at once. Use this for
 *   a setting that decides the first paint, and the local store for everything else.
 * @param options - How to write the cookie, and the request header to read on a server.
 * @returns A store that keeps each setting in a cookie of its own.
 */
export function cookieStore(options: CookieStoreOptions = {}): SettingStore {
  const { header, maxAge = YEAR, path = "/", sameSite = "lax" } = options;
  const watching = watchers();
  const held = cache();

  /**
   * Forgets what the cache contains and tells whatever is watching.
   */
  const changed = (key: null | string): void => {
    held.forget(key);
    watching.notify(key);
  };

  /**
   * Reads whichever cookies this store can see.
   */
  const jar = (): string => header ?? globalThis.document?.cookie ?? "";

  /**
   * Writes one cookie, with the attributes the store was built with.
   */
  const put = (key: string, value: string, seconds: number): void => {
    if (globalThis.document === undefined) return;

    const attributes = `Path=${path};Max-Age=${String(seconds)};SameSite=${sameSite}`;

    globalThis.document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)};${attributes}`;
  };

  return {
    clear: (key) => {
      put(key, "", 0);
      changed(key);
    },
    read: (key) => held.through(key, () => valueIn(jar(), key)),
    subscribe: (key, onChange) => {
      const stop = watching.watch(key, onChange);
      const store = changes();

      /**
       * Forgets every key when any cookie changes, because the event names what changed only in
       * browsers that ship the whole interface, and forgetting every key costs one parse on the
       * next read.
       */
      // eslint-disable-next-line unicorn/consistent-function-scoping -- each subscription removes the listener it added, and an event target keeps one copy of a function added twice
      const listener = (): void => {
        changed(null);
      };

      store?.addEventListener("change", listener);

      return () => {
        stop();
        store?.removeEventListener("change", listener);
      };
    },
    write: (key, value) => {
      put(key, value, maxAge);
      changed(key);
    },
  };
}
