import { describe, expect, it } from "vitest";

import { notFoundDataOf } from "#routes/not-found.ts";

describe("notFoundDataOf", () => {
  it.each([
    { data: { plugin: "billing", reason: "off" }, label: "a plugin a switch turned off" },
    { data: { plugin: "billing", reason: "unavailable" }, label: "a plugin a kill switch stopped" },
    {
      data: { reason: "quarantined", target: "route:billing/invoices" },
      label: "a quarantined page",
    },
  ])("returns the data of $label", ({ data }) => {
    expect(notFoundDataOf(data)).toStrictEqual(data);
  });

  it.each([
    { data: undefined, label: "no data" },
    { data: null, label: "null" },
    { data: "off", label: "a string" },
    { data: { reason: "off" }, label: "a stopped plugin without its id" },
    { data: { plugin: 7, reason: "off" }, label: "a plugin id that is not a string" },
    { data: { plugin: "billing" }, label: "a plugin without a reason" },
    { data: { plugin: "billing", reason: "gone" }, label: "a plugin with another reason" },
    { data: { reason: "quarantined" }, label: "a quarantine without its target" },
    { data: { reason: "quarantined", target: 7 }, label: "a target that is not a string" },
    {
      data: { reason: "quarantined", target: "extension:billing/total" },
      label: "an extension's target",
    },
    { data: { target: "route:billing/invoices" }, label: "a target without a reason" },
    {
      data: { reason: "gone", target: "route:billing/invoices" },
      label: "a target with another reason",
    },
  ])("returns nothing for $label", ({ data }) => {
    expect(notFoundDataOf(data)).toBeUndefined();
  });
});
