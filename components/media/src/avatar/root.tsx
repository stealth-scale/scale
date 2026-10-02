/**
 * Renders the avatar's box and runs the machine that tracks its picture.
 *
 * @remarks
 *   The element is a `span`, so an avatar fits in a line of text or a table cell. With `name`, the
 *   root is an image named by that name, `role="img"` with `aria-label`, and the fallback shows its
 *   initials. Without `name`, the root has no role, and the caller names the avatar through the
 *   image's `alt`. Beside the same name in words, set `aria-hidden` on the root, so a screen reader
 *   reads the name once. `palette`, `shape`, `size` and `variant` default to the nearest
 *   `Avatar.Group`. A badge with a label adds its ID to the root's `aria-describedby`, because the
 *   children of an image are not read.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { withProvider } from "#avatar/context.ts";
import {
  ApiProvider,
  type AvatarOptions,
  splitAvatarProps,
  useAvatarMachine,
} from "#avatar/machine.ts";
import { DescribeContext, NameContext, useDefaults } from "#avatar/state.ts";

/**
 * Renders the root `span` and provides the variants to the image and the fallback.
 */
const Boxed = withProvider("span", "root");

/**
 * Describes the props of `Root`: the machine settings, the name and the styled `span` props.
 */
export interface RootProps extends AvatarOptions, Omit<ComponentProps<typeof Boxed>, "dir" | "id"> {
  /**
   * Name of the person or the thing: the initials in the fallback and the avatar's accessible
   * name.
   */
  readonly name?: string | undefined;
}

/**
 * Renders the box, named by `name` when one is passed.
 *
 * @param props - The machine settings, the name, the recipe's variants and the `span` props.
 * @returns The `span` element, with the connected API in context.
 */
export function Root(props: RootProps): ReactElement {
  const [options, { name, palette, shape, size, variant, ...rest }] = splitAvatarProps(props);
  const api = useAvatarMachine(options);
  const defaults = useDefaults();
  const [described, setDescribed] = useState<readonly string[]>([]);

  return (
    <ApiProvider value={api}>
      <NameContext value={name}>
        <DescribeContext value={setDescribed}>
          <Boxed
            {...(name === undefined ? {} : { "aria-label": name, role: "img" })}
            {...(described.length === 0 ? {} : { "aria-describedby": described.join(" ") })}
            {...rest}
            {...omitUndefined({
              palette: palette ?? defaults.palette,
              shape: shape ?? defaults.shape,
              size: size ?? defaults.size,
              variant: variant ?? defaults.variant,
            })}
            {...api.getRootProps()}
          />
        </DescribeContext>
      </NameContext>
    </ApiProvider>
  );
}
