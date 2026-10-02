import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as Sortable from "#sortable/index.ts";
import { inside, listed, rootStateOf, STAGES } from "#sortable/sortable.fixtures.tsx";

describe("Item", () => {
  it("renders an li per item in the order of the items", () => {
    const { container } = render(listed());

    expect([...container.querySelectorAll("li")].map((row) => row.textContent)).toStrictEqual([
      "Draft",
      "Review",
      "Publish",
    ]);
  });

  it("sets data-disabled on a disabled row", () => {
    const { getByText } = render(listed());

    expect(getByText("Publish").closest("li")?.dataset["disabled"]).toBe("");
  });

  it("sets no data-disabled on a row that moves", () => {
    const { getByText } = render(listed());

    expect(getByText("Draft").closest("li")?.dataset["disabled"]).toBeUndefined();
  });

  it("registers its label with the root", () => {
    const state = rootStateOf(STAGES);

    render(inside(state, <Sortable.Item index={0} label="Draft" value="draft" />));

    expect(state.names.get("draft")).toBe("Draft");
  });

  it("removes its label from the root when it unmounts", () => {
    const state = rootStateOf(STAGES);
    const { unmount } = render(
      inside(state, <Sortable.Item index={0} label="Draft" value="draft" />),
    );

    unmount();

    expect(state.names.has("draft")).toBe(false);
  });
});
