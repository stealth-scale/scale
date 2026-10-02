import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { scoped } from "#format/format.fixtures.tsx";
import { Byte } from "#format/index.ts";

describe("Byte", () => {
  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(() => <Byte locale="en-US" value={1_450_000} />),
    ).resolves.toStrictEqual([]);
  });

  it("renders a data element whose value is the size", () => {
    render(<Byte locale="en-US" value={1_450_000} />);

    expect(screen.getByText("1.45 MB").getAttribute("value")).toBe("1450000");
  });

  it("defaults to bytes on the decimal system in the short display", () => {
    render(<Byte locale="en-US" value={2000} />);

    expect(screen.getByText("2 kB").tagName).toBe("DATA");
  });

  it("writes bits under unit bit", () => {
    render(<Byte locale="en-US" unit="bit" unitDisplay="long" value={3000} />);

    expect(screen.getByText("3 kilobits")).toBeDefined();
  });

  it("writes the size in the locale in scope", () => {
    render(scoped("fr-FR", <Byte value={1_450_000} />));

    expect(screen.getByText("1,45 Mo")).toBeDefined();
  });

  it("passes the element's props to the element", () => {
    render(<Byte className="quota" locale="en-US" value={5} />);

    expect(screen.getByText("5 bytes").classList.contains("quota")).toBe(true);
  });
});
