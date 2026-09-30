import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Current } from "#switcher/current.tsx";
import { switched } from "#switcher/switcher.fixtures.tsx";
import { Trigger } from "#switcher/trigger.tsx";

describe("Current", () => {
  it("renders the mark, the name and the detail", () => {
    const { container } = render(
      switched(
        <Trigger label="Workspace">
          <Current choice={{ detail: "Pro plan", label: "Acme", value: "acme" }} />
        </Trigger>,
      ),
    );

    expect(slotElement(container, "switcher", "label").textContent).toBe("AcmePro plan");
  });

  it("renders no detail without one", () => {
    const { container } = render(
      switched(
        <Trigger label="Workspace">
          <Current choice={{ label: "Acme", value: "acme" }} />
        </Trigger>,
      ),
    );

    expect(container.querySelector(".switcher__detail")).toBeNull();
  });

  it("hides the mark from the accessibility tree", () => {
    const { container } = render(
      switched(
        <Trigger label="Workspace">
          <Current choice={{ label: "Acme", value: "acme" }} />
        </Trigger>,
      ),
    );

    expect(slotElement(container, "switcher", "mark").getAttribute("aria-hidden")).toBe("true");
  });
});
