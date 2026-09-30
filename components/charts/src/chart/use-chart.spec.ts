import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ROWS, scoped, SERIES } from "#chart/chart.fixtures.tsx";
import { useChart } from "#chart/use-chart.ts";

describe("useChart", () => {
  it("returns the rows it is given", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, series: SERIES }));

    expect(result.current.data).toBe(ROWS);
  });

  it("resolves a stated color to its chart role", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, series: SERIES }));

    expect(result.current.color("paid")).toBe("var(--colors-primary-chart)");
  });

  it("resolves a series without a color to the theme's series color at its position", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, series: SERIES }));

    expect(result.current.color("refunded")).toBe("var(--colors-series-2)");
  });

  it("mixes a series' color towards the ink by its share", () => {
    const { result } = renderHook(() =>
      useChart({ data: ROWS, series: [{ color: "teal", ink: 30, key: "paid" }] }),
    );

    expect(result.current.color("paid")).toBe(
      "color-mix(in oklab, var(--colors-fg) 30%, var(--colors-teal-chart))",
    );
  });

  it("returns currentColor for a key no series has", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, series: SERIES }));

    expect(result.current.color("disputed")).toBe("currentColor");
  });

  it("labels a series by its key when it states no label", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, series: [{ key: "paid" }] }));

    expect(result.current.series[0]?.label).toBe("paid");
  });

  it("hides the series defaultHiddenKeys names", () => {
    const { result } = renderHook(() =>
      useChart({ data: ROWS, defaultHiddenKeys: ["refunded"], series: SERIES }),
    );

    expect(result.current.series.map((series) => series.hidden)).toStrictEqual([false, true]);
  });

  it("hides the series hiddenKeys names", () => {
    const { result } = renderHook(() =>
      useChart({ data: ROWS, hiddenKeys: ["paid"], series: SERIES }),
    );

    expect(result.current.hidden("paid")).toBe(true);
  });

  it("hides the pressed series after a plain press", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, series: SERIES }));

    act(() => {
      result.current.press("paid", false);
    });

    expect(result.current.series.map((series) => series.hidden)).toStrictEqual([true, false]);
  });

  it("shows the pressed series alone after a press with Ctrl or Cmd", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, series: SERIES }));

    act(() => {
      result.current.press("paid", true);
    });

    expect(result.current.hidden("refunded")).toBe(true);
  });

  it("resolves every series' opacity to 1 while the legend points at no series", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, series: SERIES }));

    expect(result.current.series.map((series) => series.opacity)).toStrictEqual(["1", "1"]);
  });

  it("resolves the opacity of every series but the highlighted one to the faded opacity", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, series: SERIES }));

    act(() => {
      result.current.highlight("paid");
    });

    expect(result.current.series.map((series) => series.opacity)).toStrictEqual([
      "1",
      "var(--chart-faded)",
    ]);
  });

  it("returns the faded opacity of a series the legend does not point at", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, series: SERIES }));

    act(() => {
      result.current.highlight("refunded");
    });

    expect(result.current.opacity("paid")).toBe("var(--chart-faded)");
  });

  it("returns an opacity of 1 for a key no series has", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, series: SERIES }));

    expect(result.current.opacity("disputed")).toBe("1");
  });

  it("restores every series' opacity when the legend points at no series again", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, series: SERIES }));

    act(() => {
      result.current.highlight("paid");
    });
    act(() => {
      result.current.highlight();
    });

    expect(result.current.series.map((series) => series.opacity)).toStrictEqual(["1", "1"]);
  });

  it("calls onHiddenKeysChange with the keys hidden after a press", () => {
    const changed = vi.fn<(hidden: readonly string[]) => void>();
    const { result } = renderHook(() =>
      useChart({ data: ROWS, onHiddenKeysChange: changed, series: SERIES }),
    );

    act(() => {
      result.current.press("refunded", false);
    });

    expect(changed).toHaveBeenLastCalledWith(["refunded"]);
  });

  it("writes numbers in the locale it is given", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, locale: "de-DE", series: SERIES }));

    expect(result.current.formatNumber()(1234.5)).toBe("1.234,5");
  });

  it("writes numbers in the locale in scope", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, series: SERIES }), {
      wrapper: ({ children }) => scoped("de-DE", children),
    });

    expect(result.current.formatNumber()(1234.5)).toBe("1.234,5");
  });

  it("writes dates in the locale it is given", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, locale: "en-US", series: SERIES }));

    expect(result.current.formatDate({ month: "long", timeZone: "UTC" })("2026-09-28")).toBe(
      "September",
    );
  });

  it("writes numbers in the runtime's locale outside a provider", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, series: SERIES }));
    const runtime = new Intl.NumberFormat().format(1234.5);

    expect(result.current.formatNumber()(1234.5)).toBe(runtime);
  });

  it("returns the locale it is given", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, locale: "de-DE", series: SERIES }));

    expect(result.current.locale).toBe("de-DE");
  });

  it("returns the locale in scope", () => {
    const { result } = renderHook(() => useChart({ data: ROWS, series: SERIES }), {
      wrapper: ({ children }) => scoped("nl-NL", children),
    });

    expect(result.current.locale).toBe("nl-NL");
  });
});
