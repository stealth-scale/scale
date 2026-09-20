import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { PropsMembers } from "#catalogue/props-members.tsx";
import { type Member } from "#catalogue/types.ts";

/**
 * The options of a union, each a name with no type of its own.
 */
const OPTIONS: readonly Member[] = [
  { accepts: "", name: '"lg"', says: "" },
  { accepts: "", name: '"sm"', says: "" },
];

/**
 * The properties of an object, each with a type and a sentence.
 */
const PROPERTIES: readonly Member[] = [
  { accepts: "string", name: "label", says: "The words a reader sees." },
];

describe("PropsMembers", () => {
  it("names the table by the type it belongs to", async () => {
    const { container } = await drawn(<PropsMembers label="Scale" members={OPTIONS} />);

    expect(container.querySelector("[aria-label]")?.getAttribute("aria-label")).toBe("Scale");
  });

  it("draws a row per member", async () => {
    const { getAllByRole } = await drawn(<PropsMembers label="Scale" members={OPTIONS} />);

    expect(getAllByRole("rowheader").map((one) => one.textContent)).toStrictEqual(['"lg"', '"sm"']);
  });

  it("draws the name alone for the options of a union", async () => {
    const { getAllByRole } = await drawn(<PropsMembers label="Scale" members={OPTIONS} />);

    expect(getAllByRole("columnheader").map((one) => one.textContent)).toStrictEqual(["Prop"]);
  });

  it("draws the type beside a member that holds one", async () => {
    const { getAllByRole } = await drawn(<PropsMembers label="Held" members={PROPERTIES} />);

    expect(getAllByRole("columnheader").map((one) => one.textContent)).toStrictEqual([
      "Prop",
      "Accepts",
      "What it does",
    ]);
  });

  it("writes out what a member does", async () => {
    const { getByText } = await drawn(<PropsMembers label="Held" members={PROPERTIES} />);

    expect(getByText("The words a reader sees.")).toBeDefined();
  });
});
