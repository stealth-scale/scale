import { describe, expect, it } from "vitest";

import { caseNamed } from "#checks.fixtures.ts";
import { MEMO_OFF, OFFICE } from "#desk-manifest.fixtures.ts";
import { ContentlessFrame } from "#desk-parts.fixtures.tsx";
import { PluginFrame } from "#frame.tsx";
import { placedCases } from "#placed.ts";
import { CustomFrame } from "#probes.fixtures.tsx";

const PIN = "required extension desk/pin is placed";

const NOTE = "required extension desk/note is placed";

const CONTENT = "the frame mounts the content slot";

describe("placedCases", () => {
  it("names one case per required extension before the content case", () => {
    expect(placedCases(OFFICE, PluginFrame).map(({ name }) => name)).toStrictEqual([
      NOTE,
      PIN,
      CONTENT,
    ]);
  });

  it("passes a required extension a route's render places", async () => {
    await expect(caseNamed(placedCases(OFFICE, PluginFrame), PIN).run()).resolves.toBeUndefined();
  });

  it("passes a required extension its slot drops for its condition", async () => {
    await expect(caseNamed(placedCases(OFFICE, PluginFrame), NOTE).run()).resolves.toBeUndefined();
  });

  it("shares one walk between the cases of one call", async () => {
    const cases = placedCases(OFFICE, PluginFrame);

    await caseNamed(cases, PIN).run();

    await expect(caseNamed(cases, NOTE).run()).resolves.toBeUndefined();
  });

  it("fails a required extension whose region the frame leaves out", async () => {
    await expect(caseNamed(placedCases(OFFICE, CustomFrame), PIN).run()).rejects.toThrow(
      "No route of the product renders slot:host/status, which the required extension desk/pin targets.",
    );
  });

  it("fails a required extension whose plugin is off", async () => {
    const found = caseNamed(
      placedCases(MEMO_OFF, PluginFrame),
      "required extension memo/tag is placed",
    );

    await expect(found.run()).rejects.toThrow(
      "The required extension memo/tag is not placed in host/status, which drops it as off.",
    );
  });

  it("passes a frame that renders HostContent", async () => {
    await expect(
      caseNamed(placedCases(OFFICE, PluginFrame), CONTENT).run(),
    ).resolves.toBeUndefined();
  });

  it("fails a frame that renders no HostContent", async () => {
    await expect(caseNamed(placedCases(OFFICE, ContentlessFrame), CONTENT).run()).rejects.toThrow(
      "The frame renders no HostContent, so no page renders in it.",
    );
  });
});
