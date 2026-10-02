import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boarded, listed } from "#sortable/sortable.fixtures.tsx";

describe("Items", () => {
  it("renders a ul named by the label of the list it is in", () => {
    const { getByRole } = render(boarded());

    expect(getByRole("list", { name: "To do" }).querySelectorAll("li")).toHaveLength(2);
  });

  it("renders a ul named by the caller's aria-label outside a list", () => {
    const { getByRole } = render(listed());

    expect(getByRole("list", { name: "Stages" }).tagName).toBe("UL");
  });
});
