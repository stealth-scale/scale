import { describe, expect, it } from "vitest";

import { connectionOf } from "#host/host.fixtures.ts";
import { ROUTED_PRODUCT, runtimeOf, TOASTING_PRODUCT } from "#host/runtime.fixtures.ts";

describe("createRuntime", () => {
  it("runs a command with the commands it needs", async () => {
    await expect(runtimeOf().run("payroll/summarize")).resolves.toBe("summary for Ada");
  });

  it("refuses a command whose route condition reads no router", async () => {
    await expect(runtimeOf(ROUTED_PRODUCT).run("time-off/request")).rejects.toThrow(
      "The command time-off/request cannot run: its condition is false.",
    );
  });

  it("runs a command whose route the connected router matched", async () => {
    const runtime = runtimeOf(ROUTED_PRODUCT, connectionOf(["time-off/overview"]));

    await expect(runtime.run("time-off/request")).resolves.toBeUndefined();
  });

  it("gives every command the runtime's toaster", async () => {
    const runtime = runtimeOf(TOASTING_PRODUCT);

    await expect(runtime.run("time-off/request")).resolves.toBe(runtime.toaster);
  });
});
