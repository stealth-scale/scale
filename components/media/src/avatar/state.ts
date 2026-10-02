/**
 * Provides the name an avatar's fallback reads, the variants a group gives its avatars, and the
 * setter through which a badge describes its avatar.
 */

import { createContext, type Dispatch, type SetStateAction, use } from "react";

import { type RecipeProps } from "@stealthscale/theme/authoring";

import { type recipe } from "#avatar/recipe.ts";

/**
 * Describes the variants a group gives every avatar in it that states none.
 */
export type Defaults = Pick<RecipeProps<typeof recipe>, "palette" | "shape" | "size" | "variant">;

/**
 * Describes the setter of the IDs of the badges that describe an avatar.
 */
export type Describe = Dispatch<SetStateAction<readonly string[]>>;

/**
 * Context through which the root provides its `name` to the fallback.
 */
export const NameContext = createContext<string | undefined>(undefined);

/**
 * Context through which a group provides its variants to the avatars in it.
 */
export const DefaultsContext = createContext<Defaults | undefined>(undefined);

/**
 * Context through which the root provides the setter of the IDs that describe it.
 */
export const DescribeContext = createContext<Describe | undefined>(undefined);

/**
 * Returns the name of the avatar around the caller.
 *
 * @returns The root's `name`, or undefined when the root has none.
 */
export function useAvatarName(): string | undefined {
  return use(NameContext);
}

/**
 * Returns the variants of the group around the caller.
 *
 * @returns The group's variants, or an empty object outside a group.
 */
export function useDefaults(): Defaults {
  return use(DefaultsContext) ?? {};
}

/**
 * Returns the setter of the IDs that describe the avatar around the caller.
 *
 * @returns The root's setter, or undefined outside a root.
 */
export function useDescribe(): Describe | undefined {
  return use(DescribeContext);
}
