/**
 * Declares what a command's function runs with beside its arguments: the host as its plugin sees
 * it at the time of the run.
 *
 * @remarks
 *   Every member is structural, so the host passes its own toaster, data client and router behind
 *   it, and a command's module depends on this package alone.
 */

import { type PermissionReference } from "#access.ts";
import { type EventPayload, type EventReference } from "#command.ts";
import {
  type MutationData,
  type MutationReference,
  type MutationVariables,
  type QueryData,
  type QueryReference,
  type QueryVariables,
} from "#data.ts";
import { type FlagReference } from "#flag.ts";
import { type PathParams, type RouteReference } from "#route.ts";
import { type Session } from "#session.ts";

/**
 * Describes a toast: its words, its kind and how long it shows.
 */
export interface ToastOptions {
  /**
   * The toast's body, translated.
   */
  readonly description?: string | undefined;

  /**
   * Milliseconds the toast shows. The toaster's duration for the kind where left out.
   */
  readonly duration?: number | undefined;

  /**
   * The toast's title, translated.
   */
  readonly title?: string | undefined;

  /**
   * Kind of the toast, which its look and its duration follow.
   */
  readonly type?: "error" | "info" | "loading" | "success" | "warning" | undefined;
}

/**
 * Raises and dismisses the product's toasts. The feedback package's `createToaster` returns one.
 */
export interface Toaster {
  /**
   * Raises a toast and returns its id.
   */
  readonly create: (options: ToastOptions) => string;

  /**
   * Dismisses the toast with the id given, or every toast without one.
   */
  readonly dismiss: (id?: string) => void;
}

/**
 * Lists what a navigation states beside the route: the parameters its path names and its search.
 */
export interface NavigateOptions<Params extends PathParams = PathParams, Search = unknown> {
  /**
   * The parameters the route's path names, typed by the reference.
   */
  readonly params?: Params | undefined;

  /**
   * The search to open the route with, typed by the reference.
   */
  readonly search?: Search | undefined;
}

/**
 * Runs declared queries and mutations through the host's data client, with each declaration's
 * selectors and sample applied.
 */
export interface HostData {
  /**
   * Runs a mutation with its variables and resolves with its data.
   */
  readonly mutate: <M extends MutationReference>(
    mutation: M,
    variables: MutationVariables<M>,
  ) => Promise<MutationData<M>>;

  /**
   * Runs a query with its variables and resolves with its data, from the cache while it is fresh.
   */
  readonly query: <Q extends QueryReference>(
    query: Q,
    variables: QueryVariables<Q>,
  ) => Promise<QueryData<Q>>;
}

/**
 * Lists what a command's function receives beside its arguments and the commands it needs.
 */
export interface HostApi {
  /**
   * Resolves whether the person has a permission: on the resource where a resource id is given
   * for a scoped permission, and for the tenant otherwise.
   */
  readonly can: (permission: PermissionReference, resourceId?: string) => Promise<boolean>;

  /**
   * The host's data client, for declared queries and mutations.
   */
  readonly data: HostData;

  /**
   * Emits an event as the command's plugin.
   */
  readonly emit: <E extends EventReference>(event: E, payload: EventPayload<E>) => void;

  /**
   * Returns a flag's value for the session.
   */
  readonly flag: <V extends boolean | string>(flag: FlagReference<V>) => V;

  /**
   * Qualified id of the deepest matched route, or undefined outside a declared page.
   */
  readonly matched: string | undefined;

  /**
   * Navigates to a route by reference, with its parameters and its search.
   */
  readonly navigate: <Params extends PathParams, Search>(
    to: RouteReference<string, Params, Search>,
    options?: NavigateOptions<Params, NoInfer<Search>>,
  ) => Promise<void>;

  /**
   * Id of the command's plugin.
   */
  readonly pluginId: string;

  /**
   * The session at the time of the run.
   */
  readonly session: Session;

  /**
   * Translates a key of the plugin's catalogue in the person's language.
   */
  readonly t: (key: string, values?: Readonly<Record<string, unknown>>) => string;

  /**
   * The product's toaster, to report the outcome of the run.
   */
  readonly toaster: Toaster;
}
