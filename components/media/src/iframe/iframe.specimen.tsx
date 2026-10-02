/**
 * Catalogue page for the sandboxed frame.
 *
 * @remarks
 *   `scenesOf` generates the ratio and corner scenes from the email preview, each frame in an `sm`
 *   room. The corner scene holds the square ratio, which fits the whole email at every width.
 *   The hand-written scenes show the preview with the sandbox that grants nothing, and a
 *   converter that needs scripts with the one capability it needs. Every frame renders its document
 *   from `srcDoc`, so no scene loads from the network. The words are keys under `iframe` in
 *   `locales/en/specimen/iframe.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as email from "#iframe/examples/email.example.tsx";
import * as widget from "#iframe/examples/widget.example.tsx";
import { type IframeProps } from "#iframe/index.ts";
import { recipe } from "#iframe/recipe.ts";

/**
 * Hand-written scene for an email preview in a frame that grants nothing.
 */
export const preview: Scene = {
  about: "iframe.preview.about",
  draw: () => (
    <Room size="sm">
      <email.Email ratio="portrait" />
    </Room>
  ),
  example: email,
  props: { ratio: "portrait" },
  title: "iframe.preview.title",
};

/**
 * Hand-written scene for a framed converter that needs scripts.
 */
export const scripted: Scene = {
  about: "iframe.scripted.about",
  draw: () => (
    <Room size="sm">
      <widget.Widget />
    </Room>
  ),
  example: widget,
  title: "iframe.scripted.title",
};

export default specimen({
  about: "iframe.about",
  id: "components/media/iframe",
  imports: 'import { Iframe } from "@stealthscale/component-media";',
  scenes: [
    preview,
    scripted,
    ...scenesOf<Omit<IframeProps, "title">>(recipe, {
      axes: { radius: { with: { ratio: "square" } } },
      draw: (props) => (
        <Room size="sm">
          <email.Email {...props} />
        </Room>
      ),
      example: email,
      namespace: "iframe",
      order: ["ratio", "radius"],
    }),
  ],
  title: "iframe.title",
});
