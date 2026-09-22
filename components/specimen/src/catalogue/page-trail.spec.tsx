import { describe, expect, it } from "vitest";

import { Page } from "@stealthscale/component-screen";
import { type RouteDeclaration } from "@stealthscale/provider-router";
import { type Mounted } from "@stealthscale/testing-router";

import { onRoute } from "#catalogue/mounted.fixtures.tsx";
import { Trail } from "#catalogue/page-trail.tsx";

const CATALOGUE = "cat";

const LEVELS: readonly RouteDeclaration[] = [
  { component: () => null, id: `${CATALOGUE}.index`, path: "/" },
  { component: () => null, id: `${CATALOGUE}.components`, path: "/components" },
  { component: () => null, id: `${CATALOGUE}.components.forms`, path: "/components/forms" },
];

function drawn(above: { group?: string; section?: string }): Promise<Mounted> {
  return onRoute(
    <Page.Root>
      <Page.Header>
        <Trail catalogue={CATALOGUE} {...above} title="Input" />
      </Page.Header>
    </Page.Root>,
    LEVELS,
  );
}

describe("Trail", () => {
  it("leads from the index through the section and the group to the page", async () => {
    const { result } = await drawn({ group: "forms", section: "components" });

    expect(result.getAllByRole("link").map((one) => one.getAttribute("href"))).toStrictEqual([
      "/",
      "/components",
      "/components/forms",
    ]);
  });

  it("names the page being read without leading anywhere", async () => {
    const { result } = await drawn({ group: "forms", section: "components" });

    expect(result.getByText("Input").getAttribute("href")).toBeNull();
  });

  it("names the levels out of the catalogue rather than by their key", async () => {
    const { result } = await drawn({ group: "forms", section: "components" });

    expect(result.getByRole("link", { name: "Components" })).toBeDefined();
  });

  it("leads from the index to the section alone for a group's own index", async () => {
    const { result } = await drawn({ section: "components" });

    expect(result.getAllByRole("link").map((one) => one.getAttribute("href"))).toStrictEqual([
      "/",
      "/components",
    ]);
  });

  it("leads from the index alone for a section's own index", async () => {
    const { result } = await drawn({});

    expect(result.getAllByRole("link").map((one) => one.getAttribute("href"))).toStrictEqual(["/"]);
  });

  it("draws the landmark as the header's own context row rather than inside one", async () => {
    const { result } = await drawn({ group: "forms", section: "components" });
    const row = result.container.querySelector(".page__context");

    expect(row?.tagName).toBe("NAV");
    expect(row?.classList.contains("breadcrumb__root")).toBe(true);
  });
});
