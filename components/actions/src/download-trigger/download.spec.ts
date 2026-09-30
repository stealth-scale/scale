import { downloadFile } from "@zag-js/file-utils";
import { describe, expect, it, vi } from "vitest";

import { download } from "#download-trigger/download.ts";

vi.mock(import("@zag-js/file-utils"), () => ({ downloadFile: vi.fn<typeof downloadFile>() }));

const LEDGER = "account,amount\nBridge Ledger,4120.00";

describe("download", () => {
  it("hands text data to the browser under fileName with mimeType", async () => {
    await download({ data: LEDGER, fileName: "ledger.csv", mimeType: "text/csv" });

    expect(downloadFile).toHaveBeenCalledWith({
      file: LEDGER,
      name: "ledger.csv",
      type: "text/csv",
    });
  });

  it("passes an empty type when mimeType is absent", async () => {
    await download({ data: LEDGER, fileName: "ledger.txt" });

    expect(downloadFile).toHaveBeenCalledWith({ file: LEDGER, name: "ledger.txt", type: "" });
  });

  it("hands a Blob to the browser unchanged", async () => {
    const blob = new Blob([LEDGER], { type: "text/csv" });

    await download({ data: blob, fileName: "ledger.csv" });

    expect(vi.mocked(downloadFile).mock.calls[0]?.[0].file).toBe(blob);
  });

  it("calls a data function once per download", async () => {
    const built = vi.fn<() => string>(() => LEDGER);

    await download({ data: built, fileName: "ledger.csv" });
    await download({ data: built, fileName: "ledger.csv" });

    expect(built).toHaveBeenCalledTimes(2);
  });

  it("hands over the value a data function's promise resolves to", async () => {
    await download({ data: () => Promise.resolve(LEDGER), fileName: "ledger.csv" });

    expect(downloadFile).toHaveBeenCalledWith({ file: LEDGER, name: "ledger.csv", type: "" });
  });

  it("rejects when the data function throws", async () => {
    await expect(
      download({
        data: () => {
          throw new Error("The ledger is locked");
        },
        fileName: "ledger.csv",
      }),
    ).rejects.toThrow("The ledger is locked");
  });

  it("hands nothing to the browser when the data function's promise rejects", async () => {
    await download({
      data: () => Promise.reject(new Error("The ledger is locked")),
      fileName: "ledger.csv",
    }).catch(() => {});

    expect(downloadFile).not.toHaveBeenCalled();
  });
});
