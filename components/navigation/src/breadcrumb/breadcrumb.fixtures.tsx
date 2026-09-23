/**
 * Test fixtures for the breadcrumb parts, which read the variants from the root's provider.
 */

import { type ReactElement, type ReactNode } from "react";

import { Root } from "#breadcrumb/root.ts";

/**
 * Renders the part under test inside `Breadcrumb.Root`.
 */
export function trailed(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}
