/**
 * Describes a route as a host declares it, in the form the compiler takes.
 */

import { type FunctionComponent, type ReactNode } from "react";

import { type StandardSchemaV1 } from "@standard-schema/spec";

import { type AnyParams } from "#reference.ts";

/**
 * Loads a page on the first navigation to it.
 *
 * @remarks
 *   The importer is a member of an object, because a React component is a function too and nothing
 *   at run time tells one from an importer.
 */
export interface LazyPage {
  /**
   * The export the page is published under. The module's default export where it states none.
   */
  readonly export?: string | undefined;

  /**
   * Imports the module that exports the page.
   */
  readonly load: () => Promise<Readonly<Record<string, FunctionComponent>>>;
}

/**
 * Validates a route's search string and types the values its page reads.
 *
 * @remarks
 *   Any library that implements Standard Schema provides one. This package depends on the
 *   specification's types alone, so a declaration takes a validator from any such library.
 */
export type SearchValidator<Search = unknown> = StandardSchemaV1<unknown, Search>;

/**
 * Describes the props of a layout, which renders a frame around the route below it.
 */
export interface LayoutProps {
  /**
   * The route below the layout, which React renders inside the frame.
   */
  readonly children?: ReactNode | undefined;

  /**
   * The options the declaration stated for this layout, passed through untouched.
   */
  readonly options?: Readonly<Record<string, unknown>> | undefined;
}

/**
 * Lists what a declared route's loader receives.
 */
export interface RouteLoaderArgs {
  /**
   * The route's context, which contains whatever the application put in the router's context.
   */
  readonly context: unknown;

  /**
   * The parameters the route's path names.
   */
  readonly params: AnyParams;

  /**
   * True where the router loads the route ahead of a navigation.
   */
  readonly preload: boolean;

  /**
   * The route's search, as its validator returned it.
   */
  readonly search: unknown;

  /**
   * Signal that aborts when a later navigation supersedes this one.
   */
  readonly signal: AbortSignal;
}

/**
 * Loads a route's data before its page renders.
 */
export type RouteLoader = (args: RouteLoaderArgs) => Promise<void> | void;

/**
 * Describes one route a host declares, in the form the compiler takes.
 *
 * @remarks
 *   The condition is generic because this package cannot read a session and does not know the
 *   language conditions are written in. A host states its own and supplies the evaluator that reads
 *   it.
 */
export interface RouteDeclaration<Condition = unknown> {
  /**
   * The page, as a component or as a module that loads on the first navigation to it.
   */
  readonly component: FunctionComponent | LazyPage;

  /**
   * The id a host and a plugin refer to it by, which resolves to a path through the map.
   */
  readonly id: string;

  /**
   * The layouts the page renders in, by name, outermost first. The page renders in none where the
   * list is absent.
   */
  readonly layout?: readonly string[] | undefined;

  /**
   * Passed to each layout untouched, for whatever the layout reads.
   */
  readonly layoutOptions?: Readonly<Record<string, unknown>> | undefined;

  /**
   * Loads the route's data before its page renders, and again when its search changes.
   */
  readonly loader?: RouteLoader | undefined;

  /**
   * The menu entry a menu reads, which the compiler writes onto the route without reading.
   */
  readonly navigation?: unknown;

  /**
   * The pane the page renders in, which the compiler refuses, because a matched route renders the
   * whole screen.
   */
  readonly outlet?: string | undefined;

  /**
   * Another declaration it nests under, by id. The compiler's own parent where it names none.
   */
  readonly parent?: string | undefined;

  /**
   * The path pattern, relative to the parent, in the library's `$id` form.
   */
  readonly path: string;

  /**
   * A sample of the parameters, which a plugin's own tests open the page at.
   */
  readonly sample?: Readonly<Record<string, string>> | undefined;

  /**
   * Validates the route's search string, and types the values its page reads.
   */
  readonly search?: SearchValidator | undefined;

  /**
   * When it is routed at all. Routed always where it states none.
   */
  readonly when?: Condition | undefined;
}

/**
 * Describes the id a compiled route is named by, and the menu entry a menu reads from it.
 *
 * @remarks
 *   The compiler writes it into the route's `staticData`, which the library returns with every
 *   match. A menu, a breadcrumb or a telemetry hook reads the id from the match of the page on
 *   screen, and keeps no second copy of the list.
 */
export interface DeclaredRoute {
  /**
   * The id the route is named under.
   */
  readonly id: string;

  /**
   * The menu entry the declaration stated, passed through untouched.
   */
  readonly navigation?: unknown;
}

/**
 * Returns whether a route's condition is true for the router whose context is given.
 *
 * @remarks
 *   Returning false makes the route not found, because a route nobody may open does not exist. An
 *   evaluator that wants anything else, such as sending an unauthenticated person to sign in,
 *   throws the library's own `redirect` instead. The context is the route's, as `beforeLoad`
 *   receives it, so the evaluator reads the state of the router it runs in, and one tree serves
 *   every router built from it.
 */
export type Evaluate<Condition = unknown, Context = unknown> = (
  when: Condition,
  context: Context,
) => boolean;
