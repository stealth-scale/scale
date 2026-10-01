import { createElement, Suspense } from "react";

import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { lazy } from "#host/product.fixtures.ts";
import { caught } from "#slots/boundary.fixtures.ts";
import { lazyOf, missingOf } from "#slots/lazy.ts";
import { Lead, Tail } from "#slots/parts.fixtures.tsx";

describe("lazyOf", () => {
  it("renders the one function the module exports", async () => {
    render(
      createElement(Suspense, { fallback: null }, createElement(lazyOf(lazy({ Lead }), "a/lead"))),
    );

    await expect(screen.findByText("lead")).resolves.toBeTruthy();
  });

  it("returns one component per importer", () => {
    const importer = lazy({ Lead });

    expect(lazyOf(importer, "a/lead")).toBe(lazyOf(importer, "a/lead"));
  });

  it("throws where the module exports more than one function", async () => {
    expect.hasAssertions();

    vi.spyOn(console, "error").mockImplementation(() => {});

    const onError = caught(lazyOf(lazy({ Lead, Tail }), "a/two"));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledExactlyOnceWith(
        new Error("The module of a/two exports 2 functions, and a component's module exports one."),
      );
    });
  });

  it("throws that no manifest maps a missing extension to code", async () => {
    expect.hasAssertions();

    vi.spyOn(console, "error").mockImplementation(() => {});

    const onError = caught(missingOf("a/gone"));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledExactlyOnceWith(
        new Error("No manifest maps the extension a/gone to code."),
      );
    });
  });

  it("returns one missing component per id", () => {
    expect(missingOf("a/lost")).toBe(missingOf("a/lost"));
  });
});
