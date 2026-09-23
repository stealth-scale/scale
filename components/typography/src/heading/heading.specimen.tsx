/**
 * Catalogue page for the heading.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. Every example renders an `h3`, one level below
 *   the scene's `h2`, so the page outline stays in order at every size. The display and effect
 *   scenes render at `2xl`. The tone scene renders the inverted ink on `bg.inverted` through
 *   `grounded`, and the truncation scene renders a long title in a 512px room. Every scene renders
 *   a component from `examples/` and shows that file as its source. The words are keys under
 *   `heading` in `locales/en/specimen/heading.json`.
 */

import { grounded, Room, scenesOf, specimen } from "@stealthscale/specimen";

import * as migration from "#heading/examples/migration.example.tsx";
import * as report from "#heading/examples/report.example.tsx";
import * as settings from "#heading/examples/settings.example.tsx";
import * as welcome from "#heading/examples/welcome.example.tsx";
import { recipe } from "#heading/recipe.ts";

export default specimen({
  about: "heading.about",
  id: "components/typography/heading",
  imports: 'import { Heading } from "@stealthscale/component-typography";',
  scenes: scenesOf<Parameters<typeof report.Report>[0]>(recipe, {
    axes: {
      display: {
        draw: (props) => <welcome.Welcome {...props} />,
        example: welcome,
        with: { size: "2xl" },
      },
      effect: {
        draw: (props) => <welcome.Welcome {...props} />,
        example: welcome,
        with: { size: "2xl" },
      },
      size: { direction: "column" },
      tone: {
        draw: (props) => grounded(props.tone, <settings.Settings {...props} />),
        example: settings,
      },
      truncate: {
        direction: "column",
        draw: (props) => (
          <Room size="lg">
            <migration.Migration {...props} />
          </Room>
        ),
        example: migration,
      },
    },
    draw: (props) => <report.Report {...props} />,
    example: report,
    namespace: "heading",
    order: ["size", "display", "tone", "effect", "motion", "truncate"],
  }),
  title: "heading.title",
});
