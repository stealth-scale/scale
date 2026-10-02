/**
 * Renders the heading that names the section.
 *
 * @remarks
 *   The element is `h2`, the level of a section under a page's `h1`. Pass `as` for a deeper level:
 *   the recipe sets the size, and the level follows the document's outline. The title sets the id
 *   the section's `aria-labelledby` reads, and records itself while it is mounted, so the section
 *   is a landmark named by its title.
 */

import { type ComponentProps, type ReactElement } from "react";

import { useSafeLayoutEffect } from "@stealthscale/hooks";

import { withContext } from "#section/context.ts";
import { useSection } from "#section/state.ts";

/**
 * Renders the `h2` with the recipe's title class.
 */
const Named = withContext("h2", "title");

/**
 * Describes the props of the title: the props of a heading without `id`, which the section sets.
 */
export type TitleProps = Omit<ComponentProps<typeof Named>, "id">;

/**
 * Renders the heading with the section's title id.
 *
 * @param props - The props of a heading, without `id`.
 * @returns The heading element.
 */
export function Title(props: TitleProps): ReactElement {
  const { setTitled, titleId } = useSection();

  useSafeLayoutEffect(() => {
    setTitled(true);

    return (): void => {
      setTitled(false);
    };
  }, [setTitled]);

  return <Named {...props} id={titleId} />;
}
