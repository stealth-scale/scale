/**
 * Catalogues the stat: the size and palette axes, a figure with units, two changes whose direction
 * and meaning differ, and a row of stats.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added there reaches the page without
 *   an edit here. The arrows come from `lucide-react` and are hidden from screen readers. The help
 *   text states the direction with a sign, such as `+12%`. The words are keys under `stat` in the
 *   catalogue namespace, stored at `locales/en/specimen/stat.json`.
 */

import { type ReactElement } from "react";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import { Grid } from "@stealthscale/component-layout";
import { Room, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import * as Stat from "#stat/index.ts";
import { recipe } from "#stat/recipe.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Stat.Label>Settled this week</Stat.Label>",
    "<Stat.ValueText>£17,500.40</Stat.ValueText>",
    "<Stat.HelpText>against £14,200 last week</Stat.HelpText>",
  ].join("\n"),
  imports: 'import { Stat } from "@stealthscale/component-data";',
  name: "Stat.Root",
};

/**
 * Renders a stat with a figure and a line of help text.
 */
function Settled(props: Stat.RootProps): ReactElement {
  const { t } = useWords("stat");

  return (
    <Stat.Root {...props}>
      <Stat.Label>{t("settled.label")}</Stat.Label>
      <Stat.ValueText>{t("settled.value")}</Stat.ValueText>
      <Stat.HelpText>{t("settled.help")}</Stat.HelpText>
    </Stat.Root>
  );
}

/**
 * Renders a stat whose help text leads with an upward arrow in the scene's palette.
 */
function Moved(props: Stat.RootProps): ReactElement {
  const { t } = useWords("stat");

  return (
    <Stat.Root {...props}>
      <Stat.Label>{t("revenue.label")}</Stat.Label>
      <Stat.ValueText>{t("revenue.value")}</Stat.ValueText>
      <Stat.HelpText>
        <Stat.Indicator>
          <ArrowUpIcon aria-hidden />
        </Stat.Indicator>
        {t("revenue.help")}
      </Stat.HelpText>
    </Stat.Root>
  );
}

/**
 * Renders a duration whose figure contains two units.
 */
function Units(): ReactElement {
  const { t } = useWords("stat");

  return (
    <Stat.Root>
      <Stat.Label>{t("duration.label")}</Stat.Label>
      <Stat.ValueText>
        3<Stat.ValueUnit>{t("duration.hours")}</Stat.ValueUnit>
        20<Stat.ValueUnit>{t("duration.minutes")}</Stat.ValueUnit>
      </Stat.ValueText>
    </Stat.Root>
  );
}

/**
 * Renders two stats that both rose, one good and one bad, each in the palette of its meaning.
 */
function Meaning(): ReactElement {
  const { t } = useWords("stat");

  return (
    <Room size="md">
      <Grid.Root columns="2">
        <Moved palette="success" />
        <Stat.Root palette="error">
          <Stat.Label>{t("tickets.label")}</Stat.Label>
          <Stat.ValueText>{t("tickets.value")}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.Indicator>
              <ArrowUpIcon aria-hidden />
            </Stat.Indicator>
            {t("tickets.help")}
          </Stat.HelpText>
        </Stat.Root>
      </Grid.Root>
    </Room>
  );
}

/**
 * Renders three stats in a row, one with help text, so the figures can be compared on one line.
 */
function Row(): ReactElement {
  const { t } = useWords("stat");

  return (
    <Room size="lg">
      <Grid.Root columns="3">
        <Stat.Root>
          <Stat.Label>{t("row.raised")}</Stat.Label>
          <Stat.ValueText>240</Stat.ValueText>
        </Stat.Root>
        <Stat.Root>
          <Stat.Label>{t("row.settled")}</Stat.Label>
          <Stat.ValueText>228</Stat.ValueText>
        </Stat.Root>
        <Stat.Root palette="success">
          <Stat.Label>{t("row.held")}</Stat.Label>
          <Stat.ValueText>12</Stat.ValueText>
          <Stat.HelpText>
            <Stat.Indicator>
              <ArrowDownIcon aria-hidden />
            </Stat.Indicator>
            {t("row.help")}
          </Stat.HelpText>
        </Stat.Root>
      </Grid.Root>
    </Room>
  );
}

/**
 * The hand-written scene for a figure with units.
 */
export const units: Scene = {
  about: "stat.units.about",
  draw: Units,
  title: "stat.units.title",
};

/**
 * The hand-written scene for direction and meaning.
 */
export const meaning: Scene = {
  about: "stat.meaning.about",
  draw: Meaning,
  title: "stat.meaning.title",
};

/**
 * The hand-written scene for a row of stats.
 */
export const row: Scene = {
  about: "stat.row.about",
  draw: Row,
  title: "stat.row.title",
};

export default specimen({
  about: "stat.about",
  id: "components/data/stat",
  imports: 'import { Stat } from "@stealthscale/component-data";',
  scenes: [
    ...scenesOf<Stat.RootProps>(recipe, {
      axes: { palette: { draw: (props) => <Moved {...props} /> } },
      draw: (props) => <Settled {...props} />,
      namespace: "stat",
      order: ["size", "palette"],
      sample: SAMPLE,
    }),
    units,
    meaning,
    row,
  ],
  title: "stat.title",
});
