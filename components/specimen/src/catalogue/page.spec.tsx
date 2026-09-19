import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Page } from "#catalogue/page.tsx";
import { type Indexed } from "#catalogue/types.ts";

function entry(module: unknown, about = ""): Indexed {
  return {
    about,
    group: "Data",
    id: "data/badge",
    load: () => Promise.resolve(module),
    package: "@stealthscale/component-data",
    path: "src/badge.specimen.tsx",
    source: () => Promise.resolve({ default: "" }),
    title: "Badge",
  };
}

function marked(): ReactElement {
  return <span>drawn</span>;
}

const SIZES = { about: "Every step.", draw: marked, title: "Sizes" };

function page(scenes: readonly unknown[]): unknown {
  return { default: { id: "data/badge", scenes } };
}

describe("Page", () => {
  it("heads the page with its title", async () => {
    const { getByRole } = await drawn(<Page entry={entry(page([]))} />);

    expect(getByRole("heading", { level: 1 }).textContent).toBe("Badge");
  });

  it("opens with the sentence the page declares", async () => {
    const { getByText } = await drawn(<Page entry={entry(page([]), "A small label.")} />);

    expect(getByText("A small label.")).toBeDefined();
  });

  it("writes no opening where the page declares none", async () => {
    const { container } = await drawn(<Page entry={entry(page([]))} />);

    expect(container.textContent).toBe("Badge");
  });

  it("states no trail where the page was placed under nothing", async () => {
    const { queryByRole } = await drawn(<Page entry={entry(page([]))} />);

    expect(queryByRole("link")).toBeNull();
  });

  it("draws each scene the page lists", async () => {
    const { getByText } = await drawn(<Page entry={entry(page([SIZES]))} />);

    expect(getByText("drawn")).toBeDefined();
  });

  it("draws a scene as a section of the page", async () => {
    const { getByRole } = await drawn(<Page entry={entry(page([SIZES]))} />);

    expect(getByRole("region", { name: "Sizes" })).toBeDefined();
  });

  it("heads a scene with its title", async () => {
    const { getByRole } = await drawn(<Page entry={entry(page([SIZES]))} />);

    expect(getByRole("heading", { level: 2 }).textContent).toBe("Sizes");
  });

  it("opens a scene with the sentence it declares", async () => {
    const { getByText } = await drawn(<Page entry={entry(page([SIZES]))} />);

    expect(getByText("Every step.")).toBeDefined();
  });

  it("writes no opening for a scene that declares none", async () => {
    const quiet = { draw: marked, title: "Sizes" };
    const { queryByText } = await drawn(<Page entry={entry(page([quiet]))} />);

    expect(queryByText("Every step.")).toBeNull();
  });

  it("draws no scene for a module that declares no page", async () => {
    const { container } = await drawn(<Page entry={entry({})} />);

    expect(container.textContent).toBe("Badge");
  });

  it("draws no scene where the module failed to load", async () => {
    const broken: Indexed = { ...entry({}), load: () => Promise.reject(new Error("gone")) };
    const { container } = await drawn(<Page entry={broken} />);

    expect(container.textContent).toBe("Badge");
  });

  it("leaves the page alone when it is taken off the screen before the module arrives", () => {
    const { unmount } = render(<Page entry={entry(page([SIZES]))} />);

    expect(() => {
      unmount();
    }).not.toThrow();
  });

  it("keeps quiet when the module fails after the page has left the screen", async () => {
    const broken: Indexed = { ...entry({}), load: () => Promise.reject(new Error("gone")) };
    const { unmount } = render(<Page entry={broken} />);

    unmount();

    await expect(broken.load()).rejects.toThrow("gone");
  });
});
