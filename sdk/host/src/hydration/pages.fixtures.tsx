import { type ReactNode } from "react";

import { useFeatureFlag } from "@stealthscale/sdk-plugin";

import { timeOffContract } from "#host/product.fixtures.ts";

export function Calendar(): ReactNode {
  return (
    <p>{useFeatureFlag(timeOffContract.featureFlags.calendar) ? "calendar on" : "calendar off"}</p>
  );
}
