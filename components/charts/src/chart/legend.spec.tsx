import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { charted } from "#chart/chart.fixtures.tsx";
import { Legend } from "#chart/legend.tsx";
import { useChartContext } from "#chart/use-chart.ts";

/**
 * Returns the pressed state of every button, in order.
 */
function pressed(buttons: readonly HTMLElement[]): ReadonlyArray<null | string> {
  return buttons.map((button) => button.getAttribute("aria-pressed"));
}

/**
 * Renders the legend beside the key of the series the chart points at.
 */
function Highlighted(): ReactElement {
  const chart = useChartContext();

  return (
    <>
      <Legend />
      <output data-testid="highlighted">{chart.highlighted}</output>
    </>
  );
}

describe("Legend", () => {
  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(Legend, { wrapper: (children) => charted({ children }) }),
    ).resolves.toStrictEqual([]);
  });

  it("renders a fieldset named Series by default", () => {
    const { getByRole } = render(charted({ children: <Legend /> }));

    expect(getByRole("group", { name: "Series" }).tagName).toBe("FIELDSET");
  });

  it("names the group by label", () => {
    const { getByRole } = render(charted({ children: <Legend label="Kinds of file" /> }));

    expect(getByRole("group", { name: "Kinds of file" })).toBeDefined();
  });

  it("renders a pressed button per shown series", () => {
    const { getAllByRole } = render(charted({ children: <Legend /> }));

    expect(pressed(getAllByRole("button"))).toStrictEqual(["true", "true"]);
  });

  it("renders an unpressed button for a hidden series", () => {
    const { getAllByRole } = render(
      charted({ children: <Legend />, defaultHiddenKeys: ["refunded"] }),
    );

    expect(pressed(getAllByRole("button"))).toStrictEqual(["true", "false"]);
  });

  it("hides the pressed series after a plain press", () => {
    const { getAllByRole, getByRole } = render(charted({ children: <Legend /> }));

    fireEvent.click(getByRole("button", { name: "Paid" }));

    expect(pressed(getAllByRole("button"))).toStrictEqual(["false", "true"]);
  });

  it("shows the pressed series alone after a press with Ctrl", () => {
    const { getAllByRole, getByRole } = render(charted({ children: <Legend /> }));

    fireEvent.click(getByRole("button", { name: "Paid" }), { ctrlKey: true });

    expect(pressed(getAllByRole("button"))).toStrictEqual(["true", "false"]);
  });

  it("shows the pressed series alone after a press with Cmd", () => {
    const changed = vi.fn<(hidden: readonly string[]) => void>();
    const { getByRole } = render(charted({ children: <Legend />, onHiddenKeysChange: changed }));

    fireEvent.click(getByRole("button", { name: "Refunded" }), { metaKey: true });

    expect(changed).toHaveBeenLastCalledWith(["paid"]);
  });

  it("renders each series' color in the data package's color swatch", () => {
    const { container } = render(charted({ children: <Legend /> }));

    expect(
      [...container.querySelectorAll<HTMLElement>(".color-swatch")].map((swatch) =>
        swatch.style.getPropertyValue("--color-swatch-value"),
      ),
    ).toStrictEqual(["var(--colors-primary-chart)", "var(--colors-series-2)"]);
  });

  it("hides each swatch from assistive technology", () => {
    const { container } = render(charted({ children: <Legend /> }));

    expect(container.querySelector(".color-swatch")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("points the chart at a series under the pointer", () => {
    const { getByRole, getByTestId } = render(charted({ children: <Highlighted /> }));

    fireEvent.pointerEnter(getByRole("button", { name: "Refunded" }));

    expect(getByTestId("highlighted").textContent).toBe("refunded");
  });

  it("points the chart at no series when the pointer leaves", () => {
    const { getByRole, getByTestId } = render(charted({ children: <Highlighted /> }));
    const refunded = getByRole("button", { name: "Refunded" });

    fireEvent.pointerEnter(refunded);
    fireEvent.pointerLeave(refunded);

    expect(getByTestId("highlighted").textContent).toBe("");
  });

  it("points the chart at a focused series", () => {
    const { getByRole, getByTestId } = render(charted({ children: <Highlighted /> }));

    fireEvent.focus(getByRole("button", { name: "Paid" }));

    expect(getByTestId("highlighted").textContent).toBe("paid");
  });

  it("points the chart at no series when focus leaves", () => {
    const { getByRole, getByTestId } = render(charted({ children: <Highlighted /> }));
    const paid = getByRole("button", { name: "Paid" });

    fireEvent.focus(paid);
    fireEvent.blur(paid);

    expect(getByTestId("highlighted").textContent).toBe("");
  });
});
