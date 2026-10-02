/**
 * Catalogue page for the marquee.
 *
 * @remarks
 *   `scenesOf` generates the gap scene from the logos example. The other scenes are hand-written:
 *   the speed matrix, the logos right to left, and the ticker, the vertical quotes, the finite
 *   loops and the controlled pause, each one example. The vertical scene renders in a kit `Screen`
 *   20rem tall, because a vertical marquee fills its container's height. The words are keys under
 *   `marquee` in `locales/en/specimen/marquee.json`.
 */

import { Matrix, type Scene, scenesOf, Screen, specimen } from "@stealthscale/specimen";

import * as controlled from "#marquee/examples/controlled.example.tsx";
import * as finite from "#marquee/examples/finite.example.tsx";
import * as logos from "#marquee/examples/logos.example.tsx";
import * as speed from "#marquee/examples/speed.example.tsx";
import * as testimonials from "#marquee/examples/testimonials.example.tsx";
import * as ticker from "#marquee/examples/ticker.example.tsx";
import type * as Marquee from "#marquee/index.ts";
import { recipe } from "#marquee/recipe.ts";

/**
 * Speeds of the speed scene, in pixels per second.
 */
const SPEEDS = [25, 50, 100] as const;

/**
 * Hand-written scene for a headline ticker the pointer pauses.
 */
export const headlines: Scene = {
  about: "marquee.ticker.about",
  draw: ticker.Ticker,
  example: ticker,
  title: "marquee.ticker.title",
};

/**
 * Hand-written scene for a column of quotes moving up.
 */
export const vertical: Scene = {
  about: "marquee.testimonials.about",
  draw: () => (
    <Screen size="xs">
      <testimonials.Testimonials />
    </Screen>
  ),
  example: testimonials,
  title: "marquee.testimonials.title",
};

/**
 * Hand-written scene for three marquees at three speeds.
 */
export const speeds: Scene = {
  about: "marquee.speed.about",
  draw: () => (
    <Matrix direction="column" knob="speed" of={SPEEDS}>
      {(value) => <speed.Speed speed={value} />}
    </Matrix>
  ),
  example: speed,
  props: { speed: 25 },
  title: "marquee.speed.title",
};

/**
 * Hand-written scene for a strip that runs twice and reports its loops.
 */
export const loops: Scene = {
  about: "marquee.finite.about",
  draw: finite.Finite,
  example: finite,
  title: "marquee.finite.title",
};

/**
 * Hand-written scene for a pause the application keeps.
 */
export const pause: Scene = {
  about: "marquee.controlled.about",
  draw: controlled.Controlled,
  example: controlled,
  title: "marquee.controlled.title",
};

/**
 * Hand-written scene for a strip that reads right to left.
 */
export const rtl: Scene = {
  about: "marquee.rtl.about",
  draw: () => <logos.Logos dir="rtl" />,
  example: logos,
  props: { dir: "rtl" },
  title: "marquee.rtl.title",
};

export default specimen({
  about: "marquee.about",
  id: "components/content/marquee",
  imports: 'import { Marquee } from "@stealthscale/component-content";',
  scenes: [
    headlines,
    vertical,
    speeds,
    loops,
    pause,
    rtl,
    ...scenesOf<Omit<Marquee.RootProps, "aria-label" | "aria-labelledby">>(recipe, {
      draw: (props) => <logos.Logos {...props} />,
      example: logos,
      namespace: "marquee",
    }),
  ],
  title: "marquee.title",
});
