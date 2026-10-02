/**
 * Runs a command a key or the palette chose, and reports a rejection.
 */

import { type CommandStatus, type HostRuntime } from "@stealthscale/sdk-plugin";

/**
 * Runs a command without arguments, and reports a rejection as `command-failed` under the command's
 * plugin and as an error toast.
 *
 * @remarks
 *   A key press and the palette have no caller to receive a rejection, so the host reports it.
 * @param status - The command, as `useCommands` returns it.
 * @param runtime - The host's report and toaster.
 * @param title - The error toast's title, translated.
 */
export function runReporting(
  status: CommandStatus,
  runtime: Pick<HostRuntime, "report" | "toaster">,
  title: string,
): void {
  status.run().catch((error: unknown) => {
    runtime.report({
      error,
      kind: "command-failed",
      plugin: status.command.plugin,
      target: status.command.id,
    });
    runtime.toaster.create({ title, type: "error" });
  });
}
