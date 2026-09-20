import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { type Row } from "#catalogue/parted.ts";
import { PropsTable } from "#catalogue/props-table.tsx";

/**
 * Writes one row, less whatever a case states itself.
 */
function row(over: Partial<Row["prop"]> = {}): Row {
  return {
    prop: {
      accepts: '"lg" | "md" | "sm"',
      fallback: '"md"',
      kind: "variant",
      name: "size",
      refers: [],
      required: false,
      says: "The step the control is drawn at.",
      ...over,
    },
    shows: [],
  };
}

describe("PropsTable", () => {
  it("names the table by the part it belongs to", async () => {
    const { container } = await drawn(<PropsTable label="The axes" rows={[row()]} />);

    expect(container.querySelector("[aria-label]")?.getAttribute("aria-label")).toBe("The axes");
  });

  it("heads the four columns a prop is read across", async () => {
    const { getAllByRole } = await drawn(<PropsTable label="The axes" rows={[row()]} />);

    expect(getAllByRole("columnheader").map((one) => one.textContent)).toStrictEqual([
      "Prop",
      "Accepts",
      "Falls back to",
      "What it does",
    ]);
  });

  it("names each prop in the first column", async () => {
    const { getByRole } = await drawn(<PropsTable label="The axes" rows={[row()]} />);

    expect(getByRole("rowheader", { name: "size" })).toBeDefined();
  });

  it("writes out the type a prop accepts", async () => {
    const { getByText } = await drawn(<PropsTable label="The axes" rows={[row()]} />);

    expect(getByText('"lg" | "md" | "sm"')).toBeDefined();
  });

  it("draws the fallback column where a prop states one", async () => {
    const { getAllByRole } = await drawn(<PropsTable label="The axes" rows={[row()]} />);

    expect(getAllByRole("columnheader").map((one) => one.textContent)).toStrictEqual([
      "Prop",
      "Accepts",
      "Falls back to",
      "What it does",
    ]);
  });

  it("writes out the value a prop falls back to", async () => {
    const { getByText } = await drawn(<PropsTable label="The axes" rows={[row()]} />);

    expect(getByText('"md"')).toBeDefined();
  });

  it("leaves the cell blank for a prop with no fallback beside one that has", async () => {
    const both = [row(), row({ fallback: "", name: "variant" })];
    const { getAllByRole } = await drawn(<PropsTable label="The axes" rows={both} />);
    const last = getAllByRole("row").at(-1);

    expect([...(last?.querySelectorAll("td") ?? [])][1]?.textContent).toBe("");
  });

  it("draws no fallback column at all where no prop states one", async () => {
    const { getAllByRole } = await drawn(
      <PropsTable label="The axes" rows={[row({ fallback: "" })]} />,
    );

    expect(getAllByRole("columnheader").map((one) => one.textContent)).toStrictEqual([
      "Prop",
      "Accepts",
      "What it does",
    ]);
  });

  it("writes out what a prop does", async () => {
    const { getByText } = await drawn(<PropsTable label="The axes" rows={[row()]} />);

    expect(getByText("The step the control is drawn at.")).toBeDefined();
  });

  it("marks a prop a theme moves where the table holds both kinds", async () => {
    const both = [row(), row({ kind: "option", name: "aria-label" })];
    const { getByRole } = await drawn(<PropsTable label="The axes" rows={both} />);

    expect(getByRole("rowheader", { name: "size axis" })).toBeDefined();
  });

  it("marks no kind at all where every prop is an axis", async () => {
    const { getByRole } = await drawn(<PropsTable label="The axes" rows={[row()]} />);

    expect(getByRole("rowheader", { name: "size" })).toBeDefined();
  });

  it("marks a prop a caller has to pass", async () => {
    const { getByRole } = await drawn(
      <PropsTable label="The axes" rows={[row({ required: true })]} />,
    );

    expect(getByRole("rowheader", { name: "size required" })).toBeDefined();
  });

  it("draws a row per prop", async () => {
    const two = [row(), row({ name: "variant" })];
    const { getAllByRole } = await drawn(<PropsTable label="The axes" rows={two} />);

    expect(getAllByRole("rowheader").map((one) => one.textContent)).toStrictEqual([
      "size",
      "variant",
    ]);
  });
});
