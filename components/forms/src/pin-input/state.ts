/**
 * Provides whether the pin input's label is rendered.
 *
 * @remarks
 *   The root points `aria-labelledby` at `PinInput.Label` only while a label is mounted, because an
 *   ID reference to an element that does not exist is invalid.
 */

import { createLabelling } from "@stealthscale/hooks";

/**
 * Provides the setter the label reports its mounting through, and the hook the label calls.
 *
 * @remarks
 *   `useLabelled` throws for a label rendered outside a root.
 */
export const [LabellingProvider, useLabelled] = createLabelling("PinInput");
