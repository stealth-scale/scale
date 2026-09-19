import { describe, expect, it } from "vitest";

import { EntryCard } from "#catalogue/index-card.tsx";
import { onRoute, THERE } from "#catalogue/mounted.fixtures.tsx";

describe("EntryCard", () => {
  it("titles the card with the words the entry carried", async () => {
    const { result } = await onRoute(<EntryCard page={{ entry: { label: "Badge" }, id: THERE }} />);

    expect(result.getByRole("heading", { level: 3 }).textContent).toBe("Badge");
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
