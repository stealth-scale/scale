import { createElement, type ReactNode } from "react";

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  type BarOptions,
  FoldedProvider,
  type Name,
  useFolded,
  useMenubar,
  type ValueChangeDetails,
} from "#menubar/bar.ts";

const OPTIONS: BarOptions = { loop: true, menus: {} };

function listed(...values: readonly string[]): readonly Name[] {
  const row = document.createElement("div");

  return values.map((value) => {
    const element = document.createElement("button");

    element.textContent = value;
    row.append(element);

    return { element, value };
  });
}

function stepped(options: Partial<BarOptions>, delta: number): string {
  const { result } = renderHook(() => useMenubar({ ...OPTIONS, ...options }));

  for (const name of listed("file", "edit", "view")) result.current.register(name);

  act(() => {
    result.current.step(delta);
  });

  return result.current.value;
}

describe("bar", () => {
  it("returns an empty value without a defaultValue", () => {
    const { result } = renderHook(() => useMenubar(OPTIONS));

    expect(result.current.value).toBe("");
  });

  it("returns the defaultValue as the value", () => {
    const { result } = renderHook(() => useMenubar({ ...OPTIONS, defaultValue: "edit" }));

    expect(result.current.value).toBe("edit");
  });

  it("follows a controlled value", () => {
    const { rerender, result } = renderHook((value: string) => useMenubar({ ...OPTIONS, value }), {
      initialProps: "file",
    });

    rerender("view");

    expect(result.current.value).toBe("view");
  });

  it("opens the value setValue names", () => {
    const { result } = renderHook(() => useMenubar(OPTIONS));

    act(() => {
      result.current.setValue("edit");
    });

    expect(result.current.value).toBe("edit");
  });

  it("calls onValueChange with the value setValue names", () => {
    const told = vi.fn<(details: ValueChangeDetails) => void>();
    const { result } = renderHook(() => useMenubar({ ...OPTIONS, onValueChange: told }));

    act(() => {
      result.current.setValue("edit");
    });

    expect(told).toHaveBeenLastCalledWith({ value: "edit" });
  });

  it("closes the value closeValue names while it is open", () => {
    const { result } = renderHook(() => useMenubar({ ...OPTIONS, defaultValue: "edit" }));

    act(() => {
      result.current.closeValue("edit");
    });

    expect(result.current.value).toBe("");
  });

  it("keeps the open value when closeValue names another", () => {
    const { result } = renderHook(() => useMenubar({ ...OPTIONS, defaultValue: "edit" }));

    act(() => {
      result.current.closeValue("file");
    });

    expect(result.current.value).toBe("edit");
  });

  it("opens the next name's value on a step of one", () => {
    expect(stepped({ defaultValue: "file" }, 1)).toBe("edit");
  });

  it("opens the previous name's value on a step of minus one", () => {
    expect(stepped({ defaultValue: "edit" }, -1)).toBe("file");
  });

  it("opens the first name's value on a step past the last when loop is true", () => {
    expect(stepped({ defaultValue: "view" }, 1)).toBe("file");
  });

  it("opens the last name's value on a step before the first when loop is true", () => {
    expect(stepped({ defaultValue: "file" }, -1)).toBe("view");
  });

  it("keeps the last name's value on a step past it when loop is false", () => {
    expect(stepped({ defaultValue: "view", loop: false }, 1)).toBe("view");
  });

  it("takes no step while every menu is closed", () => {
    expect(stepped({}, 1)).toBe("");
  });

  it("steps along the names in document order", () => {
    const { result } = renderHook(() => useMenubar({ ...OPTIONS, defaultValue: "file" }));

    for (const name of listed("file", "edit", "view").toReversed()) result.current.register(name);

    act(() => {
      result.current.step(1);
    });

    expect(result.current.value).toBe("edit");
  });

  it("steps past a name its cleanup removed", () => {
    const { result } = renderHook(() => useMenubar({ ...OPTIONS, defaultValue: "file" }));
    const cleanups = listed("file", "edit", "view").map((name) => result.current.register(name));

    act(() => {
      cleanups[1]?.();
      result.current.step(1);
    });

    expect(result.current.value).toBe("view");
  });

  it("claims a step once for the value it opened", () => {
    const { result } = renderHook(() => useMenubar({ ...OPTIONS, defaultValue: "file" }));

    for (const name of listed("file", "edit")) result.current.register(name);

    act(() => {
      result.current.step(1);
    });

    expect([result.current.claimStep("edit"), result.current.claimStep("edit")]).toStrictEqual([
      true,
      false,
    ]);
  });

  it("claims no step for a value no step opened", () => {
    const { result } = renderHook(() => useMenubar({ ...OPTIONS, defaultValue: "file" }));

    expect(result.current.claimStep("file")).toBe(false);
  });

  it("moves focus to the name of a value", () => {
    const { result } = renderHook(() => useMenubar(OPTIONS));
    const names = listed("file", "edit");

    for (const name of names) {
      document.body.append(name.element);
      result.current.register(name);
    }

    result.current.focusName("edit");
    const active = document.activeElement?.textContent;

    for (const name of names) name.element.remove();

    expect(active).toBe("edit");
  });

  it("keeps focus for a value no name registered", () => {
    const { result } = renderHook(() => useMenubar(OPTIONS));
    const before = document.activeElement;

    result.current.focusName("edit");

    expect(document.activeElement).toBe(before);
  });

  it("returns the settings every menu takes", () => {
    const { result } = renderHook(() =>
      useMenubar({ ...OPTIONS, menus: { dir: "rtl", size: "sm" } }),
    );

    expect(result.current.menus).toStrictEqual({ dir: "rtl", size: "sm" });
  });

  it("returns no fold outside the folded bar's menu", () => {
    const { result } = renderHook(() => useFolded());

    expect(result.current).toBeUndefined();
  });

  it("returns the fold the folded bar's menu provides", () => {
    const indicator = "›";
    const { result } = renderHook(() => useFolded(), {
      wrapper: ({ children }: { readonly children: ReactNode }) =>
        createElement(FoldedProvider, { value: { indicator } }, children),
    });

    expect(result.current).toStrictEqual({ indicator });
  });
});
