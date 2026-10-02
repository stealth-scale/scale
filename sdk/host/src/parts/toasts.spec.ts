import { act, within } from "@testing-library/react";
import { getI18n } from "react-i18next";
import { describe, expect, it, vi } from "vitest";

import { internalsOf } from "#host/internals.ts";
import { framed, painted } from "#parts/parts.fixtures.tsx";

describe("HostToasts", () => {
  it("names its region with the host's word", async () => {
    getI18n().addResourceBundle("en", "host", { toasts: { label: "Alerts" } }, true, true);

    const { view } = await framed({ at: "/time-off" });

    expect(within(view.container).queryByRole("region", { name: /^Alerts/v })).not.toBeNull();
  });

  it("renders the title of a toast the toaster raises", async () => {
    const { host, view } = await framed({ at: "/time-off" });

    act(() => {
      internalsOf(host).runtime.toaster.create({
        description: "Every request was sent.",
        title: "Requests sent",
        type: "success",
      });
    });
    await painted();

    expect(
      within(within(view.container).getByRole("status")).queryByText("Requests sent"),
    ).not.toBeNull();
  });

  it("renders the description of a toast the toaster raises", async () => {
    const { host, view } = await framed({ at: "/time-off" });

    act(() => {
      internalsOf(host).runtime.toaster.create({
        description: "Every request was sent.",
        title: "Requests sent",
        type: "success",
      });
    });
    await painted();

    expect(
      within(within(view.container).getByRole("status")).queryByText("Every request was sent."),
    ).not.toBeNull();
  });

  it("renders the action of a toast the toaster raises", async () => {
    const { host, view } = await framed({ at: "/time-off" });

    act(() => {
      internalsOf(host).runtime.toaster.create({
        action: { label: "Undo", onClick: vi.fn<() => void>() },
        title: "Request archived",
        type: "info",
      });
    });
    await painted();

    expect(
      within(within(view.container).getByRole("status")).queryByRole("button", { name: "Undo" }),
    ).not.toBeNull();
  });

  it("renders no action for a toast raised without one", async () => {
    const { host, view } = await framed({ at: "/time-off" });

    act(() => {
      internalsOf(host).runtime.toaster.create({ title: "Requests sent", type: "success" });
    });
    await painted();

    expect(within(within(view.container).getByRole("status")).queryByRole("button")).toBeNull();
  });
});
