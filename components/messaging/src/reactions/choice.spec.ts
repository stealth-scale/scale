import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { opened, reacted } from "#reactions/reactions.fixtures.tsx";

describe("Choice", () => {
  it("renders a button named by label with the glyph hidden", async () => {
    await drawn(reacted());
    await opened();

    const heart = screen.getByRole("button", { name: "Heart" });

    expect(heart.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("calls the caller's onClick when pressed", async () => {
    const onClick = vi.fn<() => void>();

    await drawn(reacted({ choice: { onClick } }));
    await opened();
    await pressed(screen.getByRole("button", { name: "Heart" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("reports its value when the caller's onClick is set", async () => {
    const onSelect = vi.fn<(value: string) => void>();

    await drawn(reacted({ choice: { onClick: vi.fn<() => void>() }, picker: { onSelect } }));
    await opened();
    await pressed(screen.getByRole("button", { name: "Heart" }));

    expect(onSelect.mock.lastCall).toStrictEqual(["heart"]);
  });
});
