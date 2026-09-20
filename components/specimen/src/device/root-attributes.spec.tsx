import { type ReactElement } from "react";
import { renderToString } from "react-dom/server";

import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useRootAttributes } from "#device/root-attributes.ts";

function Read(): ReactElement {
  return <output>{useRootAttributes()}</output>;
}

/**
 * Writes an attribute on the document root and lets the observer report it.
 */
async function written(name: string, value?: string): Promise<void> {
  await act(async () => {
    if (value === undefined) document.documentElement.removeAttribute(name);
    else document.documentElement.setAttribute(name, value);
    await Promise.resolve();
  });
}

/**
 * Writes all three, or clears them.
 */
async function rooted(theme?: string, mode?: string, lang?: string): Promise<void> {
  await written("data-theme", theme);
  await written("data-color-mode", mode);
  await written("lang", lang);
}

describe("useRootAttributes", () => {
  it("reads the theme, the mode and the language off the document root as one string", async () => {
    await rooted("ink", "dark", "nl");

    const { container } = render(<Read />);

    expect(container.textContent).toBe("ink/dark/nl");

    await rooted();
  });

  it("follows a change to any of the three", async () => {
    await rooted("ink", "dark", "nl");

    const { container } = render(<Read />);

    await written("data-color-mode");

    expect(container.textContent).toBe("ink//nl");

    await rooted();

    expect(container.textContent).toBe("//");
  });

  it("reads nothing where there is no document to read", () => {
    expect(renderToString(<Read />)).toBe("<output></output>");
  });
});
