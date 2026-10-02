import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HostFailed } from "#parts/failed.tsx";
import { named, SHELLED } from "#parts/parts.fixtures.tsx";

describe("HostFailed", () => {
  it("names the product in its heading", () => {
    named();

    const { container } = render(<HostFailed product={SHELLED} />);

    expect(within(container).getByRole("heading", { level: 1 }).textContent).toBe(
      "People could not be shown",
    );
  });

  it("renders the heading inside the main landmark", () => {
    const { container } = render(<HostFailed product={SHELLED} />);
    const main = within(container).getByRole("main");

    expect(main.contains(within(container).getByRole("heading", { level: 1 }))).toBe(true);
  });

  it("reloads the page on a press of its button", () => {
    const reload = vi.spyOn(window.location, "reload").mockImplementation(() => {});
    const { container } = render(<HostFailed product={SHELLED} />);

    fireEvent.click(within(container).getByRole("button", { name: "Reload" }));

    expect(reload).toHaveBeenCalledOnce();
  });
});
