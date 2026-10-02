import { type MountedSlot } from "@stealthscale/sdk-plugin";

export const ASIDE = "host/aside";

export const FIRST: MountedSlot = { dropped: {}, rendered: ["billing/total"] };

export const SECOND: MountedSlot = { dropped: { "billing/total": "full" }, rendered: [] };
