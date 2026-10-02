import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NOBODY } from "@stealthscale/sdk-core";

import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import {
  ANYONE_KEY,
  REMINDERS,
  REMINDERS_KEY,
  storedAs,
  UNDECLARED_SECTION,
} from "#settings/settings.fixtures.ts";
import { useSettings } from "#settings/settings.ts";

describe("useSettings", () => {
  it("returns the schema's defaults where nothing is stored", () => {
    const { result } = renderHook(() => useSettings(REMINDERS), {
      wrapper: wrapperOf(fixtureHost(), "time-off"),
    });

    expect(result.current.values).toStrictEqual({ channel: "email", days: 2 });
  });

  it("returns the stored values over the defaults", () => {
    const host = fixtureHost();

    host.runtime.settings.write(REMINDERS_KEY, storedAs(2, { days: 5 }));

    const { result } = renderHook(() => useSettings(REMINDERS), {
      wrapper: wrapperOf(host, "time-off"),
    });

    expect(result.current.values).toStrictEqual({ channel: "email", days: 5 });
  });

  it("migrates a stored value of an earlier version", () => {
    const host = fixtureHost();

    host.runtime.settings.write(REMINDERS_KEY, storedAs(1, { channel: "chat", days: 4 }));

    const { result } = renderHook(() => useSettings(REMINDERS), {
      wrapper: wrapperOf(host, "time-off"),
    });

    expect(result.current.values).toStrictEqual({ channel: "email", days: 4 });
  });

  it("reports each part of a stored value it drops", () => {
    const host = fixtureHost();

    host.runtime.settings.write(REMINDERS_KEY, storedAs(2, { days: 20 }));
    renderHook(() => useSettings(REMINDERS), { wrapper: wrapperOf(host, "time-off") });

    expect(host.recorded.reported).toStrictEqual([
      { key: REMINDERS_KEY, kind: "setting-dropped", reason: "days is above the maximum 14" },
    ]);
  });

  it("writes a change over the stored values", () => {
    const host = fixtureHost();

    host.runtime.settings.write(REMINDERS_KEY, storedAs(2, { channel: "chat" }));

    const { result } = renderHook(() => useSettings(REMINDERS), {
      wrapper: wrapperOf(host, "time-off"),
    });

    act(() => {
      result.current.update({ days: 5 });
    });

    expect(host.runtime.settings.read(REMINDERS_KEY)).toBe(
      storedAs(2, { channel: "chat", days: 5 }),
    );
  });

  it("renders the values it writes", () => {
    const { result } = renderHook(() => useSettings(REMINDERS), {
      wrapper: wrapperOf(fixtureHost(), "time-off"),
    });

    act(() => {
      result.current.update({ days: 5 });
    });

    expect(result.current.values).toStrictEqual({ channel: "email", days: 5 });
  });

  it("throws for a change the schema refuses", () => {
    const { result } = renderHook(() => useSettings(REMINDERS), {
      wrapper: wrapperOf(fixtureHost(), "time-off"),
    });

    expect(() => {
      result.current.update({ days: 20 });
    }).toThrow(
      "useSettings() refused a change to time-off/reminders: days is above the maximum 14.",
    );
  });

  it("throws for a change to another plugin's section", () => {
    const { result } = renderHook(() => useSettings(REMINDERS), {
      wrapper: wrapperOf(fixtureHost(), "billing"),
    });

    expect(() => {
      result.current.update({ days: 5 });
    }).toThrow(
      "useSettings() in billing cannot write time-off/reminders. A plugin writes its own settings sections alone.",
    );
  });

  it("throws for a reset of another plugin's section", () => {
    const { result } = renderHook(() => useSettings(REMINDERS), {
      wrapper: wrapperOf(fixtureHost(), "billing"),
    });

    expect(() => {
      result.current.reset();
    }).toThrow(
      "useSettings() in billing cannot write time-off/reminders. A plugin writes its own settings sections alone.",
    );
  });

  it("writes any section outside every plugin's scope", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useSettings(REMINDERS), { wrapper: wrapperOf(host) });

    act(() => {
      result.current.update({ days: 3 });
    });

    expect(host.runtime.settings.read(REMINDERS_KEY)).toBe(storedAs(2, { days: 3 }));
  });

  it("reads a section no installed plugin declares as empty", () => {
    const { result } = renderHook(() => useSettings(UNDECLARED_SECTION), {
      wrapper: wrapperOf(fixtureHost(), "payroll"),
    });

    expect(result.current.values).toStrictEqual({});
  });

  it("throws for a change to a section no installed plugin declares", () => {
    const { result } = renderHook(() => useSettings(UNDECLARED_SECTION), {
      wrapper: wrapperOf(fixtureHost(), "payroll"),
    });

    expect(() => {
      result.current.update({ frequency: "weekly" });
    }).toThrow("useSettings() found no installed plugin that declares payroll/digest.");
  });

  it("removes the stored value on reset", () => {
    const host = fixtureHost();

    host.runtime.settings.write(REMINDERS_KEY, storedAs(2, { days: 5 }));

    const { result } = renderHook(() => useSettings(REMINDERS), {
      wrapper: wrapperOf(host, "time-off"),
    });

    act(() => {
      result.current.reset();
    });

    expect([host.runtime.settings.read(REMINDERS_KEY), result.current.values]).toStrictEqual([
      null,
      { channel: "email", days: 2 },
    ]);
  });

  it("renders again when another tab writes the section", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useSettings(REMINDERS), {
      wrapper: wrapperOf(host, "time-off"),
    });

    act(() => {
      host.runtime.settings.write(REMINDERS_KEY, storedAs(2, { days: 9 }));
    });

    expect(result.current.values).toStrictEqual({ channel: "email", days: 9 });
  });

  it("reads the values of anyone where nobody is signed in", () => {
    const host = fixtureHost({ session: NOBODY });

    host.runtime.settings.write(ANYONE_KEY, storedAs(2, { days: 1 }));

    const { result } = renderHook(() => useSettings(REMINDERS), {
      wrapper: wrapperOf(host, "time-off"),
    });

    expect(result.current.values).toStrictEqual({ channel: "email", days: 1 });
  });

  it("throws outside a host", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useSettings(REMINDERS))).toThrow(
      "useSettings() found no host. A plugin's components render inside a host, and a test renders them with renderPlugin.",
    );
  });
});
