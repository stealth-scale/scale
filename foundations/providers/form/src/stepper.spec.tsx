import { type ReactElement } from "react";

import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { memoryStore, type SettingStore } from "@stealthscale/settings";

import { draftKey, schemaHash, writeDraft } from "#draft.ts";
import { useJumpingForm, useSchemaForm } from "#hooks.fixtures.ts";
import { type Steps } from "#presentation.ts";
import { type Schema } from "#schema.ts";
import { Stepper } from "#stepper.tsx";
import { translateFrom } from "#translate.ts";

const profile: Schema = {
  properties: { bio: { type: "string" }, name: { minLength: 2, type: "string" } },
  required: ["name"],
  type: "object",
};

const wizard: Steps = {
  of: [
    { name: "who", of: ["name"] },
    { label: "profile.about", name: "about", of: ["bio"] },
  ],
};

const words = translateFrom({ "profile.about": "About you" });
const KEY = draftKey("docs", "profile");

/**
 * Builds a form over the profile with the jumping step layout, in the steps given.
 */
function Jumping({ steps }: { readonly steps: Steps }): ReactElement {
  const form = useJumpingForm({ id: "profile", schema: profile, translate: words });

  return (
    <form.AppForm>
      <form.Form>
        <Stepper resolved={profile} steps={steps} />
      </form.Form>
    </form.AppForm>
  );
}

/**
 * Builds a form from the schema over the store given and renders it in the steps given.
 */
function Page({
  steps = wizard,
  store = memoryStore(),
}: {
  readonly steps?: Steps | undefined;
  readonly store?: SettingStore | undefined;
}): ReactElement {
  const form = useSchemaForm({
    draft: { app: "docs", store },
    id: "profile",
    schema: profile,
    translate: words,
  });

  return (
    <form.AppForm>
      <form.Form>
        <Stepper resolved={profile} steps={steps} />
      </form.Form>
    </form.AppForm>
  );
}

describe("Stepper", () => {
  it("opens on the first step under the label its name derives", () => {
    const { getByLabelText, getByRole } = render(<Page />);

    expect(getByRole("heading", { level: 2 }).textContent).toBe("Who");
    expect(getByLabelText("Name")).toBeDefined();
  });

  it("opens on the step the draft was written on", () => {
    const store = memoryStore();

    writeDraft(store, KEY, { hash: schemaHash(profile), step: "about", values: { bio: "Hi" } });

    const { getByLabelText, getByRole } = render(<Page store={store} />);

    expect(getByRole("heading", { level: 2 }).textContent).toBe("About you");
    expect(getByLabelText("Bio")).toHaveProperty("value", "Hi");
  });

  it("moves to the step of a draft that arrives after the first render", () => {
    const store = memoryStore();
    const { getByRole } = render(<Page store={store} />);

    act(() => {
      writeDraft(store, KEY, { hash: schemaHash(profile), step: "about", values: {} });
    });

    expect(getByRole("heading", { level: 2 }).textContent).toBe("About you");
  });

  it("keeps the step a person chose when a draft arrives after it", async () => {
    const store = memoryStore();
    const { getByRole } = render(<Page steps={{ ...wizard, kind: "tabs" }} store={store} />);

    fireEvent.click(getByRole("button", { name: "About you" }));

    await waitFor(() => {
      expect(getByRole("heading", { level: 2 }).textContent).toBe("About you");
    });

    act(() => {
      writeDraft(store, KEY, { hash: schemaHash(profile), step: "who", values: {} });
    });

    expect(getByRole("heading", { level: 2 }).textContent).toBe("About you");
  });

  it("refuses to move forward while a field of the step is refused", async () => {
    const { getByLabelText, getByRole } = render(<Page />);

    fireEvent.click(getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(getByRole("alert")).toBeDefined();
    });
    expect(getByRole("heading", { level: 2 }).textContent).toBe("Who");
    expect(document.activeElement).toBe(getByLabelText("Name"));
  });

  it("moves forward once the step passes", async () => {
    const { getByLabelText, getByRole } = render(<Page />);

    fireEvent.change(getByLabelText("Name"), { target: { value: "Roy" } });
    fireEvent.click(getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(getByRole("heading", { level: 2 }).textContent).toBe("About you");
    });
  });

  it("writes the step into the draft as a person moves forward", async () => {
    const store = memoryStore();
    const { getByLabelText, getByRole } = render(<Page store={store} />);

    fireEvent.change(getByLabelText("Name"), { target: { value: "Roy" } });
    fireEvent.click(getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(getByRole("heading", { level: 2 }).textContent).toBe("About you");
    });
    expect(JSON.parse(store.read(KEY) ?? "null")).toStrictEqual({
      hash: schemaHash(profile),
      step: "about",
      values: { bio: "", name: "Roy" },
    });
  });

  it("moves focus into the step once it renders", async () => {
    const { getByLabelText, getByRole } = render(<Page />);

    fireEvent.change(getByLabelText("Name"), { target: { value: "Roy" } });
    fireEvent.click(getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(document.activeElement).toBe(getByRole("heading", { level: 2 }));
    });
    expect(getByRole("heading", { level: 2 }).textContent).toBe("About you");
  });

  it("moves back without validating", async () => {
    const store = memoryStore();

    writeDraft(store, KEY, { hash: schemaHash(profile), step: "about", values: {} });

    const { getByRole } = render(<Page store={store} />);

    fireEvent.click(getByRole("button", { name: "Back" }));

    await waitFor(() => {
      expect(getByRole("heading", { level: 2 }).textContent).toBe("Who");
    });
  });

  it("moves between tabs without validating", async () => {
    const { getByRole } = render(<Page steps={{ ...wizard, kind: "tabs" }} />);

    fireEvent.click(getByRole("button", { name: "About you" }));

    await waitFor(() => {
      expect(getByRole("heading", { level: 2 }).textContent).toBe("About you");
    });
  });

  it("leaves focus on the tab a person activated", async () => {
    const { getByRole } = render(<Page steps={{ ...wizard, kind: "tabs" }} />);
    const tab = getByRole("button", { name: "About you" });

    act(() => {
      tab.focus();
    });
    fireEvent.click(tab);

    await waitFor(() => {
      expect(getByRole("heading", { level: 2 }).textContent).toBe("About you");
    });
    expect(document.activeElement).toBe(tab);
  });

  it("refuses to move a wizard more than one step forward at a time", async () => {
    const three: Steps = { kind: "wizard", of: [...wizard.of, { name: "done", of: [] }] };
    const { getByLabelText, getByRole } = render(<Jumping steps={three} />);

    fireEvent.change(getByLabelText("Name"), { target: { value: "Roy" } });
    fireEvent.click(getByRole("button", { name: "Jump" }));
    fireEvent.click(getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(getByRole("heading", { level: 2 }).textContent).toBe("About you");
    });
  });

  it("lets tabs move as far as they like", async () => {
    const three: Steps = { kind: "tabs", of: [...wizard.of, { name: "done", of: [] }] };
    const { getByRole } = render(<Jumping steps={three} />);

    fireEvent.click(getByRole("button", { name: "Jump" }));

    await waitFor(() => {
      expect(getByRole("heading", { level: 2 }).textContent).toBe("Done");
    });
  });

  it("refuses a move to an index without a step", () => {
    const { getByRole } = render(<Jumping steps={{ ...wizard, kind: "tabs" }} />);

    fireEvent.click(getByRole("button", { name: "Rewind" }));
    fireEvent.click(getByRole("button", { name: "Jump" }));

    expect(getByRole("heading", { level: 2 }).textContent).toBe("Who");
  });

  it("writes no draft when the current tab is picked", () => {
    const store = memoryStore();
    const { getByRole } = render(<Page steps={{ ...wizard, kind: "tabs" }} store={store} />);

    fireEvent.click(getByRole("button", { name: "Who" }));

    expect(store.read(KEY)).toBeNull();
  });

  it("renders nothing for steps with no step in them", () => {
    const { container } = render(<Page steps={{ of: [] }} />);

    expect(container.querySelector("h2")).toBeNull();
  });
});
