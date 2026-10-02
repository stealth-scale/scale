import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn, pressed } from "@stealthscale/testing-react";

import { Root } from "#switcher/root.tsx";
import { CHOICES, chosen } from "#switcher/switcher.fixtures.tsx";

describe("Listed", () => {
  it("returns no accessibility violation for an open switcher", async () => {
    await expect(
      accessibilityViolations(() => chosen({ defaultOpen: true })),
    ).resolves.toStrictEqual([]);
  });

  it("checks the row of the current choice", async () => {
    await drawn(chosen({ defaultOpen: true }));

    expect(
      screen.getByRole("menuitemradio", { name: "Acme Pro plan" }).getAttribute("aria-checked"),
    ).toBe("true");
  });

  it("disables the row of a disabled choice", async () => {
    await drawn(chosen({ defaultOpen: true }));

    expect(
      screen.getByRole("menuitemradio", { name: "Old Books" }).getAttribute("aria-disabled"),
    ).toBe("true");
  });

  it("switches the trigger to the chosen row", async () => {
    await drawn(chosen({ defaultOpen: true }));
    await pressed(screen.getByRole("menuitemradio", { name: "Globex Corporation" }));

    expect(screen.getByRole("button", { name: /^Workspace/u }).textContent).toContain(
      "Globex Corporation",
    );
  });

  it("reports the chosen value through onValueChange", async () => {
    const heard: string[] = [];

    await drawn(
      chosen({
        defaultOpen: true,
        onValueChange: (value) => {
          heard.push(value);
        },
      }),
    );
    await pressed(screen.getByRole("menuitemradio", { name: "Globex Corporation" }));

    expect(heard).toStrictEqual(["globex"]);
  });

  it("renders only the label in the trigger for a value no choice has", () => {
    render(chosen({ value: "missing" }));

    expect(screen.getByRole("button").textContent).toBe("Workspace⇕");
  });

  it("renders no indicator without one", () => {
    render(<Root items={CHOICES} label="Workspace" />);

    expect(screen.getByRole("button").textContent).toBe("WorkspaceAAcmePro plan");
  });

  it("renders only the label in the trigger without choices", () => {
    render(<Root items={[]} label="Workspace" />);

    expect(screen.getByRole("button").textContent).toBe("Workspace");
  });

  it("renders no separator without children", async () => {
    await drawn(<Root defaultOpen items={CHOICES} label="Workspace" />);

    expect(screen.queryByRole("separator")).toBeNull();
  });
});
