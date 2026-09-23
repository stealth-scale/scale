/**
 * Renders the unit after the stat's figure, such as `hr` or `per week`.
 */

import { type ComponentProps } from "react";

import { withContext } from "#stat/context.ts";

/**
 * Renders the unit `span`.
 */
export const ValueUnit = withContext("span", "valueUnit");

/**
 * Describes the props of `ValueUnit`.
 */
export type ValueUnitProps = ComponentProps<typeof ValueUnit>;
