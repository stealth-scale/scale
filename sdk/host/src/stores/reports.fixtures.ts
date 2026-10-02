import { type HostReport } from "@stealthscale/sdk-plugin";

export function entryOf(index: number): HostReport {
  return { kind: "event-chain-cut", target: `time-off/event${String(index)}` };
}
