/**
 * Opens a page of the catalogue in a browser the way a reader would see it: a theme, a colour
 * mode, a viewport and a device scale, with a scene picked out where one is named.
 *
 * @remarks
 *   The theme and the colour mode are written into the page's storage before it loads, under the
 *   keys the shell reads its settings from, so the page wakes up wearing them rather than being
 *   switched after the fact. The colour mode is also set on the browser context, so a page that
 *   follows the system preference agrees with the stored choice. Every scene is a section named
 *   by its heading, so a scene is found by its title or by its place on the page. A control is
 *   put into a state, hovered, focused from the keyboard or held down, the way a reader would put
 *   it there, so the recipe answers with the rules a reader gets.
 */

import {
  type Browser,
  type BrowserContext,
  chromium,
  firefox,
  type Locator,
  type Page,
  webkit,
} from "playwright";

/**
 * The browsers a target can name.
 */
export const BROWSERS = ["chromium", "firefox", "webkit"] as const;

/**
 * The colour modes a target can name.
 */
export const MODES = ["light", "dark"] as const;

/**
 * The states a control can be captured in.
 */
export const STATES = ["rest", "hover", "focus", "active"] as const;

/**
 * The application the catalogue stores its settings under.
 */
const APP = "docs";

/**
 * How many presses of Tab are tried before a control is given up on as unreachable.
 */
const TAB_LIMIT = 400;

/**
 * Describes where and how a page is opened.
 */
export interface Target {
  /**
   * The browser to open it in.
   */
  readonly browser: (typeof BROWSERS)[number];

  /**
   * Whether the page is read in a forced colours mode, such as Windows high contrast.
   */
  readonly forcedColors: boolean;

  /**
   * The viewport's height in CSS pixels.
   */
  readonly height: number;

  /**
   * The colour mode, or the page's own where none is named.
   */
  readonly mode?: (typeof MODES)[number] | undefined;

  /**
   * A control to press before anything is read, so a panel it opens is open.
   */
  readonly open?: string | undefined;

  /**
   * The page's path under `/components`, such as `actions/button`.
   */
  readonly page: string;

  /**
   * The port the catalogue's server listens on.
   */
  readonly port: number;

  /**
   * Keys to type once the page is open, so a reading shows what the keyboard does. Commas separate
   * them and a star repeats one, as in `ArrowDown*12`.
   */
  readonly press?: string | undefined;

  /**
   * Whether the page is read by someone who asked for less motion.
   */
  readonly reducedMotion: boolean;

  /**
   * The device scale factor, which is what a high density screen draws at.
   */
  readonly scale: number;

  /**
   * The theme, or the page's own where none is named.
   */
  readonly theme?: string | undefined;

  /**
   * The viewport's width in CSS pixels.
   */
  readonly width: number;
}

/**
 * Describes an open page and what it reported while loading.
 */
export interface Opened {
  /**
   * Closes the page and its context, leaving the browser for the next target.
   */
  readonly close: () => Promise<void>;

  /**
   * The errors the page's console reported, and any error thrown in the page.
   */
  readonly errors: readonly string[];

  /**
   * The page, loaded and settled.
   */
  readonly page: Page;
}

/**
 * Writes a setting the way the shell's own store writes it.
 */
function stored(name: string, value: string | undefined): string {
  const key = `stealth.${APP}.${name}`;

  return value === undefined
    ? `localStorage.removeItem(${JSON.stringify(key)});`
    : `localStorage.setItem(${JSON.stringify(key)}, ${JSON.stringify(value)});`;
}

/**
 * Launches a browser by name, once for every target that names it.
 */
export function launched(name: (typeof BROWSERS)[number]): Promise<Browser> {
  const launchers = { chromium, firefox, webkit };

  return launchers[name].launch();
}

/**
 * Builds the address of a page.
 */
export function addressOf(target: Target): string {
  return `http://localhost:${String(target.port)}/components/${target.page}`;
}

/**
 * Finds the elements a selector names, or throws naming the selector, rather than waiting for
 * an element that will never come.
 *
 * @param page - The open page.
 * @param selector - Which elements to find.
 * @param within - The region to look in, or the page.
 * @returns The elements found, at least one.
 * @throws {@link Error} When nothing matches.
 */
export async function present(page: Page, selector: string, within?: Locator): Promise<Locator> {
  const found = (within ?? page).locator(selector);

  if ((await found.count()) === 0) throw new Error(`nothing matches ${selector}`);

  return found;
}

/**
 * Types the keys a reading asked for, one after another.
 *
 * @remarks
 *   A key may be repeated with a star, `ArrowDown*12`. One press says nothing about what the
 *   twelfth does, and a reader crosses a long list by keeping the key down. Each press waits, so a
 *   component that answers on a frame has answered before the next one.
 * @param page - The open page.
 * @param keys - The keys, separated by commas.
 */
async function typed(page: Page, keys: string): Promise<void> {
  for (const each of keys.split(",")) {
    const [key = "", times = "1"] = each.trim().split("*");

    for (let at = 0; at < Number(times); at += 1) {
      await page.keyboard.press(key);
      await page.waitForTimeout(60);
    }
  }
}

/**
 * Opens a page in a browser already launched, wearing the theme and the colour mode the target
 * names, in a context of its own.
 *
 * @param browser - The browser, launched for the target's name.
 * @param target - Where and how to open the page.
 * @returns The page once it has settled, with what its console reported.
 * @throws {@link Error} When the catalogue has no page at the address, or nothing matches what
 *   `open` names.
 */
export async function opened(browser: Browser, target: Target): Promise<Opened> {
  const context: BrowserContext = await browser.newContext({
    ...(target.mode === undefined ? {} : { colorScheme: target.mode }),
    deviceScaleFactor: target.scale,
    forcedColors: target.forcedColors ? "active" : "none",
    reducedMotion: target.reducedMotion ? "reduce" : "no-preference",
    viewport: { height: target.height, width: target.width },
  });

  await context.addInitScript(
    `try { ${stored("theme", target.theme)} ${stored("color-mode", target.mode)} } catch (error) {}`,
  );

  const page = await context.newPage();
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  await page.goto(addressOf(target));
  await page.waitForLoadState("networkidle");
  await page.waitForSelector("#root > *");
  await page.waitForTimeout(800);

  if ((await page.locator("main h1").count()) === 0) {
    await context.close();
    throw new Error(`no page at ${addressOf(target)}; the catalogue draws nothing there`);
  }

  if (target.open !== undefined) {
    await (await present(page, target.open)).first().click();
    await page.waitForTimeout(400);
  }

  if (target.press !== undefined) {
    await typed(page, target.press);
  }

  return {
    close: async () => {
      await context.close();
    },
    errors,
    page,
  };
}

/**
 * Runs a step for every target, opening each in a browser launched once per browser named, and
 * closes the browsers after.
 *
 * @param targets - The targets, in order.
 * @param step - The step to run on each open page.
 */
export async function eachOpened(
  targets: readonly Target[],
  step: (opened: Opened, target: Target) => Promise<void>,
): Promise<void> {
  const browsers = new Map<(typeof BROWSERS)[number], Browser>();

  try {
    for (const target of targets) {
      const browser = browsers.get(target.browser) ?? (await launched(target.browser));

      browsers.set(target.browser, browser);

      const page = await opened(browser, target);

      try {
        await step(page, target);
      } finally {
        await page.close();
      }
    }
  } finally {
    for (const browser of browsers.values()) await browser.close();
  }
}

/**
 * Finds a scene on the page: the section whose heading holds the words, or the nth section where
 * the words are a number.
 *
 * @param page - The open page.
 * @param scene - The title, or part of it, or a one-based place on the page.
 * @returns The section, or undefined where no scene matches.
 */
export async function sceneOf(page: Page, scene: string): Promise<Locator | undefined> {
  const sections = page.locator("main section");
  const place = Number(scene.trim());

  if (Number.isInteger(place)) {
    return (await sections.count()) >= place && place > 0 ? sections.nth(place - 1) : undefined;
  }

  const found = sections.filter({ has: page.locator("h2", { hasText: new RegExp(scene, "iu") }) });

  return (await found.count()) > 0 ? found.first() : undefined;
}

/**
 * Lists the titles of the scenes on the page, in order.
 */
export function scenesOn(page: Page): Promise<readonly string[]> {
  return page.locator("main section h2").allTextContents();
}

/**
 * Picks what to read or capture: a scene, the elements a selector finds within it, the elements
 * a selector finds anywhere on the page, or the main region.
 *
 * @remarks
 *   A scene narrows and a selector picks within it, so `[data-recipe=toolbar]` under a scene is
 *   the scene's toolbar and not the catalogue's own bar. Without a scene the selector reaches the
 *   whole document, which is how the chrome is read.
 * @param page - The open page.
 * @param scene - The scene named, or undefined.
 * @param select - A selector, or an empty string.
 * @returns The locator.
 * @throws {@link Error} When a scene is named and no section matches it, or a selector is named
 *   and nothing matches it.
 */
export async function rooted(
  page: Page,
  scene: string | undefined,
  select: string,
): Promise<Locator> {
  if (scene === undefined) {
    return select === "" ? page.locator("main") : present(page, select);
  }

  const section = await sceneOf(page, scene);

  if (section === undefined) {
    const titles = await scenesOn(page);

    throw new Error(`no scene matches ${scene}; the page holds ${titles.join(", ")}`);
  }

  return select === "" ? section : present(page, select, section);
}

/**
 * Moves focus onto a control from the keyboard, so the browser draws it as focused visibly.
 *
 * @remarks
 *   Focus given from a script is not focus given from a keyboard, and a browser draws the ring
 *   only for the latter. Tab is pressed from the top of the document until the control, or
 *   something inside it, holds the focus, which is what a reader does. Inside it counts, because a
 *   checkbox or a switch is a label round the input a reader reaches.
 */
async function tabbedTo(page: Page, control: Locator): Promise<void> {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });

  for (let pressed = 0; pressed < TAB_LIMIT; pressed += 1) {
    await page.keyboard.press("Tab");

    const reached = await control.evaluate(
      (element) =>
        element === document.activeElement ||
        (document.activeElement !== null && element.contains(document.activeElement)),
    );

    if (reached) return;
  }

  throw new Error("the control was not reached by Tab; is it focusable?");
}

/**
 * Puts a control into a state, and returns what undoes it.
 *
 * @param page - The open page.
 * @param control - The element to put in the state.
 * @param state - The state to put it in.
 * @returns A function that returns the control to rest.
 */
export function staged(
  page: Page,
  control: Locator,
  state: (typeof STATES)[number],
): Promise<() => Promise<void>> {
  const staging: Record<(typeof STATES)[number], () => Promise<() => Promise<void>>> = {
    active: async () => {
      await control.hover();
      await page.mouse.down();

      return async () => {
        await page.mouse.up();
        await page.mouse.move(0, 0);
      };
    },
    focus: async () => {
      await tabbedTo(page, control);

      return async () => {
        await control.blur();
      };
    },
    hover: async () => {
      await control.hover();

      return async () => {
        await page.mouse.move(0, 0);
      };
    },
    rest: () => Promise.resolve(() => Promise.resolve()),
  };

  return staging[state]();
}

/**
 * Opens every region that scrolls on its own, so the whole page can be captured in one image.
 *
 * @remarks
 *   The catalogue scrolls its main region rather than the document, and a full-page capture only
 *   sees what the document scrolls. Each scrolling region is given its full height and the boxes
 *   above it are let grow, until the document stops growing.
 */
export async function unclamped(page: Page): Promise<void> {
  for (let round = 0; round < 6; round += 1) {
    const grew = await page.evaluate(() => {
      const before = document.documentElement.scrollHeight;

      document.documentElement.style.height = "auto";
      document.body.style.height = "auto";

      for (const each of document.querySelectorAll<HTMLElement>("*")) {
        const style = getComputedStyle(each);
        const scrolls = style.overflowY === "auto" || style.overflowY === "scroll";

        if (
          !(scrolls || style.overflowY === "hidden") ||
          each.scrollHeight <= each.clientHeight + 4
        ) {
          continue;
        }

        each.style.overflow = "visible";
        each.style.height = "auto";
        each.style.maxHeight = "none";
        each.style.blockSize = "auto";
        each.style.maxBlockSize = "none";

        let up = each.parentElement;

        while (up !== null && up !== document.body) {
          up.style.height = "auto";
          up.style.maxHeight = "none";
          up.style.blockSize = "auto";
          up.style.maxBlockSize = "none";
          up.style.minHeight = "0";
          up.style.minBlockSize = "0";
          up = up.parentElement;
        }
      }

      return document.documentElement.scrollHeight > before;
    });

    if (!grew) break;
  }

  await page.waitForTimeout(200);
}
