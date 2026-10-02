import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed, focused, keyed, star } from "#rating-group/rating-group.fixtures.tsx";

/**
 * Returns which items are checked, in order.
 */
function checked(): ReadonlyArray<null | string> {
  return screen.getAllByRole("radio").map((item) => item.getAttribute("aria-checked"));
}

describe("Item", () => {
  it("renders a span in the radio role with the rating's role description", async () => {
    await drawn(composed());

    expect([
      star("1 star").tagName,
      star("1 star").getAttribute("aria-roledescription"),
    ]).toStrictEqual(["SPAN", "rating"]);
  });

  it("names each item by the value it stands for", async () => {
    await drawn(composed());

    expect(
      screen.getAllByRole("radio").map((item) => item.getAttribute("aria-label")),
    ).toStrictEqual(["1 star", "2 stars", "3 stars", "4 stars", "5 stars"]);
  });

  it("names each item by the words getItemLabel returns", async () => {
    await drawn(composed({ getItemLabel: (value) => `${String(value)} of 5` }));

    expect(star("2 of 5")).toBeDefined();
  });

  it("checks no item while nothing is rated", async () => {
    await drawn(composed());

    expect(checked()).toStrictEqual(["false", "false", "false", "false", "false"]);
  });

  it("puts the first item in the tab order while nothing is rated", async () => {
    await drawn(composed());

    expect(screen.getAllByRole("radio").map((item) => item.tabIndex)).toStrictEqual([
      0, -1, -1, -1, -1,
    ]);
  });

  it("checks the rated item alone", async () => {
    await drawn(composed({ defaultValue: 3 }));

    expect(checked()).toStrictEqual(["false", "false", "true", "false", "false"]);
  });

  it("rates the value of an item a person presses", async () => {
    await drawn(composed());
    fireEvent.click(star("4 stars"));
    await settled();

    expect(star("4 stars").getAttribute("aria-checked")).toBe("true");
  });

  it("steps the rating up on ArrowRight", async () => {
    await drawn(composed({ defaultValue: 3 }));
    await focused(star("3 stars"));
    await keyed(star("3 stars"), "ArrowRight");

    expect(star("4 stars").getAttribute("aria-checked")).toBe("true");
  });

  it("steps the rating down on ArrowUp", async () => {
    await drawn(composed({ defaultValue: 3 }));
    await focused(star("3 stars"));
    await keyed(star("3 stars"), "ArrowUp");

    expect(star("2 stars").getAttribute("aria-checked")).toBe("true");
  });

  it("steps the rating on ArrowRight while the pointer rests on the group", async () => {
    await drawn(composed());
    fireEvent.pointerMove(star("2 stars"), { pointerType: "mouse" });
    await settled();
    fireEvent.click(star("2 stars"));
    await settled();
    await keyed(star("2 stars"), "ArrowRight");

    expect(star("3 stars").getAttribute("aria-checked")).toBe("true");
  });

  it("rates the last value on End", async () => {
    await drawn(composed({ defaultValue: 3 }));
    await focused(star("3 stars"));
    await keyed(star("3 stars"), "End");

    expect(star("5 stars").getAttribute("aria-checked")).toBe("true");
  });

  it("names a half rating on the item it rests on", async () => {
    await drawn(composed({ allowHalf: true, defaultValue: 3.5 }));

    expect(star("3.5 stars").dataset["half"]).toBe("");
  });

  it("marks every item up to the value as highlighted", async () => {
    await drawn(composed({ defaultValue: 2 }));

    expect(screen.getAllByRole("radio").map((item) => item.dataset["highlighted"])).toStrictEqual([
      "",
      "",
      undefined,
      undefined,
      undefined,
    ]);
  });

  it("keeps the rating of a read-only group on a press", async () => {
    await drawn(composed({ defaultValue: 2, readOnly: true }));
    fireEvent.click(star("4 stars"));
    await settled();

    expect(star("2 stars").getAttribute("aria-checked")).toBe("true");
  });
});
