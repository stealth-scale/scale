/**
 * Renders the page: a button that switches the document's color mode, and a row of buttons in
 * every look.
 *
 * @remarks
 *   The application installs one theme, the default, so the page passes the provider no theme and
 *   the theme attribute is not set on the document. The provider writes the color mode on the
 *   document root, so the whole page switches at once. The page layout uses `css` with the same
 *   semantic tokens a recipe uses.
 */

import { type ReactElement, useState } from "react";

import { Button } from "@stealthscale/example-lib-actions";
import { type ColorMode, css, ThemeProvider } from "@stealthscale/theme";

/**
 * Lays the page out as a column with the large gap and inset.
 */
const page = css({ display: "flex", flexDirection: "column", gap: "gap.lg", padding: "inset.lg" });

/**
 * Sets the title in the large heading style.
 */
const title = css({ textStyle: "heading.lg" });

/**
 * Lays out a row of controls that wraps when it is too narrow.
 */
const row = css({ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "gap.sm" });

/**
 * Renders the page and switches the document to the color mode the user selects.
 */
export function App(): ReactElement {
  const [mode, setMode] = useState<ColorMode>("light");

  return (
    <ThemeProvider colorMode={mode}>
      <main className={page}>
        <h1 className={title}>Fathom</h1>
        <p className={row}>
          <Button
            onClick={() => {
              setMode(mode === "light" ? "dark" : "light");
            }}
            variant="outline"
          >
            {mode === "light" ? "Dark mode" : "Light mode"}
          </Button>
        </p>
        <p className={row}>
          <Button>Solid</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button palette="error">Delete</Button>
          <Button size="lg">Large</Button>
        </p>
      </main>
    </ThemeProvider>
  );
}
