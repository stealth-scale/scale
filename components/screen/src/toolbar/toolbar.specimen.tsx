/**
 * Shows the toolbar: every look at every size, and every corner of an outlined row.
 *
 * @remarks
 *   The scenes are generated from the recipe, so a value added to it reaches the page without this
 *   file changing. Every row holds the same controls: a primary filter, a secondary export,
 *   a tertiary column picker behind a separator, the folded control at the end, and a search that
 *   covers the row once it is narrow. The rows run down the page, because a row folds on its own
 *   width and a cell of a grid would fold every one. The words are keys under `toolbar` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/toolbar.json`.
 */

import { type ReactElement } from "react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { SearchInput } from "@stealthscale/component-forms";
import { scenesOf, specimen, useWords } from "@stealthscale/specimen";
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
          {t("filter")}
        </Toolbar.Action>
        <Toolbar.Action as={Button} priority="secondary" variant="ghost">
          {t("export")}
        </Toolbar.Action>
        <Toolbar.Separator />
        <Toolbar.Action as={Button} priority="tertiary" variant="ghost">
          {t("columns")}
        </Toolbar.Action>
      </Toolbar.Start>
      <Toolbar.End>
        <Toolbar.Folded as={Button} variant="ghost">
          {t("more")}
        </Toolbar.Folded>
      </Toolbar.End>
      <Toolbar.Search>
        <SearchInput aria-label={t("search")} size={size} />
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

export default specimen({
  about: "toolbar.about",
  id: "components/screen/toolbar",
  imports: 'import { Toolbar } from "@stealthscale/component-screen";',
  scenes: scenesOf<Toolbar.RootProps>(recipe, {
    axes: {
      radius: { direction: "column", draw: (props) => <Outlined {...props} /> },
      variant: { across: "size", direction: "column" },
    },
    draw: (props) => <Row {...props} />,
    namespace: "toolbar",
    order: ["variant", "radius"],
    sample: SAMPLE,
  }),
  title: "toolbar.title",
});
