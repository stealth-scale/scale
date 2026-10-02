/**
 * Builds the forms the binding's specifications render: a form built from a schema, a form written
 * by hand, and the glyphs they give their fields.
 */

import { type FocusEvent, type ReactElement, type ReactNode, useState } from "react";

import { omitUndefined } from "@stealthscale/hooks";
import {
  type Engine,
  type FieldOptionsByPath,
  type Presentation,
  type Schema,
  type Translate,
  type UseSchemaFormOptions,
} from "@stealthscale/provider-form";

import { useBoundField } from "#form/bound.ts";
import { type fieldComponents } from "#form/fields.ts";
import { useAppForm, useSchemaForm } from "#form/hook.ts";
import { isLeaving } from "#form/leaving.ts";
import {
  type FormGlyphs,
  type FormMark,
  type FormOrientation,
  type FormSize,
  type HeadingLevel,
  useFormScope,
} from "#form/scope.ts";

/**
 * Glyphs a form gives its fields, each an `svg` named by `data-glyph`.
 */
export const GLYPHS: FormGlyphs = {
  checkbox: <svg aria-hidden="true" data-glyph="checkbox" />,
  date: {
    calendar: <svg aria-hidden="true" data-glyph="calendar" />,
    next: <svg aria-hidden="true" data-glyph="next" />,
    previous: <svg aria-hidden="true" data-glyph="previous" />,
  },
  disclosure: <svg aria-hidden="true" data-glyph="disclosure" />,
  error: <svg aria-hidden="true" data-glyph="error" />,
  number: {
    decrement: <svg aria-hidden="true" data-glyph="decrement" />,
    increment: <svg aria-hidden="true" data-glyph="increment" />,
  },
  password: {
    hide: <svg aria-hidden="true" data-glyph="hide" />,
    show: <svg aria-hidden="true" data-glyph="show" />,
  },
  remove: <svg aria-hidden="true" data-glyph="remove" />,
  select: {
    indicator: <svg aria-hidden="true" data-glyph="indicator" />,
    selected: <svg aria-hidden="true" data-glyph="selected" />,
  },
};

/**
 * Describes a value a button of the form sets on a field, as a reset or a script would.
 */
export interface Setting {
  /**
   * Words of the button.
   */
  readonly label: string;

  /**
   * Path of the field the button sets.
   */
  readonly path: string;

  /**
   * Value the button sets.
   */
  readonly value: unknown;
}

/**
 * Describes how a form built from a schema differs from the default one.
 */
export interface Setup {
  /**
   * The engine that evaluates the schema, where it names a format the default engine lacks.
   */
  readonly engine?: Engine | undefined;

  /**
   * The library's own options of the form's fields, such as a blur validator, by path.
   */
  readonly fieldOptions?: FieldOptionsByPath<Record<string, unknown>> | undefined;

  /**
   * Glyphs the form gives its fields.
   */
  readonly glyphs?: FormGlyphs | undefined;

  /**
   * Level a wizard's step heading renders at.
   */
  readonly headingLevel?: HeadingLevel | undefined;

  /**
   * Fields the form marks beside their labels.
   */
  readonly mark?: FormMark | undefined;

  /**
   * Receives the values of a submit the schema accepts. The submit is pending until the promise it
   * returns settles.
   */
  readonly onSubmit?:
    | ((values: Readonly<Record<string, unknown>>) => Promise<void> | void)
    | undefined;

  /**
   * Where the form puts its labels against their controls.
   */
  readonly orientation?: FormOrientation | undefined;

  /**
   * How the form is rendered, in place of the schema's own presentation.
   */
  readonly presentation?: Presentation<Record<string, unknown>> | undefined;

  /**
   * A value a button of the form sets on a field.
   */
  readonly setting?: Setting | undefined;

  /**
   * Size of the form.
   */
  readonly size?: FormSize | undefined;

  /**
   * Whether the form renders a submit button after its fields. Defaults to true. A wizard renders
   * its own on its last step.
   */
  readonly submit?: boolean | undefined;

  /**
   * Translator of the form's words.
   */
  readonly translate?: Translate | undefined;

  /**
   * Values the form starts from.
   */
  readonly values?: Readonly<Record<string, unknown>> | undefined;
}

/**
 * Describes what a form built from a schema is given.
 */
interface GeneratedProps {
  /**
   * The schema.
   */
  readonly schema: Schema;

  /**
   * How the form differs from the default one.
   */
  readonly setup: Setup;
}

/**
 * Renders a form built from a schema, its fields, its submit button, and a button that sets a
 * field where the setup states one.
 */
// eslint-disable-next-line react/only-export-components -- the hook runs in a component, and fast refresh never loads a fixture
function Generated({ schema, setup }: GeneratedProps): ReactElement {
  const {
    fieldOptions,
    glyphs,
    headingLevel,
    mark,
    onSubmit,
    orientation,
    presentation,
    setting,
    size,
    submit,
  } = setup;
  const options: UseSchemaFormOptions<Record<string, unknown>> = {
    id: "profile",
    onSubmit: async ({ value }) => {
      await onSubmit?.(value);
    },
    schema,
    ...omitUndefined({
      engine: setup.engine,
      fieldOptions,
      presentation,
      translate: setup.translate,
      values: setup.values,
    }),
  };
  const form = useSchemaForm(options);

  return (
    <form.AppForm>
      <form.Form {...omitUndefined({ glyphs, headingLevel, mark, orientation, size })}>
        <form.Fields />
        {submit === false ? null : <form.Submit />}
      </form.Form>
      {setting === undefined ? null : (
        <button
          onClick={() => {
            form.setFieldValue(setting.path, setting.value);
          }}
          type="button"
        >
          {setting.label}
        </button>
      )}
    </form.AppForm>
  );
}

/**
 * Renders a form built from a schema, with its fields and its submit button.
 *
 * @param schema - The schema.
 * @param setup - How the form differs from the default one.
 * @returns The form.
 */
export function generated(schema: Schema, setup: Setup = {}): ReactElement {
  return <Generated schema={schema} setup={setup} />;
}

/**
 * Describes what a form written by hand is given.
 */
interface WrittenProps {
  /**
   * Glyphs the form gives its fields.
   */
  readonly glyphs?: FormGlyphs | undefined;

  /**
   * Path of the one field the form renders.
   */
  readonly name: string;

  /**
   * Renders the field, given the field components bound to it.
   */
  readonly render: (field: typeof fieldComponents) => ReactNode;

  /**
   * Values the form starts from.
   */
  readonly values: Readonly<Record<string, unknown>>;
}

/**
 * Renders a form built from the library's own options, with one field rendered by hand.
 */
// eslint-disable-next-line react/only-export-components -- the hook runs in a component, and fast refresh never loads a fixture
function Written({ glyphs, name, render, values }: WrittenProps): ReactElement {
  const form = useAppForm({ defaultValues: values });

  return (
    <form.AppForm>
      <form.Form {...omitUndefined({ glyphs })}>
        <form.AppField name={name}>{(field) => render(field)}</form.AppField>
        <form.Submit />
      </form.Form>
    </form.AppForm>
  );
}

/**
 * Renders a form written by hand with one field, which the caller renders with a field component.
 *
 * @param name - Path of the field.
 * @param values - Values the form starts from.
 * @param render - Renders the field, given the field components bound to it.
 * @param glyphs - Glyphs the form gives its fields.
 * @returns The form.
 */
export function written(
  name: string,
  values: Readonly<Record<string, unknown>>,
  render: (field: typeof fieldComponents) => ReactNode,
  glyphs?: FormGlyphs,
): ReactElement {
  return <Written glyphs={glyphs} name={name} render={render} values={values} />;
}

/**
 * Refuses every value with the error "Write a note".
 */
function refuse(): string {
  return "Write a note";
}

/**
 * Describes what a refusing form is given.
 */
interface RefusingProps {
  /**
   * Renders the form's one field.
   */
  readonly render: () => ReactNode;
}

/**
 * Renders a form written by hand whose one field, `note`, refuses every submit.
 */
// eslint-disable-next-line react/only-export-components -- the hook runs in a component, and fast refresh never loads a fixture
function Refusing({ render }: RefusingProps): ReactElement {
  const form = useAppForm({ defaultValues: { note: "" } });

  return (
    <form.AppForm>
      <form.Form>
        <form.AppField name="note" validators={{ onSubmit: refuse }}>
          {render}
        </form.AppField>
        <form.Submit />
      </form.Form>
    </form.AppForm>
  );
}

/**
 * Renders a form written by hand with one field, `note`, which refuses every submit with the error
 * "Write a note".
 *
 * @param render - Renders the field.
 * @returns The form.
 */
export function refusing(render: () => ReactNode): ReactElement {
  return <Refusing render={render} />;
}

/**
 * Renders the value of the bound field in scope, as text.
 */
// eslint-disable-next-line react/only-export-components -- the hook runs in a component, and fast refresh never loads a fixture
function BoundValue(): ReactElement {
  return <output>{String(useBoundField<unknown>().state.value)}</output>;
}

/**
 * Renders the value of the bound field in scope, as text in an `output`.
 *
 * @returns The output.
 */
export function boundValue(): ReactElement {
  return <BoundValue />;
}

/**
 * Renders the level of a step's heading, the size and the count of glyphs the form in scope gives,
 * as text.
 */
// eslint-disable-next-line react/only-export-components -- the hook runs in a component, and fast refresh never loads a fixture
function ScopeReading(): ReactElement {
  const { glyphs, headingLevel, size } = useFormScope();

  return (
    <output>{`${String(headingLevel)} ${size ?? "none"} ${String(Object.keys(glyphs).length)}`}</output>
  );
}

/**
 * Renders what the form in scope gives its fields, as text in an `output`: the heading level, the
 * size and the count of glyphs.
 *
 * @returns The output.
 */
export function scopeReading(): ReactElement {
  return <ScopeReading />;
}

/**
 * Renders a group of two buttons and a button outside it, and an `output` with whether each blur
 * on the group left it.
 *
 * @returns The buttons and the output.
 */
export function leaving(): ReactElement {
  return <Leaving />;
}

/**
 * Renders a group of two buttons and a button outside it, and reports whether each blur on the
 * group leaves it.
 */
// eslint-disable-next-line react/only-export-components -- the hook runs in a component, and fast refresh never loads a fixture
function Leaving(): ReactElement {
  const [seen, setSeen] = useState<readonly boolean[]>([]);

  return (
    <>
      <div
        onBlur={(event: FocusEvent) => {
          setSeen([...seen, isLeaving(event)]);
        }}
      >
        <button type="button">First</button>
        <button type="button">Second</button>
      </div>
      <button type="button">Outside</button>
      <output>{seen.join(" ")}</output>
    </>
  );
}
