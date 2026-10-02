/**
 * Renders the name of the current workspace, project or environment.
 *
 * @remarks
 *   The name truncates instead of wrapping, so the control keeps one line.
 */

import { type ComponentProps } from "react";

import { withContext } from "#switcher/context.ts";

/**
 * Renders the name `span` at the switcher's size.
 */
export const Name = withContext("span", "name");

/**
 * Describes the props of `Name`.
 */
export type NameProps = ComponentProps<typeof Name>;
