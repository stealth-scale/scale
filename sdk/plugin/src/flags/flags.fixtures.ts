import { type FlagReference } from "@stealthscale/sdk-core";

import { timeOffContract } from "#host/product.fixtures.ts";

export const CALENDAR = timeOffContract.featureFlags.calendar;

export const LAYOUT = timeOffContract.featureFlags.layout;

export const BETA: FlagReference<boolean, "payroll/beta"> = {
  default: true,
  id: "payroll/beta",
  kind: "featureFlag",
};

export const BARE: FlagReference<boolean, "payroll/gamma"> = {
  id: "payroll/gamma",
  kind: "featureFlag",
};
