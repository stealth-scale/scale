import { describe, expect, it } from "vitest";

import { GroupSection } from "#catalogue/index-section.tsx";
import { HERE, onRoute, THERE } from "#catalogue/mounted.fixtures.tsx";

const DATA = {
  name: "Data",
  pages: [
    { entry: { label: "Badge" }, id: THERE },
    { entry: { label: "Table" }, id: HERE },
  ],
};

describe("GroupSection", () => {
  it("heads the section with the group's name", async () => {
    const { result } = await onRoute(<GroupSection group={DATA} />);

    expect(result.getByRole("region", { name: "Data" })).toBeDefined();
  });

  it("words a group that carries no name", async () => {
    const { result } = await onRoute(<GroupSection group={{ ...DATA, name: "" }} />);

    expect(result.getByRole("region", { name: "Other" })).toBeDefined();
  });

  it("draws one card per page", async () => {
    const { result } = await onRoute(<GroupSection group={DATA} />);

    expect(
      result.getAllByRole("heading", { level: 3 }).map((one) => one.textContent),
    ).toStrictEqual(["Badge", "Table"]);
  });
});
