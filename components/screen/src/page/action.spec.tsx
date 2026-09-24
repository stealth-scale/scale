import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Action } from "#page/action.tsx";
import { paged } from "#page/page.fixtures.tsx";

describe("Action", () => {
  it("renders a button", () => {
    render(paged(<Action>Download</Action>));

    expect(screen.getByRole("button", { name: "Download" })).toBeTruthy();
  });

  it("sets type button", () => {
    render(paged(<Action>Download</Action>));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("defaults data-priority to primary", () => {
    const { container } = render(paged(<Action>Download</Action>));

    expect(slotElement(container, "page", "action").dataset["priority"]).toBe("primary");
  });

  it("sets data-priority to its priority", () => {
    const { container } = render(paged(<Action priority="tertiary">Archive</Action>));

    expect(slotElement(container, "page", "action").dataset["priority"]).toBe("tertiary");
  });

  it("sets each action's own priority", () => {
    render(
      paged(
        <>
          <Action>Download</Action>
          <Action priority="secondary">Print</Action>
        </>,
      ),
    );

    expect(screen.getAllByRole("button").map((each) => each.dataset["priority"])).toStrictEqual([
      "primary",
      "secondary",
    ]);
  });
});
