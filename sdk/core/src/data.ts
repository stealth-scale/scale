/**
 * Declares the operations a plugin runs, the queries and mutations its contract lists, and the
 * data a page needs.
 *
 * @remarks
 *   `Operation` is structurally the type the data foundation defines, so a contract package depends
 *   on no data library and a web package passes the same values to the foundation's functions.
 */

import { type PermissionReference, type ResourceRef, type ResourceReference } from "#access.ts";
import { type MarkerOptions } from "#marker.ts";
import { type Reference } from "#reference.ts";

/**
 * Lists the kinds of operation.
 */
export type OperationKind = "mutation" | "query" | "subscription";

/**
 * Types an operation that takes no variables.
 */
export type NoVariables = Readonly<Record<string, never>>;

/**
 * Records an operation's data and variables for the type checker.
 */
interface Typed<Data, Variables> {
  /**
   * The data the operation returns.
   */
  readonly data: Data;

  /**
   * The variables the operation takes, which are JSON.
   */
  readonly variables: Variables;
}

/**
 * Describes one operation the gateway publishes, with its data and its variables in the type alone.
 */
export interface Operation<
  Data = unknown,
  Variables extends object = NoVariables,
  Kind extends OperationKind = OperationKind,
> {
  /**
   * Types of the operation's data and variables, for the type checker alone.
   */
  readonly "~types"?: Typed<Data, Variables>;

  /**
   * The id the gateway runs the operation under: `<application>~<version>~<hash>`.
   */
  readonly id: string;

  /**
   * Whether the operation reads, changes or streams.
   */
  readonly kind: Kind;
}

/**
 * Defines a query, an operation that reads.
 *
 * @param id - The id the gateway runs the query under.
 * @returns The query, with its data and variables in its type.
 */
export function defineQuery<Data, Variables extends object = NoVariables>(
  id: string,
): Operation<Data, Variables, "query"> {
  return { id, kind: "query" };
}

/**
 * Defines a mutation, an operation that changes records.
 *
 * @param id - The id the gateway runs the mutation under.
 * @returns The mutation, with its data and variables in its type.
 */
export function defineMutation<Data, Variables extends object>(
  id: string,
): Operation<Data, Variables, "mutation"> {
  return { id, kind: "mutation" };
}

/**
 * Defines a subscription, an operation whose data arrives as a stream of events.
 *
 * @param id - The id the gateway runs the subscription under.
 * @returns The subscription, with the data of each event and its variables in its type.
 */
export function defineSubscription<Data, Variables extends object = NoVariables>(
  id: string,
): Operation<Data, Variables, "subscription"> {
  return { id, kind: "subscription" };
}

/**
 * Describes where a query's data states the person's actions on its records.
 */
export interface DecisionSelector {
  /**
   * Dotted path of the records in the data. The data itself where left out.
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
   * The scoped permission the member decides. Its resource kind is the records' kind.
   */
  readonly permission: PermissionReference<string, true>;
}

/**
 * Describes where a query's data contains records of one declared resource kind.
 */
export interface RecordSelector {
  /**
   * Dotted path of the records in the data. The data itself where left out.
   */
  readonly at?: string | undefined;

  /**
   * Member of each record that contains its id.
   */
  readonly id: string;

  /**
   * True where the records form a list that a created record of the kind may join.
   */
  readonly list?: true | undefined;

  /**
   * The records' resource kind.
   */
  readonly type: ResourceReference;
}

/**
 * Describes the data and the variables a test and the standalone host serve an operation with.
 */
export interface Sampled<Data, Variables> {
  /**
   * The data the operation resolves with.
   */
  readonly data: NoInfer<Data>;

  /**
   * The variables a page or a test runs the operation with.
   */
  readonly variables: NoInfer<Variables>;
}

/**
 * Describes a query a plugin runs.
 */
export interface QueryOptions<Data, Variables extends object> extends MarkerOptions {
  /**
   * Where the data states the person's actions on its records.
   */
  readonly decisions?: readonly DecisionSelector[] | undefined;

  /**
   * The operation the query runs.
   */
  readonly operation: Operation<Data, Variables, "query">;

  /**
   * Where the data contains records.
   */
  readonly records?: readonly RecordSelector[] | undefined;

  /**
   * The data tests and the standalone host serve, and the variables their pages run the query with.
   */
  readonly sample: Sampled<Data, Variables>;

  /**
   * Milliseconds the data is fresh. The client's 30 s where left out.
   */
  readonly staleTime?: number | undefined;
}

/**
 * Describes a query as its marker states it.
 */
export interface QueryMarker<
  Data = unknown,
  Variables extends object = object,
> extends QueryOptions<Data, Variables> {
  /**
   * The query's data and variables, for the type checker alone.
   */
  readonly "~types"?: Typed<Data, Variables>;

  /**
   * The kind of the marker.
   */
  readonly kind: "query";
}

/**
 * Points at a query a plugin declared, with its data and variables in the type.
 */
export interface QueryReference<
  Id extends string = string,
  Data = unknown,
  Variables extends object = object,
>
  extends Partial<QueryOptions<Data, Variables>>, Reference<"query", Id> {
  /**
   * The query's data and variables, for the type checker alone.
   */
  readonly "~types"?: Typed<Data, Variables>;
}

/**
 * Describes which records a mutation changes.
 */
export interface ChangeSelector {
  /**
   * Whether the records are created, deleted or updated.
   */
  readonly action: "created" | "deleted" | "updated";

  /**
   * Name of the variable that contains the record's id. Absent for `created`.
   */
  readonly id?: string | undefined;

  /**
   * The records' resource kind.
   */
  readonly type: ResourceReference;
}

/**
 * Describes a change to one record: its kind, its id, and whether it was created, deleted or
 * updated.
 */
export interface Change extends ResourceRef {
  /**
   * Whether the record was created, deleted or updated.
   */
  readonly action: "created" | "deleted" | "updated";
}

/**
 * Lists the changes of one batch: a mutation that settled, or one event of the changes stream.
 */
export interface ChangeBatch {
  /**
   * Each change, in the order the services made them.
   */
  readonly changes: readonly Change[];
}

/**
 * Describes a mutation a plugin runs.
 */
export interface MutationOptions<Data, Variables extends object> extends MarkerOptions {
  /**
   * The records the mutation changes, invalidated once it settles.
   */
  readonly changes?: readonly ChangeSelector[] | undefined;

  /**
   * The operation the mutation runs.
   */
  readonly operation: Operation<Data, Variables, "mutation">;

  /**
   * The data tests and the standalone host serve, and the variables they run the mutation with.
   */
  readonly sample: Sampled<Data, Variables>;
}

/**
 * Describes a mutation as its marker states it.
 */
export interface MutationMarker<
  Data = unknown,
  Variables extends object = object,
> extends MutationOptions<Data, Variables> {
  /**
   * The mutation's data and variables, for the type checker alone.
   */
  readonly "~types"?: Typed<Data, Variables>;

  /**
   * The kind of the marker.
   */
  readonly kind: "mutation";
}

/**
 * Points at a mutation a plugin declared, with its data and variables in the type.
 */
export interface MutationReference<
  Id extends string = string,
  Data = unknown,
  Variables extends object = object,
>
  extends Partial<MutationOptions<Data, Variables>>, Reference<"mutation", Id> {
  /**
   * The mutation's data and variables, for the type checker alone.
   */
  readonly "~types"?: Typed<Data, Variables>;
}

/**
 * Marks a query, with its operation, the records its data contains, and its sample.
 *
 * @param options - The operation, the selectors, the sample and the fresh time.
 * @returns The marker, with the operation's data and variables in its type.
 */
export function query<const Data, const Variables extends object>(
  options: QueryOptions<Data, Variables>,
): QueryMarker<Data, Variables> {
  return { ...options, kind: "query" };
}

/**
 * Marks a mutation, with its operation, the records it changes, and its sample.
 *
 * @param options - The operation, the changes and the sample.
 * @returns The marker, with the operation's data and variables in its type.
 */
export function mutation<const Data, const Variables extends object>(
  options: MutationOptions<Data, Variables>,
): MutationMarker<Data, Variables> {
  return { ...options, kind: "mutation" };
}

/**
 * Types the data of a query reference.
 */
export type QueryData<Q> = Q extends QueryReference<string, infer D> ? D : never;

/**
 * Types the variables of a query reference.
 */
export type QueryVariables<Q> = Q extends QueryReference<string, unknown, infer V> ? V : never;

/**
 * Types the data of a mutation reference.
 */
export type MutationData<M> = M extends MutationReference<string, infer D> ? D : never;

/**
 * Types the variables of a mutation reference.
 */
export type MutationVariables<M> =
  M extends MutationReference<string, unknown, infer V> ? V : never;

/**
 * Describes one query a page reads, and the names its variables take from the route.
 */
export interface RouteData<Name extends string = string> {
  /**
   * The query.
   */
  readonly query: Reference<"query">;

  /**
   * Variables the query takes from the route, each read from the parameters, then from the search.
   */
  readonly variables?: readonly Name[] | undefined;
}
