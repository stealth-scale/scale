/**
 * Draws one scene in a window the size of the device a reader picked: a row of pickers over a
 * frame that loads the catalogue at the address of the sample they pick.
 */

import { type ReactElement, useState } from "react";

import { Text } from "@stealthscale/component-typography";

import { useChoices } from "#device/choices.ts";
import { useFrame } from "#device/frame.ts";
import { Bar, Frame, Root, Size, Stage } from "#device/parts.ts";
import { Picker } from "#device/picker.tsx";
import { HEIGHT, WIDTH } from "#device/recipe.ts";
import { type Held } from "#device/scene.ts";
import { type Pick } from "#framed/address.ts";
import { useWords } from "#words.ts";

/**
 * Describes what a device takes: the device a reader picked, and the scene to show in it.
 */
export type DeviceProps = Held;

/**
 * Draws the pickers, the size and the frame.
 *
 * @remarks
 *   The frame is the device's size and nothing else, the way a phone is, so a sample shorter than
 *   the window sits at its top and one taller scrolls inside it. It loads the same application at
 *   its framed page with the scene's address in the fragment, so everything in it sees a window of
 *   the device's size: the styling engine's media queries, the parts that portal to the body, and
 *   a height stated as the viewport's. The scene is drawn there and nowhere else, so the document
 *   inside says what the scene offers a pick on and a picker per axis is drawn from its report; a
 *   scene of one sample reports no axis and gets no picker. A pick moves the fragment, which the
 *   document follows without loading again, and is forgotten with the page, because which sample
 *   is in the frame is a test setting rather than a preference. The frame is keyed by the theme,
 *   the mode and the language written on the document root, so it loads again when the page
 *   changes one. It loads at once rather than when it comes into view, because a browser's own
 *   deferral of a frame proved unreliable: a frame scrolled past never loaded in one browser and
 *   a frame under the fold never loaded in another, and a frame that stays blank reads as a
 *   scene that failed. It is not sandboxed, because what it loads is this application at its own
 *   origin, which a sandbox that let it run and read its settings would not have held anyway.
 * @param props - The device and the scene.
 * @returns The bar and the frame.
 */
export function Device({ device, scene }: DeviceProps): ReactElement {
  const { t } = useWords();
  const [pick, setPick] = useState<Pick>({});
  const { address, key, src } = useFrame(scene, pick);
  const choices = useChoices(address);
  const sized: Record<string, string> = {
    [HEIGHT]: `${String(device.height)}px`,
    [WIDTH]: `${String(device.width)}px`,
  };

  return (
    <Root style={sized}>
      <Bar>
        {choices.map((choice) => (
          <Picker
            key={choice.part}
            knob={choice.knob ?? t("device.sample")}
            names={choice.names}
            onPick={(position) => {
              setPick({ ...pick, [choice.part]: position });
            }}
            picked={pick[choice.part] ?? 0}
          />
        ))}
        <Size>
          <Text size="sm" tone="muted">
            {t("device.size", { height: device.height, width: device.width })}
          </Text>
        </Size>
      </Bar>
      <Stage>
        <Frame key={key} src={src} title={scene.title} />
      </Stage>
    </Root>
  );
}
