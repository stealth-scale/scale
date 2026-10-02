import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { charted } from "#chart/chart.fixtures.tsx";
import { ValueLabel } from "#polar/value-label.tsx";

describe("ValueLabel", () => {
  it("writes the name then the value", () => {
    const { container } = render(
      charted({
        children: <ValueLabel label="Storage" options={{ style: "percent" }} value={0.82} />,
        locale: "en-US",
      }),
    );

    expect(container.textContent).toBe("Storage 82%");
  });

  it("writes the value in the chart's locale", () => {
    const { container } = render(
      charted({
        children: <ValueLabel label="Speicher" options={undefined} value={1234.5} />,
        locale: "de-DE",
      }),
    );

    expect(container.textContent).toBe("Speicher 1.234,5");
  });
});
