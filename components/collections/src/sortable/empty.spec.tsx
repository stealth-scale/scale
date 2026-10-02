import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import * as Sortable from "#sortable/index.ts";
import { boarded, listed } from "#sortable/sortable.fixtures.tsx";

describe("Empty", () => {
  it("renders its message in a list without items", () => {
    const { getByRole } = render(boarded());

    expect(getByRole("list", { name: "Done" }).parentElement?.textContent).toBe("No cards.");
  });

  it("renders nothing in a list with items", () => {
    const { getAllByText } = render(boarded());

    expect(getAllByText("No cards.")).toHaveLength(1);
  });

  it("renders nothing beside the one list of an array with items", () => {
    const { queryByText } = render(listed());

    expect(queryByText("No stages.")).toBeNull();
  });

  it("renders a div with the recipe's empty class beside an empty array", () => {
    const { container } = render(
      <Sortable.Root items={[]}>
        <Sortable.Items aria-label="Stages" />
        <Sortable.Empty>No stages.</Sortable.Empty>
      </Sortable.Root>,
    );

    expect(slotElement(container, "sortable", "empty").textContent).toBe("No stages.");
  });
});
