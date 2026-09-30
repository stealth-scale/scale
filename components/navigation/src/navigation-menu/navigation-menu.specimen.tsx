/**
 * Catalogue page for the navigation menu.
 *
 * @remarks
 *   Every menu renders at the top of a `Screen`, the window of a site, because a scene's card clips
 *   what overflows it and an open panel hangs below the bar. A horizontal menu renders inside a
 *   full `Container`, the page's gutter, and the vertical menu at the window's start edge. At 420
 *   the site header's bar takes two rows over its tallest panel, which fits a 24rem window at `md`
 *   and a 28rem window at `lg`, so the header takes the first and its sizes the second. Every other
 *   menu takes a 20rem window. Every scene renders live and closed, and the reader opens the
 *   panels. The palettes are drawn on the panels-in-place menu, whose Changelog link is current, so
 *   the palette shows at rest. The words are keys under `navigation-menu` in
 *   `locales/en/specimen/navigation-menu.json`.
 */

import { type ReactElement, type ReactNode } from "react";

import { Container } from "@stealthscale/component-layout";
import { Matrix, Room, type Scene, Screen, specimen } from "@stealthscale/specimen";

import * as examples from "#navigation-menu/examples/index.ts";
import type * as NavigationMenu from "#navigation-menu/index.ts";

/**
 * Alignments of the alignment scene, in reading order.
 */
const ALIGNS: ReadonlyArray<NonNullable<NavigationMenu.ViewportPositionerProps["align"]>> = [
  "start",
  "center",
  "end",
];

/**
 * Palettes of the palette scene.
 */
const PALETTES: ReadonlyArray<NonNullable<NavigationMenu.RootProps["palette"]>> = [
  "primary",
  "accent",
  "neutral",
  "success",
];

/**
 * Sizes of the size scene.
 */
const SIZES: ReadonlyArray<NonNullable<NavigationMenu.RootProps["size"]>> = ["sm", "md", "lg"];

/**
 * Renders a menu inside the page's gutter at the top of a site's window.
 *
 * @param size - The window's height.
 * @param menu - The menu.
 * @returns The window.
 */
function windowed(size: "md" | "sm" | "xs", menu: ReactNode): ReactElement {
  return (
    <Screen size={size}>
      <Container size="full">{menu}</Container>
    </Screen>
  );
}

/**
 * Hand-written scene for a site header with a shared viewport and an indicator.
 */
export const header: Scene = {
  about: "navigation-menu.header.about",
  draw: () => windowed("sm", <examples.header.Header />),
  example: examples.header,
  title: "navigation-menu.header.title",
};

/**
 * Hand-written scene for every size of the site header.
 */
export const size: Scene = {
  about: "navigation-menu.size.about",
  axes: ["size"],
  draw: () => (
    <Matrix direction="column" knob="size" of={SIZES}>
      {(each) => windowed("md", <examples.header.Header size={each} />)}
    </Matrix>
  ),
  example: examples.header,
  props: { size: "sm" },
  title: "navigation-menu.size.title",
};

/**
 * Hand-written scene for the indicator and a current link in several palettes.
 */
export const palette: Scene = {
  about: "navigation-menu.palette.about",
  axes: ["palette"],
  draw: () => (
    <Matrix direction="column" knob="palette" of={PALETTES}>
      {(each) => windowed("xs", <examples.inline.Inline palette={each} />)}
    </Matrix>
  ),
  example: examples.inline,
  props: { palette: "primary" },
  title: "navigation-menu.palette.title",
};

/**
 * Hand-written scene for panels that open under their own triggers.
 */
export const inline: Scene = {
  about: "navigation-menu.inline.about",
  draw: () => windowed("xs", <examples.inline.Inline />),
  example: examples.inline,
  title: "navigation-menu.inline.title",
};

/**
 * Hand-written scene for a vertical menu at a sidebar's width.
 */
export const sidebar: Scene = {
  about: "navigation-menu.sidebar.about",
  draw: () => (
    <Screen size="xs">
      <Room size="xs">
        <examples.sidebar.Sidebar />
      </Room>
    </Screen>
  ),
  example: examples.sidebar,
  title: "navigation-menu.sidebar.title",
};

/**
 * Hand-written scene for a menu whose panels open only on a press.
 */
export const click: Scene = {
  about: "navigation-menu.click.about",
  draw: () => windowed("xs", <examples.click.Click />),
  example: examples.click,
  title: "navigation-menu.click.title",
};

/**
 * Hand-written scene for a menu whose open item the caller keeps.
 */
export const controlled: Scene = {
  about: "navigation-menu.controlled.about",
  draw: () => windowed("xs", <examples.controlled.Controlled />),
  example: examples.controlled,
  title: "navigation-menu.controlled.title",
};

/**
 * Hand-written scene for every alignment of the viewport against the open trigger.
 */
export const aligned: Scene = {
  about: "navigation-menu.aligned.about",
  draw: () => (
    <Matrix direction="column" knob="align" of={ALIGNS}>
      {(align) => windowed("xs", <examples.aligned.Aligned align={align} />)}
    </Matrix>
  ),
  example: examples.aligned,
  props: { align: "start" },
  title: "navigation-menu.aligned.title",
};

export default specimen({
  about: "navigation-menu.about",
  id: "components/navigation/navigation-menu",
  imports: 'import { NavigationMenu } from "@stealthscale/component-navigation";',
  scenes: [header, size, palette, inline, sidebar, click, controlled, aligned],
  title: "navigation-menu.title",
});
