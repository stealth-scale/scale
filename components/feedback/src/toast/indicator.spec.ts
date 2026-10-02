import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { raised, regioned, toasterOf } from "#toast/toast.fixtures.tsx";

describe("Indicator", () => {
  it("renders a span", async () => {
    const toaster = toasterOf();
    const { container } = await drawn(regioned(toaster));

    await raised(toaster, { title: "Exported", type: "success" });

    expect(slotElement(container, "toast", "indicator").tagName).toBe("SPAN");
  });

  it("sets aria-hidden", async () => {
    const toaster = toasterOf();
    const { container } = await drawn(regioned(toaster));

    await raised(toaster, { title: "Exported", type: "success" });

    expect(slotElement(container, "toast", "indicator").getAttribute("aria-hidden")).toBe("true");
  });
});
