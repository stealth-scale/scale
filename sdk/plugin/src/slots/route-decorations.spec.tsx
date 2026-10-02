import { act, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fixtureHost } from "#host/host.fixtures.tsx";
import { slotted } from "#slots/feed.fixtures.ts";
import { PAGED } from "#slots/route-decorations.fixtures.ts";
import { RouteDecorations } from "#slots/route-decorations.tsx";

describe("RouteDecorations", () => {
  it("renders the extensions placed around the page by position", async () => {
    const { container } = await slotted(
      <RouteDecorations routeId="time-off/overview">page</RouteDecorations>,
      fixtureHost({ product: PAGED }),
    );

    expect(container.textContent).toBe(
      "notice time-off/overview time-off/overviewpagechip time-off/overview",
    );
  });

  it("wraps the page in the route's wrap extensions", async () => {
    await slotted(
      <RouteDecorations routeId="time-off/overview">page</RouteDecorations>,
      fixtureHost({ product: PAGED }),
    );

    const ring = screen.getByRole("region", { name: "ring time-off/overview" });

    expect(within(ring).getByText("page")).toBeTruthy();
  });

  it("wraps the route's wrap extensions in the wrappers of every route", async () => {
    await slotted(
      <RouteDecorations routeId="time-off/overview">page</RouteDecorations>,
      fixtureHost({ product: PAGED }),
    );

    const halo = screen.getByRole("region", { name: "halo time-off/overview" });

    expect(within(halo).getByRole("region", { name: "ring time-off/overview" })).toBeTruthy();
  });

  it("wraps the page in the wrappers of every route with the first outermost", async () => {
    await slotted(
      <RouteDecorations routeId="time-off/calendar">page</RouteDecorations>,
      fixtureHost({ product: PAGED }),
    );

    const glow = screen.getByRole("region", { name: "glow time-off/calendar" });

    expect(within(glow).getByRole("region", { name: "halo time-off/calendar" })).toBeTruthy();
  });

  it("renders a replace extension in place of the page", async () => {
    const { container } = await slotted(
      <RouteDecorations routeId="time-off/request">page</RouteDecorations>,
      fixtureHost({ product: PAGED }),
    );

    expect(container.textContent).toBe("cover time-off/request");
  });

  it("records what it renders in the mounted store under the route's key", async () => {
    const host = fixtureHost({ product: PAGED });

    await slotted(<RouteDecorations routeId="time-off/overview">page</RouteDecorations>, host);

    expect(host.mounted.get().get("route:time-off/overview")).toStrictEqual([
      {
        dropped: { "pages/hint": "condition" },
        match: undefined,
        rendered: ["pages/chip", "pages/notice", "pages/ring", "pages/glow", "pages/halo"],
      },
    ]);
  });

  it("removes its record from the mounted store when it unmounts", async () => {
    const host = fixtureHost({ product: PAGED });
    const view = await slotted(
      <RouteDecorations routeId="time-off/overview">page</RouteDecorations>,
      host,
    );

    view.unmount();

    expect(host.mounted.get().get("route:time-off/overview")).toStrictEqual([]);
  });

  it("renders the page alone when the decorating plugin turns off", async () => {
    const host = fixtureHost({ product: PAGED });
    const { container } = await slotted(
      <RouteDecorations routeId="time-off/overview">page</RouteDecorations>,
      host,
    );

    act(() => {
      host.availability.set({
        pages: { on: false, reason: "condition" },
        "time-off": { on: true },
      });
    });

    expect(container.textContent).toBe("page");
  });

  it("throws outside a host", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      render(<RouteDecorations routeId="time-off/overview">page</RouteDecorations>),
    ).toThrow(
      "RouteDecorations() found no host. A plugin's components render inside a host, and a test renders them with renderPlugin.",
    );
  });
});
