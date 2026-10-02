/**
 * Connects the Zag avatar machine and provides its API to the image and the fallback.
 *
 * @remarks
 *   The machine starts in `loading` and moves to `loaded` when the image loads or to `error` when
 *   it fails. The image is hidden until it loads, and the fallback is hidden only once it has, so
 *   an avatar without an image shows its fallback.
 */

import { useId } from "react";

import * as avatar from "@zag-js/avatar";
import { normalizeProps, useMachine } from "@zag-js/react";
import { createSplitProps } from "@zag-js/utils";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * API returned by `avatar.connect`: a prop getter per part, the load state and its setters.
 *
 * @remarks
 *   The type derives from `connect`, so it follows the installed machine version. The derived type
 *   references `@zag-js/types`, so the package declares that package as a dependency.
 */
export type AvatarApi = ReturnType<typeof avatar.connect>;

/**
 * Machine settings a caller passes to the root, `id` included, all optional.
 */
export type AvatarOptions = Partial<avatar.Props>;

/**
 * Context through which the root provides the connected API to its parts.
 *
 * @remarks
 *   `useAvatar` throws when no `Avatar.Root` is mounted above the calling part.
 */
export const [ApiProvider, useAvatar] = createRequiredContext<AvatarApi>("Avatar");

/**
 * Starts the avatar machine and returns its connected API.
 *
 * @param options - Machine settings split from the root's props. A generated ID is used when `id`
 *   is absent.
 */
export function useAvatarMachine(options: AvatarOptions): AvatarApi {
  const generated = useId();

  return avatar.connect(
    useMachine(avatar.machine, { ...omitUndefined(options), id: options.id ?? generated }),
    normalizeProps,
  );
}

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The machine's own splitter types `id` as required, and the root generates the ID after
 *   splitting, so the splitter is rebuilt over `AvatarOptions` from the machine's key list.
 */
export const splitAvatarProps = splitEnumerable(createSplitProps<AvatarOptions>(avatar.props));
