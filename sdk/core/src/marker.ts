/**
 * Defines what every marker states beside its own members.
 *
 * @remarks
 *   A marker is a plain object that states one name. Its function types the argument and adds the
 *   kind. A helper such as `props` or `params` returns an object whose type records a type
 *   argument, and the marker's options spread it, so TypeScript infers every type parameter of the
 *   marker from its one argument. An explicit type argument would stop that inference.
 */

/**
 * Lists what any marker may state beside its own members.
 */
export interface MarkerOptions {
  /**
   * Marks the name as deprecated, with what to use instead.
   *
   * @remarks
   *   The build warns once for every plugin that still references the name.
   */
  readonly deprecated?: string | undefined;
}
