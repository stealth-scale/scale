/**
 * Reads two bands of an open catalogue page: the Source panel of every scene, and the Props tab.
 *
 * @remarks
 *   Controls are located by structure, not by their English words. The Source control is the one
 *   disclosure in the scene card's last footer, and the Props tab is the last tab of the page's
 *   first tab list.
 */

import { type Page } from "playwright";

/**
 * Patterns that must not appear in a scene's Source, each with the label a fault prints.
 *
 * @remarks
 *   The specimen plugin replaces an example's `{...props}` spread with the first cell's attributes
 *   and rewrites `#` imports to the package name. A match means the Source is not an example file
 *   or the example reads its props parameter.
 */
const FORBIDDEN = [
  { label: "{...props}", pattern: /\{\.\.\.props\}/u },
  { label: "props.<name>", pattern: /\bprops\.\w/u },
  { label: "# import", pattern: /from "#/u },
];

/**
 * Longest wait, in milliseconds, for the Props tab to render its first row.
 */
const PROPS_TIMEOUT = 15_000;

/**
 * Result of reading one band.
 */
export interface Band {
  /**
   * Faults found, or an empty array.
   */
  readonly faults: readonly string[];

  /**
   * Summary printed when there are no faults.
   */
  readonly note: string;
}

/**
 * Opens the Source panel of every scene, checks its code, and closes it again.
 *
 * @remarks
 *   A scene is a `main section[id]` with an `h2`, the sections `pnpm dom` lists. The kit renders
 *   the scene's footer after the scene, so the last `.card__footer` in the section is the kit's.
 *   Its only `aria-expanded` button is the Source control until an audit has run, and a scene
 *   without a Source renders a line of text there instead.
 * @param page - The open page.
 * @returns One fault per scene without a Source and per forbidden pattern found, and the number of
 *   scenes read.
 */
export async function sourced(page: Page): Promise<Band> {
  const sections = page.locator("main section[id]").filter({ has: page.locator("h2") });
  const count = await sections.count();
  const faults: string[] = [];

  for (let index = 0; index < count; index += 1) {
    const section = sections.nth(index);
    const title = (await section.locator("h2").first().innerText()).trim();
    const control = section.locator(".card__footer").last().locator("button[aria-expanded]");

    if ((await control.count()) === 0) {
      faults.push(`${title}: no Source`);
      continue;
    }

    await control.click();

    const id = (await control.getAttribute("aria-controls")) ?? "";
    const code = await page.locator(`[id="${id}"]`).innerText();

    await control.click();

    for (const { label, pattern } of FORBIDDEN) {
      if (pattern.test(code)) faults.push(`${title}: ${label}`);
    }
  }

  return { faults, note: `${String(count)} scenes` };
}

/**
 * Opens the Props tab and waits for its first table row.
 *
 * @param page - The open page.
 * @returns A fault with the panel's text when no row renders within 15 seconds, and the row count
 *   otherwise.
 */
export async function propped(page: Page): Promise<Band> {
  const tab = page.locator("main [role=tablist]").first().getByRole("tab").last();

  await tab.click();

  const panel = page.locator(`[id="${(await tab.getAttribute("aria-controls")) ?? ""}"]`);
  const rows = panel.locator("tbody tr");

  try {
    await rows.first().waitFor({ timeout: PROPS_TIMEOUT });
  } catch {
    return { faults: [(await panel.innerText()).slice(0, 200)], note: "" };
  }

  return { faults: [], note: `${String(await rows.count())} rows` };
}
