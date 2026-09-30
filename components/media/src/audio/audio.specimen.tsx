/**
 * Catalogue page for the audio element.
 *
 * @remarks
 *   The recipe has no axes, so both scenes are hand-written: a voice memo with the browser's
 *   controls and its transcript, and a notification sound played from a button with the controls
 *   off. The memo and the sound are generated files beside the examples, so no scene loads from the
 *   network. The words are keys under `audio` in `locales/en/specimen/audio.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as chime from "#audio/examples/chime.example.tsx";
import * as memo from "#audio/examples/memo.example.tsx";

/**
 * Hand-written scene for a voice memo with the browser's controls and its transcript.
 */
export const transcribed: Scene = {
  about: "audio.transcribed.about",
  draw: () => (
    <Room size="sm">
      <memo.Memo />
    </Room>
  ),
  example: memo,
  title: "audio.transcribed.title",
};

/**
 * Hand-written scene for a sound played from a button, with the browser's controls off.
 */
export const controlled: Scene = {
  about: "audio.controlled.about",
  draw: () => (
    <Room size="sm">
      <chime.Chime />
    </Room>
  ),
  example: chime,
  title: "audio.controlled.title",
};

export default specimen({
  about: "audio.about",
  id: "components/media/audio",
  imports: 'import { Audio } from "@stealthscale/component-media";',
  scenes: [transcribed, controlled],
  title: "audio.title",
});
