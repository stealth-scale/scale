/**
 * Renders the rail's cell of an entry, which contains the indicator and draws the rail down the
 * entry.
 */

import { type ComponentProps } from "react";

import { withContext } from "#timeline/context.ts";

/**
 * Renders the connector `div` in the root's middle column.
 */
export const Connector = withContext("div", "connector");

/**
 * Describes the props of `Connector`.
 */
export type ConnectorProps = ComponentProps<typeof Connector>;
