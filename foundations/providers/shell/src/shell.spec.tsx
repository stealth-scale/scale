import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { memoryStore } from "@stealthscale/settings";

import { CATALOGUES } from "#catalogues.fixtures.ts";
import {
  Chosen,
  Picked,
  Rooted,
  ShortcutDefaults,
  Sized,
  Switched,
  Worded,
  Written,
} from "#shell.fixtures.tsx";
import { Shell, type ShellProps } from "#shell.tsx";

/**
 * Mounts one reader under the shell, with the browser asking for one set of languages.
 *
 * @param reader - The reader to mount.
 * @param props - What the shell is given beyond the application and a fresh store.
 * @param languages - What the browser asks for.
 */
function shell(
  reader: ReactElement,
  props: Partial<ShellProps> = {},
  languages: readonly string[] = ["en-US"],
): void {
  vi.stubGlobal("navigator", { languages });

  render(
    <Shell app="probe" store={memoryStore()} {...props}>
      {reader}
    </Shell>,
  );

  vi.unstubAllGlobals();
}

describe("Shell", () => {
  it("reads American English left to right when it is offered no locale", () => {
    shell(<Written />, {}, []);

    expect(screen.getByText("en-US/ltr")).toBeTruthy();
  });

  it("turns the writing around for a right-to-left locale", () => {
    shell(<Written />, { locales: ["ar-EG"] });

    expect(screen.getByText("ar-EG/rtl")).toBeTruthy();
  });

  it("writes the locale and the direction onto the document root", () => {
    shell(<Written />, { locales: ["ar-EG"] });

    expect(document.documentElement.lang).toBe("ar-EG");
    expect(document.documentElement.dir).toBe("rtl");
  });

  it("reads the catalogues in the locale in force", () => {
    shell(<Worded />, { catalogues: CATALOGUES, locales: ["nl", "en"] }, ["nl"]);

    expect(screen.getByText("Opdrachten")).toBeTruthy();
  });

  it("resolves a key to itself when it is given no catalogues", () => {
    shell(<Worded />);

    expect(screen.getByText("commands")).toBeTruthy();
  });

  it("switches the document to the first theme it offers", () => {
    shell(<Switched />, { themes: ["forge", "fathom"] });

    expect(screen.getByText("forge/none")).toBeTruthy();
  });

  it("offers the themes it is given for a person to pick from", () => {
    shell(<Picked />, { themes: ["forge", "fathom"] });

    expect(screen.getByText("forge of forge,fathom")).toBeTruthy();
  });

  it("follows the machine's colour mode until a person chooses", () => {
    shell(<Chosen />);

    expect(screen.getByText("system")).toBeTruthy();
  });

  it("leaves the colour mode attribute off while a person follows the machine", () => {
    shell(<Switched />, { themes: ["forge"] });

    expect(document.documentElement.dataset["colorMode"]).toBeUndefined();
  });

  it("roots the tree in the page's document when it is given no node", () => {
    shell(<Rooted />);

    expect(screen.getByText("page")).toBeTruthy();
  });

  it("roots the tree in a node it is given", () => {
    shell(<Rooted />, { rootNode: document.implementation.createHTMLDocument() });

    expect(screen.getByText("elsewhere")).toBeTruthy();
  });

  it("starts every shortcut from the library's own defaults", () => {
    shell(<ShortcutDefaults />);

    expect(screen.getByText(/ignoreInputs:/u)).toBeTruthy();
  });

  it("starts every shortcut from the defaults it is given", () => {
    shell(<ShortcutDefaults />, { hotkeys: { hotkey: { ignoreInputs: false } } });

    expect(screen.getByText("ignoreInputs:false")).toBeTruthy();
  });

  it("offers the widths it is given", () => {
    shell(<Sized />, {
      sizes: [
        { min: 0, name: "compact" },
        { min: 900, name: "wide" },
      ],
    });

    expect(screen.getByText("compact,wide")).toBeTruthy();
  });
});
