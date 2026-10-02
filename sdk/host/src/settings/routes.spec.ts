import { describe, expect, it, vi } from "vitest";

import { type LazyPage } from "@stealthscale/provider-router";
import { type SettingsSectionProps } from "@stealthscale/sdk-core";

import { withCode } from "#host/host.fixtures.ts";
import { routeIn } from "#routes/routes.fixtures.ts";
import { hostComponentOf, SETTINGS_INDEX, settingsIndexOf } from "#settings/routes.ts";
import { SETTLED } from "#settings/settings.fixtures.ts";

type Import = () => Promise<Readonly<Record<string, (props: SettingsSectionProps) => null>>>;

describe("hostComponentOf", () => {
  it("returns the settings frame for the settings route", () => {
    expect(hostComponentOf(SETTLED, routeIn(SETTLED, "host/settings"))).toBeTypeOf("function");
  });

  it("returns no component for a plugin's route", () => {
    expect(hostComponentOf(SETTLED, routeIn(SETTLED, "time-off/overview"))).toBeUndefined();
  });

  it("loads a settings page as a module whose default export is the page", async () => {
    const component = hostComponentOf(SETTLED, routeIn(SETTLED, "host/settings/profile/main"));

    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a settings page's route loads lazily
    const module = await (component as LazyPage).load();

    expect(module["default"]).toBeTypeOf("function");
  });

  it("imports the plugins of a settings page's loads with the page", async () => {
    const load = vi.fn<Import>(() => Promise.resolve({ Avatar: () => null }));
    const product = withCode(SETTLED, "profile", { settings: { avatar: { component: load } } });
    const component = hostComponentOf(product, routeIn(product, "host/settings/host/account"));

    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a settings page's route loads lazily
    await (component as LazyPage).load();

    expect(load).toHaveBeenCalledExactlyOnceWith();
  });

  it("declares the index at the settings route's own address", () => {
    expect(settingsIndexOf()).toMatchObject({
      id: SETTINGS_INDEX,
      parent: "host/settings",
      path: "/",
    });
  });
});
