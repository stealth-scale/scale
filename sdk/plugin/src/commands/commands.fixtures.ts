import { type CommandReference } from "@stealthscale/sdk-core";

export const RUN: CommandReference<"payroll/run"> = {
  id: "payroll/run",
  kind: "command",
  label: "commands.run",
};

export const SYNC: CommandReference<"payroll/sync"> = { id: "payroll/sync", kind: "command" };
