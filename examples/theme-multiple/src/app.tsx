/**
 * Renders the page: controls that switch the document's theme and color mode, a row of buttons in
 * every look, a panel with its own theme, and the example sections.
 *
 * @remarks
 *   The provider writes the theme and color mode attributes on the document root, so the whole page
 *   switches at once. The Forge panel sets `data-theme` on itself, which applies another theme to a
 *   subtree. The page layout uses `css` with the same semantic tokens a recipe uses, so every theme
 *   restyles it.
 */

import { type ChangeEvent, type ReactElement, useState } from "react";

import { Button } from "@stealthscale/example-lib-actions";
import { type ColorMode, css, ThemeProvider } from "@stealthscale/theme";

import { Badge } from "#badge/badge.ts";
import { Bento } from "#bento.tsx";
import { Candy } from "#candy.tsx";
import { Cards } from "#cards.tsx";
import { Looks } from "#looks.tsx";
import { Motions } from "#motions.tsx";
import { Published } from "#published.tsx";

/**
 * The themes the application installs, in the order `theme.config.ts` lists them.
 */
const THEMES = [
  "fathom",
  "folio",
  "forge",
  "abyss",
  "graphite",
  "graphite-dimmed",
  "graphite-contrast",
  "steel",
  "steel-gray",
  "compass",
  "compass-contrast",
  "quartz",
  "asphalt",
  "pebble",
  "lantern",
  "prism",
] as const;

/**
 * Selects one of the installed themes.
 */
type ThemeName = (typeof THEMES)[number];

/**
 * Lays the page out as a column with the large gap and inset, over a dotted backdrop.
 */
const page = css({
  display: "flex",
  flexDirection: "column",
  gap: "gap.lg",
  layerStyle: "backdrop.dots",
  minHeight: "100dvh",
  padding: "inset.lg",
});

/**
 * Sets the title in the large heading style.
 */
const title = css({ textStyle: "heading.lg" });

/**
 * Lays out a row of controls that wraps when it is too narrow.
 */
const row = css({ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "gap.sm" });

/**
 * Sticks the switches to the top of the page, on the page background so scrolled content is
 * hidden behind them.
 */
const switches = css({
  alignItems: "center",
  background: "bg",
  display: "flex",
  flexWrap: "wrap",
  gap: "gap.sm",
  paddingBlock: "inset.sm",
  position: "sticky",
  top: "0",
  zIndex: "sticky",
});

/**
 * Styles a panel on the panel background, with the medium corner and inset.
 */
const panel = css({
  background: "bg.panel",
  borderColor: "border",
  borderRadius: "l2",
  borderWidth: "sm",
  display: "flex",
  flexDirection: "column",
  gap: "gap.md",
  padding: "inset.md",
});

/**
 * Reports whether a select's value is the name of an installed theme.
 */
function isThemeName(value: string): value is ThemeName {
  return THEMES.some((name) => name === value);
}

/**
 * Renders the page and switches the document to the theme and color mode the user selects.
 */
export function App(): ReactElement {
  const [themeName, setThemeName] = useState<ThemeName>(THEMES[0]);
  const [mode, setMode] = useState<ColorMode>("light");

  /**
   * Switches the document to the theme selected in the select element.
   */
  const pickTheme = (event: ChangeEvent<HTMLSelectElement>): void => {
    if (isThemeName(event.target.value)) setThemeName(event.target.value);
  };

  return (
    <ThemeProvider colorMode={mode} theme={themeName}>
      <main className={page}>
        <h1 className={title}>Themed</h1>
        <p className={switches}>
          <label htmlFor="theme">Theme</label>
          <select id="theme" onChange={pickTheme} value={themeName}>
            {THEMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <Button
            onClick={() => {
              setMode(mode === "light" ? "dark" : "light");
            }}
            variant="outline"
          >
            {mode === "light" ? "Dark mode" : "Light mode"}
          </Button>
          <Badge>{mode}</Badge>
        </p>
        <p className={row}>
          <Button>Solid</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button palette="error">Delete</Button>
          <Button size="lg">Large</Button>
        </p>
        <section className={panel} data-theme="forge">
          <h2>A panel wearing forge</h2>
          <p className={row}>
            <Button>Solid in forge</Button>
            <Button variant="subtle">Subtle in forge</Button>
            <Button size="lg">Hero in forge</Button>
          </p>
        </section>
        <Cards />
        <Candy />
        <Looks />
        <Motions />
        <Bento />
        <Published />
      </main>
    </ThemeProvider>
  );
}
