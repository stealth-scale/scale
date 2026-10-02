/**
 * Catalogue page for the pagination.
 *
 * @remarks
 *   `scenesOf` generates the sizes from the results example, which starts on page 12 of 24, so
 *   every row shows the marks on both sides. The hand-written scenes turn the buttons' look, their
 *   palette, `siblingCount` and the page text's format, and show the first and last triggers, a row
 *   too narrow for its pages, a controlled pagination under a list, and pages as links. Every row
 *   renders in a room at its real width. The words are keys under `pagination` in
 *   `locales/en/specimen/pagination.json`.
 */

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#pagination/examples/index.ts";
import type * as Pagination from "#pagination/index.ts";
import { recipe } from "#pagination/recipe.ts";

/**
 * Looks of the looks scene: the button looks that mark the current page with a fill.
 */
const LOOKS = ["ghost", "outline", "subtle"] as const;

/**
 * Palettes of the palette scene.
 */
const PALETTES = ["primary", "accent", "neutral", "success"] as const;

/**
 * Sibling counts of the siblings scene.
 */
const SIBLINGS = [0, 1, 2] as const;

/**
 * Formats of the page text scene.
 */
const FORMATS = ["compact", "short", "long"] as const;

/**
 * Hand-written scene for every look of the buttons.
 */
export const looks: Scene = {
  about: "pagination.looks.about",
  draw: () => (
    <Matrix direction="column" knob="variant" of={LOOKS}>
      {(variant) => (
        <Room size="md">
          <examples.results.Results variant={variant} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.results,
  props: { variant: "ghost" },
  title: "pagination.looks.title",
};

/**
 * Hand-written scene for the buttons in several palettes.
 */
export const palette: Scene = {
  about: "pagination.palette.about",
  draw: () => (
    <Matrix direction="column" knob="palette" of={PALETTES}>
      {(each) => (
        <Room size="md">
          <examples.results.Results palette={each} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.results,
  props: { palette: "primary" },
  title: "pagination.palette.title",
};

/**
 * Hand-written scene for every sibling count.
 */
export const siblings: Scene = {
  about: "pagination.siblings.about",
  draw: () => (
    <Matrix direction="column" knob="siblingCount" of={SIBLINGS}>
      {(count) => (
        <Room size="lg">
          <examples.results.Results siblingCount={count} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.results,
  props: { siblingCount: 0 },
  title: "pagination.siblings.title",
};

/**
 * Hand-written scene for the first and last triggers.
 */
export const edges: Scene = {
  about: "pagination.edges.about",
  draw: () => (
    <Room size="md">
      <examples.edges.Edges />
    </Room>
  ),
  example: examples.edges,
  title: "pagination.edges.title",
};

/**
 * Hand-written scene for a row too narrow for its pages, which the summary replaces.
 */
export const narrow: Scene = {
  about: "pagination.narrow.about",
  draw: () => (
    <Room size="xs">
      <examples.results.Results />
    </Room>
  ),
  example: examples.results,
  title: "pagination.narrow.title",
};

/**
 * Hand-written scene for every format of the page text.
 */
export const text: Scene = {
  about: "pagination.text.about",
  draw: () => (
    <Matrix direction="column" knob="format" of={FORMATS}>
      {(format) => (
        <Room size="sm">
          <examples.wording.Wording format={format} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.wording,
  props: { format: "compact" },
  title: "pagination.text.title",
};

/**
 * Hand-written scene for a controlled pagination under a list.
 */
export const table: Scene = {
  about: "pagination.table.about",
  draw: () => (
    <Room size="md">
      <examples.invoices.Invoices />
    </Room>
  ),
  example: examples.invoices,
  title: "pagination.table.title",
};

/**
 * Hand-written scene for pages as links.
 */
export const links: Scene = {
  about: "pagination.links.about",
  draw: () => (
    <Room size="md">
      <examples.links.Links />
    </Room>
  ),
  example: examples.links,
  title: "pagination.links.title",
};

export default specimen({
  about: "pagination.about",
  id: "components/navigation/pagination",
  imports: 'import { Pagination } from "@stealthscale/component-navigation";',
  scenes: [
    ...scenesOf<Pagination.RootProps>(recipe, {
      axes: { size: { direction: "column" } },
      draw: (props) => (
        <Room size="lg">
          <examples.results.Results {...props} />
        </Room>
      ),
      example: examples.results,
      namespace: "pagination",
    }),
    looks,
    palette,
    siblings,
    edges,
    narrow,
    text,
    table,
    links,
  ],
  title: "pagination.title",
});
