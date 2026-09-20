import { describe, expect, it } from "vitest";

import { NavList } from "@stealthscale/component-navigation";

import { HERE, onRoute, THERE } from "#catalogue/mounted.fixtures.tsx";
import { Row } from "#catalogue/rail-row.tsx";

describe("Row", () => {
  it("titles the link with the words the entry carried", async () => {
    const { result } = await onRoute(
      <NavList.Root>
        <Row page={{ entry: { label: "Badge" }, id: THERE }} />
      </NavList.Root>,
    );

    expect(result.getByRole("link", { name: "Badge" })).toBeDefined();
  });

  it("resolves the words through the namespace the entry names", async () => {
    const { result } = await onRoute(
      <NavList.Root>
        <Row page={{ entry: { label: "rail.label", namespace: "specimen" }, id: THERE }} />
      </NavList.Root>,
    );

    expect(result.getByRole("link", { name: "Components" })).toBeDefined();
  });

  it("addresses the page the id names", async () => {
    const { result } = await onRoute(
      <NavList.Root>
        <Row page={{ entry: { label: "Badge" }, id: THERE }} />
      </NavList.Root>,
    );

    expect(result.getByRole("link").getAttribute("href")).toBe("/there");
  });

  it("marks the row as current on the page it names", async () => {
    const { result } = await onRoute(
      <NavList.Root>
        <Row page={{ entry: { label: "Badge" }, id: HERE }} />
      </NavList.Root>,
    );

    expect(result.getByRole("link").getAttribute("aria-current")).toBe("page");
  });

  it("marks the row as current on no other page", async () => {
    const { result } = await onRoute(
      <NavList.Root>
        <Row page={{ entry: { label: "Badge" }, id: THERE }} />
      </NavList.Root>,
    );

    expect(result.getByRole("link").getAttribute("aria-current")).toBeNull();
  });
});
