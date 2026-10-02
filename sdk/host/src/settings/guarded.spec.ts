import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type HostReport } from "@stealthscale/sdk-plugin";

import { waited } from "#parts/parts.fixtures.tsx";
import { silenced } from "#routes/routes.fixtures.ts";
import { CRASHING, settled } from "#settings/settings.fixtures.ts";

const EXTRA = "section:profile/extra";

describe("Guarded", () => {
  it("renders an alert in the place of a section that throws", async () => {
    silenced();
    await settled("/settings/profile/main", { host: { product: CRASHING } });
    await waited();

    const section = screen.getByRole("region", { name: "Extra" });

    expect(within(section).getByText("This section could not be shown")).toBeTruthy();
  });

  it("keeps the other sections of the page running after one throws", async () => {
    silenced();
    await settled("/settings/profile/main", { host: { product: CRASHING } });
    await waited();

    expect(screen.getByText("ranked")).toBeTruthy();
  });

  it("counts a throw towards the section's quarantine", async () => {
    silenced();

    const { host } = await settled("/settings/profile/main", {
      host: { product: CRASHING, quarantineAfter: 1 },
    });

    await waited();

    expect(host.stores.quarantine.get().has(EXTRA)).toBe(true);
  });

  it("renders a quarantined section's alert without rendering the section", async () => {
    const report = vi.fn<(entry: HostReport) => void>();

    await settled("/settings/profile/main", {
      host: { product: CRASHING, quarantineAfter: 1, report },
      prepare: (host) => {
        host.stores.quarantine.failed(EXTRA, new Error("broken before"));
      },
    });
    await waited();

    expect(report.mock.calls.filter(([entry]) => entry.kind === "render-failed")).toHaveLength(1);
  });

  it("renders a section that commits in its plugin's scope", async () => {
    await settled("/settings/profile/main");
    await waited();

    expect(screen.getByText("extra")).toBeTruthy();
  });
});
