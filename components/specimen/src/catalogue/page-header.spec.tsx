import { type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import { Page } from "@stealthscale/component-screen";
import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Header } from "#catalogue/page-header.tsx";
import { type Indexed } from "#catalogue/types.ts";

function entry(about = "", group = "Data", namespace = ""): Indexed {
  return {
    about,
    group,
    id: "data/badge",
    load: () => Promise.resolve({}),
    namespace,
    package: "@stealthscale/component-data",
    path: "src/badge.specimen.tsx",
    title: "Badge",
  };
}

function headed(indexed: Indexed): ReactElement {
  return (
    <Page.Root>
      <Header entry={indexed} />
    </Page.Root>
  );
}

describe("Header", () => {
  it("heads the page with its title", async () => {
    const { getByRole } = await drawn(headed(entry()));

    expect(getByRole("heading", { level: 1 }).textContent).toBe("Badge");
  });

  it("opens with the sentence the page declares", async () => {
    const { getByText } = await drawn(headed(entry("A small label.")));

    expect(getByText("A small label.")).toBeDefined();
  });

  it("writes no opening where the page declares none", async () => {
    const { container } = await drawn(headed(entry()));

    expect(container.querySelector(".page__description")).toBeNull();
  });

  it("names the group the page is filed under beside the title", async () => {
    const { container } = await drawn(headed(entry()));

    expect(slotElement(container, "page", "meta").textContent).toBe("Data");
  });

  it("names no group beside the title of a page filed under none", async () => {
    const { container } = await drawn(headed(entry("", "")));

    expect(container.querySelector(".page__meta")).toBeNull();
  });

  it("states no trail where the page was placed under nothing", async () => {
    const { queryByRole } = await drawn(headed(entry()));

    expect(queryByRole("link")).toBeNull();
  });

  it("resolves the title and the opening through the namespace named", async () => {
    const named = { ...entry("page.back", "Data", "specimen"), title: "index.title" };
    const { getByRole, getByText } = await drawn(headed(named));

    expect(getByRole("heading", { level: 1 }).textContent).toBe("Components");
    expect(getByText("Components", { selector: "p" })).toBeDefined();
  });

  it("draws the code spans of the opening as code", async () => {
    const { container } = await drawn(headed(entry("One `size`.")));

    expect(container.querySelector("code")?.textContent).toBe("size");
  });
});
