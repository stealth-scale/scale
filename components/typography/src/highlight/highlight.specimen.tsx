/**
 * Catalogue page for the highlight.
 *
 * @remarks
 *   The highlight has no recipe of its own: every match renders in `Mark`. The search scene filters
 *   article titles as a person types and marks the query in each. The letter case scene crosses
 *   `ignoreCase`, and the looks scene crosses the mark's looks. The words are keys under
 *   `highlight` in `locales/en/specimen/highlight.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen } from "@stealthscale/specimen";

import * as letters from "#highlight/examples/letters.example.tsx";
import * as looks from "#highlight/examples/looks.example.tsx";
import * as search from "#highlight/examples/search.example.tsx";
import * as terms from "#highlight/examples/terms.example.tsx";
import { type HighlightProps } from "#highlight/index.ts";

/**
 * Values of `ignoreCase` in the letter case scene, the default first.
 */
const CASES: readonly boolean[] = [true, false];

/**
 * Looks of the mark in the looks scene, the default first.
 */
const LOOKS: ReadonlyArray<NonNullable<HighlightProps["variant"]>> = [
  "subtle",
  "solid",
  "surface",
  "outline",
  "plain",
  "text",
];

/**
 * Hand-written scene for search results filtered and marked as a person types.
 */
export const searched: Scene = {
  about: "highlight.search.about",
  draw: search.Search,
  example: search,
  title: "highlight.search.title",
};

/**
 * Hand-written scene for several terms in one text.
 */
export const listed: Scene = {
  about: "highlight.terms.about",
  draw: terms.Terms,
  example: terms,
  title: "highlight.terms.title",
};

/**
 * Hand-written scene for letter case ignored and matched.
 */
export const cased: Scene = {
  about: "highlight.letters.about",
  draw: (): ReactElement => (
    <Matrix knob="ignoreCase" of={CASES}>
      {(ignoreCase) => <letters.Letters ignoreCase={ignoreCase} />}
    </Matrix>
  ),
  example: letters,
  props: { ignoreCase: true },
  title: "highlight.letters.title",
};

/**
 * Hand-written scene for the mark's looks on every match.
 */
export const looked: Scene = {
  about: "highlight.looks.about",
  draw: (): ReactElement => (
    <Matrix knob="variant" of={LOOKS}>
      {(variant) => <looks.Looks variant={variant} />}
    </Matrix>
  ),
  example: looks,
  props: { variant: "subtle" },
  title: "highlight.looks.title",
};

export default specimen({
  about: "highlight.about",
  id: "components/typography/highlight",
  imports: 'import { Highlight } from "@stealthscale/component-typography";',
  scenes: [searched, listed, cased, looked],
  title: "highlight.title",
});
