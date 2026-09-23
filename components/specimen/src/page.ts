/**
 * Types and identity helpers for declaring catalogue pages and their scenes.
 *
 * @remarks
 *   A page declares every field explicitly. The catalogue derives nothing from file paths, because
 *   a path-based rule fits one repository layout and silently breaks on another.
 */

import { type FC } from "react";

/**
 * How a scene is framed on its card.
 */
export type Frame = "bare" | "bleed" | "inset";

/**
 * All frame values, from the least to the most change to the card.
 */
export const FRAMES: readonly Frame[] = ["inset", "bleed", "bare"];

/**
 * A scene on a catalogue page.
 */
export interface Scene {
  /**
   * Introductory sentence, for a scene whose title does not describe what it shows.
   */
  about?: string;

  /**
   * Recipe axes the scene renders. The coverage check reads the field to find unrendered axes.
   *
   * @remarks
   *   The axes are declared explicitly because the props of a scene are not the recipe's axes. A
   *   scene can vary one axis while it fixes three others. `scenesOf` sets the field on generated
   *   scenes. A hand-written scene sets it when it replaces a generated scene, and omits it when it
   *   shows no axis, such as an anatomy or a usage example.
   */
  axes?: readonly string[] | undefined;

  /**
   * Component that renders the scene.
   *
   * @remarks
   *   The field takes a component, not a node, so a stateful scene calls its hooks in its own
   *   render. A scene called as a function would register its hooks on the caller.
   */
  draw: FC;

  /**
   * Namespace of the example module the scene renders. The catalogue shows its `source` export.
   *
   * @remarks
   *   Example files are named `<component>/examples/<name>.example.tsx` and contain consumer code.
   *   The specimen plugin appends the text of each file to its module as a `source` string export,
   *   with `#` imports rewritten to the package name. The field takes the module, not the text,
   *   because the export exists only where the plugin runs. Under a plain test runner the scene
   *   has no source.
   */
  example?: object | undefined;

  /**
   * How the scene is framed on its card. Defaults to `inset`.
   *
   * @remarks
   *   `inset` keeps the card padding, for a component without a surface. `bleed` removes the
   *   padding, so a panel reaches the card edges. `bare` removes the card surface, so the scene
   *   renders as it would in an application. The source control keeps the card padding in every
   *   frame, because a control flush with the page edge reads as part of the scene.
   */
  frame?: Frame;

  /**
   * Source text shown for the scene. Takes precedence over `example`.
   *
   * @remarks
   *   `scenesOf` writes the source of a generated scene from the props of its first cell. A
   *   hand-written scene sets `example`, or sets this field when it has no example file.
   */
  source?: string | undefined;

  /**
   * Scene heading. The catalogue also uses it as the key of the scene's source.
   */
  title: string;

  /**
   * Whether the scene fills the device window. Defaults to false.
   *
   * @remarks
   *   An application shell is as tall as its window, so a device renders it edge to edge whatever
   *   the frame. Padding would push the shell past the bottom of the window.
   */
  viewport?: boolean;
}

/**
 * A catalogue page.
 */
export interface Specimen {
  /**
   * Introductory sentences of the page.
   */
  about?: string;

  /**
   * Navigation group the rail lists the page under. The page is ungrouped when the field is
   * absent.
   */
  group?: string;

  /**
   * Page address, unique across the catalogue.
   *
   * @remarks
   *   The ID is never displayed, so a title can change or be translated without breaking links.
   *   The index rejects a duplicate ID, because the second page would be unreachable.
   */
  id: string;

  /**
   * Import statement shown at the top of the page. No import line renders when the field is
   * absent.
   *
   * @remarks
   *   The statement is declared explicitly. A specimen file imports the catalogue kit and icons
   *   alongside the components it documents, and no rule separates the two reliably. A page whose
   *   scenes share one sample declares the sample's imports here.
   */
  imports?: string;

  /**
   * Translation namespace of the page and scene titles and introductions. Defaults to
   * `specimen`.
   *
   * @remarks
   *   The value must be a string literal, because the index plugin reads it from source text. A key
   *   without a translation renders as the key, so plain text works as well.
   */
  namespace?: string;

  /**
   * Scenes in display order.
   *
   * @remarks
   *   The scenes are listed explicitly because a module namespace enumerates its exports in
   *   alphabetical order. A page written as Variants, States, Anatomy would otherwise render as
   *   Anatomy, States, Variants.
   */
  scenes: readonly Scene[];

  /**
   * Page heading. Defaults to the last segment of the ID.
   */
  title?: string;
}

/**
 * Returns the page declaration unchanged.
 *
 * @remarks
 *   The function exists so TypeScript checks the declaration where the page is written. The index
 *   plugin parses the call from source text and never evaluates it.
 */
export function specimen(page: Specimen): Specimen {
  return page;
}

/**
 * Returns the scene declaration unchanged, typed as a {@link Scene}.
 */
export function scene(shown: Scene): Scene {
  return shown;
}

/**
 * Returns the source text shown for a scene.
 *
 * @returns `source` if set, otherwise the `source` export of `example`, or undefined when neither
 *   is a string.
 */
export function sourceOf(shown: Scene): string | undefined {
  if (shown.source !== undefined) return shown.source;

  const { example } = shown;

  return example !== undefined && "source" in example && typeof example.source === "string"
    ? example.source
    : undefined;
}
