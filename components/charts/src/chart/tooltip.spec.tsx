import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { charted } from "#chart/chart.fixtures.tsx";
import { Tooltip, type TooltipEntry } from "#chart/tooltip.tsx";

const PAYLOAD: readonly TooltipEntry[] = [
  { dataKey: "paid", value: 1234.5 },
  { dataKey: "refunded", value: 30 },
];

/**
 * Returns the text of every row's name and value.
 */
function rows(container: HTMLElement): readonly string[] {
  return [...container.querySelectorAll(".chart__row")].map(
    (row) =>
      `${row.querySelector(".chart__name")?.textContent ?? ""}=${row.querySelector(".chart__value")?.textContent ?? ""}`,
  );
}

describe("Tooltip", () => {
  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(Tooltip, {
        props: { active: true, label: "Tue", payload: PAYLOAD },
        wrapper: (children) => charted({ children, locale: "en-US" }),
      }),
    ).resolves.toStrictEqual([]);
  });

  it("renders the panel as an output", () => {
    const { container } = render(
      charted({ children: <Tooltip active label="Tue" payload={PAYLOAD} /> }),
    );

    expect(container.querySelector(".chart__tooltip")?.tagName).toBe("OUTPUT");
  });

  it("keeps an empty panel while recharts hides it", () => {
    const { container } = render(
      charted({ children: <Tooltip active={false} label="Tue" payload={PAYLOAD} /> }),
    );

    expect(container.querySelector(".chart__tooltip")?.childElementCount).toBe(0);
  });

  it("keeps an empty panel without values", () => {
    const { container } = render(charted({ children: <Tooltip active /> }));

    expect(container.querySelector(".chart__tooltip")?.childElementCount).toBe(0);
  });

  it("announces the panel assertively while recharts' keyboard layer is on", () => {
    const { container } = render(
      charted({ children: <Tooltip accessibilityLayer active label="Tue" payload={PAYLOAD} /> }),
    );

    expect(container.querySelector(".chart__tooltip")?.getAttribute("aria-live")).toBe("assertive");
  });

  it("announces nothing while recharts' keyboard layer is off", () => {
    const { container } = render(
      charted({
        children: <Tooltip accessibilityLayer={false} active label="Tue" payload={PAYLOAD} />,
      }),
    );

    expect(container.querySelector(".chart__tooltip")?.getAttribute("aria-live")).toBe("off");
  });

  it("renders a row per series with the value in the chart's locale", () => {
    const { container } = render(
      charted({ children: <Tooltip active label="Tue" payload={PAYLOAD} />, locale: "en-US" }),
    );

    expect(rows(container)).toStrictEqual(["Paid=1,234.5", "Refunded=30"]);
  });

  it("renders the heading headingOf returns from the entries shown", () => {
    const { container } = render(
      charted({
        children: (
          <Tooltip
            active
            headingOf={(entries) => `${String(entries.length)} values`}
            label="Tue"
            payload={PAYLOAD}
          />
        ),
      }),
    );

    expect(container.querySelector(".chart__heading")?.textContent).toBe("2 values");
  });

  it("names each row by nameOf", () => {
    const { container } = render(
      charted({
        children: (
          <Tooltip
            active
            label="Tue"
            nameOf={(entry) => `Axis ${String(entry.dataKey)}`}
            payload={PAYLOAD}
          />
        ),
        locale: "en-US",
      }),
    );

    expect(rows(container)).toStrictEqual(["Axis paid=1,234.5", "Axis refunded=30"]);
  });

  it("renders the rows rowsOf returns from the entries shown", () => {
    const { container } = render(
      charted({
        children: (
          <Tooltip
            active
            label="Tue"
            payload={PAYLOAD}
            rowsOf={(entries) => [
              { key: "count", name: "Entries", value: String(entries.length) },
              { key: "first", name: "First", value: String(entries[0]?.value) },
            ]}
          />
        ),
      }),
    );

    expect(rows(container)).toStrictEqual(["Entries=2", "First=1234.5"]);
  });

  it("renders the rows rowsOf returns without a swatch", () => {
    const { container } = render(
      charted({
        children: (
          <Tooltip
            active
            label="Tue"
            payload={PAYLOAD}
            rowsOf={() => [{ key: "median", name: "Median", value: "62" }]}
          />
        ),
      }),
    );

    expect(container.querySelector(".color-swatch")).toBeNull();
  });

  it("lists the rows in the legend's order whatever order recharts passes", () => {
    const { container } = render(
      charted({
        children: <Tooltip active label="Tue" payload={PAYLOAD.toReversed()} />,
        locale: "en-US",
      }),
    );

    expect(rows(container)).toStrictEqual(["Paid=1,234.5", "Refunded=30"]);
  });

  it("writes the values with formatValue", () => {
    const { container } = render(
      charted({
        children: (
          <Tooltip
            active
            formatValue={(value) => `€${String(value)}`}
            label="Tue"
            payload={PAYLOAD}
          />
        ),
      }),
    );

    expect(rows(container)).toStrictEqual(["Paid=€1234.5", "Refunded=€30"]);
  });

  it("passes each entry to formatValue", () => {
    const { container } = render(
      charted({
        children: (
          <Tooltip
            active
            formatValue={(value, entry) => `${String(entry.dataKey)} ${String(value)}`}
            label="Tue"
            payload={PAYLOAD}
          />
        ),
      }),
    );

    expect(rows(container)).toStrictEqual(["Paid=paid 1234.5", "Refunded=refunded 30"]);
  });

  it("writes a band's two ends as a range in the chart's locale", () => {
    const { container } = render(
      charted({
        children: <Tooltip active label="Tue" payload={[{ name: "paid", value: [120, 180] }]} />,
        locale: "en-US",
      }),
    );

    expect(rows(container)).toStrictEqual(["Paid=120–180"]);
  });

  it("names the category as it is", () => {
    const { container } = render(
      charted({ children: <Tooltip active label={2026} payload={PAYLOAD} /> }),
    );

    expect(container.querySelector(".chart__heading")?.textContent).toBe("2026");
  });

  it("names the category with formatLabel", () => {
    const { container } = render(
      charted({
        children: <Tooltip active formatLabel={() => "Tuesday"} label="Tue" payload={PAYLOAD} />,
      }),
    );

    expect(container.querySelector(".chart__heading")?.textContent).toBe("Tuesday");
  });

  it("leaves out the heading for a category that is neither a string nor a number", () => {
    const { container } = render(
      charted({ children: <Tooltip active label={{ day: "Tue" }} payload={PAYLOAD} /> }),
    );

    expect(container.querySelector(".chart__heading")).toBeNull();
  });

  it("leaves out the heading without a category", () => {
    const { container } = render(
      charted({
        children: <Tooltip active payload={[{ dataKey: "amount", name: "paid", value: 30 }]} />,
      }),
    );

    expect(container.querySelector(".chart__heading")).toBeNull();
  });

  it("leaves out a series the legend hides", () => {
    const { container } = render(
      charted({
        children: <Tooltip active label="Tue" payload={PAYLOAD} />,
        defaultHiddenKeys: ["refunded"],
        locale: "en-US",
      }),
    );

    expect(rows(container)).toStrictEqual(["Paid=1,234.5"]);
  });

  it("keys a pie sector by its name", () => {
    const { container } = render(
      charted({
        children: <Tooltip active payload={[{ dataKey: "amount", name: "refunded", value: 30 }]} />,
        locale: "en-US",
      }),
    );

    expect(rows(container)).toStrictEqual(["Refunded=30"]);
  });

  it("names a value no series has by its key", () => {
    const { container } = render(
      charted({
        children: <Tooltip active payload={[{ dataKey: "disputed", value: 2 }]} />,
        locale: "en-US",
      }),
    );

    expect(rows(container)).toStrictEqual(["disputed=2"]);
  });

  it("renders each row's swatch in the color entryColor returns", () => {
    const { container } = render(
      charted({
        children: (
          <Tooltip
            active
            entryColor={() => "var(--colors-error-chart)"}
            label="Tue"
            payload={PAYLOAD}
          />
        ),
      }),
    );

    expect(
      container
        .querySelector<HTMLElement>(".color-swatch")
        ?.style.getPropertyValue("--color-swatch-value"),
    ).toBe("var(--colors-error-chart)");
  });

  it("renders each row's color in the data package's color swatch", () => {
    const { container } = render(
      charted({ children: <Tooltip active label="Tue" payload={PAYLOAD} /> }),
    );

    expect(
      container
        .querySelector<HTMLElement>(".color-swatch")
        ?.style.getPropertyValue("--color-swatch-value"),
    ).toBe("var(--colors-primary-chart)");
  });

  it("renders the notes about the category after the rows", () => {
    const { container } = render(
      charted({
        children: (
          <Tooltip
            active
            label="Tue"
            notesOf={(label) => [
              { color: "red", key: "deploy", text: `Deploy on ${String(label)}` },
            ]}
            payload={PAYLOAD}
          />
        ),
        locale: "en-US",
      }),
    );

    expect(rows(container)).toStrictEqual(["Paid=1,234.5", "Refunded=30", "Deploy on Tue="]);
  });

  it("renders a note's swatch in its color", () => {
    const { container } = render(
      charted({
        children: (
          <Tooltip
            active
            label="Tue"
            notesOf={() => [{ color: "var(--colors-error-chart)", key: "spike", text: "Spike" }]}
            payload={PAYLOAD}
          />
        ),
      }),
    );

    expect(
      [...container.querySelectorAll<HTMLElement>(".color-swatch")]
        .at(-1)
        ?.style.getPropertyValue("--color-swatch-value"),
    ).toBe("var(--colors-error-chart)");
  });
});
