/**
 * Catalogue page for the list.
 *
 * @remarks
 *   `scenesOf` generates the marker, gap, alignment and motion scenes. The marker scene renders a
 *   counting marker on an `ol` and the others on a `ul`. The alignment scene renders the feature
 *   list in a 320px room, where its last item wraps. A hand-written scene renders the `plain` look
 *   with a lucide check in each indicator, and every other scene renders the `marker` look. Every
 *   scene renders a component from `examples/` and shows that file as its source. The words are
 *   keys under `list` in `locales/en/specimen/list.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as features from "#list/examples/features.example.tsx";
import * as steps from "#list/examples/steps.example.tsx";
import { recipe } from "#list/recipe.ts";

/**
 * Lists the markers that count, which render on an `ol`.
 */
const COUNTING = new Set<unknown>([
  "decimal",
  "leading-zero",
  "lower-alpha",
  "lower-greek",
  "lower-roman",
  "upper-alpha",
  "upper-roman",
]);

/**
 * Hand-written scene for the plain look with an indicator on each item.
 */
export const plain: Scene = {
  about: "list.variant.about",
  axes: ["variant"],
  draw: features.Features,
  example: features,
  title: "list.variant.title",
};

export default specimen({
  about: "list.about",
  id: "components/typography/list",
  imports: 'import { List } from "@stealthscale/component-typography";',
  scenes: [
    ...scenesOf<Parameters<typeof steps.Steps>[0]>(recipe, {
      axes: {
        align: {
          draw: (props) => (
            <Room size="xs">
              <features.Features {...props} />
            </Room>
          ),
          example: features,
        },
        marker: {
          draw: (props) => <steps.Steps as={COUNTING.has(props.marker) ? "ol" : "ul"} {...props} />,
        },
      },
      draw: (props) => <steps.Steps {...props} />,
      example: steps,
      namespace: "list",
      order: ["marker", "gap", "align", "motion"],
      skip: {
        variant: "The plain scene renders the plain look, and every other scene the marker look.",
      },
    }),
    plain,
  ],
  title: "list.title",
});
