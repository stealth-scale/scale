/**
 * Renders the line under the name: a plan, an environment or a role.
 *
 * @remarks
 *   The detail tells two things with the same name apart, so it is part of the control's accessible
 *   name. Leave it out when the name is unique. The toolbar placement hides it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#switcher/context.ts";

/**
 * Renders the detail `span` at the switcher's size.
 */
export const Detail = withContext("span", "detail");

/**
 * Describes the props of `Detail`.
 */
export type DetailProps = ComponentProps<typeof Detail>;
