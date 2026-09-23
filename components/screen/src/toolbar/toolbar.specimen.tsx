/**
 * Shows the toolbar: every look, every size, every corner of an outlined row, and what a row drops
 * as the room it is given runs out.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added to it reaches the page without
 *   this file changing. Every row holds the same controls: a primary filter, a secondary export, a
 *   tertiary column picker behind a separator, the folded control at the end, and a search that
 *   covers the row once it is narrow.
 *   Every scene runs its rows down the page and none of them crosses two axes. A row folds on its
 *   own width, so a matrix of looks against sizes gave each row a third of a card and folded all
 *   nine of them: the drawings that were meant to show three sizes showed three collapses, with
 *   the words of one control drawn over the words of the next.
 *   The room scene is written by hand, because what a row drops is not an axis. It is the same row
 *   in three widths, which is the only way to read a fold at all.
 *   The words are keys under `toolbar` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/toolbar.json`.
 */

import { type ReactElement } from "react";

import { Columns3, Download, Ellipsis, Funnel } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { SearchInput } from "@stealthscale/component-forms";
import { Matrix, Room, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";
import { type Scale } from "@stealthscale/theme/authoring";

import * as Toolbar from "#toolbar/index.ts";
import { recipe } from "#toolbar/recipe.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Toolbar.Start>",
    "  <Toolbar.Action as={Button}>Filter</Toolbar.Action>",
    "</Toolbar.Start>",
  ].join("\n"),
  imports: 'import { Toolbar } from "@stealthscale/component-screen";',
  name: "Toolbar.Root",
};

/**
 * Describes what the controls of a row are told.
 */
interface ControlsProps {
  /**
   * The step every control is drawn at, which is the row's own.
   */
  readonly size: Scale;
}

/**
 * Draws the controls every row holds.
 *
 * @remarks
 *   The controls take the row's size, because the row's own axis moves the gaps and the
 *   separator alone. A row at every size around controls at the middle one drew eight rows that
 *   differed by a few pixels of gap.
 */
function Controls({ size }: ControlsProps): ReactElement {
  const { t } = useWords("toolbar");

  return (
    <ButtonPropsProvider value={{ size }}>
      <Toolbar.Start>
        <Toolbar.Action as={Button} priority="primary" variant="subtle">
          <Funnel />
          <span>{t("filter")}</span>
        </Toolbar.Action>
        <Toolbar.Action as={Button} priority="secondary" variant="ghost">
          <Download />
          <span>{t("export")}</span>
        </Toolbar.Action>
        <Toolbar.Separator />
        <Toolbar.Action as={Button} priority="tertiary" variant="ghost">
          <Columns3 />
          <span>{t("columns")}</span>
        </Toolbar.Action>
      </Toolbar.Start>
      <Toolbar.End>
        <Toolbar.Folded aria-label={t("more")} as={Button} variant="ghost">
          <Ellipsis />
        </Toolbar.Folded>
      </Toolbar.End>
      <Toolbar.Search>
        <SearchInput aria-label={t("search")} placeholder={t("search")} size={size} />
      </Toolbar.Search>
    </ButtonPropsProvider>
  );
}

/**
 * Draws the row with its controls at the row's own step.
 */
function Row({ size = "md", ...rest }: Toolbar.RootProps): ReactElement {
  const { t } = useWords("toolbar");

  return (
    <Toolbar.Root size={size} {...rest} aria-label={t("invoices")}>
      <Controls size={size} />
    </Toolbar.Root>
  );
}

/**
 * Draws an outlined row, which is what a corner is read against.
 *
 * @remarks
 *   The plain row draws no edge, so a corner set on it has nothing to round.
 */
function Outlined(props: Toolbar.RootProps): ReactElement {
  return <Row variant="outline" {...props} />;
}

/**
 * The widths a row is read across: too little for the controls it holds, enough for them, and more
 * than enough.
 */
const ROOMS = ["xs", "2xl", "5xl"] as const;

/**
 * Draws one row in three rooms, which is what makes the fold visible.
 */
function Rooms(): ReactElement {
  const { t } = useWords("toolbar");

  return (
    <Matrix direction="column" knob="room" of={ROOMS}>
      {(room) => (
        <Room size={room}>
          <Outlined aria-label={t("invoices")} />
        </Room>
      )}
    </Matrix>
  );
}

/**
 * The hand-written scene for what a row drops as its room runs out.
 */
export const room: Scene = {
  about: "toolbar.room.about",
  draw: Rooms,
  source: [
    'import { Toolbar } from "@stealthscale/component-screen";',
    "",
    '<Toolbar.Root aria-label="Invoices" variant="outline">',
    "  <Toolbar.Start>",
    '    <Toolbar.Action as={Button} priority="primary">',
    "      <Funnel />",
    "      <span>Filter</span>",
    "    </Toolbar.Action>",
    '    <Toolbar.Action as={Button} priority="secondary">',
    "      <Download />",
    "      <span>Export</span>",
    "    </Toolbar.Action>",
    "    <Toolbar.Separator />",
    '    <Toolbar.Action as={Button} priority="tertiary">',
    "      <Columns3 />",
    "      <span>Columns</span>",
    "    </Toolbar.Action>",
    "  </Toolbar.Start>",
    "  <Toolbar.End>",
    '    <Toolbar.Folded aria-label="More" as={Button}>',
    "      <Ellipsis />",
    "    </Toolbar.Folded>",
    "  </Toolbar.End>",
    "  <Toolbar.Search>",
    '    <SearchInput aria-label="Search invoices" placeholder="Search invoices" />',
    "  </Toolbar.Search>",
    "</Toolbar.Root>",
  ].join("\n"),
  title: "toolbar.room.title",
};

export default specimen({
  about: "toolbar.about",
  id: "components/screen/toolbar",
  imports: 'import { Toolbar } from "@stealthscale/component-screen";',
  scenes: [
    ...scenesOf<Toolbar.RootProps>(recipe, {
      axes: {
        radius: { direction: "column", draw: (props) => <Outlined {...props} /> },
        size: { direction: "column" },
        variant: { direction: "column" },
      },
      draw: (props) => <Row {...props} />,
      namespace: "toolbar",
      order: ["variant", "size", "radius"],
      sample: SAMPLE,
    }),
    room,
  ],
  title: "toolbar.title",
});
