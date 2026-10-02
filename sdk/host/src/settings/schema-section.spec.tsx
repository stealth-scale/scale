import { act, fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { memoryStore } from "@stealthscale/settings";

import { waited } from "#parts/parts.fixtures.tsx";
import { settled, storedKeyOf } from "#settings/settings.fixtures.ts";

const KEY = storedKeyOf("time-off", "reminders");

async function saved(): Promise<void> {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 20);
    });
  });
}

describe("SchemaSection", () => {
  it("renders a field for each property of the schema", async () => {
    await settled("/settings/time-off/time-off");

    const section = screen.getByRole("region", { name: "Reminders" });

    expect(within(section).getByRole("radiogroup", { name: "Channel" })).toBeTruthy();
    expect(within(section).getByRole("spinbutton", { name: "Days before" })).toBeTruthy();
  });

  it("starts the form from the stored values", async () => {
    const store = memoryStore();

    store.write(KEY, JSON.stringify({ values: { days: 5 }, version: 1 }));
    await settled("/settings/time-off/time-off", { host: { store } });

    expect(screen.getByRole<HTMLInputElement>("spinbutton", { name: "Days before" }).value).toBe(
      "5",
    );
  });

  it("writes the values over the stored ones on submit", async () => {
    const store = memoryStore();

    store.write(KEY, JSON.stringify({ values: { days: 5 }, version: 1 }));
    await settled("/settings/time-off/time-off", { host: { store } });
    await saved();

    expect(JSON.parse(store.read(KEY) ?? "null")).toStrictEqual({
      values: { channel: "email", days: 5 },
      version: 1,
    });
  });

  it("raises a success toast after a save", async () => {
    await settled("/settings/time-off/time-off");
    await saved();
    await waited();

    expect(screen.getByText("Settings saved")).toBeTruthy();
  });

  it("renders the host's glyphs in the form", async () => {
    await settled("/settings/time-off/time-off", {
      host: { glyphs: { number: { decrement: <span>fewer</span>, increment: <span>more</span> } } },
    });

    expect(screen.getByText("more")).toBeTruthy();
  });
});
