import { renderToString } from "react-dom/server";

import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { composed, pressed } from "#segment-group/segment-group.fixtures.tsx";

describe("Item", () => {
  it("renders a label around each option", async () => {
    const { container } = await drawn(composed());

    expect(
      [...container.querySelectorAll('[data-part="item"]')].map((item) => item.tagName),
    ).toStrictEqual(["LABEL", "LABEL", "LABEL"]);
  });

  it("points the label's for attribute at its input", async () => {
    const { container } = await drawn(composed());

    expect(container.querySelector('[data-part="item"]')?.getAttribute("for")).toBe(
      screen.getByRole("radio", { name: "Week" }).id,
    );
  });

  it("renders a radio input with the item's value", async () => {
    await drawn(composed());

    expect(screen.getByRole<HTMLInputElement>("radio", { name: "Month" }).value).toBe("Month");
  });

  it("checks its option on a press on its words", async () => {
    await drawn(composed());
    await pressed(screen.getByText("Quarter"));

    expect(screen.getByRole<HTMLInputElement>("radio", { name: "Quarter" }).checked).toBe(true);
  });

  it("disables the input of a disabled item", async () => {
    await drawn(composed({}, "Quarter"));

    expect(screen.getByRole<HTMLInputElement>("radio", { name: "Quarter" }).disabled).toBe(true);
  });

  it("leaves the other inputs enabled beside a disabled item", async () => {
    await drawn(composed({}, "Quarter"));

    expect(screen.getByRole<HTMLInputElement>("radio", { name: "Week" }).disabled).toBe(false);
  });

  it("keeps the inputs of a read-only group enabled", async () => {
    await drawn(composed({ defaultValue: "Month", readOnly: true }));

    expect(screen.getAllByRole<HTMLInputElement>("radio").some((radio) => radio.disabled)).toBe(
      false,
    );
  });

  it("cancels a press on an option of a read-only group", async () => {
    await drawn(composed({ defaultValue: "Month", readOnly: true }));

    expect(fireEvent.click(screen.getByRole("radio", { name: "Week" }))).toBe(false);
  });

  it("sets data-state to checked on the checked option", async () => {
    const { container } = await drawn(composed({ defaultValue: "Month" }));

    expect(
      [...container.querySelectorAll<HTMLElement>('[data-part="item"]')].map(
        (item) => item.dataset["state"],
      ),
    ).toStrictEqual(["unchecked", "checked", "unchecked"]);
  });

  it("marks the checked option data-ssr in server markup", () => {
    const markup = new DOMParser().parseFromString(
      renderToString(composed({ defaultValue: "Month" })),
      "text/html",
    );

    expect(
      markup.querySelector<HTMLElement>('[data-part="item"][data-state="checked"]')?.dataset["ssr"],
    ).toBe("");
  });

  it("clears data-ssr once the machine starts", async () => {
    const { container } = await drawn(composed({ defaultValue: "Month" }));

    expect(container.querySelector("[data-ssr]")).toBeNull();
  });
});
