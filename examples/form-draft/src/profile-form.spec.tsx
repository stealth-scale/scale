import { type ReactElement } from "react";

import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { draftKey, FormProvider, schemaHash, writeDraft } from "@stealthscale/provider-form";
import { memoryStore, type SettingStore } from "@stealthscale/settings";
import { drawn, settled } from "@stealthscale/testing-react";

import { ProfileForm } from "#profile-form.tsx";
import { type Profile, readProfile, resetProfiles } from "#records.ts";
import { profile } from "#schema.ts";
import { words } from "#words.ts";

const KEY = draftKey("docs", "profile.p-1");
const HASH = schemaHash(profile);
const RECORD: Profile = { bio: "", email: "roy@example.com", id: "p-1", name: "Roy" };
const saved = vi.fn<(profile: Profile) => void>();

/**
 * Renders the form over the record and the store given.
 */
function Page({ store }: { readonly store: SettingStore }): ReactElement {
  return (
    <FormProvider translate={words}>
      <ProfileForm onSaved={saved} record={RECORD} store={store} />
    </FormProvider>
  );
}

/**
 * Returns the box a label names, with or without the required mark after the label's words.
 */
function box(label: string): HTMLInputElement {
  return screen.getByLabelText<HTMLInputElement>(new RegExp(`^${label}\\*?$`, "u"));
}

/**
 * Returns the words of the step's heading.
 */
function heading(): null | string {
  return screen.getByRole("heading", { level: 2 }).textContent;
}

/**
 * Reads the draft in the store, parsed.
 */
function stored(store: SettingStore): unknown {
  const text = store.read(KEY);

  return text === null ? undefined : JSON.parse(text);
}

describe("ProfileForm", () => {
  it("starts on the first step", async () => {
    await drawn(<Page store={memoryStore()} />);

    expect(heading()).toBe("Who you are");
  });

  it("starts from the saved record", async () => {
    await drawn(<Page store={memoryStore()} />);

    expect([box("Name").value, box("Email").value]).toStrictEqual(["Roy", "roy@example.com"]);
  });

  it("opens on the step a draft was left on with the values it kept", async () => {
    const store = memoryStore();

    writeDraft(store, KEY, {
      hash: HASH,
      step: "about",
      values: { bio: "Hi there", email: "roy@example.com", name: "Roy K" },
    });
    await drawn(<Page store={store} />);

    expect([heading(), box("About you").value, box("New password").value]).toStrictEqual([
      "About",
      "Hi there",
      "",
    ]);
  });

  it("keeps the draft's values on the step before", async () => {
    const store = memoryStore();

    writeDraft(store, KEY, {
      hash: HASH,
      step: "about",
      values: { bio: "Hi there", email: "roy@example.com", name: "Roy K" },
    });
    await drawn(<Page store={store} />);
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    await settled();

    expect(box("Name").value).toBe("Roy K");
  });

  it("writes the draft without the password once a change is debounced", async () => {
    const store = memoryStore();

    await drawn(<Page store={store} />);
    vi.useFakeTimers();
    fireEvent.change(box("Name"), { target: { value: "Roy Klopper" } });

    expect(stored(store)).toBeUndefined();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    vi.useRealTimers();

    expect(stored(store)).toStrictEqual({
      hash: HASH,
      values: { bio: "", email: "roy@example.com", name: "Roy Klopper" },
    });
  });

  it("keeps a person on the first step while a field of it is refused", async () => {
    await drawn(<Page store={memoryStore()} />);
    fireEvent.change(box("Name"), { target: { value: "R" } });
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    await settled();

    await waitFor(() => {
      expect(screen.getAllByRole("alert").map((alert) => alert.textContent)).toContain(
        "Enter at least two characters",
      );
    });
    expect(heading()).toBe("Who you are");
  });

  it("writes the step at once when the first step is left", async () => {
    const store = memoryStore();

    await drawn(<Page store={store} />);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    await settled();

    await waitFor(() => {
      expect(heading()).toBe("About");
    });
    expect(stored(store)).toStrictEqual({
      hash: HASH,
      step: "about",
      values: { bio: "", email: "roy@example.com", name: "Roy" },
    });
  });

  it("saves the profile on submit", async () => {
    const store = memoryStore();

    resetProfiles();
    writeDraft(store, KEY, {
      hash: HASH,
      step: "about",
      values: { bio: "Hi", email: "roy@example.com", name: "Roy" },
    });
    await drawn(<Page store={store} />);
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await settled();

    await waitFor(() => {
      expect(saved).toHaveBeenCalledWith({
        bio: "Hi",
        email: "roy@example.com",
        id: "p-1",
        name: "Roy",
      });
    });
    expect(readProfile("p-1")?.bio).toBe("Hi");
  });

  it("forgets the draft on submit", async () => {
    const store = memoryStore();

    resetProfiles();
    writeDraft(store, KEY, {
      hash: HASH,
      step: "about",
      values: { bio: "Hi", email: "roy@example.com", name: "Roy" },
    });
    await drawn(<Page store={store} />);
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await settled();

    await waitFor(() => {
      expect(store.read(KEY)).toBeNull();
    });
  });
});
