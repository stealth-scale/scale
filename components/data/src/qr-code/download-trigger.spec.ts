import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { composed } from "#qr-code/qr-code.fixtures.tsx";

/**
 * Presses the download trigger with the anchor's click stubbed, and returns the anchor the machine
 * clicked to download the image.
 */
async function downloaded(): Promise<unknown> {
  const click = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(vi.fn<() => void>());

  await pressed(screen.getByRole("button", { name: "Download" }));
  await waitFor(() => {
    expect(click).toHaveBeenCalledExactlyOnceWith();
  });

  return click.mock.contexts[0];
}

describe("DownloadTrigger", () => {
  it("renders the library Button with the download trigger class", async () => {
    await drawn(composed());

    expect([...screen.getByRole("button", { name: "Download" }).classList]).toStrictEqual(
      expect.arrayContaining(["button", slotClass("qr-code", "downloadTrigger")]),
    );
  });

  it("sets type to button", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Download" }).getAttribute("type")).toBe("button");
  });

  it("downloads the image under fileName", async () => {
    await drawn(composed());

    await expect(downloaded()).resolves.toMatchObject({ download: "code.svg" });
  });

  it("writes a white ground and a black pattern into an SVG", async () => {
    await drawn(composed());

    const { href } = (await downloaded()) as HTMLAnchorElement;

    expect(decodeURIComponent(href)).toMatch(/<rect fill="white".*<path[^>]* fill="black"/su);
  });

  it("writes the mark's white ground into an SVG while a mark renders", async () => {
    await drawn(composed({}, { marked: true }));

    const { href } = (await downloaded()) as HTMLAnchorElement;

    expect(decodeURIComponent(href)).toContain('<rect fill="white" height="25%" width="25%"');
  });

  it("renders a PNG through a canvas by default", async () => {
    expect.hasAssertions();

    const context = vi.spyOn(HTMLCanvasElement.prototype, "getContext");

    await drawn(composed({}, { trigger: { fileName: "code.png", mimeType: undefined } }));
    await pressed(screen.getByRole("button", { name: "Download" }));

    await waitFor(() => {
      expect(context).toHaveBeenCalledWith("2d");
    });
  });
});
