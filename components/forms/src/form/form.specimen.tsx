/**
 * Catalogue page for the form binding.
 *
 * @remarks
 *   `scenesOf` generates the sizes scene from a sign-in form. Hand-written scenes render every
 *   control a schema picks, the controls a presentation picks, typed values with masks, one form
 *   with glyphs and without, groups with legends and columns, floating labels, fields under a
 *   condition, a repeat group, a wizard, tabs, a form validator's errors, a password typed twice
 *   and a form written by hand. Each form renders in a room at a measure a form takes in an
 *   application, because a form fills its container. The page imports the binding's entry as a
 *   type, so the props reader finds the form's parts. The words are keys under `form` in
 *   `locales/en/specimen/form.json`.
 */

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import type * as Binding from "#form.ts";
import * as examples from "#form/examples/index.ts";
import { recipe } from "#form/recipe.ts";

/**
 * Cells of the glyphs scene, in reading order.
 */
const MARKED = ["lucide", "none"] as const;

/**
 * Maps each cell of the glyphs scene to the props of its form.
 */
const MARKS: Readonly<Record<(typeof MARKED)[number], Binding.FormProps>> = {
  lucide: {},
  none: { glyphs: {} },
};

/**
 * Hand-written scene for every control a schema picks.
 */
export const controls: Scene = {
  about: "form.controls.about",
  draw: () => (
    <Room size="lg">
      <examples.controls.Controls />
    </Room>
  ),
  example: examples.controls,
  title: "form.controls.title",
};

/**
 * Hand-written scene for the controls a presentation picks through `control`.
 */
export const presented: Scene = {
  about: "form.presented.about",
  draw: () => (
    <Room size="md">
      <examples.subscription.Subscription />
    </Room>
  ),
  example: examples.subscription,
  title: "form.presented.title",
};

/**
 * Hand-written scene for a combobox, a phone number, a masked postcode and tags.
 */
export const typed: Scene = {
  about: "form.typed.about",
  draw: () => (
    <Room size="sm">
      <examples.freelancer.Freelancer />
    </Room>
  ),
  example: examples.freelancer,
  title: "form.typed.title",
};

/**
 * Hand-written scene for one form with the glyphs a caller gives and with none.
 */
export const glyphs: Scene = {
  about: "form.glyphs.about",
  draw: () => (
    <Matrix knob="glyphs" of={MARKED}>
      {(marked) => (
        <Room size="xs">
          <examples.glyphs.Glyphs {...MARKS[marked]} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.glyphs,
  props: {},
  title: "form.glyphs.title",
};

/**
 * Hand-written scene for groups with legends, two columns and a closed group.
 */
export const layout: Scene = {
  about: "form.layout.about",
  draw: () => (
    <Room size="md">
      <examples.checkout.Checkout />
    </Room>
  ),
  example: examples.checkout,
  title: "form.layout.title",
};

/**
 * Hand-written scene for labels that float inside empty text boxes.
 */
export const floating: Scene = {
  about: "form.floating.about",
  draw: () => (
    <Room size="sm">
      <examples.contact.Contact />
    </Room>
  ),
  example: examples.contact,
  title: "form.floating.title",
};

/**
 * Hand-written scene for fields the schema declares under a condition.
 */
export const conditional: Scene = {
  about: "form.conditional.about",
  draw: () => (
    <Room size="sm">
      <examples.billing.Billing />
    </Room>
  ),
  example: examples.billing,
  title: "form.conditional.title",
};

/**
 * Hand-written scene for a group repeated per item of an array.
 */
export const repeat: Scene = {
  about: "form.repeat.about",
  draw: () => (
    <Room size="sm">
      <examples.payout.Payout />
    </Room>
  ),
  example: examples.payout,
  title: "form.repeat.title",
};

/**
 * Hand-written scene for a wizard.
 */
export const wizard: Scene = {
  about: "form.wizard.about",
  draw: () => (
    <Room size="sm">
      <examples.onboarding.Onboarding />
    </Room>
  ),
  example: examples.onboarding,
  title: "form.wizard.title",
};

/**
 * Hand-written scene for steps as tabs.
 */
export const tabs: Scene = {
  about: "form.tabs.about",
  draw: () => (
    <Room size="sm">
      <examples.preferences.Preferences />
    </Room>
  ),
  example: examples.preferences,
  title: "form.tabs.title",
};

/**
 * Hand-written scene for the errors of a form validator.
 */
export const summary: Scene = {
  about: "form.summary.about",
  draw: () => (
    <Room size="sm">
      <examples.register.Register />
    </Room>
  ),
  example: examples.register,
  title: "form.summary.title",
};

/**
 * Hand-written scene for a new password typed twice.
 */
export const confirmation: Scene = {
  about: "form.confirmation.about",
  draw: () => (
    <Room size="sm">
      <examples.password.Password />
    </Room>
  ),
  example: examples.password,
  title: "form.confirmation.title",
};

/**
 * Hand-written scene for a form written by hand.
 */
export const written: Scene = {
  about: "form.written.about",
  draw: () => (
    <Room size="sm">
      <examples.invoice.Invoice />
    </Room>
  ),
  example: examples.invoice,
  title: "form.written.title",
};

export default specimen({
  about: "form.about",
  id: "components/forms/form",
  imports: 'import { useAppForm, useSchemaForm } from "@stealthscale/component-forms/form";',
  scenes: [
    ...scenesOf<Binding.FormProps>(recipe, {
      axes: { size: { direction: "column" } },
      draw: (props) => (
        <Room size="sm">
          <examples.signin.SignIn {...props} />
        </Room>
      ),
      example: examples.signin,
      namespace: "form",
    }),
    controls,
    presented,
    typed,
    glyphs,
    layout,
    floating,
    conditional,
    repeat,
    wizard,
    tabs,
    summary,
    confirmation,
    written,
  ],
  title: "form.title",
});
