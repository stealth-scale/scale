/**
 * Defines the reference that points at a declared name, and the kinds of name a contract declares.
 *
 * @remarks
 *   A reference contains the name's qualified id, its kind and the version of the contract it was
 *   made from. It contains no path and no code, so a plugin that imports another plugin's contract
 *   imports names and types alone.
 */

/**
 * Lists every kind of name a contract declares.
 */
export type ReferenceKind =
  | "command"
  | "entitlement"
  | "event"
  | "extension"
  | "featureFlag"
  | "menu"
  | "mutation"
  | "permission"
  | "query"
  | "resource"
  | "role"
  | "route"
  | "settingsPage"
  | "settingsSection"
  | "slot";

/**
 * Points at a name a plugin declared.
 */
export interface Reference<K extends ReferenceKind = ReferenceKind, Id extends string = string> {
  /**
   * The plugin id and the name, joined by a slash.
   */
  readonly id: Id;

  /**
   * The kind of the name.
   */
  readonly kind: K;

  /**
   * The version of the contract the reference was made from, where the contract states one.
   */
  readonly version?: string | undefined;
}

/**
 * Builds the qualified id of a name: the plugin id and the name, joined by a slash.
 */
export type QualifiedId<P extends string, N extends string> = `${P}/${N}`;
