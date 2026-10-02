/**
 * Catalogue page for the tags input.
 *
 * @remarks
 *   `scenesOf` generates the looks scene crossed with the statuses and the sizes scene from the
 *   recipe over a field of accounts. Hand-written scenes show the states, email addresses checked
 *   as they are added, a pasted list, editable keywords capped at five, a palette per label, and
 *   a required field in a form. Every drawing is in a room of a phone's width. The page imports the
 *   parts' barrel as a type, so the props reader finds the parts. The words are keys under
 *   `tags-input` in `locales/en/specimen/tags-input.json`.
 */

import { type ReactElement, type ReactNode, useEffect, useState } from "react";

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#tags-input/examples/index.ts";
import type * as TagsInput from "#tags-input/index.ts";
import { recipe } from "#tags-input/recipe.ts";

/**
 * States of the states scene, in reading order.
 */
const STATES = ["empty", "highlighted", "invalid", "readOnly", "disabled"] as const;

/**
 * Maps each state to the root props that put the tags input in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], TagsInput.RootProps>> = {
  disabled: { disabled: true },
  empty: { defaultValue: [] },
  highlighted: {},
  invalid: { invalid: true },
  readOnly: { readOnly: true },
};

/**
 * Renders its children and sets `data-highlighted` on the last tag inside them.
 *
 * @remarks
 *   The machine highlights a tag only while its input has focus, and one input on a page has focus
 *   at a time. The attribute is staging, so it never appears in an example.
 */
function Highlighted({ children }: { readonly children: ReactNode }): ReactElement {
  const [box, setBox] = useState<HTMLDivElement | null>(null);

  useEffect((): (() => void) | undefined => {
    const tags = box?.querySelectorAll<HTMLElement>(".tags-input__item-preview") ?? [];
    const last = [...tags].at(-1);

    if (last === undefined) return undefined;

    last.dataset["highlighted"] = "";

    return () => {
      delete last.dataset["highlighted"];
    };
  }, [box]);

  return <div ref={setBox}>{children}</div>;
}

/**
 * Hand-written scene for an empty, a highlighted, an invalid, a read-only and a disabled tags
 * input.
 */
export const states: Scene = {
  about: "tags-input.states.about",
  draw: () => (
    <Matrix direction="column" knob="state" of={STATES}>
      {(state) => (
        <Room size="sm">
          {state === "highlighted" ? (
            <Highlighted>
              <examples.accounts.Accounts />
            </Highlighted>
          ) : (
            <examples.accounts.Accounts {...STATED[state]} />
          )}
        </Room>
      )}
    </Matrix>
  ),
  example: examples.accounts,
  props: { invalid: true },
  title: "tags-input.states.title",
};

/**
 * Returns a hand-written scene that renders one example in a room of a phone's width.
 *
 * @param key - The scene's key under `tags-input`.
 * @param example - The example module the scene shows as its source.
 * @param Drawing - The example's component.
 * @returns The scene.
 */
function roomed(key: string, example: object, Drawing: () => ReactElement): Scene {
  return {
    about: `tags-input.${key}.about`,
    draw: () => (
      <Room size="sm">
        <Drawing />
      </Room>
    ),
    example,
    title: `tags-input.${key}.title`,
  };
}

export default specimen({
  about: "tags-input.about",
  id: "components/forms/tags-input",
  imports: 'import { TagsInput } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<TagsInput.RootProps>(recipe, {
      axes: {
        size: { direction: "column" },
        status: { across: "variant" },
        variant: { direction: "column" },
      },
      draw: (props) => (
        <Room size="sm">
          <examples.accounts.Accounts {...props} />
        </Room>
      ),
      example: examples.accounts,
      namespace: "tags-input",
      order: ["variant", "size", "status"],
    }),
    states,
    roomed("validated", examples.recipients, examples.recipients.Recipients),
    roomed("pasting", examples.invite, examples.invite.Invite),
    roomed("editing", examples.keywords, examples.keywords.Keywords),
    roomed("palettes", examples.labels, examples.labels.Labels),
    roomed("required", examples.skills, examples.skills.Skills),
  ],
  title: "tags-input.title",
});
