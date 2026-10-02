import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotVariantClass } from "@stealthscale/testing-theme";

import { type ValueChangeDetails } from "#menubar/bar.ts";
import { bar, clicked, expanded, keyed, named } from "#menubar/menubar.fixtures.tsx";

describe("Menu", () => {
  it("opens the menu the defaultValue names", async () => {
    await drawn(bar({ defaultValue: "edit" }));

    expect(expanded("Edit")).toBe("true");
  });

  it("keeps every other menu closed", async () => {
    await drawn(bar({ defaultValue: "edit" }));

    expect([expanded("File"), expanded("View")]).toStrictEqual(["false", "false"]);
  });

  it("opens the menu a controlled value names", async () => {
    await drawn(bar({ value: "view" }));

    expect(expanded("View")).toBe("true");
  });

  it("opens a menu when its name is pressed", async () => {
    await drawn(bar());
    await clicked(named("File"));

    expect(expanded("File")).toBe("true");
  });

  it("closes the open menu when another name is pressed", async () => {
    await drawn(bar());
    await clicked(named("File"));
    await clicked(named("Edit"));

    expect([expanded("File"), expanded("Edit")]).toStrictEqual(["false", "true"]);
  });

  it("calls onValueChange with the value of the menu a press opens", async () => {
    const told = vi.fn<(details: ValueChangeDetails) => void>();

    await drawn(bar({ onValueChange: told }));
    await clicked(named("View"));

    expect(told).toHaveBeenLastCalledWith({ value: "view" });
  });

  it("calls onValueChange with an empty value when Escape closes the open menu", async () => {
    const told = vi.fn<(details: ValueChangeDetails) => void>();

    await drawn(bar({ defaultValue: "file", onValueChange: told }));
    await keyed(screen.getByRole("menu"), "Escape");

    expect(told).toHaveBeenLastCalledWith({ value: "" });
  });

  it("passes the bar's size to its panel", async () => {
    await drawn(bar({ defaultValue: "file", size: "sm" }));

    expect(screen.getByRole("menu").closest(".menu__content")?.className).toContain(
      slotVariantClass("menu", "content", "size", "sm"),
    );
  });

  it("passes the bar's palette to its panel", async () => {
    await drawn(bar({ defaultValue: "file", palette: "accent" }));

    expect(screen.getByRole("menu").closest(".menu__content")?.className).toContain(
      slotVariantClass("menu", "content", "palette", "accent"),
    );
  });

  it("passes the bar's direction to its panel", async () => {
    await drawn(bar({ defaultValue: "file", dir: "rtl" }));

    expect(screen.getByRole("menu").getAttribute("dir")).toBe("rtl");
  });
});
