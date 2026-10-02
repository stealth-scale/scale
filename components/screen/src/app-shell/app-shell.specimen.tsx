/**
 * Catalogue page for the app shell.
 *
 * @remarks
 *   Eleven applications, each laid out on the one shell: an operations console, a chat client, a
 *   mail client, a checkout, a handbook, a design tool, a billing console, a reader, a storefront,
 *   a journal and a music player. The kit's `Screen` gives each shell a window of a fixed height
 *   and contains its sheets, and scrolls the three shells that scroll the window. Every scene
 *   bleeds to the card's edges, so a shell is as wide as the card allows. The boxes never appear in
 *   the examples. The words are keys under `app-shell` in `locales/en/specimen/app-shell.json`.
 */

import { type ComponentType, type ReactElement } from "react";

import { type Scene, Screen, specimen } from "@stealthscale/specimen";

import * as examples from "#app-shell/examples/index.ts";
import type * as AppShell from "#app-shell/index.ts";

/**
 * Describes a scene's window and the recipe axes the scene renders.
 */
interface Window {
  /**
   * The recipe axes the scene renders.
   */
  readonly axes?: readonly string[];

  /**
   * Whether the box is the window a shell scrolls.
   */
  readonly scrolls?: boolean;

  /**
   * Height of the box.
   */
  readonly size: "lg" | "md" | "sm" | "xs";
}

/**
 * Returns a scene that renders one application in a window.
 *
 * @param name - The scene's key under `app-shell`, and the example's name.
 * @param example - The example module.
 * @param Application - The example's component.
 * @param window - The window's height, whether it scrolls and the axes the scene renders.
 * @returns The scene.
 */
function applied(
  name: string,
  example: object,
  Application: ComponentType<AppShell.RootProps>,
  window: Window,
): Scene {
  return {
    about: `app-shell.${name}.about`,
    axes: [...(window.axes ?? [])],
    draw: (): ReactElement => (
      <Screen scrolls={window.scrolls ?? false} size={window.size}>
        <Application />
      </Screen>
    ),
    example,
    frame: "bleed",
    title: `app-shell.${name}.title`,
  };
}

export default specimen({
  about: "app-shell.about",
  id: "components/screen/app-shell",
  imports: 'import { AppShell } from "@stealthscale/component-screen";',
  scenes: [
    applied("console", examples.console, examples.console.Console, { size: "lg" }),
    applied("chat", examples.chat, examples.chat.Chat, { size: "sm" }),
    applied("mail", examples.mail, examples.mail.Mail, { size: "sm" }),
    applied("checkout", examples.checkout, examples.checkout.Checkout, { size: "sm" }),
    applied("handbook", examples.handbook, examples.handbook.Handbook, {
      axes: ["variant"],
      size: "md",
    }),
    applied("canvas", examples.canvas, examples.canvas.Canvas, {
      axes: ["divided", "variant"],
      size: "sm",
    }),
    applied("billing", examples.billing, examples.billing.Billing, { size: "sm" }),
    applied("reader", examples.reader, examples.reader.Reader, { size: "sm" }),
    applied("storefront", examples.storefront, examples.storefront.Storefront, {
      axes: ["scroll"],
      scrolls: true,
      size: "xs",
    }),
    applied("journal", examples.journal, examples.journal.Journal, { scrolls: true, size: "xs" }),
    applied("player", examples.player, examples.player.Player, { scrolls: true, size: "xs" }),
  ],
  title: "app-shell.title",
});
