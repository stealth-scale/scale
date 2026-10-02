/**
 * Builds the description of a form from what the hook is given and what the provider supplies.
 */

import { useFormEnvironment } from "#environment.ts";
import { type Layouts } from "#layouts.ts";
import { presentationOf, validatePresentation } from "#presentation-of.ts";
import { type Presentation } from "#presentation.ts";
import { type FormDescription } from "#registry.ts";
import { type Renderer } from "#renderer.ts";
import { type UseSchemaFormOptions } from "#schema-form.ts";
import { schemaOf } from "#schema.ts";

/**
 * Describes what a component package hands the foundation once, for every form it builds.
 */
export interface Drawing {
  /**
   * The components that lay a generated form out.
   */
  readonly layouts: Layouts;

  /**
   * The renderers the package renders fields with, before the provider's.
   */
  readonly renderers: readonly Renderer[];
}

/**
 * Describes the two members of the options that are typed over the form's values and are kept
 * untyped in the description, as one object so that one assertion widens both.
 */
interface Typed {
  /**
   * The field options, by path.
   */
  readonly fieldOptions: FormDescription["fieldOptions"];

  /**
   * How the form is rendered.
   */
  readonly presentation: Presentation;
}

/**
 * Builds the description of a form, less the draft, from the options and the environment.
 *
 * @remarks
 *   The presentation is read from the schema and the call site, then checked against the paths
 *   the engine lists, so a member naming a path the schema lacks throws where the form is built
 *   rather than rendering nothing. The identifier given takes precedence over the presentation's.
 *   The package's renderers come before the provider's, so an application overrides a default
 *   by registering after it.
 * @typeParam Values - The form's values.
 * @throws {@link Error} When the presentation names a path no branch of the schema has.
 */
export function useDescription<Values>(
  options: UseSchemaFormOptions<Values>,
  drawing: Drawing,
): Omit<FormDescription, "draft"> {
  const environment = useFormEnvironment();
  const engine = options.engine ?? environment.engine;
  const schema = schemaOf(options.schema);
  const given =
    options.id === undefined ? options.presentation : { ...options.presentation, id: options.id };
  const members = {
    fieldOptions: options.fieldOptions ?? {},
    presentation: presentationOf(schema, given),
  };
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a presentation and field options over typed values are the untyped ones with their paths narrowed, which the compiler cannot relate across a type parameter
  const typed = members as Typed;

  validatePresentation(typed.presentation, engine.paths(schema));

  return {
    engine,
    fieldOptions: typed.fieldOptions,
    id: typed.presentation.id,
    layouts: drawing.layouts,
    presentation: typed.presentation,
    renderers: [...drawing.renderers, ...environment.renderers],
    schema,
    translate: options.translate ?? environment.translate,
  };
}
