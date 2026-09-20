import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { PartSection } from "#catalogue/page-part.tsx";
import { type Part, type Row } from "#catalogue/parted.ts";

/**
 * Writes one row of the kind a case asks for.
 */
function row(name: string, kind: Row["prop"]["kind"]): Row {
  return {
    prop: { accepts: "string", fallback: "", kind, name, refers: [], required: false, says: "" },
    shows: [],
  };
}

/**
 * Writes one part, less whatever a case states itself.
 */
function part(over: Partial<Part> = {}): Part {
  return {
    component: "Button",
    dropped: { conditions: 284, foreign: 1051 },
    name: "ButtonProps",
    options: [row("aria-label", "option")],
    variants: [row("size", "variant")],
    ...over,
  };
}

describe("PartSection", () => {
  it("heads the section with the component the props belong to", async () => {
    const { getByRole } = await drawn(<PartSection id="buttonprops" part={part()} />);

    expect(getByRole("heading", { name: "Button ButtonProps 2" })).toBeDefined();
  });

  it("anchors the section by the id it is given", async () => {
    const { container } = await drawn(<PartSection id="buttonprops" part={part()} />);

    expect(container.querySelector("#buttonprops")).toBeDefined();
  });

  it("draws the axes and the props in one table", async () => {
    const { getAllByRole } = await drawn(<PartSection id="buttonprops" part={part()} />);

    expect(getAllByRole("table")).toHaveLength(1);
  });

  it("puts the axes a theme moves before the props a page sets", async () => {
    const { getAllByRole } = await drawn(<PartSection id="buttonprops" part={part()} />);

    expect(getAllByRole("rowheader").map((one) => one.textContent)).toStrictEqual([
      "sizeaxis",
      "aria-label",
    ]);
  });

  it("draws one table where the part takes only props", async () => {
    const { getAllByRole } = await drawn(
      <PartSection id="buttonprops" part={part({ variants: [] })} />,
    );

    expect(getAllByRole("table")).toHaveLength(1);
  });

  it("draws no table at all where the reader found nothing", async () => {
    const { queryAllByRole } = await drawn(
      <PartSection id="buttonprops" part={part({ options: [], variants: [] })} />,
    );

    expect(queryAllByRole("table")).toStrictEqual([]);
  });

  it("counts every prop the part takes beside its name", async () => {
    const { getByText } = await drawn(<PartSection id="buttonprops" part={part()} />);

    expect(getByText("2")).toBeDefined();
  });
});
