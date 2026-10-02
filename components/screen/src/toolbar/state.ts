/**
 * Provides the toolbar's measured width and its size to the controls in it.
 *
 * @remarks
 *   An action reads the width to fold itself into the row's menu, and the size to render the
 *   library's button at the toolbar's size.
 */

import { createRequiredContext } from "@stealthscale/hooks";
import { type Scale } from "@stealthscale/theme/authoring";

/**
 * Describes the state the toolbar provides.
 */
export interface ToolbarState {
  /**
   * Whether the toolbar is narrower than the `sm` breakpoint.
   */
  readonly narrow: boolean;

  /**
   * Size of the toolbar, which its buttons render at.
   */
  readonly size: Scale;
}

/**
 * Creates the context through which the root provides the toolbar state, with a reader that throws
 * outside a toolbar and one that returns `undefined` there.
 */
export const [ToolbarProvider, useToolbar, useEnclosingToolbar] =
  createRequiredContext<ToolbarState>("Toolbar");
