import { describe, expect, it } from "vitest";

import { slotElement, slotVariantClass, variantClass } from "@stealthscale/testing-theme";

import { EntryCard } from "#catalogue/index-card.tsx";
import { onRoute, THERE } from "#catalogue/mounted.fixtures.tsx";

describe("EntryCard", () => {
  it("titles the card with the words the entry carried", async () => {
    const { result } = await onRoute(<EntryCard page={{ entry: { label: "Badge" }, id: THERE }} />);

    expect(result.getByRole("heading", { level: 3 }).textContent).toBe("Badge");
  });

  it("resolves the title and the sentence through the namespace the entry names", async () => {
    const entry = { about: "rail.ungrouped", label: "rail.label", namespace: "specimen" };
    const { result } = await onRoute(<EntryCard page={{ entry, id: THERE }} />);

    expect(result.getByRole("heading", { level: 3 }).textContent).toBe("Pages");
    expect(result.getByText("Other")).toBeDefined();
  });

  it("leads the title to the page the id names", async () => {
    const { result } = await onRoute(<EntryCard page={{ entry: { label: "Badge" }, id: THERE }} />);

    expect(result.getByRole("link", { name: "Badge" }).getAttribute("href")).toBe("/there");
  });

  it("opens the card with the sentence the entry carried", async () => {
    const { result } = await onRoute(
      <EntryCard page={{ entry: { about: "A small label.", label: "Badge" }, id: THERE }} />,
    );

    expect(result.getByText("A small label.")).toBeDefined();
  });

  it("draws the code spans of the sentence as code", async () => {
    const { result } = await onRoute(
      <EntryCard page={{ entry: { about: "A `small` label.", label: "Badge" }, id: THERE }} />,
    );

    expect(result.container.querySelector("code")?.textContent).toBe("small");
  });

  it("outlines the card and gives the link the card's ink", async () => {
    const { result } = await onRoute(<EntryCard page={{ entry: { label: "Badge" }, id: THERE }} />);

    expect(slotElement(result.container, "card", "root").classList).toContain(
      slotVariantClass("card", "root", "variant", "outline"),
    );
    expect(result.getByRole("link", { name: "Badge" }).classList).toContain(
      variantClass("link", "inherit", true),
    );
  });

  it("writes no opening where the entry carried none", async () => {
    const { result } = await onRoute(<EntryCard page={{ entry: { label: "Badge" }, id: THERE }} />);

    expect(result.queryByRole("paragraph")).toBeNull();
  });

  it("writes no opening where the entry carried an empty one", async () => {
    const { result } = await onRoute(
      <EntryCard page={{ entry: { about: "", label: "Badge" }, id: THERE }} />,
    );

    expect(result.queryByRole("paragraph")).toBeNull();
  });
});
