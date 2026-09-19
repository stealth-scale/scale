import { describe, expect, it } from "vitest";

import { Page } from "@stealthscale/component-screen";

import { onRoute, THERE } from "#catalogue/mounted.fixtures.tsx";
import { Trail } from "#catalogue/page-trail.tsx";

describe("Trail", () => {
  it("names where it leads out of the catalogue rather than the key", async () => {
    const { result } = await onRoute(
      <Page.Root>
        <Page.Header>
          <Trail to={THERE} />
        </Page.Header>
      </Page.Root>,
    );

    expect(result.getByRole("link", { name: "Catalogue" })).toBeDefined();
  });

  it("leads to the route the id names", async () => {
    const { result } = await onRoute(
      <Page.Root>
        <Page.Header>
          <Trail to={THERE} />
        </Page.Header>
      </Page.Root>,
    );

    expect(result.getByRole("link").getAttribute("href")).toBe("/there");
  });
});
