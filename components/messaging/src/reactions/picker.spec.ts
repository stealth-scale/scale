import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { opened, reacted } from "#reactions/reactions.fixtures.tsx";

describe("Picker", () => {
  it("renders a trigger named Add a reaction", async () => {
    await drawn(reacted());

    expect(
      screen.getByRole("button", { name: "Add a reaction" }).getAttribute("aria-expanded"),
    ).toBe("false");
  });

  it("names the trigger by label", async () => {
    await drawn(reacted({ picker: { label: "React" } }));

    expect(screen.getByRole("button", { name: "React" })).toBeDefined();
  });

  it("opens a panel named Choose a reaction with the choices", async () => {
    await drawn(reacted());

    const panel = await opened();

    expect([
      panel.getAttribute("aria-label"),
      panel.querySelectorAll("button").length,
    ]).toStrictEqual(["Choose a reaction", 2]);
  });

  it("names the panel by choicesLabel", async () => {
    await drawn(reacted({ picker: { choicesLabel: "Reactions to add" } }));

    expect((await opened()).getAttribute("aria-label")).toBe("Reactions to add");
  });

  it("reports the value of the choice pressed", async () => {
    const onSelect = vi.fn<(value: string) => void>();

    await drawn(reacted({ picker: { onSelect } }));
    await opened();
    await pressed(screen.getByRole("button", { name: "Eyes" }));

    expect(onSelect.mock.lastCall).toStrictEqual(["eyes"]);
  });

  it("closes the panel when a choice is pressed", async () => {
    await drawn(reacted());
    await opened();
    await pressed(screen.getByRole("button", { name: "Heart" }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
