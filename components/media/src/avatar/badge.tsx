/**
 * Renders a mark pinned to a corner of the avatar: a status dot, a count, an emoji or an icon.
 *
 * @remarks
 *   The badge goes inside `Avatar.Root`, which it is positioned against. Without children it is a
 *   dot. With `label` it is an image named by the label, and its ID joins the root's
 *   `aria-describedby`, because a root named by `name` is an image whose children are not read.
 *   Without `label` it is hidden from screen readers, for a state already written beside the
 *   avatar. `palette`, `placement` and `variant` are the badge's own, apart from the avatar's.
 */

import { type ComponentProps, type ReactElement, useId } from "react";

import { useSafeLayoutEffect } from "@stealthscale/hooks";

import { withBadgeContext } from "#avatar/context.ts";
import { useDescribe } from "#avatar/state.ts";

/**
 * Renders the badge `span` with the badge recipe's variants.
 */
const Marked = withBadgeContext("span");

/**
 * Describes the props of `Badge`: the label, the variants and the `span` props.
 */
export interface BadgeProps extends Omit<ComponentProps<typeof Marked>, "id"> {
  /**
   * Meaning of the badge in words, such as `Online`, `3 unread messages` or `On holiday`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the badge, named by `label` and describing the avatar around it.
 *
 * @param props - The label, the variants and the `span` element's props.
 * @returns The `span` element.
 */
export function Badge({ label, ...rest }: BadgeProps): ReactElement {
  const id = useId();
  const describe = useDescribe();

  useSafeLayoutEffect(() => {
    const described = label === undefined ? undefined : describe;

    described?.((ids) => [...ids, id]);

    return (): void => {
      described?.((ids) => ids.filter((each) => each !== id));
    };
  }, [describe, id, label]);

  return (
    <Marked
      {...(label === undefined
        ? { "aria-hidden": true }
        : { "aria-label": label, id, role: "img" })}
      {...rest}
    />
  );
}
