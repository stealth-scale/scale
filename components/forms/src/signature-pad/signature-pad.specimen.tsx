/**
 * Catalogue page for the signature pad.
 *
 * @remarks
 *   `scenesOf` generates a scene per axis from the recipe on the saved example, a pad that starts
 *   with a stored signature, so each look, size and palette shows ink. The states scene shows an
 *   invalid, a read-only and a disabled pad. The pen scene draws with pressure at a larger size in
 *   the info palette, the download scene saves the drawing as a PNG, the undo scene keeps the
 *   strokes in the caller's state and removes the last one, the consent scene requires a signature
 *   in a form, and the typed scene offers a typed name in place of a drawn one. The pen, download
 *   and undo scenes draw two strokes after mounting, so the still page shows the pen's stroke and
 *   the buttons a drawing enables. Every drawing is in a room of a phone's width. The words are
 *   keys under `signature-pad` in `locales/en/specimen/signature-pad.json`.
 */

import { type ReactElement, type ReactNode, useEffect, useRef, useState } from "react";

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#signature-pad/examples/index.ts";
import type * as SignaturePad from "#signature-pad/index.ts";
import { recipe } from "#signature-pad/recipe.ts";

/**
 * States of the states scene, in reading order.
 */
const STATES = ["invalid", "readOnly", "disabled"] as const;

/**
 * Maps each state to the root props that put the pad in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], SignaturePad.RootProps>> = {
  disabled: { disabled: true },
  invalid: { invalid: true },
  readOnly: { readOnly: true },
};

/**
 * Describes one stroke the staging draws: points in the control's pixels.
 */
type Stroke = ReadonlyArray<readonly [number, number]>;

/**
 * Describes the shape of a stroke of loops: where it starts, its width, the height of a loop and
 * how many loops it makes.
 */
interface Loops {
  /**
   * Height of a loop, in the control's pixels.
   */
  readonly height: number;

  /**
   * Start point, in the control's pixels.
   */
  readonly start: readonly [number, number];

  /**
   * Number of loops, where half a loop is a rise.
   */
  readonly turns: number;

  /**
   * Width of the stroke, in the control's pixels.
   */
  readonly width: number;
}

/**
 * Returns the points of a stroke of loops.
 */
function looped({ height, start: [x, y], turns, width }: Loops): Stroke {
  return Array.from({ length: 28 }, (_, index) => {
    const t = index / 27;

    return [x + width * t, y - height * Math.abs(Math.sin(Math.PI * turns * t))] as const;
  });
}

/**
 * Strokes the staging draws: a word of loops, and a line under it that rises to the end.
 */
const STROKES: readonly Stroke[] = [
  looped({ height: 42, start: [32, 96], turns: 5, width: 180 }),
  looped({ height: 10, start: [32, 124], turns: 0.5, width: 210 }),
];

/**
 * Describes the props of the drawing staging: the example and the strokes to draw into it.
 */
interface SignedProps {
  /**
   * Example whose signature pad receives the strokes.
   */
  readonly children: ReactNode;

  /**
   * Strokes drawn after the pad mounts, or nothing to leave it as it renders.
   */
  readonly strokes: readonly Stroke[] | undefined;
}

/**
 * Milliseconds the staging waits after a press and after a release, so the machine starts and
 * stops tracking the pointer between events.
 */
const PAUSE = 60;

/**
 * Milliseconds between two moves. The machine adds a point to the stroke it last rendered, so a
 * move waits for the render of the one before it, as a pointer's moves arrive a frame apart.
 */
const STEP = 16;

/**
 * Waits the given milliseconds.
 */
async function paused(milliseconds: number): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/**
 * Sends one pointer event of a pen pressed on the control, at a point of the control where it is
 * when the event is sent.
 */
function sent(
  control: HTMLElement,
  target: EventTarget,
  type: string,
  point: readonly [number, number],
): void {
  const box = control.getBoundingClientRect();

  target.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      button: 0,
      buttons: type === "pointerup" ? 0 : 1,
      clientX: box.left + point[0],
      clientY: box.top + point[1],
      isPrimary: true,
      pointerId: 7,
      pointerType: "pen",
    }),
  );
}

/**
 * Draws one stroke in a control with the pointer events a pen sends: a press on the control, then
 * moves and a release on the document once the machine tracks the pointer.
 */
async function stroked(control: HTMLElement, stroke: Stroke): Promise<void> {
  const [start, ...rest] = stroke;

  if (start === undefined) return;

  sent(control, control, "pointerdown", start);
  await paused(PAUSE);

  await rest.reduce<Promise<void>>(async (previous, point) => {
    await previous;
    sent(control, control.ownerDocument, "pointermove", point);
    await paused(STEP);
  }, Promise.resolve());

  sent(control, control.ownerDocument, "pointerup", rest.at(-1) ?? start);
  await paused(PAUSE);
}

/**
 * Draws strokes in a control, one after another, once the page has settled.
 *
 * @remarks
 *   A browser refuses pointer capture for a pointer it did not create, so the control's
 *   `setPointerCapture` does nothing while the staging draws.
 */
async function drawn(control: HTMLElement, strokes: readonly Stroke[]): Promise<void> {
  await paused(PAUSE * 5);
  control.setPointerCapture = (): undefined => undefined;

  await strokes.reduce<Promise<void>>(async (previous, stroke) => {
    await previous;
    await stroked(control, stroke);
  }, Promise.resolve());

  Reflect.deleteProperty(control, "setPointerCapture");
}

/**
 * Tail of the strokes staged on the page. Every pad's machine tracks a pressed pointer on the
 * whole document, so two pads staged at once would each take the other's moves.
 */
const QUEUE: { tail: Promise<void> } = { tail: Promise.resolve() };

/**
 * Stages strokes in a control after every stroke staged before it on the page.
 */
function queued(control: HTMLElement, strokes: readonly Stroke[]): void {
  QUEUE.tail = QUEUE.tail.then(() => drawn(control, strokes));
}

/**
 * Renders an example and draws strokes in its signature pad once, after it mounts.
 */
function Signed({ children, strokes }: SignedProps): ReactElement {
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const control = box?.querySelector<HTMLElement>("[role=application]");

    if (control === null || control === undefined || strokes === undefined || started.current)
      return;

    started.current = true;
    queued(control, strokes);
  }, [box, strokes]);

  return <div ref={setBox}>{children}</div>;
}

/**
 * Builds a hand-written scene that renders one example in a room of a phone's width.
 *
 * @param name - Key of the scene under `signature-pad`.
 * @param example - Example module, whose source the scene shows.
 * @param Example - Component the example module exports.
 * @param strokes - Strokes the staging draws in the example's pad, or nothing.
 * @returns The scene.
 */
function roomed(
  name: string,
  example: object,
  Example: () => ReactElement,
  strokes?: readonly Stroke[],
): Scene {
  return {
    about: `signature-pad.${name}.about`,
    draw: () => (
      <Room size="sm">
        <Signed strokes={strokes}>
          <Example />
        </Signed>
      </Room>
    ),
    example,
    title: `signature-pad.${name}.title`,
  };
}

/**
 * Hand-written scene for an invalid, a read-only and a disabled pad.
 */
export const states: Scene = {
  about: "signature-pad.states.about",
  draw: () => (
    <Matrix knob="state" of={STATES}>
      {(state) => (
        <Room size="sm">
          <examples.saved.Saved {...STATED[state]} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.saved,
  props: { invalid: true },
  title: "signature-pad.states.title",
};

export default specimen({
  about: "signature-pad.about",
  id: "components/forms/signature-pad",
  imports: 'import { SignaturePad } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<SignaturePad.RootProps>(recipe, {
      draw: (props) => (
        <Room size="sm">
          <examples.saved.Saved {...props} />
        </Room>
      ),
      example: examples.saved,
      namespace: "signature-pad",
      order: ["variant", "size", "palette"],
    }),
    states,
    roomed("pen", examples.pen, examples.pen.Pen, STROKES),
    roomed("download", examples.download, examples.download.Download, STROKES),
    roomed("undo", examples.undo, examples.undo.Undo, STROKES),
    roomed("consent", examples.consent, examples.consent.Consent),
    roomed("typed", examples.typed, examples.typed.Typed),
  ],
  title: "signature-pad.title",
});
