/**
 * Catalogue page for the card.
 *
 * @remarks
 *   Eight hand-written scenes lead the page, one per example file: a profile, a product, an
 *   article, a balance, a pricing plan, settings, a loading card and an expandable card. `scenesOf`
 *   then generates one scene per axis from the invoice example, with the balance for `palette`, the
 *   article for `orientation` and `scrim`, and the linked invoice for `interactive` and `disabled`.
 *   Every card is rendered in a room of a sidebar's width, and the orientation scene in a medium
 *   room. The words are keys under `card` in `locales/en/specimen/card.json`. The page imports the
 *   parts' barrel directly, because the props reader follows a specimen's own imports and not an
 *   examples barrel.
 */

import { type ReactElement } from "react";

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#card/examples/index.ts";
import type * as Card from "#card/index.ts";
import { recipe } from "#card/recipe.ts";

/**
 * Props of a generated cell: the card root's props.
 */
type Props = Card.RootProps;

/**
 * Builds a hand-written scene that renders one example in a room of a sidebar's width.
 *
 * @param name - Key of the scene under `card.scenes`.
 * @param example - Example module, whose source the scene shows.
 * @param Example - Component the example module exports.
 * @returns The scene.
 */
function roomed(name: string, example: object, Example: () => ReactElement): Scene {
  return {
    about: `card.scenes.${name}.about`,
    draw: () => (
      <Room size="xs">
        <Example />
      </Room>
    ),
    example,
    title: `card.scenes.${name}.title`,
  };
}

/**
 * Hand-written scenes, one per example file that shows the card in use.
 */
export const shown: readonly Scene[] = [
  roomed("profile", examples.profile, examples.profile.Profile),
  roomed("product", examples.product, examples.product.Product),
  roomed("article", examples.article, () => <examples.article.Article />),
  roomed("balance", examples.balance, () => <examples.balance.Balance />),
  roomed("plan", examples.plan, examples.plan.Plan),
  roomed("settings", examples.settings, examples.settings.Settings),
  roomed("loading", examples.loading, examples.loading.Loading),
  roomed("expandable", examples.expandable, examples.expandable.Expandable),
];

export default specimen({
  about: "card.about",
  id: "components/surfaces/card",
  imports: 'import { Card } from "@stealthscale/component-surfaces";',
  scenes: [
    ...shown,
    ...scenesOf<Props>(recipe, {
      axes: {
        disabled: {
          draw: (props) => (
            <Room size="xs">
              <examples.linked.Linked {...props} />
            </Room>
          ),
          example: examples.linked,
          with: { interactive: true },
        },
        effect: { with: { palette: "info" } },
        interactive: {
          draw: (props) => (
            <Room size="xs">
              <examples.linked.Linked {...props} />
            </Room>
          ),
          example: examples.linked,
        },
        orientation: {
          direction: "column",
          draw: (props) => (
            <Room size="md">
              <examples.article.Article {...props} />
            </Room>
          ),
          example: examples.article,
        },
        palette: {
          draw: (props) => (
            <Room size="xs">
              <examples.balance.Balance {...props} />
            </Room>
          ),
          example: examples.balance,
        },
        scrim: {
          draw: (props) => (
            <Room size="xs">
              <examples.article.Article {...props} />
            </Room>
          ),
          example: examples.article,
        },
      },
      draw: (props) => (
        <Room size="xs">
          <examples.invoice.Invoice {...props} />
        </Room>
      ),
      example: examples.invoice,
      namespace: "card",
      order: [
        "variant",
        "palette",
        "size",
        "radius",
        "orientation",
        "scrim",
        "divided",
        "justify",
        "interactive",
        "disabled",
        "effect",
        "motion",
      ],
    }),
  ],
  title: "card.title",
});
