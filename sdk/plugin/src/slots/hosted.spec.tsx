import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fixtureHost, hosted } from "#host/host.fixtures.tsx";
import { extensionIn, FED } from "#slots/feed.fixtures.ts";
import { Hosted } from "#slots/hosted.tsx";

describe("Hosted", () => {
  it("renders the extension's component with its props", async () => {
    hosted(
      <Hosted
        extension={extensionIn(FED, "notes/tail")}
        props={{ label: "Panel", targetId: "feed/panel" }}
      />,
      fixtureHost({ product: FED }),
    );

    expect(await screen.findByText("tail Panel feed/panel")).toBeTruthy();
  });

  it("renders the extension in its plugin's scope", async () => {
    hosted(
      <Hosted extension={extensionIn(FED, "notes/first")} props={{ targetId: "feed/badge" }} />,
      fixtureHost({ product: FED }),
    );

    expect(await screen.findByText("first notes")).toBeTruthy();
  });

  it("returns the failure count to zero after a render commits", async () => {
    const host = fixtureHost({ product: FED });

    hosted(
      <Hosted
        extension={extensionIn(FED, "notes/tail")}
        props={{ label: "Panel", targetId: "feed/panel" }}
      />,
      host,
    );

    await screen.findByText("tail Panel feed/panel");

    expect(host.recorded.rendered).toContain("extension:notes/tail");
  });

  it("renders the manifest's fallback after the component throws", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    hosted(
      <Hosted extension={extensionIn(FED, "notes/broken")} props={{ targetId: "feed/frame" }} />,
      fixtureHost({ product: FED }),
    );

    expect(await screen.findByText("mended")).toBeTruthy();
  });

  it("counts a render that throws towards the quarantine", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const host = fixtureHost({ product: FED });

    hosted(
      <Hosted extension={extensionIn(FED, "notes/broken")} props={{ targetId: "feed/frame" }} />,
      host,
    );

    await screen.findByText("mended");

    expect(host.recorded.failed.at(0)).toStrictEqual([
      "extension:notes/broken",
      new Error("broken"),
    ]);
  });

  it("counts an extension no installed manifest maps to code as a failure", async () => {
    expect.hasAssertions();
    vi.spyOn(console, "error").mockImplementation(() => {});

    const host = fixtureHost({ product: { ...FED, manifests: {} } });

    hosted(
      <Hosted extension={extensionIn(FED, "notes/tail")} props={{ targetId: "feed/panel" }} />,
      host,
    );

    await waitFor(() => {
      expect(host.recorded.failed.at(0)).toStrictEqual([
        "extension:notes/tail",
        new Error("No manifest maps the extension notes/tail to code."),
      ]);
    });
  });
});
