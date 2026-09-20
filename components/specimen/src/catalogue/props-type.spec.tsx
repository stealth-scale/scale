import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { type Shown } from "#catalogue/parted.ts";
import { PropsType } from "#catalogue/props-type.tsx";

/**
 * A named type the reader listed a documented property for.
 */
const IDS: Shown = {
  members: [{ accepts: "string", name: "root", says: "The id of the element that holds it." }],
  name: "kit.ElementIds",
};

/**
 * A named type the reader listed a second documented property for.
 */
const LIFT: Shown = {
  members: [{ accepts: "string", name: "rest", says: "The shadow it rests at." }],
  name: "kit.Lift",
};

/**
 * A named type that stands for a list of values, each a name and nothing else.
 */
const MODE: Shown = {
  members: [
    { accepts: "", name: '"inline"', says: "" },
    { accepts: "", name: '"block"', says: "" },
  ],
  name: "kit.CodeBlockMode",
};

/**
 * A named type the reader named and listed nothing for.
 */
const BARE: Shown = { members: [], name: "kit.Scale" };

describe("PropsType", () => {
  it("draws a type that names nothing as the words it is", async () => {
    const { getByText } = await drawn(<PropsType accepts="string" shows={[]} />);

    expect(getByText("string")).toBeDefined();
  });

  it("opens a named type the reader listed properties for", async () => {
    const { getByRole } = await drawn(<PropsType accepts="ElementIds" shows={[IDS]} />);

    expect(getByRole("button", { name: "ElementIds" })).toBeDefined();
  });

  it("draws a named type the reader listed nothing for as plain words", async () => {
    const { queryByRole } = await drawn(<PropsType accepts="Scale" shows={[BARE]} />);

    expect(queryByRole("button")).toBeNull();
  });

  it("writes out a name that stands for a list of values rather than opening it", async () => {
    const { getByText, queryByRole } = await drawn(
      <PropsType accepts="CodeBlockMode" shows={[MODE]} />,
    );

    expect(getByText('"inline" | "block"')).toBeDefined();
    expect(queryByRole("button")).toBeNull();
  });

  it("keeps the rest of a printed type round the name it opens", async () => {
    const { getByRole } = await drawn(<PropsType accepts="readonly ElementIds[]" shows={[IDS]} />);
    const opened = getByRole("button", { name: "ElementIds" }).parentElement;

    expect(opened?.previousSibling?.textContent).toBe("readonly ");
    expect(opened?.nextSibling?.textContent).toBe("[]");
  });

  it("keeps the spaces round the bar between two names it opens", async () => {
    const { getByRole } = await drawn(
      <PropsType accepts="ElementIds | Lift" shows={[IDS, LIFT]} />,
    );
    const opened = getByRole("button", { name: "Lift" }).parentElement;

    expect(opened?.previousSibling?.textContent).toBe(" | ");
  });

  it("opens each of two names the printed type refers to", async () => {
    const { getAllByRole } = await drawn(
      <PropsType accepts="ElementIds | Lift" shows={[IDS, LIFT]} />,
    );

    expect(getAllByRole("button").map((one) => one.textContent)).toStrictEqual([
      "ElementIds",
      "Lift",
    ]);
  });
});
