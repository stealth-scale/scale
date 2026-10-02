/**
 * Builds the product a plugin runs in alone, for its tests and its standalone page: the plugin, the
 * plugins beside it installed from their contracts alone, and the sources of a signed-in session.
 *
 * @remarks
 *   The module imports `sdk-core` alone. The build evaluates a product's definition in Node without
 *   a CommonJS loader, and an inline type import still loads its package there.
 */

import {
  type AccessCheck,
  type AccessSource,
  type AnyContract,
  API_RANGE,
  type CommandEntry,
  type ExtensionEntry,
  type FlagSource,
  type InstalledOptions,
  type LazyComponent,
  type PluginManifest,
  type ProductDefinition,
  type ResolvedProduct,
  type Session,
  type SessionSource,
  type SettingsEntry,
} from "@stealthscale/sdk-core";

/**
 * Lists the plugin a standalone product runs, and the plugins installed beside it.
 */
export interface StandaloneOptions {
  /**
   * Contracts of the plugins installed beside the plugin, each from its contract alone. None where
   * left out.
   */
  readonly beside?: readonly AnyContract[] | undefined;

  /**
   * The plugin's configuration, as its schema admits it. The schema's defaults where left out.
   */
  readonly config?: InstalledOptions["config"];

  /**
   * The plugin's contract.
   */
  readonly contract: AnyContract;

  /**
   * The plugin's manifest. The plugin is installed from its contract alone where left out.
   */
  readonly manifest?: PluginManifest | undefined;
}

/**
 * Describes a module a standalone product is built from: a plugin's manifest module, or a contract
 * package beside it.
 */
export interface StandaloneModule {
  /**
   * Where the module comes from: a path or a package name, which an error names.
   */
  readonly from: string;

  /**
   * The module's exports.
   */
  readonly module: Readonly<Record<string, unknown>>;
}

/**
 * Describes the session source of a standalone product, whose session a panel or a test replaces.
 */
export interface StandaloneSession extends SessionSource {
  /**
   * Replaces the session, and calls every listener where the session is another object.
   */
  readonly set: (session: Session) => void;
}

/**
 * Decides one check on one resource: true where the person has the permission on it.
 */
export type Decider = (check: AccessCheck) => boolean;

/**
 * Describes the access source of a standalone product, whose decisions a panel or a test switches.
 *
 * @remarks
 *   The source denies a check whose permission the session lacks, whatever the decision, as an
 *   access service decides for the person the session names.
 */
export interface StandaloneAccess extends AccessSource {
  /**
   * Allows every check the session's permissions admit from now on.
   */
  readonly allow: () => void;

  /**
   * Decides every check the session's permissions admit from now on with the function.
   */
  readonly decide: (decider: Decider) => void;

  /**
   * Denies every check from now on.
   */
  readonly deny: () => void;

  /**
   * Leaves every check from now on pending.
   */
  readonly pending: () => void;

  /**
   * Calls the listener after the decision or the session changes, so the host asks again. Returns a
   * function that stops the calls.
   */
  readonly subscribe: (listener: () => void) => () => void;
}

/**
 * Lists the sources the host of a standalone product reads.
 */
export interface StandaloneSources {
  /**
   * Decides every check on one resource, allowing each the session's permissions admit until a
   * panel or a test switches the decision.
   */
  readonly access: StandaloneAccess;

  /**
   * Turns every boolean flag on, and leaves every experiment at its default.
   */
  readonly flags: FlagSource;

  /**
   * Returns the session a panel or a test last set.
   */
  readonly session: StandaloneSession;
}

/**
 * Describes a value a panel or a test replaces, with the listeners each replacement calls.
 */
interface Kept<T> {
  /**
   * Returns the value.
   */
  readonly get: () => T;

  /**
   * Replaces the value, and calls every listener where the value is another one.
   */
  readonly set: (value: T) => void;

  /**
   * Calls the listener after each replacement. Returns a function that stops the calls.
   */
  readonly subscribe: (listener: () => void) => () => void;
}

/**
 * Allows every check.
 */
function allowed(): boolean {
  return true;
}

/**
 * Denies every check.
 */
function denied(): boolean {
  return false;
}

/**
 * Describes what a placeholder extension reads of its props.
 */
interface Wrapping {
  /**
   * The content the extension wraps, where it wraps.
   */
  readonly children?: unknown;
}

/**
 * The version a standalone product states, which no deployment compares.
 */
const VERSION = "0.0.0";

/**
 * Does nothing: the run of a command without code, and the end of a subscription to a source that
 * never notifies.
 */
function nothing(): void {}

/**
 * Renders the content a wrapping extension wraps, and nothing in any other position.
 */
function PlaceholderExtension({ children }: Wrapping): unknown {
  return children;
}

/**
 * The code of every command of a plugin installed from its contract alone.
 */
const COMMAND: CommandEntry = { run: () => Promise.resolve({ nothing }) };

/**
 * The code of every extension of a plugin installed from its contract alone.
 */
const EXTENSION: ExtensionEntry = { component: () => Promise.resolve({ PlaceholderExtension }) };

/**
 * The code of every settings section without a schema of a plugin installed from its contract
 * alone.
 */
const SECTION: SettingsEntry = { component: () => import("#standalone/section.tsx") };

/**
 * The flag source of a standalone product: every boolean flag on, and every experiment at the value
 * the product or the contract states.
 */
const FLAGS: FlagSource = {
  evaluate: ({ type }) => (type === "boolean" ? true : undefined),
  subscribe: () => nothing,
};

/**
 * A batch of decisions that never settles.
 */
const PENDING: Promise<readonly boolean[]> = new Promise(nothing);

/**
 * Returns a value and its listeners, which each replacement with another value calls.
 *
 * @param initial - The value before the first replacement.
 */
function kept<T>(initial: T): Kept<T> {
  let value = initial;
  const listeners = new Set<() => void>();

  return {
    get: () => value,
    set: (next) => {
      if (Object.is(next, value)) return;

      value = next;

      // eslint-disable-next-line unicorn/no-useless-spread -- the loop runs over a copy, so a listener added during it waits for the next change
      for (const listener of [...listeners]) listener();
    },
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/**
 * Returns the importer of the placeholder page of one route.
 *
 * @param routeId - Qualified id of the route the page names.
 * @param contract - The contract whose slots the page renders.
 */
function pageOf(routeId: string, contract: AnyContract): LazyComponent<object> {
  return async () => {
    const { placeholderPageOf } = await import("#standalone/page.tsx");

    return { PlaceholderPage: placeholderPageOf(routeId, contract) };
  };
}

/**
 * Returns a record with each value mapped, under the same names.
 */
function mapped<T, U>(
  record: Readonly<Record<string, T>>,
  map: (value: T) => U,
): Readonly<Record<string, U>> {
  return Object.fromEntries(Object.entries(record).map(([name, value]) => [name, map(value)]));
}

/**
 * Returns the manifest of a plugin installed from its contract alone: a placeholder for every name
 * that needs code.
 */
function placeholderOf(contract: AnyContract): PluginManifest {
  const sections = Object.entries(contract.settings.sections).filter(
    ([, section]) => section.schema === undefined,
  );

  return {
    apiVersion: API_RANGE,
    code: {
      commands: mapped(contract.commands, () => COMMAND),
      extensions: mapped(contract.extensions, () => EXTENSION),
      routes: mapped(contract.routes, ({ id }) => pageOf(id, contract)),
      settings: Object.fromEntries(sections.map(([name]) => [name, SECTION])),
    },
    contract,
  };
}

/**
 * Returns the definition of a product that runs one plugin: the plugin from its manifest, and each
 * plugin beside it from its contract alone.
 *
 * @remarks
 *   A route of a plugin installed from its contract alone renders a page that names the route and
 *   renders each of the plugin's slots with its sample props. Such a plugin's extensions render the
 *   content they wrap, or nothing, and its commands resolve with nothing. Its settings sections
 *   without a schema name their plugin. The product's id is the plugin's, and its name is the key
 *   `plugin.name`, so the product's name is the plugin's own.
 * @param options - The plugin's contract and manifest, its configuration, and the contracts beside
 *   it.
 * @throws {@link Error} Where the manifest implements another contract.
 */
export function standaloneProduct(options: StandaloneOptions): ProductDefinition {
  const { beside = [], config, contract, manifest = placeholderOf(contract) } = options;

  if (manifest.contract !== contract) {
    throw new Error(
      `The manifest implements the contract of ${manifest.contract.pluginId}, not of ${contract.pluginId}.`,
    );
  }

  return {
    name: "plugin.name",
    plugins: [{ config, manifest }, ...beside.map((one) => ({ manifest: placeholderOf(one) }))],
    productId: contract.pluginId,
    version: VERSION,
  };
}

/**
 * The members every manifest has, which no contract has.
 */
const MANIFEST_KEYS = ["apiVersion", "code", "contract"];

/**
 * The members every contract has, which no manifest has.
 */
const CONTRACT_KEYS = ["pluginId", "routes"];

/**
 * Returns true where a value is an object with every member a manifest has.
 */
function isManifest(value: unknown): value is PluginManifest {
  return value instanceof Object && MANIFEST_KEYS.every((key) => key in value);
}

/**
 * Returns true where a value is an object with every member a contract has.
 */
function isContract(value: unknown): value is AnyContract {
  return value instanceof Object && CONTRACT_KEYS.every((key) => key in value);
}

/**
 * Returns the one export of a module the test accepts, however many names export it.
 *
 * @param standalone - The module, and where it comes from.
 * @param test - Accepts the kind of export the module must have one of.
 * @param kind - The kind of export, which an error names.
 * @throws {@link Error} Where the module exports none of the kind, or several.
 */
function oneOf<T>(
  { from, module }: StandaloneModule,
  test: (value: unknown) => value is T,
  kind: string,
): T {
  const found = [...new Set(Object.values(module).filter((value) => test(value)))];
  const [one] = found;

  if (one === undefined || found.length > 1) {
    throw new Error(
      `${from} exports ${String(found.length)} ${kind}s, and a standalone product takes one.`,
    );
  }

  return one;
}

/**
 * Returns the definition of a product that runs one plugin, from the plugin's manifest module and
 * the module of each contract package beside it.
 *
 * @remarks
 *   The standalone layer of `vite-config-product` writes a definition that calls this with the
 *   modules it imports, so an author states package names and paths alone.
 * @param plugin - The module that exports the plugin's manifest.
 * @param beside - The module of each contract package installed beside the plugin.
 * @throws {@link Error} Where a module exports no manifest or contract, or several, naming the
 *   module.
 */
export function standaloneFrom(
  plugin: StandaloneModule,
  beside: readonly StandaloneModule[] = [],
): ProductDefinition {
  const manifest = oneOf(plugin, isManifest, "plugin manifest");

  return standaloneProduct({
    beside: beside.map((one) => oneOf(one, isContract, "plugin contract")),
    contract: manifest.contract,
    manifest,
  });
}

/**
 * Returns the sources of a standalone product's host: a signed-in session with every permission and
 * entitlement the product declares, every check on one resource the session's permissions admit
 * allowed, every boolean flag on and every experiment at its default.
 *
 * @param product - The permissions and entitlements the installed plugins declare.
 */
export function standaloneSources(
  product: Pick<ResolvedProduct, "entitlements" | "permissions">,
): StandaloneSources {
  const session = kept<Session>({
    authenticated: true,
    entitlements: product.entitlements.map(({ id }) => id),
    permissions: product.permissions.map(({ id }) => id),
    roles: [],
  });
  const decider = kept<Decider | undefined>(allowed);

  /**
   * Returns true where the session has the permission a check names.
   */
  const permitted = ({ permission }: AccessCheck): boolean =>
    session.get().permissions.includes(permission);

  return {
    access: {
      allow: () => {
        decider.set(allowed);
      },
      check: (checks) => {
        const decide = decider.get();

        return decide === undefined
          ? PENDING
          : Promise.resolve(checks.map((check) => permitted(check) && decide(check)));
      },
      decide: decider.set,
      deny: () => {
        decider.set(denied);
      },
      pending: () => {
        decider.set(undefined);
      },
      subscribe: (listener) => {
        const stops = [decider.subscribe(listener), session.subscribe(listener)];

        return () => {
          for (const stop of stops) stop();
        };
      },
    },
    flags: FLAGS,
    session: { read: session.get, set: session.set, subscribe: session.subscribe },
  };
}
