/**
 * Configures the doc comment shape the formatter writes.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Writes a doc comment over several lines and ends each description with a full stop.
 *
 * @remarks
 *   The lint rules refuse a single-line block and check the wrap at a fixed indent. The formatter
 *   produces the form those rules accept, so `vp check --fix` never leaves a block the linter
 *   rejects.
 */
export function docblocks(): Preset {
  return preset({
    config: { fmt: { jsdoc: { commentLineStrategy: "multiline", descriptionWithDot: true } } },
    name: "fmt.docblocks",
  });
}
