/**
 * Reports why an operation failed, in the kinds the rest of an application acts on.
 */

/**
 * Lists the ways an operation fails.
 */
export type DataErrorKind =
  | "conflict"
  | "forbidden"
  | "invalid"
  | "network"
  | "not-found"
  | "server"
  | "unauthenticated";

/**
 * Describes one value a service refused, as a form places it under its field.
 *
 * @remarks
 *   The shape is the one a form's schema reports, so a form translates the keyword of a refusal
 *   the way it translates a schema keyword.
 */
export interface DataIssue {
  /**
   * The service's code for the refusal, which a form translates like a schema keyword.
   */
  readonly keyword: string;

  /**
   * The service's own words, for development.
   */
  readonly message: string;

  /**
   * Path of the refused value, segment by segment. Empty for the whole submission.
   */
  readonly path: ReadonlyArray<number | string>;

  /**
   * Values the message reads, such as a limit.
   */
  readonly values: Readonly<Record<string, unknown>>;
}

/**
 * Lists what a data error is created from.
 */
export interface DataErrorOptions {
  /**
   * The error that caused this one, such as the failed fetch.
   */
  readonly cause?: unknown;

  /**
   * Each refused value, for `invalid`.
   */
  readonly issues?: readonly DataIssue[] | undefined;

  /**
   * The way the operation failed.
   */
  readonly kind: DataErrorKind;

  /**
   * The message, for development.
   */
  readonly message: string;

  /**
   * Id of the operation that failed.
   */
  readonly operation: string;

  /**
   * The HTTP status, where a response arrived.
   */
  readonly status?: number | undefined;
}

/**
 * Reports why an operation failed.
 */
export class DataError extends Error {
  /**
   * Each refused value, for `invalid`. Empty for every other kind.
   */
  readonly issues: readonly DataIssue[];

  /**
   * The way the operation failed.
   */
  readonly kind: DataErrorKind;

  /**
   * Id of the operation that failed.
   */
  readonly operation: string;

  /**
   * The HTTP status, where a response arrived.
   */
  readonly status?: number | undefined;

  /**
   * Creates the error from its kind, its operation and its message.
   *
   * @param options - The kind, the operation, the message, and the issues, status and cause where
   *   known.
   */
  constructor(options: DataErrorOptions) {
    super(options.message, { cause: options.cause });

    this.name = "DataError";
    this.issues = options.issues ?? [];
    this.kind = options.kind;
    this.operation = options.operation;
    this.status = options.status;
  }
}

/**
 * The kind of failure each GraphQL error code a gateway returns reports.
 */
const BY_CODE: Readonly<Record<string, DataErrorKind>> = {
  BAD_USER_INPUT: "invalid",
  CONFLICT: "conflict",
  FORBIDDEN: "forbidden",
  NOT_FOUND: "not-found",
  UNAUTHENTICATED: "unauthenticated",
};

/**
 * The kind of failure each HTTP status reports, where a response contains no GraphQL error.
 */
const BY_STATUS: Readonly<Record<number, DataErrorKind>> = {
  400: "invalid",
  401: "unauthenticated",
  403: "forbidden",
  404: "not-found",
  409: "conflict",
  422: "invalid",
};

/**
 * Returns the kind of a failure from the first GraphQL error's code, or from the status where the
 * response contains no GraphQL error.
 *
 * @param code - The first GraphQL error's `extensions.code`, where the response contains one.
 * @param status - The response's HTTP status.
 * @returns The kind. A code or a status the table does not list is `server`.
 */
export function kindOf(code: string | undefined, status: number): DataErrorKind {
  if (code !== undefined) return BY_CODE[code] ?? "server";

  return BY_STATUS[status] ?? "server";
}

/**
 * Lists a refusal's issues by the name of the field each one refuses, as a form's submit validator
 * returns them.
 */
export interface FieldErrors {
  /**
   * The issue for each refused field, keyed by the field's name: `lines[0].amount`.
   */
  readonly fields: Readonly<Record<string, DataIssue>>;

  /**
   * The issue that refuses the whole submission, where the service returned one.
   */
  readonly form?: DataIssue | undefined;
}

/**
 * Writes a path the way a form names a field: members joined by dots, indexes in brackets.
 *
 * @param path - The path, segment by segment.
 * @returns The field's name, as `lines[0].amount` for `["lines", 0, "amount"]`.
 */
function nameOf(path: ReadonlyArray<number | string>): string {
  let name = "";

  for (const segment of path) {
    if (typeof segment === "number") name += `[${String(segment)}]`;
    else name += name === "" ? segment : `.${segment}`;
  }

  return name;
}

/**
 * Returns a refusal's issues keyed by field name, as a form's submit validator returns them.
 *
 * @remarks
 *   The first issue for a field is kept, because a form renders one message under a field. An issue
 *   with an empty path refuses the whole submission and is returned as `form`.
 * @param error - The value a mutation rejected with, of any type.
 * @returns The issues, or nothing where the error is not an `invalid` refusal.
 */
export function fieldErrorsOf(error: unknown): FieldErrors | undefined {
  if (!(error instanceof DataError) || error.kind !== "invalid") return undefined;

  const fields: Record<string, DataIssue> = {};
  let form: DataIssue | undefined;

  for (const issue of error.issues) {
    const name = nameOf(issue.path);

    if (name === "") form ??= issue;
    else fields[name] ??= issue;
  }

  return form === undefined ? { fields } : { fields, form };
}
