import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import * as Sortable from "#sortable/index.ts";
import { boarded, COLUMNS, inside, rootStateOf } from "#sortable/sortable.fixtures.tsx";

describe("List", () => {
  it("sets data-full while the list has as many items as its limit", () => {
    const { getByRole } = render(boarded());

    expect(getByRole("list", { name: "In progress" }).parentElement?.dataset["full"]).toBe("");
  });

  it("sets no data-full while the list has fewer items than its limit", () => {
    const { getByRole } = render(boarded({ items: { ...COLUMNS, doing: [] } }));

    expect(
      getByRole("list", { name: "In progress" }).parentElement?.dataset["full"],
    ).toBeUndefined();
  });

  it("sets no data-full on a list without a limit", () => {
    const { getByRole } = render(boarded());

    expect(getByRole("list", { name: "To do" }).parentElement?.dataset["full"]).toBeUndefined();
  });

  it("sets data-refuses while the root marks the list as refusing", () => {
    const { container } = render(
      inside(rootStateOf(COLUMNS, "done"), <Sortable.List label="Done" value="done" />),
    );

    expect(slotElement(container, "sortable", "list").dataset["refuses"]).toBe("");
  });

  it("sets no data-refuses while the root marks another list as refusing", () => {
    const { container } = render(
      inside(rootStateOf(COLUMNS, "todo"), <Sortable.List label="Done" value="done" />),
    );

    expect(slotElement(container, "sortable", "list").dataset["refuses"]).toBeUndefined();
  });

  it("registers its entry with the root", () => {
    const state = rootStateOf(COLUMNS);

    render(inside(state, <Sortable.List label="In progress" limit={3} value="doing" />));

    expect(state.lists.get("doing")).toStrictEqual({ label: "In progress", limit: 3 });
  });

  it("removes its entry from the root when it unmounts", () => {
    const state = rootStateOf(COLUMNS);
    const { unmount } = render(inside(state, <Sortable.List label="Done" value="done" />));

    unmount();

    expect(state.lists.has("done")).toBe(false);
  });
});
