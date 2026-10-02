import { describe, expect, it, vi } from "vitest";

import { type CommandStatus } from "@stealthscale/sdk-plugin";

import { fakeRuntime, settledTasks, statusOf } from "#commands/commands.fixtures.ts";
import { runReporting } from "#commands/run.ts";

describe("run", () => {
  it("runs the command without arguments", () => {
    const running = vi.fn<CommandStatus["run"]>(() => Promise.resolve());

    runReporting(statusOf(running), fakeRuntime(), "failed");

    expect(running.mock.calls).toStrictEqual([[]]);
  });

  it("reports a command that rejects as failed under its plugin", async () => {
    const error = new Error("refused");
    const runtime = fakeRuntime();

    runReporting(
      statusOf(() => Promise.reject(error)),
      runtime,
      "failed",
    );
    await settledTasks();

    expect(runtime.report.mock.calls).toStrictEqual([
      [{ error, kind: "command-failed", plugin: "time-off", target: "time-off/request" }],
    ]);
  });

  it("raises an error toast with the title for a command that rejects", async () => {
    const runtime = fakeRuntime();

    runReporting(
      statusOf(() => Promise.reject(new Error("refused"))),
      runtime,
      'Could not run "Request time off".',
    );
    await settledTasks();

    expect(runtime.toaster.create).toHaveBeenCalledExactlyOnceWith({
      title: 'Could not run "Request time off".',
      type: "error",
    });
  });

  it("reports nothing for a command that resolves", async () => {
    const runtime = fakeRuntime();

    runReporting(
      statusOf(() => Promise.resolve()),
      runtime,
      "failed",
    );
    await settledTasks();

    expect(runtime.report).not.toHaveBeenCalled();
  });
});
