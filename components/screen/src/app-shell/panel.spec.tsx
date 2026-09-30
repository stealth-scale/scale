import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { bodied, composed, narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Panel } from "#app-shell/panel.tsx";

describe("Panel", () => {
  it("returns no accessibility violation while it is open over the page", async () => {
    await expect(
      accessibilityViolations(() => narrowed(composed({ open: true }))),
    ).resolves.toStrictEqual([]);
  });

  it("renders its children in the content wrapper", () => {
    const { container } = render(bodied(<Panel side="start">Destinations</Panel>));

    expect(slotElement(container, "app-shell", "content").textContent).toBe("Destinations");
  });

  it("defaults to open", () => {
    const { container } = render(bodied(<Panel side="start" />));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("open");
  });

  it("starts closed when defaultOpen is false", () => {
    const { container } = render(bodied(<Panel defaultOpen={false} side="start" />));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("closed");
  });

  it("follows the open prop", () => {
    const { container } = render(bodied(<Panel open={false} side="start" />));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("closed");
  });

  it("becomes inert when closed to nothing", () => {
    const { container } = render(bodied(<Panel defaultOpen={false} side="start" />));

    expect(slotElement(container, "app-shell", "navbar").inert).toBe(true);
  });

  it("leaves the panel interactive when closed to a rail", () => {
    const { container } = render(
      bodied(<Panel collapse="icons" defaultOpen={false} side="start" />),
    );

    expect(slotElement(container, "app-shell", "navbar").inert).toBe(false);
  });

  it("writes its collapse as data-collapse", () => {
    const { container } = render(bodied(<Panel collapse="icons" side="start" />));

    expect(slotElement(container, "app-shell", "navbar").dataset["collapse"]).toBe("icons");
  });

  it("starts closed over the page", () => {
    const { container } = render(narrowed(bodied(<Panel side="start" />)));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("closed");
  });

  it("opens over the page when open is true", () => {
    const { container } = render(narrowed(bodied(<Panel open side="start" />)));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("open");
  });

  it("opens on a press of its trigger", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("open");
  });

  it("moves focus into its content's viewport when it opens over the page", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(document.activeElement).toBe(
      slotElement(container, "app-shell", "content").querySelector(".scroll-area__viewport"),
    );
  });

  it("returns focus to its trigger when it closes over the page", async () => {
    const { container } = render(narrowed(composed()));
    const trigger = screen.getByRole("button", { name: "Navigation" });

    trigger.focus();
    await pressed(trigger);

    expect(document.activeElement).toBe(
      slotElement(container, "app-shell", "content").querySelector(".scroll-area__viewport"),
    );

    await pressed(slotElement(container, "app-shell", "backdrop"));

    expect(document.activeElement).toBe(trigger);
  });

  it("renders an id for aria-controls", () => {
    const { container } = render(bodied(<Panel side="start" />));

    expect(slotElement(container, "app-shell", "navbar").id).not.toBe("");
  });

  it("writes its width to the panel size property", () => {
    const { container } = render(bodied(<Panel side="start" width="14rem" />));

    expect(
      slotElement(container, "app-shell", "navbar").style.getPropertyValue(
        "--app-shell-panel-size",
      ),
    ).toBe("14rem");
  });

  it("writes its rail width to the panel rail property", () => {
    const { container } = render(bodied(<Panel collapse="icons" railWidth="3rem" side="start" />));

    expect(
      slotElement(container, "app-shell", "navbar").style.getPropertyValue(
        "--app-shell-panel-rail",
      ),
    ).toBe("3rem");
  });

  it("writes no width property without widths", () => {
    const { container } = render(bodied(<Panel side="start" />));

    expect(slotElement(container, "app-shell", "navbar").getAttribute("style")).toBeNull();
  });
});
