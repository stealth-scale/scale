/**
 * Publishes the foundation every form is built on: the contexts a bound field and a bound form
 * share, the engine that evaluates a schema and wraps it as the Standard Schema the form library
 * validates with, the defaults and message identifiers derived from a schema, how a form is
 * rendered as data, the factory a component package binds its components with, the hook that
 * builds a form from a schema, the provider that puts the engine, the renderers and the translator
 * in scope, and the draft that keeps a form across a refresh.
 *
 * @packageDocumentation
 */

export { catalogue, type CatalogueEntry } from "#catalogue.ts";
export { fieldContext, formContext, useFieldContext, useFormContext } from "#contexts.ts";
export {
  createSchemaForm,
  type Generated,
  type SchemaFormComponents,
  type SchemaFormHooks,
} from "#create-schema-form.ts";
export { defaultsOf } from "#defaults.ts";
export { type Draft, draftKey, parseDraft, schemaHash, withoutPaths, writeDraft } from "#draft.ts";
export {
  createEngine,
  defaultEngine,
  type Engine,
  type EngineOptions,
  type Format,
  type Keyword,
} from "#engine.ts";
export { defaultEnvironment, type FormEnvironment, useFormEnvironment } from "#environment.ts";
export {
  type ControlProps,
  type DescriptionProps,
  type ErrorProps,
  type FieldAria,
  type FieldAriaOptions,
  type LabelProps,
  useFieldAria,
  type Worded,
} from "#field-aria.ts";
export { Fields, type FieldsProps } from "#fields.tsx";
export {
  errorsId,
  focusControl,
  focusFirstInvalid,
  focusInside,
  type Invalidated,
} from "#focus.ts";
export { formDefaults } from "#form-defaults.ts";
export { schemaFormOptions, type SchemaFormOptions, type SchemaFormStart } from "#form-options.ts";
export { type Identifiers, identifiers } from "#identifiers.ts";
export { type Issue } from "#issues.ts";
export {
  type CellProps,
  type ErrorsProps,
  type GroupProps,
  type ItemProps,
  type Layouts,
  type StepProps,
} from "#layouts.ts";
export { collapse, type Path, type Segment } from "#path.ts";
export {
  FORM,
  KEYWORDS,
  leafPaths,
  memberKey,
  memberPaths,
  members,
  presentationOf,
  stepOf,
  unplaced,
  validatePresentation,
} from "#presentation-of.ts";
export {
  type Field,
  type FieldWidth,
  type Group,
  isGroup,
  type Member,
  type Presentation,
  type Step,
  type Steps,
  WIDTHS,
} from "#presentation.ts";
export { bound, choicesOf, countAt, propertyOf, requiredIn, textOf, valueAt } from "#property.ts";
export { FormProvider, type FormProviderProps } from "#provider.tsx";
export {
  descriptionOf,
  type FieldRules,
  type FormDescription,
  useDescribed,
  useDescribedForm,
} from "#registry.ts";
export {
  byControl,
  RANK,
  type Renderer,
  rendererFor,
  type RendererProps,
  type Suits,
} from "#renderer.ts";
export { RootErrors } from "#root-errors.tsx";
export {
  type DraftScope,
  type FieldOptionsByPath,
  type SchemaFieldOptions,
  type SchemaForm,
  type SchemaValidators,
  type UseSchemaFormOptions,
} from "#schema-form.ts";
export { DRAFT, type Schema, schemaOf } from "#schema.ts";
export { standardOf } from "#standard.ts";
export { leaveStep } from "#steps.ts";
export * from "#tanstack.ts";
export {
  interpolate,
  type Translate,
  translateFrom,
  type TranslateOptions,
  untranslated,
  worded,
} from "#translate.ts";
export { type DraftHandle, type DraftOptions, useDraft } from "#use-draft.ts";
export { type Property, useProperty } from "#use-property.ts";
export { useResolved } from "#use-resolved.ts";
export { rootErrorsOf, useRootErrors } from "#use-root-errors.ts";
export { isSchema, PERSIST, sensitivePaths } from "#walk.ts";
export { useWords, type Words, wordsOf } from "#words.ts";
