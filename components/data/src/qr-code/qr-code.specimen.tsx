/**
 * Catalogue page for the QR code.
 *
 * @remarks
 *   `scenesOf` generates the sizes, the palettes and the effects from an invite code. The
 *   hand-written scenes show an authenticator setup, a mark over the code, the downloads, a value
 *   that follows a field and a guest network card, each in a 448px room. The words are keys under
 *   `qr-code` in `locales/en/specimen/qr-code.json`.
 */

import { type ReactElement } from "react";

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#qr-code/examples/index.ts";
import type * as QrCode from "#qr-code/index.ts";
import { recipe } from "#qr-code/recipe.ts";

/**
 * Builds a hand-written scene for one example in a 448px room.
 *
 * @param name - The key of the scene's words under `qr-code`.
 * @param example - The example module.
 * @param Drawn - The example's component.
 * @returns The scene.
 */
function roomed(name: string, example: Scene["example"], Drawn: () => ReactElement): Scene {
  return {
    about: `qr-code.${name}.about`,
    draw: () => (
      <Room size="md">
        <Drawn />
      </Room>
    ),
    example,
    title: `qr-code.${name}.title`,
  };
}

export default specimen({
  about: "qr-code.about",
  id: "components/data/qr-code",
  imports: 'import { QrCode } from "@stealthscale/component-data";',
  scenes: [
    ...scenesOf<QrCode.RootProps>(recipe, {
      axes: { size: { direction: "row" } },
      draw: (props) => <examples.invite.Invite {...props} />,
      example: examples.invite,
      namespace: "qr-code",
      order: ["size", "palette", "effect"],
    }),
    roomed("authenticator", examples.authenticator, examples.authenticator.Authenticator),
    roomed("mark", examples.mark, examples.mark.Mark),
    roomed("download", examples.download, examples.download.Download),
    roomed("live", examples.live, examples.live.Live),
    roomed("network", examples.network, examples.network.Network),
  ],
  title: "qr-code.title",
});
