import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, narrowed, shell } from "#app-shell/app-shell.fixtures.tsx";
import { Body } from "#app-shell/body.tsx";
import { Navbar } from "#app-shell/navbar.tsx";
import { Trigger } from "#app-shell/trigger.tsx";

describe("Trigger", () => {
  it("renders a button inside the root", () => {
    const { container } = render(shell(<Trigger>Navigation</Trigger>));

    expect(slotElement(container, "app-shell", "trigger").tagName).toBe("BUTTON");
  });

  it("defaults type to button", () => {
    const { container } = render(shell(<Trigger>Navigation</Trigger>));

    expect(slotElement(container, "app-shell", "trigger").getAttribute("type")).toBe("button");
  });

  it("points aria-controls at its panel", () => {
    const { container } = render(composed());

    expect(screen.getByRole("button", { name: "Navigation" }).getAttribute("aria-controls")).toBe(
      slotElement(container, "app-shell", "navbar").id,
    );
  });

  it("sets aria-expanded to true while its panel is open", () => {
    render(composed());

    expect(screen.getByRole("button", { expanded: true, name: "Navigation" })).toBeTruthy();
  });

  it("sets aria-expanded to false when no panel has its name", () => {
    render(shell(<Trigger>Navigation</Trigger>));

    expect(screen.getByRole("button", { expanded: false })).toBeTruthy();
  });

  it("opens its panel on a press", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("open");
  });

  it("closes its open panel on a press", async () => {
    const { container } = render(composed());

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("closed");
  });

  it("leaves its panel unchanged when onClick prevents the default", async () => {
    const { container } = render(
      shell(
        <>
          <Trigger
            onClick={(event) => {
              event.preventDefault();
            }}
          >
            Navigation
          </Trigger>
          <Body>
            <Navbar />
          </Body>
        </>,
      ),
    );

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("open");
  });

  it("writes its panel's state as data-state", () => {
    const { container } = render(composed());

    expect(slotElement(container, "app-shell", "trigger").dataset["state"]).toBe("open");
  });

  it("renders nothing while its panel is under the page", () => {
    render(narrowed(composed({ folds: "under" })));

    expect(screen.queryByRole("button", { name: "Navigation" })).toBeNull();
  });
});
