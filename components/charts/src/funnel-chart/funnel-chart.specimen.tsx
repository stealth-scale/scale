/**
 * Catalogue page for the funnel chart.
 *
 * @remarks
 *   The funnel chart has no recipe of its own: the chart's recipe styles its figure, so every scene
 *   is hand-written. The scenes render a shop's checkout with its biggest loss in the caption, the
 *   tooltip at the last stage, the checkout counted from two queries, a hiring pipeline in a
 *   palette without the counts on its stages, an advert's funnel in compact counts, the checkout
 *   without its table, a trial of two stages, the checkout at a phone's width, the stages animated
 *   in with a replay, and a funnel without stages. Every scene renders a component from
 *   `examples/` and shows that file as its source. The words are keys under `funnel-chart` in
 *   `locales/en/specimen/funnel-chart.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as advert from "#funnel-chart/examples/advert.example.tsx";
import * as checkout from "#funnel-chart/examples/checkout.example.tsx";
import * as hiring from "#funnel-chart/examples/hiring.example.tsx";
import * as quiet from "#funnel-chart/examples/quiet.example.tsx";
import * as rates from "#funnel-chart/examples/rates.example.tsx";
import * as replay from "#funnel-chart/examples/replay.example.tsx";
import * as shape from "#funnel-chart/examples/shape.example.tsx";
import * as trial from "#funnel-chart/examples/trial.example.tsx";
import * as widening from "#funnel-chart/examples/widening.example.tsx";

/**
 * Hand-written scene for a shop's checkout, its biggest loss named in the caption.
 */
export const checkedOut: Scene = {
  about: "funnel-chart.checkout.about",
  draw: () => (
    <Room size="lg">
      <checkout.Checkout />
    </Room>
  ),
  example: checkout,
  title: "funnel-chart.checkout.title",
};

/**
 * Hand-written scene for the tooltip at the last stage.
 */
export const pointed: Scene = {
  about: "funnel-chart.rates.about",
  draw: () => (
    <Room size="lg">
      <rates.Rates />
    </Room>
  ),
  example: rates,
  title: "funnel-chart.rates.title",
};

/**
 * Hand-written scene for a funnel whose fourth stage widens.
 */
export const widened: Scene = {
  about: "funnel-chart.widening.about",
  draw: () => (
    <Room size="lg">
      <widening.Widening />
    </Room>
  ),
  example: widening,
  title: "funnel-chart.widening.title",
};

/**
 * Hand-written scene for a hiring pipeline in a palette, without the counts on its stages.
 */
export const tinted: Scene = {
  about: "funnel-chart.hiring.about",
  draw: () => (
    <Room size="lg">
      <hiring.Hiring />
    </Room>
  ),
  example: hiring,
  title: "funnel-chart.hiring.title",
};

/**
 * Hand-written scene for an advert's funnel in compact counts.
 */
export const compact: Scene = {
  about: "funnel-chart.advert.about",
  draw: () => (
    <Room size="lg">
      <advert.Advert />
    </Room>
  ),
  example: advert,
  title: "funnel-chart.advert.title",
};

/**
 * Hand-written scene for the checkout without its table.
 */
export const bare: Scene = {
  about: "funnel-chart.shape.about",
  draw: () => (
    <Room size="lg">
      <shape.Shape />
    </Room>
  ),
  example: shape,
  title: "funnel-chart.shape.title",
};

/**
 * Hand-written scene for a trial of two stages.
 */
export const paired: Scene = {
  about: "funnel-chart.trial.about",
  draw: () => (
    <Room size="lg">
      <trial.Trial />
    </Room>
  ),
  example: trial,
  title: "funnel-chart.trial.title",
};

/**
 * Hand-written scene for the checkout at a phone's width.
 */
export const narrow: Scene = {
  about: "funnel-chart.narrow.about",
  draw: () => (
    <Room size="xs">
      <checkout.Checkout />
    </Room>
  ),
  example: checkout,
  title: "funnel-chart.narrow.title",
};

/**
 * Hand-written scene for the stages animated in, with a replay.
 */
export const animated: Scene = {
  about: "funnel-chart.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "funnel-chart.replay.title",
};

/**
 * Hand-written scene for a funnel without stages.
 */
export const empty: Scene = {
  about: "funnel-chart.quiet.about",
  draw: () => (
    <Room size="lg">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "funnel-chart.quiet.title",
};

export default specimen({
  about: "funnel-chart.about",
  id: "components/charts/funnel-chart",
  imports: 'import { FunnelChart } from "@stealthscale/component-charts";',
  scenes: [checkedOut, pointed, widened, tinted, compact, bare, paired, narrow, animated, empty],
  title: "funnel-chart.title",
});
