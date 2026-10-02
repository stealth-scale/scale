/**
 * Types a plugin's declaration against its contract: an entry for every name that needs code, each
 * checked against what the contract states about the name.
 *
 * @remarks
 *   A name the contract declares with no entry fails to compile, and so does an entry for a name it
 *   does not declare. A component whose props differ from its target's fails too, as does a command
 *   function whose arguments, needs or result differ from its marker's.
 */

import {
  type CommandEntry,
  type ExtensionEntry,
  type LazyCommand,
  type LazyComponent,
  type RouteCode,
  type RoutedProps,
  type SettingsEntry,
  type SettingsSectionProps,
  type TargetedProps,
  type WrapProps,
} from "#code.ts";
import { type CommandArgs, type CommandArguments, type CommandResult } from "#command.ts";
import { type AnyContract } from "#contract.ts";
import { type Reference, type ReferenceKind } from "#reference.ts";
import { type RouteReference } from "#route.ts";
import {
  type EveryTarget,
  type ExtensionReference,
  type Placed,
  type SlotReference,
} from "#slot.ts";

/**
 * Types the props a target renders its extensions with: a slot's props, a route's id, a decorated
 * extension's props, or any props for every member of a kind.
 */
export type PropsOf<T> =
  T extends SlotReference<string, infer Props>
    ? Props
    : T extends RouteReference
      ? RoutedProps
      : T extends ExtensionReference<string, infer Props>
        ? Props
        : T extends EveryTarget
          ? Readonly<Record<string, unknown>>
          : never;

/**
 * Types what an extension renders with: its target's props, the target's id, and what it wraps
 * where it wraps.
 */
export type ExtensionProps<T, Position> = (Position extends "wrap" ? WrapProps : object) &
  PropsOf<T> &
  TargetedProps;

/**
 * Types what a command's function receives as its needs: each needed command as a function that
 * runs it.
 */
export type ResolvedNeeds<Needs> = {
  readonly [Name in keyof Needs]: (
    ...args: CommandArguments<Needs[Name]>
  ) => Promise<CommandResult<Needs[Name]>>;
};

/**
 * Keys a kind's entries under it, or states nothing where the contract declares none of the kind.
 */
type Keyed<K extends string, Entries> = [keyof Entries] extends [never]
  ? object
  : { readonly [Key in K]: Entries };

/**
 * Types the settings sections a contract declares.
 */
type Sections<C extends AnyContract> = C["settings"]["sections"];

/**
 * Describes a section reference by its schema alone.
 */
interface Schematic<Schema> {
  /**
   * The section's schema, or undefined for a section that renders a component.
   */
  readonly schema?: Schema;
}

/**
 * Returns true, as a type, where a section states no schema and so renders a component.
 */
type Schemaless<S> =
  S extends Schematic<infer Schema> ? ([NonNullable<Schema>] extends [never] ? true : false) : true;

/**
 * Describes the entry of a settings section that renders a component.
 */
interface ComponentSection extends SettingsEntry {
  /**
   * Imports the section's component.
   */
  readonly component: LazyComponent<SettingsSectionProps>;
}

/**
 * Types the entries of the sections that render a component: one per section, each required.
 */
type ComponentSections<C extends AnyContract> = {
  readonly [
    N in keyof Sections<C> as Schemaless<Sections<C>[N]> extends true ? N : never
  ]: ComponentSection;
};

/**
 * Types the entries of the sections a schema renders: each optional, for its migrations.
 */
type SchemaSections<C extends AnyContract> = {
  readonly [
    N in keyof Sections<C> as Schemaless<Sections<C>[N]> extends true ? never : N
  ]?: SettingsEntry;
};

/**
 * Keys the settings entries: required where a section renders a component, optional otherwise.
 */
type Settings<C extends AnyContract> = [keyof ComponentSections<C>] extends [never]
  ? { readonly [Key in "settings"]?: SchemaSections<C> }
  : { readonly [Key in "settings"]: ComponentSections<C> & SchemaSections<C> };

/**
 * Describes a plugin's declaration against its contract: one entry per route, extension and
 * command, and one per settings section that renders a component, keyed by the contract's names.
 */
export type PluginDeclaration<C extends AnyContract> = Keyed<
  "commands",
  { readonly [Name in keyof C["commands"]]: CommandEntry }
> &
  Keyed<"extensions", { readonly [Name in keyof C["extensions"]]: ExtensionEntry }> &
  Keyed<"routes", { readonly [Name in keyof C["routes"]]: RouteCode }> &
  Settings<C>;

/**
 * Types the reference a contract declares under a qualified id, or never where it declares none.
 */
type DeclaredAs<References, Id extends string> = {
  [Name in keyof References]: References[Name] extends Reference<ReferenceKind, Id>
    ? References[Name]
    : never;
}[keyof References];

/**
 * Types a target as the contract types it. A reference from `self` states the qualified id alone,
 * and becomes the slot or the extension the contract declares under that id.
 */
type Resolved<C extends AnyContract, Target> =
  Target extends SlotReference<infer Id>
    ? [DeclaredAs<C["slots"], Id>] extends [never]
      ? Target
      : DeclaredAs<C["slots"], Id>
    : Target extends ExtensionReference<infer Id>
      ? [DeclaredAs<C["extensions"], Id>] extends [never]
        ? Target
        : DeclaredAs<C["extensions"], Id>
      : Target;

/**
 * Types every extension's entry, with the component and the fallback checked against the props its
 * target renders it with.
 */
type Components<C extends AnyContract> = Keyed<
  "extensions",
  {
    readonly [Name in keyof C["extensions"]]: C["extensions"][Name] extends Placed<
      infer Target,
      infer Position
    >
      ? ExtensionEntry<ExtensionProps<Resolved<C, Target>, Position>>
      : never;
  }
>;

/**
 * Describes a command's entry by the commands it needs alone.
 */
interface Needing<Needs> {
  /**
   * The commands the command's function runs, by the name it reads each under.
   */
  readonly needs: Needs;
}

/**
 * Types the commands a declaration's entry states a command needs, or none.
 */
type NeedsOf<D, Name> = "commands" extends keyof D
  ? Name extends keyof D["commands"]
    ? D["commands"][Name] extends Needing<infer Needs>
      ? Needs
      : object
    : object
  : object;

/**
 * Describes a command's entry as the declaration checks it.
 */
interface Checked<Args, Needs, Result> {
  /**
   * Imports the command's function, checked against its arguments, its needs and its result.
   */
  readonly run: LazyCommand<Args, Needs, Result>;
}

/**
 * Types every command's entry, with the function checked against the marker's arguments and
 * result and the needs the entry states.
 */
type Runs<C extends AnyContract, D> = Keyed<
  "commands",
  {
    readonly [Name in keyof C["commands"]]: Checked<
      CommandArgs<C["commands"][Name]>,
      ResolvedNeeds<NeedsOf<D, Name>>,
      CommandResult<C["commands"][Name]>
    >;
  }
>;

/**
 * Types each name a declaration lists against the contract: a name the contract does not declare
 * is `never`.
 */
type Named<C extends AnyContract, D> = {
  readonly [K in "commands" | "extensions" | "routes"]?: {
    readonly [Name in keyof D[K & keyof D]]: Name extends keyof C[K] ? unknown : never;
  };
} & {
  readonly [K in "settings"]?: {
    readonly [Name in keyof D[K & keyof D]]: Name extends keyof Sections<C> ? unknown : never;
  };
};

/**
 * Types everything `definePlugin` checks a declaration against beside its shape.
 */
export type Verified<C extends AnyContract, D> = Components<C> & Named<C, D> & Runs<C, D>;
