import { fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NavList } from "@stealthscale/component-navigation";

import { onRoute, THERE } from "#catalogue/mounted.fixtures.tsx";
import { Branch } from "#catalogue/rail-branch.tsx";

const DATA = { name: "Data", pages: [{ entry: { label: "Badge" }, id: THERE }] };

describe("Branch", () => {
  it("names the branch after the group", async () => {
    const { result } = await onRoute(
      <NavList.Root>
        <Branch group={DATA} holdsCurrent={false} />
      </NavList.Root>,
    );

    expect(result.getByRole("button", { name: "Data" })).toBeDefined();
  });

  it("words a group that carries no name", async () => {
    const { result } = await onRoute(
      <NavList.Root>
        <Branch group={{ ...DATA, name: "" }} holdsCurrent={false} />
      </NavList.Root>,
    );

    expect(result.getByRole("button", { name: "Other" })).toBeDefined();
  });

  it("opens where the group holds the page being read", async () => {
    const { result } = await onRoute(
      <NavList.Root>
        <Branch group={DATA} holdsCurrent />
      </NavList.Root>,
    );

    expect(result.getByRole("link", { name: "Badge" })).toBeDefined();
  });

  it("stays closed where the group holds no page being read", async () => {
    const { result } = await onRoute(
      <NavList.Root>
        <Branch group={DATA} holdsCurrent={false} />
      </NavList.Root>,
    );

    expect(result.queryByRole("link", { name: "Badge" })).toBeNull();
  });

  it("opens when the reader presses it", async () => {
    const { result } = await onRoute(
      <NavList.Root>
        <Branch group={DATA} holdsCurrent={false} />
      </NavList.Root>,
    );

    fireEvent.click(result.getByRole("button", { name: "Data" }));

    expect(result.getByRole("link", { name: "Badge" })).toBeDefined();
  });
});
