import { render, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Crash } from "#parts/frames.fixtures.tsx";
import { LastBoundary } from "#parts/last-boundary.ts";
import { named, reporting } from "#parts/parts.fixtures.tsx";
import { silenced } from "#routes/routes.fixtures.ts";

describe("LastBoundary", () => {
  it("renders its children while they render", () => {
    const { container } = render(
      <LastBoundary runtime={reporting()}>
        <p>frame</p>
      </LastBoundary>,
    );

    expect(container.textContent).toBe("frame");
  });

  it("renders the failure page after a child throws", () => {
    silenced();
    named();

    const { container } = render(
      <LastBoundary runtime={reporting()}>
        <Crash />
      </LastBoundary>,
    );

    expect(within(container).getByRole("heading", { level: 1 }).textContent).toBe(
      "People could not be shown",
    );
  });

  it("reports the error with the target host", () => {
    silenced();

    const runtime = reporting();

    render(
      <LastBoundary runtime={runtime}>
        <Crash />
      </LastBoundary>,
    );

    expect(runtime.report.mock.lastCall?.[0]).toMatchObject({
      kind: "render-failed",
      target: "host",
    });
  });

  it("keeps the failure page after its children change", () => {
    silenced();

    const runtime = reporting();
    const { container, rerender } = render(
      <LastBoundary runtime={runtime}>
        <Crash />
      </LastBoundary>,
    );

    rerender(
      <LastBoundary runtime={runtime}>
        <p>frame</p>
      </LastBoundary>,
    );

    expect(within(container).queryByText("frame")).toBeNull();
  });
});
