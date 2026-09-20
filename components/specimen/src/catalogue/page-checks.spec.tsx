import { type ReactElement } from "react";

import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { Checks, type ChecksProps } from "#catalogue/page-checks.tsx";

/**
 * Draws the control, less whatever a case states itself.
 */
function checking(over: Partial<ChecksProps> = {}): ReactElement {
  return (
    <Checks
      id="panel"
      onPress={vi.fn<() => void>()}
      open={false}
      ran={false}
      running={false}
      {...over}
    />
  );
}

describe("Checks", () => {
  it("names itself by what it does", async () => {
    const { getByRole } = await drawn(checking());

    expect(getByRole("button", { name: "Audit" })).toBeDefined();
  });

  it("says what it is doing while it runs", async () => {
    const { getByRole } = await drawn(checking({ running: true }));

    expect(getByRole("button", { name: "Auditing" })).toBeDefined();
  });

  it("takes no press while it runs", async () => {
    const { getByRole } = await drawn(checking({ running: true }));

    expect(getByRole("button").hasAttribute("disabled")).toBe(true);
  });

  it("controls nothing before an audit has run", async () => {
    const { getByRole } = await drawn(checking());

    expect(getByRole("button").hasAttribute("aria-controls")).toBe(false);
  });

  it("stands as no disclosure before an audit has run", async () => {
    const { getByRole } = await drawn(checking());

    expect(getByRole("button").hasAttribute("aria-expanded")).toBe(false);
  });

  it("points at the panel it controls once an audit has run", async () => {
    const { getByRole } = await drawn(checking({ ran: true }));

    expect(getByRole("button").getAttribute("aria-controls")).toBe("panel");
  });

  it("says the panel it controls is open while it is", async () => {
    const { getByRole } = await drawn(checking({ open: true, ran: true }));

    expect(getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("reports a press", async () => {
    const heard = vi.fn<() => void>();
    const { getByRole } = await drawn(checking({ onPress: heard }));

    await pressed(getByRole("button"));

    expect(heard).toHaveBeenCalledTimes(1);
  });
});
