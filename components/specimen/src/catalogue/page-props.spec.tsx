import { type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import { Page } from "@stealthscale/component-screen";
import { drawn } from "@stealthscale/testing-react";

import { PropsBody } from "#catalogue/page-props.tsx";
import { type Part } from "#catalogue/parted.ts";

/**
 * Renders PropsBody inside the page it belongs to.
 */
function paged(parts?: readonly Part[], failure?: Error): ReactElement {
  return (
    <Page.Root>
      <PropsBody failure={failure} parts={parts} />
    </Page.Root>
  );
}

/**
 * Returns one part with no options and no variants, for a case counting the sections.
 */
function part(name: string): Part {
  return {
    component: `Kit.${name}`,
    dropped: { conditions: 0, foreign: 0 },
    name,
    options: [],
    variants: [],
  };
}

describe("PropsBody", () => {
  it("renders the loading text when parts is undefined", async () => {
    const { getByText } = await drawn(paged());

    expect(getByText("Reading what the parts accept.")).toBeDefined();
  });

  it("renders the empty text when parts is an empty array", async () => {
    const { getByText } = await drawn(paged([]));

    expect(getByText("Nothing was read for this page.")).toBeDefined();
  });

  it("renders the failure message when the props fail to load", async () => {
    const { getByRole } = await drawn(paged(undefined, new Error("chunk gone")));

    expect(getByRole("alert").textContent).toBe(
      "What the parts accept could not be read: chunk gone",
    );
  });

  it("renders a reload button when the props fail to load", async () => {
    const { getByRole } = await drawn(paged(undefined, new Error("chunk gone")));

    expect(getByRole("button", { name: "Reload the page" })).toBeDefined();
  });

  it("renders the dropped counts once below the parts", async () => {
    const { getByText } = await drawn(paged([part("One")]));

    expect(
      getByText("0 styling conditions and 0 properties from elsewhere are not listed."),
    ).toBeDefined();
  });

  it("renders a section per part", async () => {
    const { getAllByRole } = await drawn(paged([part("One"), part("Two")]));

    expect(getAllByRole("heading").map((one) => one.textContent)).toStrictEqual([
      "Kit.One One 0",
      "Kit.Two Two 0",
    ]);
  });

  it("renders the parts in the order they were given", async () => {
    const { getAllByRole } = await drawn(paged([part("Zebra"), part("Acme")]));

    expect(getAllByRole("heading").map((one) => one.textContent)).toStrictEqual([
      "Kit.Zebra Zebra 0",
      "Kit.Acme Acme 0",
    ]);
  });
});
