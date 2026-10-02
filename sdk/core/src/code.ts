/**
 * Declares the code a manifest maps a contract's names to: lazy importers of components and of
 * command functions, the props each component renders with, and the entries per kind.
 *
 * @remarks
 *   A component is a function of its props that returns what the host renders. This package
 *   imports no React types, so a component's return type is `unknown` here, and `sdk-plugin` types
 *   it as React's.
 */

import { type CommandReference } from "#command.ts";
import { type HostApi } from "#host-api.ts";

/**
 * Renders what a plugin contributes: a function of its props.
 */
export type PluginComponent<Props> = (props: Props) => unknown;

/**
 * Maps a module's export names to the one component it exports.
 */
export type ComponentModule<Props> = Readonly<Record<string, PluginComponent<Props>>>;

/**
 * Imports the module of one component on first use: `() => import("#overview.tsx")`.
 *
 * @remarks
 *   The module exports exactly one function, and the host renders it. `Props` defaults to `never`,
 *   which takes a module of any component.
 */
export type LazyComponent<Props = never> = () => Promise<ComponentModule<Props>>;

/**
 * Runs a command with its arguments, the commands it needs, and the host's API, and returns the
 * command's result.
 */
export type CommandRun<Args, Needs, Result = void> = (
  args: Args,
  needs: Needs,
  host: HostApi,
) => Promise<Result> | Result;

/**
 * Maps a module's export names to the one command function it exports.
 */
export type CommandModule<Args, Needs, Result> = Readonly<
  Record<string, CommandRun<Args, Needs, Result>>
>;

/**
 * Imports the module of one command on first use: `() => import("#approve.command.ts")`.
 *
 * @remarks
 *   The defaults take a module of any command function.
 */
export type LazyCommand<Args = never, Needs = never, Result = unknown> = () => Promise<
  CommandModule<Args, Needs, Result>
>;

/**
 * Describes what every extension renders with beside its target's own props.
 */
export interface TargetedProps {
  /**
   * Qualified id of the slot, route or extension the extension is attached to.
   */
  readonly targetId: string;
}

/**
 * Describes what an extension attached to a route renders with.
 */
export interface RoutedProps {
  /**
   * Qualified id of the route.
   */
  readonly routeId: string;
}

/**
 * Describes what a wrapping extension renders with beside its target's props.
 */
export interface WrapProps {
  /**
   * The content the extension wraps, already decorated. The host renders it with React, and
   * `never` takes any type a component states for its children.
   */
  readonly children: never;
}

/**
 * Describes what a settings section's component renders with.
 */
export interface SettingsSectionProps {
  /**
   * Qualified id of the section.
   */
  readonly sectionId: string;
}

/**
 * Lists a page's component and the component that renders in its place where it throws.
 */
export interface RouteEntry {
  /**
   * Imports the page. A routed component takes no props: it reads through hooks.
   */
  readonly component: LazyComponent<object>;

  /**
   * Imports the component that renders in the page's place after it throws, until the page is
   * quarantined.
   */
  readonly fallback?: LazyComponent<object> | undefined;
}

/**
 * Lists the code of a page: its component, or its component and a fallback.
 */
export type RouteCode = LazyComponent<object> | RouteEntry;

/**
 * Lists an extension's component and the component that renders in its place where it throws.
 */
export interface ExtensionEntry<Props = never> {
  /**
   * Imports the extension's component.
   */
  readonly component: LazyComponent<Props>;

  /**
   * Imports the component that renders in the extension's place after it throws, with the same
   * props.
   */
  readonly fallback?: LazyComponent<Props> | undefined;
}

/**
 * Lists the commands a command runs, by the name its function reads each under.
 */
export type CommandNeeds = Readonly<Record<string, CommandReference>>;

/**
 * Lists a command's function and the commands it runs.
 */
export interface CommandEntry<Needs extends CommandNeeds = CommandNeeds> {
  /**
   * The commands the function runs, each resolved to a function that runs it with its condition
   * checked.
   */
  readonly needs?: Needs | undefined;

  /**
   * Imports the command's function.
   */
  readonly run: LazyCommand;
}

/**
 * Turns a stored section's values of one version into the values of the next version.
 */
export type Migration = (
  values: Readonly<Record<string, unknown>>,
) => Readonly<Record<string, unknown>>;

/**
 * Lists a settings section's component and the migrations of its stored values.
 */
export interface SettingsEntry {
  /**
   * Imports the section's component. Required where the section states no schema.
   */
  readonly component?: LazyComponent<SettingsSectionProps> | undefined;

  /**
   * Migrations by the version each reads: the result is the next version's values.
   */
  readonly migrations?: Readonly<Record<number, Migration>> | undefined;
}

/**
 * Lists a manifest's code by kind and name.
 */
export interface PluginCode {
  /**
   * Command functions, by the command's name.
   */
  readonly commands?: Readonly<Record<string, CommandEntry>> | undefined;

  /**
   * Extension components, by the extension's name.
   */
  readonly extensions?: Readonly<Record<string, ExtensionEntry>> | undefined;

  /**
   * Pages, by the route's name.
   */
  readonly routes?: Readonly<Record<string, RouteCode>> | undefined;

  /**
   * Settings sections' components and migrations, by the section's name.
   */
  readonly settings?: Readonly<Record<string, SettingsEntry>> | undefined;
}
