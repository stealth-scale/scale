import { type ReactElement } from "react";

import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Page } from "#catalogue/page.tsx";
import { type Indexed } from "#catalogue/types.ts";
import { UPDATED } from "#catalogue/updated.ts";

function entry(module: unknown, about = "", namespace = ""): Indexed {
  return {
    about,
    group: "Data",
    id: "data/badge",
    load: () => Promise.resolve(module),
    namespace,
    package: "@stealthscale/component-data",
    path: "src/badge.specimen.tsx",
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

    expect(container.textContent).toBe("BadgeDataExamples0Props");
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

  it("anchors each scene by its worded title", async () => {
    const looks = { draw: marked, title: "Looks and sizes" };
    const { getByRole } = await drawn(<Page entry={entry(page([looks]))} />);

    expect(getByRole("region", { name: "Looks and sizes" }).id).toBe("looks-and-sizes");
  });

  it("lists the scenes in a rail beside the page", async () => {
    const { getByRole } = await drawn(<Page entry={entry(page([SIZES]))} />);
    const rail = getByRole("navigation", { name: "On this page" });

    expect(rail.querySelector("a")?.getAttribute("href")).toBe("#sizes");
  });

  it("draws no rail beside a page with no scenes", async () => {
    const { queryByRole } = await drawn(<Page entry={entry(page([]))} />);

    expect(queryByRole("navigation", { name: "On this page" })).toBeNull();
  });

  it("resolves the title, the opening and a scene's words through the namespace named", async () => {
    const keyed = { about: "rail.ungrouped", draw: marked, title: "rail.label" };
    const named = { ...entry(page([keyed]), "page.back", "specimen"), title: "index.title" };
    const { getByRole, getByText } = await drawn(<Page entry={named} />);

    expect(getByRole("heading", { level: 1 }).textContent).toBe("Components");
    expect(getByRole("heading", { level: 2 }).textContent).toBe("Components");
    expect(getByText("Other")).toBeDefined();
  });

  it("opens a scene with the sentence it declares", async () => {
    const { getByText } = await drawn(<Page entry={entry(page([SIZES]))} />);

    expect(getByText("Every step.")).toBeDefined();
  });

  it("draws the code spans of a sentence as code", async () => {
    const looks = { about: "The `glass` look.", draw: marked, title: "Looks" };
    const { container } = await drawn(<Page entry={entry(page([looks]), "One `size`.")} />);

    expect(
      Array.from(container.querySelectorAll("code"), (code) => code.textContent),
    ).toStrictEqual(["size", "glass"]);
  });

  it("stands a scene's component on a stage inside its section", async () => {
    const { container, getByText } = await drawn(<Page entry={entry(page([SIZES]))} />);

    expect(slotElement(container, "card", "root").contains(getByText("drawn"))).toBe(true);
  });

  it("writes no opening for a scene that declares none", async () => {
    const quiet = { draw: marked, title: "Sizes" };
    const { queryByText } = await drawn(<Page entry={entry(page([quiet]))} />);

    expect(queryByText("Every step.")).toBeNull();
  });

  it("draws no scene for a module that declares no page", async () => {
    const { container } = await drawn(<Page entry={entry({})} />);

    expect(container.textContent).toBe("BadgeDataExamples0Props");
  });

  it("draws no scene where the module failed to load", async () => {
    const broken: Indexed = { ...entry({}), load: () => Promise.reject(new Error("gone")) };
    const { container } = await drawn(<Page entry={broken} />);

    expect(container.textContent).toBe("BadgeDataExamples0Props");
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

  it("redraws the page with the module a hot update replaced its own with", async () => {
    const { container, queryAllByText } = await drawn(<Page entry={entry(page([]))} />);
    const added = { ...SIZES, title: "Added" };

    expect(queryAllByText("Added")).toHaveLength(0);

    act(() => {
      window.dispatchEvent(
        new CustomEvent(UPDATED, { detail: { id: "data/badge", module: page([added]) } }),
      );
    });

    expect(queryAllByText("Added")).not.toHaveLength(0);

    act(() => {
      window.dispatchEvent(
        new CustomEvent(UPDATED, {
          detail: { fragments: { fragments: {}, imported: ["Chip"] }, id: "data/badge" },
        }),
      );
    });

    expect(slotElement(container, "code-block", "code").textContent).toBe(
      'import { Chip } from "@stealthscale/component-data";',
    );
  });

  it("opens with the import line once the fragments have loaded", async () => {
    const cut: Indexed = {
      ...entry(page([SIZES])),
      fragments: () => Promise.resolve({ fragments: {}, imported: ["Badge"] }),
    };
    const { container } = await drawn(<Page entry={cut} />);

    expect(slotElement(container, "code-block", "code").textContent).toBe(
      'import { Badge } from "@stealthscale/component-data";',
    );
  });

  it("folds a scene's source under its stage once the fragments have loaded", async () => {
    const cut: Indexed = {
      ...entry(page([SIZES])),
      fragments: () =>
        Promise.resolve({ fragments: { Sizes: "export const sizes = {};" }, imported: [] }),
    };
    const { getByRole } = await drawn(<Page entry={cut} />);

    expect(getByRole("button", { name: "Source" })).toBeDefined();
  });

  it("draws the scenes without their sources where the fragments fail to load", async () => {
    const broken: Indexed = {
      ...entry(page([SIZES])),
      fragments: () => Promise.reject(new Error("gone")),
    };
    const { getByText, queryByRole } = await drawn(<Page entry={broken} />);

    expect(getByText("drawn")).toBeDefined();
    expect(queryByRole("button", { name: "Source" })).toBeNull();
  });

  it("keeps quiet when the fragments fail after the page has left the screen", async () => {
    const broken: Indexed = {
      ...entry(page([SIZES])),
      fragments: () => Promise.reject(new Error("gone")),
    };
    const { unmount } = render(<Page entry={broken} />);

    unmount();

    await expect(broken.fragments?.()).rejects.toThrow("gone");
  });

  it("draws the scenes without their sources where the index cut none for the page", async () => {
    const { getByText, queryByRole } = await drawn(<Page entry={entry(page([SIZES]))} />);

    expect(getByText("drawn")).toBeDefined();
    expect(queryByRole("button", { name: "Source" })).toBeNull();
  });
});
