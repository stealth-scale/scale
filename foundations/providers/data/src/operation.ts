/**
 * Names the operations a gateway publishes, with their data and their variables in the type alone.
 */

/**
 * Lists the kinds of operation.
 */
export type OperationKind = "mutation" | "query" | "subscription";

/**
 * Types an operation that takes no variables.
 */
export type NoVariables = Readonly<Record<string, never>>;

/**
 * Describes one operation the gateway publishes, with its data and its variables in the type alone.
 *
 * @remarks
 *   The gateway runs only the documents a product published, and the browser sends the id alone,
 *   never a document's text. The id is opaque to the foundation: a build that hashes the documents
 *   writes the ids.
 */
export interface Operation<
  Data = unknown,
  Variables extends object = NoVariables,
  Kind extends OperationKind = OperationKind,
> {
  /**
   * Types of the operation's data and variables, for the type checker alone.
   */
  readonly "~types"?: {
    /**
     * The data the operation returns.
     */
    readonly data: Data;

    /**
     * The variables the operation takes, which are JSON.
     */
    readonly variables: Variables;
  };

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
