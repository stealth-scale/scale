import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionFailed } from "#settings/section-failed.tsx";

describe("SectionFailed", () => {
  it("states that the section could not be shown", () => {
    render(<SectionFailed />);

    expect(screen.getByText("This section could not be shown")).toBeTruthy();
  });

  it("asks the person to reload or try again later", () => {
    render(<SectionFailed />);

    expect(screen.getByText("Reload the page, or try again later.")).toBeTruthy();
  });
});
