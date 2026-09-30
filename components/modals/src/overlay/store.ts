/**
 * Keeps the overlays `createOverlay` renders: which are open, the props each renders with, and the
 * promises their callers wait on.
 *
 * @remarks
 *   The store imports no React. Every change replaces the entry list, so a subscriber compares two
 *   lists by reference. Each promise `open` returns settles once: with the result `close` passes,
 *   or with `undefined` when the overlay is dismissed, removed, or opened again under its id.
 */

/**
 * Describes one overlay the store keeps.
 */
export interface Entry<Props, Result> {
  /**
   * Resolves the promises that wait for the overlay to leave the store.
   *
   * @remarks
   *   Every copy of an entry shares this array, so a promise from `close` resolves when the copy
   *   an `update` made leaves.
   */
  readonly exits: Array<() => void>;

  /**
   * Key the caller opened the overlay under.
   */
  readonly id: string;

  /**
   * True until the overlay closes, and false while its exit animation runs.
   */
  readonly open: boolean;

  /**
   * Props the caller passed to `open`, merged with every `update`.
   */
  readonly props: Props;

  /**
   * Settles the promise `open` returned. A second call keeps the first result.
   */
  readonly settle: (result: Result | undefined) => void;
}

/**
 * Describes the store: the methods a caller drives its overlays with, plus the list and the
 * subscription a viewport renders from.
 */
export interface Store<Props, Result> {
  /**
   * Closes an overlay and settles the promise `open` returned with `result`.
   *
   * @returns A promise that resolves once the overlay leaves the store, at once for an id the store
   *   does not keep.
   */
  readonly close: (id: string, result?: Result) => Promise<void>;

  /**
   * Returns every entry in the order its id was first opened.
   */
  readonly entries: () => ReadonlyArray<Entry<Props, Result>>;

  /**
   * Returns the props of the overlay kept under `id`.
   *
   * @throws {@link Error} When the store keeps no overlay under `id`.
   */
  readonly get: (id: string) => Props;

  /**
   * Returns the props of every overlay the store keeps, in the order of `entries`.
   */
  readonly getSnapshot: () => Props[];

  /**
   * Returns true while the store keeps an overlay under `id`, its exit animation included.
   */
  readonly has: (id: string) => boolean;

  /**
   * Opens an overlay under `id` with `props`.
   *
   * @remarks
   *   An id the store already keeps renders the new props in the same overlay, and the promise the
   *   earlier `open` returned settles with `undefined`.
   * @returns A promise of the result the overlay closes with, or `undefined` when it is dismissed
   *   or removed.
   */
  readonly open: (id: string, props: Props) => Promise<Result | undefined>;

  /**
   * Removes an overlay without its exit animation and settles its promise with `undefined`.
   */
  readonly remove: (id: string) => void;

  /**
   * Removes every overlay without its exit animation and settles each promise with `undefined`.
   */
  readonly removeAll: () => void;

  /**
   * Calls `listener` after every change to the entry list.
   *
   * @returns A function that stops the calls.
   */
  readonly subscribe: (listener: () => void) => () => void;

  /**
   * Merges `props` into the props of the overlay kept under `id`, and does nothing for an id the
   * store does not keep.
   */
  readonly update: (id: string, props: Partial<Props>) => void;

  /**
   * Returns a promise that resolves once the overlay kept under `id` leaves the store, at once for
   * an id the store does not keep.
   */
  readonly waitForExit: (id: string) => Promise<void>;
}

/**
 * Describes the state one store keeps between calls.
 */
interface State<Props, Result> {
  /**
   * Entries in the order their ids were first opened.
   */
  entries: ReadonlyArray<Entry<Props, Result>>;

  /**
   * Functions called after every change to `entries`.
   */
  readonly listeners: Set<() => void>;
}

/**
 * Replaces the entry list and calls every listener.
 */
function publish<Props, Result>(
  state: State<Props, Result>,
  next: State<Props, Result>["entries"],
): void {
  state.entries = next;

  for (const listener of state.listeners) listener();
}

/**
 * Returns the entry kept under `id`, or undefined when there is none.
 */
function find<Props, Result>(
  state: State<Props, Result>,
  id: string,
): Entry<Props, Result> | undefined {
  return state.entries.find((entry) => entry.id === id);
}

/**
 * Replaces one entry with another in place, so the list keeps its order.
 */
function replace<Props, Result>(
  state: State<Props, Result>,
  entry: Entry<Props, Result>,
  next: Entry<Props, Result>,
): void {
  publish(
    state,
    state.entries.map((kept) => (kept === entry ? next : kept)),
  );
}

/**
 * Returns a promise that resolves once the entry leaves the store.
 */
function leaving<Props, Result>(entry: Entry<Props, Result>): Promise<void> {
  return new Promise((resolve) => {
    entry.exits.push(resolve);
  });
}

/**
 * Settles the entry's promise with `undefined` and resolves every promise waiting for it to leave.
 */
function release<Props, Result>(entry: Entry<Props, Result>): void {
  entry.settle(undefined);

  for (const exit of entry.exits.splice(0)) exit();
}

/**
 * Opens an overlay, or renders new props in the overlay already kept under `id`.
 */
function open<Props, Result>(
  state: State<Props, Result>,
  id: string,
  props: Props,
): Promise<Result | undefined> {
  return new Promise((settle) => {
    const earlier = find(state, id);
    const entry: Entry<Props, Result> = { exits: [], id, open: true, props, settle };

    if (earlier === undefined) {
      publish(state, [...state.entries, entry]);

      return;
    }

    release(earlier);
    replace(state, earlier, entry);
  });
}

/**
 * Closes an overlay and settles its promise with `result`.
 */
function close<Props, Result>(
  state: State<Props, Result>,
  id: string,
  result: Result | undefined,
): Promise<void> {
  const entry = find(state, id);

  if (entry === undefined) return Promise.resolve();

  const left = leaving(entry);

  entry.settle(result);

  if (entry.open) replace(state, entry, { ...entry, open: false });

  return left;
}

/**
 * Removes an overlay and settles its promise with `undefined`.
 */
function remove<Props, Result>(state: State<Props, Result>, id: string): void {
  const entry = find(state, id);

  if (entry === undefined) return;

  release(entry);
  publish(
    state,
    state.entries.filter((kept) => kept !== entry),
  );
}

/**
 * Returns the props of the overlay kept under `id`.
 *
 * @throws {@link Error} When the store keeps no overlay under `id`.
 */
function get<Props, Result>(state: State<Props, Result>, id: string): Props {
  const entry = find(state, id);

  if (entry === undefined) throw new Error(`No overlay is kept under the id "${id}".`);

  return entry.props;
}

/**
 * Creates an empty store of overlays.
 *
 * @typeParam Props - Props the caller passes to `open`.
 * @typeParam Result - Value an overlay closes with.
 */
export function createStore<Props extends object, Result>(): Store<Props, Result> {
  const state: State<Props, Result> = { entries: [], listeners: new Set() };

  return {
    close: (id, result) => close(state, id, result),
    entries: () => state.entries,
    get: (id) => get(state, id),
    getSnapshot: () => state.entries.map((entry) => entry.props),
    has: (id) => find(state, id) !== undefined,
    open: (id, props) => open(state, id, props),
    remove: (id) => {
      remove(state, id);
    },
    removeAll: () => {
      for (const entry of state.entries) release(entry);

      publish(state, []);
    },
    subscribe: (listener) => {
      state.listeners.add(listener);

      return () => {
        state.listeners.delete(listener);
      };
    },
    update: (id, props) => {
      const entry = find(state, id);

      if (entry !== undefined)
        replace(state, entry, { ...entry, props: { ...entry.props, ...props } });
    },
    waitForExit: (id) => {
      const entry = find(state, id);

      return entry === undefined ? Promise.resolve() : leaving(entry);
    },
  };
}
