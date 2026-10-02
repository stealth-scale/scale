import { describe, expect, it, vi } from "vitest";

import { type HostReport } from "@stealthscale/sdk-plugin";

import { internalsOf } from "#host/internals.ts";
import { changed } from "#parts/parts.fixtures.tsx";
import { UnplacedProbe } from "#settings/sections.fixtures.tsx";
import { settled } from "#settings/settings.fixtures.ts";

type Report = (entry: HostReport) => void;

function unplacedIn(report: ReturnType<typeof vi.fn<Report>>): readonly HostReport[] {
  return report.mock.calls.map(([entry]) => entry).filter(({ kind }) => kind === "unplaced");
}

describe("useUnplacedReports", () => {
  it("reports a section that renders on no page as unplaced", async () => {
    const report = vi.fn<Report>();

    await settled("/time-off", { frame: UnplacedProbe, host: { report } });

    expect(unplacedIn(report)).toStrictEqual([
      { kind: "unplaced", slot: "audit/page", target: "lonely/stray" },
    ]);
  });

  it("reports a section once while the caller is mounted", async () => {
    const report = vi.fn<Report>();
    const { host } = await settled("/time-off", { frame: UnplacedProbe, host: { report } });

    await changed(() => {
      internalsOf(host).switches.set("profile", false);
    });

    expect(unplacedIn(report)).toHaveLength(1);
  });

  it("reports a section that becomes unplaced after a change", async () => {
    const report = vi.fn<Report>();
    const { host } = await settled("/invoices", { frame: UnplacedProbe, host: { report } });

    await changed(() => {
      internalsOf(host).switches.set("time-off", false);
    });

    expect(unplacedIn(report)).toContainEqual({
      kind: "unplaced",
      slot: "time-off/time-off",
      target: "lonely/visiting",
    });
  });
});
