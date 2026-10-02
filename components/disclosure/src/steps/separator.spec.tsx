import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Separator } from "#steps/separator.tsx";
import { itemed } from "#steps/steps.fixtures.tsx";

describe("Separator", () => {
  it("renders a span hidden from assistive technology", async () => {
    const { container } = await drawn(itemed(<Separator />));
    const rule = slotElement(container, "steps", "separator");

    expect([rule.tagName, rule.getAttribute("aria-hidden")]).toStrictEqual(["SPAN", "true"]);
  });

  it("renders nothing after the last step", async () => {
    const { container } = await drawn(itemed(<Separator />, {}, 2));

    expect(container.querySelector("[data-part=separator]")).toBeNull();
  });

  it("sets data-complete after a completed step", async () => {
    const { container } = await drawn(itemed(<Separator />, { defaultStep: 1 }));

    expect(slotElement(container, "steps", "separator").dataset["complete"]).toBe("");
  });
});
