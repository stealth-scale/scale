/**
 * Catalogue page for the toast.
 *
 * @remarks
 *   A toast renders in a region fixed to the window, not in its scene, so every scene is a trigger
 *   that raises toasts. The examples share one toaster, as an application does, and the first
 *   scene renders its region. The recipe has no axes, so every scene is hand-written. The specimen
 *   imports each example file directly, because the props reader finds the toast's parts through
 *   the imports of the example files a specimen imports. A single trigger renders in a `Sample`,
 *   which keeps it at its own width. The words are keys under `toast` in
 *   `locales/en/specimen/toast.json`.
 */

import { Sample, type Scene, specimen } from "@stealthscale/specimen";

import * as kinds from "#toast/examples/kinds.example.tsx";
import * as promise from "#toast/examples/promise.example.tsx";
import * as queue from "#toast/examples/queue.example.tsx";
import * as region from "#toast/examples/region.example.tsx";
import * as sync from "#toast/examples/sync.example.tsx";
import * as undo from "#toast/examples/undo.example.tsx";

/**
 * Hand-written scene for the region an application renders once, with a trigger.
 */
export const regioned: Scene = {
  about: "toast.region.about",
  draw: () => (
    <Sample>
      <region.Toasts />
    </Sample>
  ),
  example: region,
  title: "toast.region.title",
};

/**
 * Hand-written scene for the five kinds a toaster raises.
 */
export const typed: Scene = {
  about: "toast.kinds.about",
  draw: kinds.Kinds,
  example: kinds,
  title: "toast.kinds.title",
};

/**
 * Hand-written scene for a toast with an action.
 */
export const undone: Scene = {
  about: "toast.undo.about",
  draw: () => (
    <Sample>
      <undo.Undo />
    </Sample>
  ),
  example: undo,
  title: "toast.undo.title",
};

/**
 * Hand-written scene for a toast that follows a promise.
 */
export const promised: Scene = {
  about: "toast.promise.about",
  draw: promise.Export,
  example: promise,
  title: "toast.promise.title",
};

/**
 * Hand-written scene for a toast updated in place.
 */
export const updated: Scene = {
  about: "toast.sync.about",
  draw: () => (
    <Sample>
      <sync.Sync />
    </Sample>
  ),
  example: sync,
  title: "toast.sync.title",
};

/**
 * Hand-written scene for toasts queued past the toaster's `max`.
 */
export const queued: Scene = {
  about: "toast.queue.about",
  draw: () => (
    <Sample>
      <queue.Queue />
    </Sample>
  ),
  example: queue,
  title: "toast.queue.title",
};

export default specimen({
  about: "toast.about",
  id: "components/feedback/toast",
  imports: 'import { Toast } from "@stealthscale/component-feedback";',
  scenes: [regioned, typed, undone, promised, updated, queued],
  title: "toast.title",
});
