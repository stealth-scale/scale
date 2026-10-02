/**
 * Defines the condition a contract states as data, and evaluates it against a context.
 *
 * @remarks
 *   The evaluation is pure and synchronous, so the build, the host, the tests and a service in Node
 *   evaluate a condition the same way. A check that needs a service, such as a permission on one
 *   resource, is not a condition.
 */

import { type FlagReference } from "#flag.ts";
import { type Reference } from "#reference.ts";
import { type Session } from "#session.ts";

/**
 * Describes a value the record a slot renders with must have.
 */
export interface FieldCondition {
  /**
   * Value the record's value must equal, compared strictly.
   */
  readonly equals?: boolean | null | number | string | undefined;

  /**
   * True where the value must be present, and false where it must be absent. Present means
   * neither undefined, null nor an empty array.
   */
  readonly exists?: boolean | undefined;

  /**
   * Dotted path of the value in the record.
   */
  readonly path: string;
}

/**
 * Describes the variant an experiment must serve the session.
 */
export interface VariantCondition {
  /**
   * Qualified id of the experiment.
   */
  readonly flag: string;

  /**
   * The variant the experiment must serve.
   */
  readonly is: string;
}

/**
 * Describes the plugin a condition names: any object with the plugin's id, such as its contract.
 */
export interface NamedPlugin {
  /**
   * Id of the plugin.
   */
  readonly pluginId: string;
}

/**
 * Describes when a name applies. Every member stated must be true.
 */
export interface When {
  /**
   * Conditions that must all be true.
   */
  readonly allOf?: readonly When[] | undefined;

  /**
   * Conditions of which at least one must be true. An empty list is false.
   */
  readonly anyOf?: readonly When[] | undefined;

  /**
   * Whether somebody must be signed in, or must not be.
   */
  readonly authenticated?: boolean | undefined;

  /**
   * An entitlement the tenant must be licensed for.
   */
  readonly entitlement?: Reference<"entitlement"> | undefined;

  /**
   * A boolean flag that must be on for the session.
   */
  readonly featureFlag?: FlagReference<boolean> | undefined;

  /**
   * A value of the record the slot renders with. Allowed only in an extension whose target slot
   * states `record`.
   */
  readonly field?: FieldCondition | undefined;

  /**
   * A condition that must be false.
   */
  readonly not?: undefined | When;

  /**
   * A permission the person must have, for the tenant or for at least one resource.
   */
  readonly permission?: Reference<"permission"> | undefined;

  /**
   * A plugin that must be installed and on, named by its contract.
   */
  readonly plugin?: NamedPlugin | undefined;

  /**
   * A route that must be matched: the page is the route or a route nested under it.
   */
  readonly route?: Reference<"route"> | undefined;

  /**
   * An experiment's variant the session must be in, built with `flagIs`.
   */
  readonly variant?: undefined | VariantCondition;
}

/**
 * Lists the lookups a condition is evaluated against.
 */
export interface ConditionContext {
  /**
   * True when somebody is signed in.
   */
  readonly authenticated: boolean;

  /**
   * Returns whether the tenant is licensed for the entitlement.
   */
  readonly entitled: (id: string) => boolean;

  /**
   * Returns the value at a dotted path of the record a slot renders with. Present only while a slot
   * that states `record` evaluates its extensions' conditions.
   */
  readonly field?: ((path: string) => unknown) | undefined;

  /**
   * Returns the flag's value for the session: a boolean, or an experiment's variant.
   */
  readonly flag: (id: string) => boolean | string;

  /**
   * Ids of every matched route, outermost first. Undefined where no location applies.
   */
  readonly matched: ReadonlySet<string> | undefined;

  /**
   * Returns whether the plugin is installed and on.
   */
  readonly on: (pluginId: string) => boolean;

  /**
   * Returns whether the person has the permission, for the tenant or for at least one resource.
   */
  readonly permitted: (id: string) => boolean;
}

/**
 * Lists the lookups a context takes beside the session.
 */
export type ConditionLookups = Pick<ConditionContext, "field" | "flag" | "matched" | "on">;

/**
 * Checks one member of a condition, and returns true where the condition does not state it.
 */
type Check = (when: When, context: ConditionContext) => boolean;

/**
 * Returns true where a value is present: neither undefined, null nor an empty array.
 *
 * @param value - The value at a field's path.
 */
function isPresent(value: unknown): boolean {
  return value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0);
}

/**
 * Returns true where the record a slot renders with meets a field condition.
 *
 * @param field - The condition on one value of the record.
 * @param context - The context, whose `field` reads the record. False without one.
 */
function fieldMatches(field: FieldCondition, context: ConditionContext): boolean {
  if (context.field === undefined) return false;

  const value = context.field(field.path);

  return (
    (field.equals === undefined || value === field.equals) &&
    (field.exists === undefined || field.exists === isPresent(value))
  );
}

/**
 * The check of every member, in the order a condition lists them.
 */
const CHECKS: readonly Check[] = [
  ({ allOf }, context) => allOf === undefined || allOf.every((one) => evaluateWhen(one, context)),
  ({ anyOf }, context) => anyOf === undefined || anyOf.some((one) => evaluateWhen(one, context)),
  ({ authenticated }, context) =>
    authenticated === undefined || authenticated === context.authenticated,
  ({ entitlement }, context) => entitlement === undefined || context.entitled(entitlement.id),
  ({ featureFlag }, context) => featureFlag === undefined || context.flag(featureFlag.id) === true,
  ({ field }, context) => field === undefined || fieldMatches(field, context),
  ({ not }, context) => not === undefined || !evaluateWhen(not, context),
  ({ permission }, context) => permission === undefined || context.permitted(permission.id),
  ({ plugin }, context) => plugin === undefined || context.on(plugin.pluginId),
  ({ route }, context) => route === undefined || context.matched?.has(route.id) === true,
  ({ variant }, context) => variant === undefined || context.flag(variant.flag) === variant.is,
];

/**
 * Evaluates a condition. An absent condition, and a condition that states no member, are true.
 *
 * @param when - The condition, or undefined for none.
 * @param context - The session's lookups.
 * @returns True where every member the condition states is true.
 */
export function evaluateWhen(when: undefined | When, context: ConditionContext): boolean {
  return when === undefined || CHECKS.every((check) => check(when, context));
}

/**
 * Builds a variant condition that the type checker checks against the experiment's variants.
 *
 * @param flag - The experiment.
 * @param is - The variant the experiment must serve.
 * @returns The condition, for a `variant` member.
 */
export function flagIs<V extends string>(flag: FlagReference<V>, is: NoInfer<V>): VariantCondition {
  return { flag: flag.id, is };
}

/**
 * Builds a condition context from a session and the lookups beside it.
 *
 * @remarks
 *   The session's permissions and entitlements are put in sets once, so each check is one lookup
 *   however long the lists are. Build one context per session.
 * @param session - The session whose permissions and entitlements the context checks.
 * @param lookups - The flags, the plugins that are on, the matched routes and the record's fields.
 * @returns A context that checks the session's grants in sets.
 */
export function conditionContext(session: Session, lookups: ConditionLookups): ConditionContext {
  const entitlements = new Set(session.entitlements);
  const permissions = new Set(session.permissions);

  return {
    ...lookups,
    authenticated: session.authenticated,
    entitled: (id) => entitlements.has(id),
    permitted: (id) => permissions.has(id),
  };
}
