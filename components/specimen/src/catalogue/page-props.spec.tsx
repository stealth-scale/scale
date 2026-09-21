import { type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import { Page } from "@stealthscale/component-screen";
import { drawn } from "@stealthscale/testing-react";

import { PropsBody } from "#catalogue/page-props.tsx";
import { type Part } from "#catalogue/parted.ts";

/**
 * Draws the props in the page they belong to.
 */
function paged(parts?: readonly Part[], failure?: Error): ReactElement {
  return (
    <Page.Root>
      <PropsBody failure={failure} parts={parts} />
    </Page.Root>
  );
}

/**
 * Writes one part holding nothing, for a case counting the sections.
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
  it("says it is still reading until the parts arrive", async () => {
    const { getByText } = await drawn(paged());

    expect(getByText("Reading what the parts accept.")).toBeDefined();
  });

  it("says so where the reader found nothing for the page", async () => {
    const { getByText } = await drawn(paged([]));

    expect(getByText("Nothing was read for this page.")).toBeDefined();
  });

  it("says why the parts could not be read and offers a reload", async () => {
    const { getByRole } = await drawn(paged(undefined, new Error("chunk gone")));

    expect(getByRole("alert").textContent).toBe(
      "What the parts accept could not be read: chunk gone",
    );
    expect(getByRole("button", { name: "Reload the page" })).toBeDefined();
  });

  it("says once what the reader resolved and no table draws", async () => {
    const { getByText } = await drawn(paged([part("One")]));

    expect(
      getByText("0 styling conditions and 0 properties from elsewhere are not listed."),
    ).toBeDefined();
  });

  it("draws a section per part", async () => {
    const { getAllByRole } = await drawn(paged([part("One"), part("Two")]));

    expect(getAllByRole("heading").map((one) => one.textContent)).toStrictEqual([
      "Kit.One One 0",
      "Kit.Two Two 0",
    ]);
  });

  it("keeps the order the parts arrived in", async () => {
    const { getAllByRole } = await drawn(paged([part("Zebra"), part("Acme")]));

    expect(getAllByRole("heading").map((one) => one.textContent)).toStrictEqual([
      "Kit.Zebra Zebra 0",
      "Kit.Acme Acme 0",
    ]);
  });
});
