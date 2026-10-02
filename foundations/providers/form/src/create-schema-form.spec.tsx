import { type ReactElement, useMemo } from "react";

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { memoryStore, type SettingStore } from "@stealthscale/settings";

import { draftKey, schemaHash, writeDraft } from "#draft.ts";
import { createEngine } from "#engine.ts";
import { useAppForm, useSchemaForm, withFieldGroup, withForm } from "#hooks.fixtures.ts";
import { type SchemaValidators } from "#schema-form.ts";
import { type Schema } from "#schema.ts";
import { type Translate, translateFrom } from "#translate.ts";

interface Signup {
  name: string;
  password: string;
}

const signup: Schema = {
  properties: {
    name: { minLength: 2, type: "string" },
    password: { format: "password", type: "string" },
  },
  required: ["name"],
  type: "object",
  "x-form": { id: "signup" },
};

const KEY = draftKey("docs", "signup");
const HASH = schemaHash(signup);

/**
 * Refuses a password that contains the name, marking the password.
 */
const apart: SchemaValidators<Signup> = {
  onSubmit: ({ value }) =>
    value.name !== "" && value.password.includes(value.name)
      ? { fields: { password: { keyword: "containsName" } } }
      : undefined,
};

/**
 * Builds the signup form and renders it, with a draft kept in the store given.
 */
function Page({
  onSubmit,
  store,
  validators,
  values,
}: {
  readonly onSubmit?: ((submitted: { value: Signup }) => void) | undefined;
  readonly store?: SettingStore | undefined;
  readonly validators?: SchemaValidators<Signup> | undefined;
  readonly values?: Partial<Signup> | undefined;
}): ReactElement {
  const form = useSchemaForm<Signup>({
    ...(onSubmit && { onSubmit }),
    draft: store && { app: "docs", store },
    schema: signup,
    validators,
    values,
  });

  return (
    <form.AppForm>
      <form.Form>
        <form.Fields />
        <form.Submit />
      </form.Form>
    </form.AppForm>
  );
}

/**
 * Reads the draft in the store, parsed.
 */
function stored(store: SettingStore): unknown {
  const text = store.read(KEY);

  return text === null ? undefined : JSON.parse(text);
}

/**
 * Lists the alerts with words in them, which leaves out the form's own region while it is empty.
 */
function shown(): HTMLElement[] {
  return screen.getAllByRole("alert").filter((alert) => alert.textContent !== "");
}

/**
 * Builds the form and keeps the element that renders its fields, as a compiled build does.
 */
function Kept({ translate }: { readonly translate: Translate }): ReactElement {
  const form = useSchemaForm<Signup>({ schema: signup, translate });
  const fields = useMemo(() => <form.Fields />, [form]);

  return <form.AppForm>{fields}</form.AppForm>;
}

describe("createSchemaForm", () => {
  it("binds the field components and the form components of the package", () => {
    const { getByLabelText, getByRole } = render(<Page />);

    expect(getByLabelText("Name").getAttribute("type")).toBe("text");
    expect(getByLabelText("Password").getAttribute("type")).toBe("password");
    expect(getByRole("button").textContent).toBe("Submit");
  });

  it("returns the library's own helpers beside the hook", () => {
    expect(useAppForm).toBeTypeOf("function");
    expect(withForm).toBeTypeOf("function");
    expect(withFieldGroup).toBeTypeOf("function");
  });
});

describe("useSchemaForm", () => {
  it("starts from the schema's defaults with the values given written over them", () => {
    const { getByLabelText } = render(<Page values={{ name: "Roy" }} />);

    expect(getByLabelText("Name")).toHaveProperty("value", "Roy");
    expect(getByLabelText("Password")).toHaveProperty("value", "");
  });

  it("starts from the draft's values written over the values given", () => {
    const store = memoryStore();

    writeDraft(store, KEY, { hash: HASH, values: { name: "Roy K" } });

    const { getByLabelText } = render(<Page store={store} values={{ name: "Roy" }} />);

    expect(getByLabelText("Name")).toHaveProperty("value", "Roy K");
  });

  it("writes the draft after a change and the debounce without the password", () => {
    vi.useFakeTimers();

    const store = memoryStore();
    const { getByLabelText } = render(<Page store={store} />);

    fireEvent.change(getByLabelText("Name"), { target: { value: "Roy" } });
    fireEvent.change(getByLabelText("Password"), { target: { value: "hunter2" } });

    expect(stored(store)).toBeUndefined();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(stored(store)).toStrictEqual({ hash: HASH, values: { name: "Roy" } });
    vi.useRealTimers();
  });

  it("hands the submit handler the values and forgets the draft once it returns", async () => {
    const store = memoryStore();
    const onSubmit = vi.fn<(submitted: { value: Signup }) => void>();

    writeDraft(store, KEY, { hash: HASH, values: { name: "Roy" } });

    const { getByRole } = render(<Page onSubmit={onSubmit} store={store} />);

    fireEvent.click(getByRole("button"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ value: { name: "Roy", password: "" } }),
      );
    });
    expect(store.read(KEY)).toBeNull();
  });

  it("forgets the draft on submit where no handler is given", async () => {
    const store = memoryStore();

    writeDraft(store, KEY, { hash: HASH, values: { name: "Roy" } });

    const { getByRole } = render(<Page store={store} />);

    fireEvent.click(getByRole("button"));

    await waitFor(() => {
      expect(store.read(KEY)).toBeNull();
    });
  });

  it("validates with the schema on submit and then on every change", async () => {
    const { getByLabelText, getByRole } = render(<Page />);

    fireEvent.change(getByLabelText("Name"), { target: { value: "R" } });

    expect(shown()).toHaveLength(0);

    fireEvent.click(getByRole("button"));

    await waitFor(() => {
      expect(shown()).toHaveLength(1);
    });
    expect(document.activeElement).toBe(getByLabelText("Name"));

    fireEvent.change(getByLabelText("Name"), { target: { value: "Roy" } });

    await waitFor(() => {
      expect(shown()).toHaveLength(0);
    });
  });

  it("runs the listener given beside the draft's and hands the submit handler the form", async () => {
    const seen: string[] = [];
    const store = memoryStore();

    /**
     * Builds the form with a change listener and a submit handler reading the form.
     */
    function Listened(): ReactElement {
      const form = useSchemaForm<Signup>({
        draft: { app: "docs", store },
        listeners: {
          onChange: ({ formApi }) => {
            seen.push(`changed ${formApi.state.values.name}`);
          },
          onChangeDebounceMs: 0,
        },
        onSubmit: ({ formApi, value }) => {
          seen.push(`submitted ${value.name} ${formApi.state.submissionAttempts}`);
        },
        schema: signup,
      });

      return (
        <form.AppForm>
          <form.Form>
            <form.Fields />
            <form.Submit />
          </form.Form>
        </form.AppForm>
      );
    }

    const { getByLabelText, getByRole } = render(<Listened />);

    fireEvent.change(getByLabelText("Name"), { target: { value: "Roy" } });
    fireEvent.click(getByRole("button"));

    await waitFor(() => {
      expect(seen).toStrictEqual(["changed Roy", "submitted Roy 1"]);
    });
    expect(store.read(KEY)).toBeNull();
  });

  it("runs the form validators given in their own slots", async () => {
    const { getByLabelText, getByRole } = render(<Page validators={apart} />);

    fireEvent.change(getByLabelText("Name"), { target: { value: "Roy" } });
    fireEvent.change(getByLabelText("Password"), { target: { value: "Roy123" } });
    fireEvent.click(getByRole("button"));

    await waitFor(() => {
      expect(shown().map((alert) => alert.textContent)).toStrictEqual(["containsName"]);
    });
  });

  it("reads every word under the form's identifier through the translator given", () => {
    const words = translateFrom({ "signup.fields.name.label": "Your name" });

    /**
     * Builds the form translated by the words.
     */
    function Translated(): ReactElement {
      const form = useSchemaForm<Signup>({ schema: signup, translate: words });

      return (
        <form.AppForm>
          <form.Fields />
        </form.AppForm>
      );
    }

    expect(render(<Translated />).getByLabelText("Your name")).toBeDefined();
  });

  it("renders the fields again through a kept element when the translator changes", () => {
    const english = translateFrom({ "signup.fields.name.label": "Your name" });
    const dutch = translateFrom({ "signup.fields.name.label": "Je naam" });
    const { getByLabelText, rerender } = render(<Kept translate={english} />);

    rerender(<Kept translate={dutch} />);

    expect(getByLabelText("Je naam")).toBeDefined();
  });

  it("evaluates the schema with the engine given", () => {
    const vatted: Schema = { properties: { vat: { format: "vat-number", type: "string" } } };
    const engine = createEngine({ formats: [{ holds: (): boolean => true, name: "vat-number" }] });

    /**
     * Builds a form over a schema naming the format the engine has.
     */
    function Engined(): ReactElement {
      const form = useSchemaForm({ engine, schema: vatted });

      return (
        <form.AppForm>
          <form.Fields />
        </form.AppForm>
      );
    }

    expect(render(<Engined />).getByLabelText("Vat")).toBeDefined();
  });
});
