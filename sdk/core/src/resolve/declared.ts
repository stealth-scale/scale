/**
 * Reads the declared names of one kind, each typed by its kind's marker.
 *
 * @remarks
 *   The shapes check has checked every reference against its kind's marker, so a reference read
 *   here has each member its marker requires.
 */

import {
  type EntitlementMarker,
  type PermissionMarker,
  type ResourceMarker,
  type RoleMarker,
} from "#access.ts";
import { type CommandMarker, type EventMarker } from "#command.ts";
import { type MutationMarker, type QueryMarker } from "#data.ts";
import { type FlagMarker } from "#flag.ts";
import { type Reference, type ReferenceKind } from "#reference.ts";
import { type Declaration, type ResolveContext } from "#resolve/context.ts";
import { type RouteMarker } from "#route.ts";
import { type SettingsPageMarker, type SettingsSectionMarker } from "#settings.ts";
import { type ExtensionMarker, type SlotMarker } from "#slot.ts";

/**
 * Lists the marker each kind's references spread.
 */
interface Markers {
  /**
   * The marker of a command.
   */
  readonly command: CommandMarker<unknown, unknown>;

  /**
   * The marker of an entitlement.
   */
  readonly entitlement: EntitlementMarker;

  /**
   * The marker of an event.
   */
  readonly event: EventMarker<unknown>;

  /**
   * The marker of an extension.
   */
  readonly extension: ExtensionMarker;

  /**
   * The marker of a feature flag.
   */
  readonly featureFlag: FlagMarker;

  /**
   * A menu, which has no marker beside its reference.
   */
  readonly menu: Reference<"menu">;

  /**
   * The marker of a mutation.
   */
  readonly mutation: MutationMarker;

  /**
   * The marker of a permission.
   */
  readonly permission: PermissionMarker;

  /**
   * The marker of a query.
   */
  readonly query: QueryMarker;

  /**
   * The marker of a resource kind.
   */
  readonly resource: ResourceMarker;

  /**
   * The marker of a role.
   */
  readonly role: RoleMarker;

  /**
   * The marker of a route.
   */
  readonly route: RouteMarker;

  /**
   * The marker of a settings page.
   */
  readonly settingsPage: SettingsPageMarker;

  /**
   * The marker of a settings section.
   */
  readonly settingsSection: SettingsSectionMarker;

  /**
   * The marker of a slot.
   */
  readonly slot: SlotMarker;
}

/**
 * Types a declared name's reference: its marker's members, with its qualified id and its kind.
 */
export type Declared<K extends ReferenceKind> = Omit<Markers[K], "kind"> & Reference<K>;

/**
 * Lists the declared names of one kind, the host's first, then in install order.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param kind - The kind of the names.
 */
export function declarationsOf<K extends ReferenceKind>(
  context: ResolveContext,
  kind: K,
): ReadonlyArray<Declaration<Declared<K>>> {
  const found = [...context.declared.values()].filter(({ reference }) => reference.kind === kind);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the shapes check has checked each reference against its kind's marker
  return found as unknown as ReadonlyArray<Declaration<Declared<K>>>;
}

/**
 * Returns the name of a kind declared under a qualified id.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param kind - The kind of the name.
 * @param id - The qualified id.
 * @returns The declared name, or undefined where no installed plugin declares it.
 */
export function declarationOf<K extends ReferenceKind>(
  context: ResolveContext,
  kind: K,
  id: string,
): Declaration<Declared<K>> | undefined {
  const found = context.declared.get(`${kind}:${id}`);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the shapes check has checked each reference against its kind's marker
  return found as Declaration<Declared<K>> | undefined;
}
