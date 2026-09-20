/**
 * Registers the custom properties an animation interpolates and the one every scaled size reads.
 *
 * @remarks
 *   A browser animates a registered property between two values and leaves an unregistered one to
 *   jump, so the angle a moving border sweeps through is registered here with its type. The
 *   density is registered so it has a value of one wherever no attribute sets it and inherits
 *   into the subtree an attribute is set on. The compiler writes each registration once, at the
 *   top of the stylesheet.
 */

import { DENSITY } from "#draw/metrics.ts";
import { type Preset } from "#pandacss.ts";

/**
 * Describes the custom properties a preset registers.
 */
type GlobalVars = NonNullable<Preset["globalVars"]>;

/**
 * Lists the registered properties: the angle a conic gradient is drawn from, and the density
 * every scaled size is multiplied by.
 */
export const globalVars: GlobalVars = {
  extend: {
    "--angle": { inherits: false, initialValue: "0deg", syntax: "<angle>" },
    [DENSITY]: { inherits: true, initialValue: "1", syntax: "<number>" },
  },
};
