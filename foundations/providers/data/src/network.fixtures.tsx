/**
 * Renders the page's connection, so a server can be asked what it renders.
 */

import { type ReactElement } from "react";

import { useNetwork } from "#network.ts";

/**
 * Renders `online` or `offline`.
 *
 * @returns The word, in an `i` element.
 */
export function Connection(): ReactElement {
  return <i>{useNetwork().online ? "online" : "offline"}</i>;
}
