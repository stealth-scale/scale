/**
 * Links the chart's caption to its figure: the ID the caption takes, and the report that a caption
 * renders.
 *
 * @remarks
 *   Chromium names a `figure` by its `figcaption` only through `aria-labelledby` (measured
 *   2026-09-28 with the caption as the first and as the last child), so the root points the
 *   attribute at the caption while one renders, and at nothing otherwise.
 */

import { createLabelling, createRequiredContext } from "@stealthscale/hooks";

/**
 * Provides the ID the caption takes, and reads it in the caption.
 */
export const [CaptionProvider, useCaptionId] = createRequiredContext<string>("Chart.Root");

/**
 * Provides the root's setter a caption reports to, and the hook the caption calls.
 */
export const [LabellingProvider, useLabelled] = createLabelling("Chart.Root");
