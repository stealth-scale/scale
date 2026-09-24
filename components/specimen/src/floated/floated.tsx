/**
 * Renders a scene's content with room around it for the open floating content inside it.
 *
 * @remarks
 *   An open tooltip, popover or menu floats over whatever follows it on the page. After a machine
 *   positions its positioner, the box measures every `[data-part=positioner]` descendant against
 *   its content box and pads each side a positioner crosses, so the open content renders inside the
 *   scene. It measures again whenever a style attribute inside it changes, which is when a machine
 *   repositions, and stops after `CHANGES` changes of padding, so a layout that never settles
 *   cannot hold the page in a loop. A positioner with no size is skipped. The inline sides assume
 *   a left-to-right page. The padding is staging, so it never appears in an example.
 */

import { type ComponentProps, type ReactElement, useEffect, useState } from "react";

import { withContext } from "#floated/context.ts";
import { ROOM } from "#floated/recipe.ts";
import { NONE, type Room, roomFor, same } from "#floated/room.ts";

/**
 * Renders the `div` element with the floated recipe's class.
 */
const Box = withContext("div");

/**
 * Number of padding changes after which the box stops measuring.
 */
const CHANGES = 8;

/**
 * Describes the props of Floated: the props of a `div` element except `ref`.
 */
export type FloatedProps = Omit<ComponentProps<typeof Box>, "ref">;

/**
 * Renders its children and pads itself around the positioners inside it.
 */
export function Floated({ style, ...rest }: FloatedProps): ReactElement {
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const [room, setRoom] = useState<Room>(NONE);

  useEffect((): (() => void) | undefined => {
    if (box === null) return undefined;

    let left = CHANGES;

    /**
     * Measures the positioners and sets the padding they need, keeping the state when it is
     * unchanged or when no change is left.
     */
    const measure = (): void => {
      const placed = [...box.querySelectorAll("[data-part=positioner]")].map((each) =>
        each.getBoundingClientRect(),
      );

      setRoom((was) => {
        const next = roomFor(box.getBoundingClientRect(), placed, was);

        if (left === 0 || same(next, was)) return was;

        left -= 1;

        return next;
      });
    };
    const watcher = new MutationObserver(measure);
    const frame = requestAnimationFrame(measure);

    watcher.observe(box, { attributeFilter: ["style"], attributes: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      watcher.disconnect();
    };
  }, [box]);

  const padded: Record<string, string> = {
    [ROOM.blockEnd]: `${String(room.blockEnd)}px`,
    [ROOM.blockStart]: `${String(room.blockStart)}px`,
    [ROOM.inlineEnd]: `${String(room.inlineEnd)}px`,
    [ROOM.inlineStart]: `${String(room.inlineStart)}px`,
  };

  return <Box {...rest} ref={setBox} style={{ ...padded, ...style }} />;
}
