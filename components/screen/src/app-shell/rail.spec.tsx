import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { bodied, narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Navbar } from "#app-shell/navbar.tsx";
import { Rail } from "#app-shell/rail.tsx";

describe("Rail", () => {
  it("names itself with the close label while its panel is open", async () => {
    await drawn(
      bodied(
        <>
          <Navbar />
          <Rail />
        </>,
      ),
    );

    expect(screen.getByRole("button", { expanded: true, name: "Close" })).toBeTruthy();
  });

  it("closes its panel when pressed", async () => {
    const { container } = await drawn(
      bodied(
        <>
          <Navbar />
          <Rail />
        </>,
      ),
    );

    await pressed(screen.getByRole("button", { name: "Close" }));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("closed");
  });

  it("names itself with the open label while its panel is closed", async () => {
    await drawn(
      bodied(
        <>
          <Navbar defaultOpen={false} />
          <Rail openLabel="Open navigation" />
        </>,
      ),
    );

    expect(screen.getByRole("button", { expanded: false, name: "Open navigation" })).toBeTruthy();
  });

  it("points aria-controls at its panel", async () => {
    const { container } = await drawn(
      bodied(
        <>
          <Navbar name="folders" />
          <Rail panel="folders" />
        </>,
      ),
    );

    expect(screen.getByRole("button").getAttribute("aria-controls")).toBe(
      slotElement(container, "app-shell", "navbar").id,
    );
  });

  it("takes no tab stop", async () => {
    await drawn(
      bodied(
        <>
          <Navbar />
          <Rail />
        </>,
      ),
    );

    expect(screen.getByRole("button").tabIndex).toBe(-1);
  });

  it("renders nothing without a panel of its name", async () => {
    await drawn(bodied(<Rail panel="missing" />));

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders nothing while its panel is over the page", async () => {
    await drawn(
      narrowed(
        bodied(
          <>
            <Navbar />
            <Rail />
          </>,
        ),
      ),
    );

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders nothing while its panel is under the page", async () => {
    await drawn(
      narrowed(
        bodied(
          <>
            <Navbar folds="under" />
            <Rail />
          </>,
        ),
      ),
    );

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("leaves its panel open when onClick prevents the default", async () => {
    const { container } = await drawn(
      bodied(
        <>
          <Navbar />
          <Rail
            onClick={(event) => {
              event.preventDefault();
            }}
          />
        </>,
      ),
    );

    await pressed(screen.getByRole("button", { name: "Close" }));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("open");
  });
});
