/**
 * Shows the toolbar: every look at every size, and every corner of an outlined row.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every row holds the same controls: a primary filter, a secondary export,
 *   a tertiary column picker behind a separator, the folded control at the end, and a search that
 *   covers the row once it is narrow. The rows run down the page, because a row folds on its own
 *   width and a cell of a grid would fold every one. The words are keys under `toolbar` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/toolbar.json`.
 */

import { type ReactElement } from "react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { SearchInput } from "@stealthscale/component-forms";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";
import { type Scale } from "@stealthscale/theme/authoring";

import * as Toolbar from "#toolbar/index.ts";
import { recipe } from "#toolbar/recipe.ts";

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
 * Draws the row in every look at every size.
 */
function Looks(): ReactElement {
  const { t } = useWords("toolbar");

  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, size) => (
        <Toolbar.Root aria-label={t("invoices")} size={size} variant={variant}>
          <Controls size={size} />
        </Toolbar.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws an outlined row at every corner.
 */
function Corners(): ReactElement {
  const { t } = useWords("toolbar");

  return (
    <Matrix direction="column" knob="radius" of={valuesOf(recipe, "radius")}>
      {(radius) => (
        <Toolbar.Root aria-label={t("invoices")} radius={radius} variant="outline">
          <Controls size="md" />
        </Toolbar.Root>
      )}
    </Matrix>
  );
}

/**
 * Every look at every size.
 */
export const looks: Scene = {
  about: "toolbar.looks.about",
  draw: Looks,
  title: "toolbar.looks.title",
};

/**
 * Every corner.
 */
export const corners: Scene = {
  about: "toolbar.corners.about",
  draw: Corners,
  title: "toolbar.corners.title",
};

export default specimen({
  about: "toolbar.about",
  group: "Screen",
  id: "screen/toolbar",
  imports: 'import { Toolbar } from "@stealthscale/component-screen";',
  scenes: [looks, corners],
  title: "toolbar.title",
});
