/**
 * Catalogues the status: one scene per recipe axis, generated from the recipe, and one in a line of
 * text.
 *
 * @remarks
 *   Each palette renders with a word for a state a caller would map to it, so the page shows the
 *   dot next to the word that carries the meaning. The words are keys under `status` in the
 *   catalogue namespace, stored at `locales/en/specimen/status.json`.
 */

import { type ReactElement } from "react";

import { Text } from "@stealthscale/component-typography";
import { type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { Indicator } from "#status/indicator.ts";
import { recipe } from "#status/recipe.ts";
import { Root, type RootProps } from "#status/root.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "<Status.Indicator />\nLive",
  imports: 'import { Status } from "@stealthscale/component-data";',
  name: "Status.Root",
};

/**
 * Renders a status with the word for its palette, or `Live` when the scene sets no palette.
 */
function Stated(props: RootProps): ReactElement {
  const { t } = useWords("status");

  return (
    <Root {...props}>
      <Indicator />
      {t(`states.${props.palette ?? "success"}`)}
    </Root>
  );
}

/**
 * Renders a status inside a sentence at the middle body size.
 */
function Sentence(): ReactElement {
  const { t } = useWords("status");

  return (
    <Text>
      {t("before")}{" "}
      <Root effect="pulse" palette="success" size="inherit">
        <Indicator />
        {t("states.success")}
      </Root>{" "}
      {t("after")}
    </Text>
  );
}

/**
 * The hand-written scene for a status inside running text.
 */
export const sentence: Scene = {
  about: "status.sentence.about",
  draw: Sentence,
  title: "status.sentence.title",
};

export default specimen({
  about: "status.about",
  id: "components/data/status",
  imports: 'import { Status } from "@stealthscale/component-data";',
  scenes: [
    ...scenesOf<RootProps>(recipe, {
      axes: {
        effect: { with: { palette: "success" } },
        size: { with: { palette: "success" } },
      },
      draw: (props) => <Stated {...props} />,
      namespace: "status",
      order: ["palette", "size", "effect"],
      sample: SAMPLE,
    }),
    sentence,
  ],
  title: "status.title",
});
