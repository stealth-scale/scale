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

const STATEMENT = 'import { Badge } from "@stealthscale/component-data";';

function page(scenes: readonly unknown[]): unknown {
  return { default: { id: "data/badge", scenes } };
}

describe("Page", () => {
  it("renders the entry title as the level 1 heading", async () => {
    const { getByRole } = await drawn(<Page entry={entry(page([]))} />);

    expect(getByRole("heading", { level: 1 }).textContent).toBe("Badge");
  });

  it("renders the about text the entry declares", async () => {
    const { getByText } = await drawn(<Page entry={entry(page([]), "A small label.")} />);

    expect(getByText("A small label.")).toBeDefined();
  });

  it("renders no about text when the entry declares none", async () => {
    const { container } = await drawn(<Page entry={entry(page([]))} />);

    expect(container.textContent).toBe("BadgeExamples0Props");
  });

  it("renders no back link when back is absent", async () => {
    const { queryByRole } = await drawn(<Page entry={entry(page([]))} />);

    expect(queryByRole("link")).toBeNull();
  });

  it("renders each scene the page lists", async () => {
    const { getByText } = await drawn(<Page entry={entry(page([SIZES]))} />);

    expect(getByText("drawn")).toBeDefined();
  });

  it("renders a scene as a region named after its title", async () => {
    const { getByRole } = await drawn(<Page entry={entry(page([SIZES]))} />);

    expect(getByRole("region", { name: "Sizes" })).toBeDefined();
  });

  it("renders a scene title as a level 2 heading", async () => {
    const { getByRole } = await drawn(<Page entry={entry(page([SIZES]))} />);

    expect(getByRole("heading", { level: 2 }).textContent).toBe("Sizes");
  });

  it("sets a scene region id to the slug of its title", async () => {
    const looks = { draw: marked, title: "Looks and sizes" };
    const { getByRole } = await drawn(<Page entry={entry(page([looks]))} />);

    expect(getByRole("region", { name: "Looks and sizes" }).id).toBe("looks-and-sizes");
  });

  it("links each scene from the on-this-page navigation", async () => {
    const { getByRole } = await drawn(<Page entry={entry(page([SIZES]))} />);
    const rail = getByRole("navigation", { name: "On this page" });

    expect(rail.querySelector("a")?.getAttribute("href")).toBe("#sizes");
  });

  it("renders no on-this-page navigation for a page with no scenes", async () => {
    const { queryByRole } = await drawn(<Page entry={entry(page([]))} />);

    expect(queryByRole("navigation", { name: "On this page" })).toBeNull();
  });

  it("resolves the entry title through the namespace the entry names", async () => {
    const keyed = { about: "rail.ungrouped", draw: marked, title: "rail.label" };
    const named = { ...entry(page([keyed]), "page.back", "specimen"), title: "index.title" };
    const { getByRole } = await drawn(<Page entry={named} />);

    expect(getByRole("heading", { level: 1 }).textContent).toBe("Catalogue");
  });

  it("resolves a scene title through the namespace the entry names", async () => {
    const keyed = { about: "rail.ungrouped", draw: marked, title: "rail.label" };
    const named = { ...entry(page([keyed]), "page.back", "specimen"), title: "index.title" };
    const { getByRole } = await drawn(<Page entry={named} />);

    expect(getByRole("heading", { level: 2 }).textContent).toBe("Catalogue");
  });

  it("resolves a scene about text through the namespace the entry names", async () => {
    const keyed = { about: "rail.ungrouped", draw: marked, title: "rail.label" };
    const named = { ...entry(page([keyed]), "page.back", "specimen"), title: "index.title" };
    const { getByText } = await drawn(<Page entry={named} />);

    expect(getByText("Other")).toBeDefined();
  });

  it("renders the about text a scene declares", async () => {
    const { getByText } = await drawn(<Page entry={entry(page([SIZES]))} />);

    expect(getByText("Every step.")).toBeDefined();
  });

  it("renders a backtick span of an about text as a code element", async () => {
    const looks = { about: "The `glass` look.", draw: marked, title: "Looks" };
    const { container } = await drawn(<Page entry={entry(page([looks]), "One `size`.")} />);

    expect(
      Array.from(container.querySelectorAll("code"), (code) => code.textContent),
    ).toStrictEqual(["size", "glass"]);
  });

  it("renders a scene inside the card of its section", async () => {
    const { container, getByText } = await drawn(<Page entry={entry(page([SIZES]))} />);

    expect(slotElement(container, "card", "root").contains(getByText("drawn"))).toBe(true);
  });

  it("renders no about text for a scene that declares none", async () => {
    const quiet = { draw: marked, title: "Sizes" };
    const { queryByText } = await drawn(<Page entry={entry(page([quiet]))} />);

    expect(queryByText("Every step.")).toBeNull();
  });

  it("renders no scene for a module that declares no page", async () => {
    const { container } = await drawn(<Page entry={entry({})} />);

    expect(container.textContent).toBe("BadgeExamples0Props");
  });

  it("renders the failure message when the module rejects", async () => {
    const broken: Indexed = { ...entry({}), load: () => Promise.reject(new Error("gone")) };
    const { getByRole } = await drawn(<Page entry={broken} />);

    expect(getByRole("alert").textContent).toBe("This page could not be loaded: gone");
  });

  it("renders a reload button when the module rejects", async () => {
    const broken: Indexed = { ...entry({}), load: () => Promise.reject(new Error("gone")) };
    const { getByRole } = await drawn(<Page entry={broken} />);

    expect(getByRole("button", { name: "Reload the page" })).toBeDefined();
  });

  it("unmounts without throwing while the module is pending", () => {
    const { unmount } = render(<Page entry={entry(page([SIZES]))} />);

    expect(() => {
      unmount();
    }).not.toThrow();
  });

  it("unmounts without throwing when the module rejects afterwards", async () => {
    const broken: Indexed = { ...entry({}), load: () => Promise.reject(new Error("gone")) };
    const { unmount } = render(<Page entry={broken} />);

    unmount();

    await expect(broken.load()).rejects.toThrow("gone");
  });

  it("renders the scenes of the module a hot update supplies", async () => {
    const { queryAllByText } = await drawn(<Page entry={entry(page([]))} />);
    const added = { ...SIZES, title: "Added" };

    expect(queryAllByText("Added")).toHaveLength(0);

    act(() => {
      window.dispatchEvent(
        new CustomEvent(UPDATED, { detail: { id: "data/badge", module: page([added]) } }),
      );
    });

    expect(queryAllByText("Added")).not.toHaveLength(0);
  });

  it("renders the import statement the page declares", async () => {
    const stated = { default: { id: "data/badge", imports: STATEMENT, scenes: [SIZES] } };
    const { container } = await drawn(<Page entry={entry(stated)} />);

    expect(slotElement(container, "code-block", "code").textContent).toBe(STATEMENT);
  });

  it("renders a source disclosure for a scene that declares source", async () => {
    const carried = { ...SIZES, source: '<Badge size="sm" />' };
    const { getByRole } = await drawn(<Page entry={entry(page([carried]))} />);

    expect(getByRole("button", { name: "Source" })).toBeDefined();
  });

  it("renders no source disclosure for a scene that declares none", async () => {
    const { getByText, queryByRole } = await drawn(<Page entry={entry(page([SIZES]))} />);

    expect(getByText("drawn")).toBeDefined();
    expect(queryByRole("button", { name: "Source" })).toBeNull();
  });
});
