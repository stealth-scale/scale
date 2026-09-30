import { type MouseEvent } from "react";

import { render, screen } from "@testing-library/react";
import { downloadFile } from "@zag-js/file-utils";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, pressed, violations } from "@stealthscale/testing-react";
import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider } from "#button/context.ts";
import { DownloadTrigger } from "#download-trigger/download-trigger.tsx";

vi.mock(import("@zag-js/file-utils"), () => ({ downloadFile: vi.fn<typeof downloadFile>() }));

const FILE = { data: "account,amount", fileName: "ledger.csv", mimeType: "text/csv" };

describe("DownloadTrigger", () => {
  it("returns no conformance violation for its BUTTON root", () => {
    expect(
      violations(DownloadTrigger, { as: true, children: true, element: "BUTTON", props: FILE }),
    ).toStrictEqual([]);
  });

  it("returns no accessibility violation when it renders a text label", async () => {
    await expect(
      accessibilityViolations(DownloadTrigger, { props: { ...FILE, children: "Download" } }),
    ).resolves.toStrictEqual([]);
  });

  it("downloads data as fileName when pressed", async () => {
    render(<DownloadTrigger {...FILE}>Download</DownloadTrigger>);
    await pressed(screen.getByRole("button", { name: "Download" }));

    expect(downloadFile).toHaveBeenCalledWith({
      file: "account,amount",
      name: "ledger.csv",
      type: "text/csv",
    });
  });

  it("downloads nothing before it is pressed", () => {
    render(<DownloadTrigger {...FILE}>Download</DownloadTrigger>);

    expect(downloadFile).not.toHaveBeenCalled();
  });

  it("calls the onClick handler the caller passes", async () => {
    const heard = vi.fn<() => void>();

    render(
      <DownloadTrigger {...FILE} onClick={heard}>
        Download
      </DownloadTrigger>,
    );
    await pressed(screen.getByRole("button", { name: "Download" }));

    expect(heard).toHaveBeenCalledOnce();
  });

  it("downloads nothing when onClick prevents the default", async () => {
    render(
      <DownloadTrigger
        {...FILE}
        onClick={(event: MouseEvent) => {
          event.preventDefault();
        }}
      >
        Download
      </DownloadTrigger>,
    );
    await pressed(screen.getByRole("button", { name: "Download" }));

    expect(downloadFile).not.toHaveBeenCalled();
  });

  it("applies the button recipe variants passed as props", () => {
    const { container } = render(
      <DownloadTrigger {...FILE} size="sm" variant="outline">
        Download
      </DownloadTrigger>,
    );

    expect(recipeClasses(container, "button")).toStrictEqual(
      expect.arrayContaining([
        variantClass("button", "size", "sm"),
        variantClass("button", "variant", "outline"),
      ]),
    );
  });

  it("takes its variants from a ButtonPropsProvider above it", () => {
    const { container } = render(
      <PropsProvider value={{ variant: "ghost" }}>
        <DownloadTrigger {...FILE}>Download</DownloadTrigger>
      </PropsProvider>,
    );

    expect(recipeClasses(container, "button")).toContain(
      variantClass("button", "variant", "ghost"),
    );
  });

  it("sets the type attribute to button", () => {
    render(<DownloadTrigger {...FILE}>Download</DownloadTrigger>);

    expect(screen.getByRole("button", { name: "Download" }).getAttribute("type")).toBe("button");
  });
});
