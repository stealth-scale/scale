import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { routed } from "#routes/routed.fixtures.tsx";
import { BROKEN, INVOICES, MENDED, SCOPED, silenced } from "#routes/routes.fixtures.ts";

describe("error", () => {
  it("renders the manifest's fallback in place of a page that throws", async () => {
    silenced();
    await routed({ at: "/invoices", routes: MENDED });

    expect(screen.getByText("mended")).toBeTruthy();
  });

  it("renders the fallback in its plugin's scope", async () => {
    silenced();
    await routed({ at: "/invoices", routes: SCOPED });

    expect(screen.getByText("scope billing")).toBeTruthy();
  });

  it("renders the host's error page in place of a page without a fallback", async () => {
    silenced();
    await routed({ at: "/invoices", routes: BROKEN });

    expect(screen.getByRole("heading", { name: "This page could not be shown" })).toBeTruthy();
  });

  it("counts an error towards the page's quarantine", async () => {
    silenced();

    const { host } = await routed({
      at: "/invoices",
      host: { quarantineAfter: 1 },
      routes: BROKEN,
    });

    expect(host.stores.quarantine.get().has(INVOICES)).toBe(true);
  });

  it("counts an error once however often its component mounts", async () => {
    silenced();

    const { host } = await routed({
      at: "/invoices",
      host: { quarantineAfter: 2 },
      routes: BROKEN,
      strict: true,
    });

    expect(host.stores.quarantine.get().has(INVOICES)).toBe(false);
  });
});
