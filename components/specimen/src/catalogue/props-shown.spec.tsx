import { describe, expect, it } from "vitest";

import { drawn, hovered, pressed, unhovered } from "@stealthscale/testing-react";

import { type Shown } from "#catalogue/parted.ts";
import { PropsShown } from "#catalogue/props-shown.tsx";

/**
 * A named type with two members, one of them documented, held under the key the reader uses.
 */
const SCALE: Shown = {
  members: [
    { accepts: "", name: '"sm"', says: "" },
    { accepts: "string", name: "label", says: "The words a reader sees." },
  ],
  name: "kit.Scale",
};

describe("PropsShown", () => {
  it("draws the name the compiler prints as the control that opens it", async () => {
    const { getByRole } = await drawn(<PropsShown shown={SCALE} />);

    expect(getByRole("button", { name: "Scale" })).toBeDefined();
  });

  it("opens nothing until the control is pressed", async () => {
    const { getByRole } = await drawn(<PropsShown shown={SCALE} />);

    expect(getByRole("button", { name: "Scale" }).getAttribute("aria-expanded")).toBe("false");
  });

  it("says it is open once the control is pressed", async () => {
    const { getByRole } = await drawn(<PropsShown shown={SCALE} />);

    await pressed(getByRole("button", { name: "Scale" }));

    expect(getByRole("button", { name: "Scale" }).getAttribute("aria-expanded")).toBe("true");
  });

  it("draws the members as a table once open", async () => {
    const { findByRole, getByRole } = await drawn(<PropsShown shown={SCALE} />);

    await pressed(getByRole("button", { name: "Scale" }));

    expect(await findByRole("table")).toBeDefined();
  });

  it("names the panel after the type and not after the key it is held by", async () => {
    const { findByRole, getByRole } = await drawn(<PropsShown shown={SCALE} />);

    await pressed(getByRole("button", { name: "Scale" }));

    expect(await findByRole("dialog", { name: "Scale" })).toBeDefined();
  });

  it("heads the panel with nothing, because the name it opened from says what it is", async () => {
    const { getByRole, queryByRole } = await drawn(<PropsShown shown={SCALE} />);

    await pressed(getByRole("button", { name: "Scale" }));

    expect(queryByRole("heading")).toBeNull();
  });

  it("opens the panel under a pointer that only passes over the name", async () => {
    const { getByRole } = await drawn(<PropsShown shown={SCALE} />);

    await hovered(getByRole("button", { name: "Scale" }));

    expect(getByRole("button", { name: "Scale" }).getAttribute("aria-expanded")).toBe("true");
  });

  it("closes the panel once the pointer has left the name", async () => {
    const { getByRole } = await drawn(<PropsShown shown={SCALE} />);

    await hovered(getByRole("button", { name: "Scale" }));
    await unhovered(getByRole("button", { name: "Scale" }));

    expect(getByRole("button", { name: "Scale" }).getAttribute("aria-expanded")).toBe("false");
  });

  it("lists every member once the control is pressed", async () => {
    const { findByText, getByRole } = await drawn(<PropsShown shown={SCALE} />);

    await pressed(getByRole("button", { name: "Scale" }));

    expect(await findByText("label")).toBeDefined();
  });

  it("writes out what a member does", async () => {
    const { findByText, getByRole } = await drawn(<PropsShown shown={SCALE} />);

    await pressed(getByRole("button", { name: "Scale" }));

    expect(await findByText("The words a reader sees.")).toBeDefined();
  });
});
