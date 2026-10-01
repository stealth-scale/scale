/**
 * Describes a product as the build resolved it: every installed plugin's declarations, checked,
 * qualified and placed, as data a host starts from without running any check.
 *
 * @remarks
 *   Every member is data the build writes as a literal. The manifests, with their lazy importers
 *   and the contracts' search validators, travel beside it in `Product`.
 */

import { type When } from "#condition.ts";
import { type OperationKind, type Sampled } from "#data.ts";
import { type FlagKind } from "#flag.ts";
import { type PluginManifest } from "#manifest.ts";
import { type Problem } from "#resolve/problem.ts";
import { type PathParams } from "#route.ts";
import { type SettingsSchema } from "#settings.ts";
import { type ExtensionPosition } from "#slot.ts";
import { type Requirement } from "#version.ts";

/**
 * Describes one installed plugin as the host starts it.
 */
export interface ResolvedPlugin {
  /**
   * The configuration: the schema's defaults with the product's values over them.
   */
  readonly config: Readonly<Record<string, boolean | number | string>>;

  /**
   * True where the plugin's modules load before the first render.
   */
  readonly eager: boolean;

  /**
   * The switch's state before a person chooses.
   */
  readonly enabled: boolean;

  /**
   * Id of the plugin.
   */
  readonly id: string;

  /**
   * Qualified id of the plugin's kill switch: `host/plugin.<plugin id>`.
   */
  readonly killSwitch: string;

  /**
   * True where no person may switch the plugin off.
   */
  readonly locked: boolean;

  /**
   * The plugins it needs.
   */
  readonly requires: readonly Requirement[];

  /**
   * The contract's version, where it states one.
   */
  readonly version?: string | undefined;

  /**
   * The product's condition for the whole plugin.
   */
  readonly when?: undefined | When;
}

/**
 * Describes a menu entry as the build resolved it.
 */
export interface ResolvedNavigation {
  /**
   * Key of the entry's text in the plugin's catalogue.
   */
  readonly label: string;

  /**
   * Qualified id of the menu: the host's `main` where the marker names none.
   */
  readonly menu: string;

  /**
   * Rank of the entry, where the marker states one.
   */
  readonly order?: number | undefined;
}

/**
 * Describes one query a page reads, by qualified id.
 */
export interface ResolvedRouteData {
  /**
   * Qualified id of the query.
   */
  readonly query: string;

  /**
   * Variables the query takes from the route.
   */
  readonly variables: readonly string[];
}

/**
 * Describes a route as the build resolved it.
 */
export interface ResolvedRoute {
  /**
   * The queries the page reads.
   */
  readonly data: readonly ResolvedRouteData[];

  /**
   * Qualified id of the route.
   */
  readonly id: string;

  /**
   * Ids of the plugins whose chunks load with the page: those with an extension placed in a slot
   * the route's plugin declares, or targeting the route itself.
   */
  readonly loads: readonly string[];

  /**
   * Menu entry of the route.
   */
  readonly navigation?: ResolvedNavigation | undefined;

  /**
   * Qualified id of the route the page nests under.
   */
  readonly parent?: string | undefined;

  /**
   * Path pattern in the router's `$name` form.
   */
  readonly path: string;

  /**
   * Id of the plugin that declares the route.
   */
  readonly plugin: string;

  /**
   * Parameters the plugin's tests open the page at.
   */
  readonly sample?: PathParams | undefined;

  /**
   * The route's condition joined with the product's.
   */
  readonly when?: undefined | When;
}

/**
 * Describes a slot as the build resolved it.
 */
export interface ResolvedSlot {
  /**
   * `"one"` where the slot renders one contribution.
   */
  readonly arity?: "one" | undefined;

  /**
   * Qualified ids of the extensions placed in the slot, in order, after the manifests' and the
   * product's placements.
   */
  readonly extensions: readonly string[];

  /**
   * Qualified id of the slot.
   */
  readonly id: string;

  /**
   * True where the slot selects extensions by a value.
   */
  readonly keyed?: true | undefined;

  /**
   * Id of the plugin that declares the slot.
   */
  readonly plugin: string;

  /**
   * Qualified id of the resource kind the slot renders with.
   */
  readonly record?: string | undefined;

  /**
   * True where the slot is a host region, which renders without props.
   */
  readonly region: boolean;
}

/**
 * Describes an extension as the build resolved it.
 */
export interface ResolvedExtension {
  /**
   * True where the product leaves the extension out everywhere.
   */
  readonly disabled: boolean;

  /**
   * True where the manifest states a fallback.
   */
  readonly fallback: boolean;

  /**
   * Qualified id of the extension.
   */
  readonly id: string;

  /**
   * Value of a keyed slot the extension renders for.
   */
  readonly match?: string | undefined;

  /**
   * Rank among the extensions in the same position.
   */
  readonly order?: number | undefined;

  /**
   * Id of the plugin that declares the extension.
   */
  readonly plugin: string;

  /**
   * Position against the target.
   */
  readonly position: ExtensionPosition;

  /**
   * True where the product is wrong without the extension.
   */
  readonly required?: true | undefined;

  /**
   * Key of the target: `slot:<id>`, `route:<id>`, `extension:<id>` or `every:<kind>`.
   */
  readonly target: string;

  /**
   * The extension's condition.
   */
  readonly when?: undefined | When;
}

/**
 * Describes a command as the build resolved it.
 */
export interface ResolvedCommand {
  /**
   * Qualified id of the command.
   */
  readonly id: string;

  /**
   * Keys in TanStack Hotkeys notation, validated at build. Absent where the command binds none.
   */
  readonly keys?: string | undefined;

  /**
   * Key of the command's text in its plugin's catalogue.
   */
  readonly label: string;

  /**
   * Qualified ids of the commands the manifest's entry needs, by the name the function reads.
   */
  readonly needs: Readonly<Record<string, string>>;

  /**
   * Id of the plugin that declares the command.
   */
  readonly plugin: string;

  /**
   * True where the command resolves with a result, so the palette does not list it.
   */
  readonly returnsResult: boolean;

  /**
   * True where the command takes arguments, so a key and the palette cannot run it.
   */
  readonly takesArguments: boolean;

  /**
   * Condition under which the command may run.
   */
  readonly when?: undefined | When;
}

/**
 * Describes an event as the build resolved it.
 */
export interface ResolvedEvent {
  /**
   * Who may emit the event.
   */
  readonly emit: "anyone" | "owner";

  /**
   * Qualified id of the event.
   */
  readonly id: string;

  /**
   * Id of the plugin that declares the event.
   */
  readonly plugin: string;

  /**
   * True where a late subscriber receives the last payload.
   */
  readonly sticky: boolean;
}

/**
 * Describes a flag as the build resolved it, the kill switches included.
 */
export interface ResolvedFlag {
  /**
   * The contract's default.
   */
  readonly default: boolean | string;

  /**
   * Key of the flag's description in its plugin's catalogue.
   */
  readonly description: string;

  /**
   * Date by which the flag is removed, where it states one.
   */
  readonly expires?: string | undefined;

  /**
   * Qualified id of the flag.
   */
  readonly id: string;

  /**
   * The flag's kind.
   */
  readonly kind: FlagKind;

  /**
   * Id of the plugin that declares the flag: `host` for a kill switch.
   */
  readonly plugin: string;

  /**
   * The product's value, where the product states one.
   */
  readonly product?: boolean | string | undefined;

  /**
   * `"boolean"` for a release or an ops flag, `"string"` for an experiment.
   */
  readonly type: "boolean" | "string";

  /**
   * The variants of an experiment.
   */
  readonly variants?: readonly string[] | undefined;
}

/**
 * Describes a resource kind or an entitlement as the build resolved it.
 */
export interface ResolvedName {
  /**
   * Key of the description in the plugin's catalogue.
   */
  readonly description: string;

  /**
   * Qualified id of the name.
   */
  readonly id: string;

  /**
   * Id of the plugin that declares the name.
   */
  readonly plugin: string;
}

/**
 * Describes a permission as the build resolved it.
 */
export interface ResolvedPermission extends ResolvedName {
  /**
   * Qualified id of the resource kind a scoped permission is granted on.
   */
  readonly resource?: string | undefined;
}

/**
 * Describes a role as the build resolved it.
 */
export interface ResolvedRole extends ResolvedName {
  /**
   * Qualified ids of the permissions the role grants.
   */
  readonly permissions: readonly string[];
}

/**
 * Describes where a query's data contains records, by qualified ids.
 */
export interface ResolvedRecords {
  /**
   * Dotted path of the records in the data.
   */
  readonly at?: string | undefined;

  /**
   * Member of each record that contains its id.
   */
  readonly id: string;

  /**
   * True where a created record of the kind may join the list.
   */
  readonly list?: true | undefined;

  /**
   * Qualified id of the records' resource kind.
   */
  readonly type: string;
}

/**
 * Describes where a query's data states the person's actions, by qualified ids.
 */
export interface ResolvedDecisions {
  /**
   * Dotted path of the records in the data.
   */
  readonly at?: string | undefined;

  /**
   * Member of each record that is true where the person may take the action.
   */
  readonly field: string;

  /**
   * Member of each record that contains its id.
   */
  readonly id: string;

  /**
   * Qualified id of the scoped permission the member decides.
   */
  readonly permission: string;
}

/**
 * Describes which records a mutation changes, by qualified ids.
 */
export interface ResolvedChanges {
  /**
   * Whether the records are created, deleted or updated.
   */
  readonly action: "created" | "deleted" | "updated";

  /**
   * Name of the variable that contains the record's id.
   */
  readonly id?: string | undefined;

  /**
   * Qualified id of the records' resource kind.
   */
  readonly type: string;
}

/**
 * Describes an operation by its gateway id and its kind.
 */
export interface ResolvedOperation {
  /**
   * The id the gateway runs the operation under.
   */
  readonly id: string;

  /**
   * Whether the operation reads, changes or streams.
   */
  readonly kind: OperationKind;
}

/**
 * Describes a query or a mutation as the build resolved it.
 */
export interface ResolvedOperationDeclaration {
  /**
   * Qualified id of the declaration.
   */
  readonly id: string;

  /**
   * The operation it runs.
   */
  readonly operation: ResolvedOperation;

  /**
   * Id of the plugin that declares it.
   */
  readonly plugin: string;

  /**
   * The data and the variables tests and the standalone host serve.
   */
  readonly sample: Sampled<unknown, unknown>;
}

/**
 * Describes a query as the build resolved it.
 */
export interface ResolvedQuery extends ResolvedOperationDeclaration {
  /**
   * Where the data states the person's actions.
   */
  readonly decisions: readonly ResolvedDecisions[];

  /**
   * Where the data contains records.
   */
  readonly records: readonly ResolvedRecords[];

  /**
   * Milliseconds the data is fresh, where the query states it.
   */
  readonly staleTime?: number | undefined;
}

/**
 * Describes a mutation as the build resolved it.
 */
export interface ResolvedMutation extends ResolvedOperationDeclaration {
  /**
   * The records the mutation changes.
   */
  readonly changes: readonly ResolvedChanges[];
}

/**
 * Describes a settings page as the build resolved it.
 */
export interface ResolvedSettingsPage {
  /**
   * Qualified id of the page.
   */
  readonly id: string;

  /**
   * Key of the page's title in its plugin's catalogue.
   */
  readonly label: string;

  /**
   * Rank of the page in the settings menu.
   */
  readonly order?: number | undefined;

  /**
   * Id of the plugin that declares the page.
   */
  readonly plugin: string;

  /**
   * Condition under which the page is routed and listed.
   */
  readonly when?: undefined | When;
}

/**
 * Describes a settings section as the build resolved it.
 */
export interface ResolvedSettingsSection {
  /**
   * True where the section renders its manifest's component.
   */
  readonly component: boolean;

  /**
   * Qualified id of the section.
   */
  readonly id: string;

  /**
   * Key of the section's heading in its plugin's catalogue.
   */
  readonly label: string;

  /**
   * The versions the manifest's migrations read, ascending.
   */
  readonly migrations: readonly number[];

  /**
   * Rank of the section on its page.
   */
  readonly order?: number | undefined;

  /**
   * Id of the plugin that declares the section.
   */
  readonly plugin: string;

  /**
   * JSON Schema of the section's values, for a section the form renders.
   */
  readonly schema?: SettingsSchema | undefined;

  /**
   * Version of the schema, 1 where the marker states none.
   */
  readonly schemaVersion: number;

  /**
   * Qualified id of the page the section renders on.
   */
  readonly target: string;

  /**
   * Condition under which the section renders.
   */
  readonly when?: undefined | When;
}

/**
 * Lists the settings pages and sections of every installed plugin.
 */
export interface ResolvedSettings {
  /**
   * Every settings page, in install order.
   */
  readonly pages: readonly ResolvedSettingsPage[];

  /**
   * Every settings section, in install order.
   */
  readonly sections: readonly ResolvedSettingsSection[];
}

/**
 * Describes the data the build resolved for a product.
 */
export interface ResolvedProduct {
  /**
   * Every command, in install order.
   */
  readonly commands: readonly ResolvedCommand[];

  /**
   * Every entitlement.
   */
  readonly entitlements: readonly ResolvedName[];

  /**
   * Every event, the host's included.
   */
  readonly events: readonly ResolvedEvent[];

  /**
   * Every extension, in install order.
   */
  readonly extensions: readonly ResolvedExtension[];

  /**
   * Every flag, one kill switch per installed plugin included.
   */
  readonly flags: readonly ResolvedFlag[];

  /**
   * Every mutation.
   */
  readonly mutations: readonly ResolvedMutation[];

  /**
   * Key of the product's name in its own catalogue.
   */
  readonly name: string;

  /**
   * Every permission.
   */
  readonly permissions: readonly ResolvedPermission[];

  /**
   * Every installed plugin, in install order.
   */
  readonly plugins: readonly ResolvedPlugin[];

  /**
   * Id of the product.
   */
  readonly productId: string;

  /**
   * Every query.
   */
  readonly queries: readonly ResolvedQuery[];

  /**
   * Every resource kind.
   */
  readonly resources: readonly ResolvedName[];

  /**
   * Every role.
   */
  readonly roles: readonly ResolvedRole[];

  /**
   * Every route, the host's included.
   */
  readonly routes: readonly ResolvedRoute[];

  /**
   * Every settings page and section.
   */
  readonly settings: ResolvedSettings;

  /**
   * Qualified id of the sign-in route.
   */
  readonly signIn?: string | undefined;

  /**
   * Every slot, the host's included, by qualified id.
   */
  readonly slots: Readonly<Record<string, ResolvedSlot>>;

  /**
   * The product's version.
   */
  readonly version: string;

  /**
   * Faults that do not fail the build.
   */
  readonly warnings: readonly Problem[];

  /**
   * The product's condition, joined into every plugin route's but the sign-in route's.
   */
  readonly when?: undefined | When;
}

/**
 * Describes a product as `virtual:product` exports it: the resolved data, with each installed
 * plugin's manifest.
 */
export interface Product extends ResolvedProduct {
  /**
   * Each installed plugin's manifest, by plugin id.
   */
  readonly manifests: Readonly<Record<string, PluginManifest>>;
}

/**
 * Describes what resolving a product returns.
 */
export interface Resolution {
  /**
   * Faults that fail the build.
   */
  readonly problems: readonly Problem[];

  /**
   * The resolved product. Absent where a problem was found.
   */
  readonly product?: ResolvedProduct | undefined;

  /**
   * Faults that do not fail the build.
   */
  readonly warnings: readonly Problem[];
}
