/**
 * Starts the application once the browser has loaded the page.
 *
 * @remarks
 *   The theme's stylesheet is imported before the application, so the page has the compiled rules
 *   before the first paint. The page's own stylesheet sets the measure and the catalogue's table.
 */

import { createRoot } from "react-dom/client";

import "@stealthscale/theme/styles.css";
import "#styles.css";

import { App } from "#app.tsx";

/**
 * Selects the element this application renders into, and is null when the page has none.
 */
const root = document.querySelector("#root");

if (root !== null) createRoot(root).render(<App />);
