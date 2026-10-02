import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { raised, regioned, toasterOf } from "#toast/toast.fixtures.tsx";

describe("Content", () => {
  it("renders a div", async () => {
    const toaster = toasterOf();
    const { container } = await drawn(regioned(toaster));

    await raised(toaster, { title: "Exported" });

    expect(slotElement(container, "toast", "content").tagName).toBe("DIV");
  });

  it("contains the title", async () => {
    const toaster = toasterOf();
    const { container } = await drawn(regioned(toaster));

    await raised(toaster, { title: "Exported" });

    expect(slotElement(container, "toast", "content").textContent).toContain("Exported");
  });
});
