/**
 * Catalogue page for the chord diagram.
 *
 * @remarks
 *   The chord diagram has no recipe of its own: the chart's recipe styles its figure, so every
 *   scene is hand-written. The scenes render an hour of calls between five services with the
 *   loudest in the caption, the readout at a pair, a decade of moves between regions, a service
 *   that calls itself, an audit log that only receives, the exported layout, stated palettes, the
 *   calls at a phone's width, and a diagram without flows. Every scene renders a component from
 *   `examples/` and shows that file as its source. The words are keys under `chord-diagram` in
 *   `locales/en/specimen/chord-diagram.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as audit from "#chord-diagram/examples/audit.example.tsx";
import * as internal from "#chord-diagram/examples/internal.example.tsx";
import * as layout from "#chord-diagram/examples/layout.example.tsx";
import * as migration from "#chord-diagram/examples/migration.example.tsx";
import * as pair from "#chord-diagram/examples/pair.example.tsx";
import * as palette from "#chord-diagram/examples/palette.example.tsx";
import * as quiet from "#chord-diagram/examples/quiet.example.tsx";
import * as services from "#chord-diagram/examples/services.example.tsx";

/**
 * Hand-written scene for an hour of calls between five services.
 */
export const called: Scene = {
  about: "chord-diagram.services.about",
  draw: () => (
    <Room size="md">
      <services.Services />
    </Room>
  ),
  example: services,
  title: "chord-diagram.services.title",
};

/**
 * Hand-written scene for the readout at a pair of services.
 */
export const paired: Scene = {
  about: "chord-diagram.pair.about",
  draw: () => (
    <Room size="md">
      <pair.Pair />
    </Room>
  ),
  example: pair,
  title: "chord-diagram.pair.title",
};

/**
 * Hand-written scene for a decade of moves between four regions.
 */
export const moved: Scene = {
  about: "chord-diagram.migration.about",
  draw: () => (
    <Room size="md">
      <migration.Migration />
    </Room>
  ),
  example: migration,
  title: "chord-diagram.migration.title",
};

/**
 * Hand-written scene for a service that calls itself.
 */
export const requeued: Scene = {
  about: "chord-diagram.internal.about",
  draw: () => (
    <Room size="md">
      <internal.Internal />
    </Room>
  ),
  example: internal,
  title: "chord-diagram.internal.title",
};

/**
 * Hand-written scene for an audit log that only receives.
 */
export const logged: Scene = {
  about: "chord-diagram.audit.about",
  draw: () => (
    <Room size="md">
      <audit.Audit />
    </Room>
  ),
  example: audit,
  title: "chord-diagram.audit.title",
};

/**
 * Hand-written scene for a caption read from the exported layout.
 */
export const laid: Scene = {
  about: "chord-diagram.layout.about",
  draw: () => (
    <Room size="md">
      <layout.Layout />
    </Room>
  ),
  example: layout,
  title: "chord-diagram.layout.title",
};

/**
 * Hand-written scene for the services in stated palettes.
 */
export const tinted: Scene = {
  about: "chord-diagram.palette.about",
  draw: () => (
    <Room size="md">
      <palette.Palette />
    </Room>
  ),
  example: palette,
  title: "chord-diagram.palette.title",
};

/**
 * Hand-written scene for the calls at a phone's width.
 */
export const narrow: Scene = {
  about: "chord-diagram.narrow.about",
  draw: () => (
    <Room size="xs">
      <services.Services />
    </Room>
  ),
  example: services,
  title: "chord-diagram.narrow.title",
};

/**
 * Hand-written scene for a chord diagram without flows.
 */
export const empty: Scene = {
  about: "chord-diagram.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "chord-diagram.quiet.title",
};

export default specimen({
  about: "chord-diagram.about",
  id: "components/charts/chord-diagram",
  imports: 'import { ChordDiagram } from "@stealthscale/component-charts";',
  scenes: [called, paired, moved, requeued, logged, laid, tinted, narrow, empty],
  title: "chord-diagram.title",
});
