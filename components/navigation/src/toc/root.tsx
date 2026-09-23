/**
 * Renders the navigation landmark of the table of contents and runs the machine the parts share.
 *
 * @remarks
 *   The element is `nav`. The machine sets `aria-labelledby` to the title's ID, so render a
 *   `Toc.Title` or the landmark has no name. The machine marks each heading inside the
 *   `IntersectionObserver` band that `rootMargin` sets. Its default band excludes the bottom of
 *   the viewport, so a short last section is never marked. Pass `rootMargin="0px"` to mark every
 *   visible heading, and the last one once the page reaches its end.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#toc/context.ts";
import {
  ApiProvider,
  splitTocProps,
  type TocItem,
  type TocOptions,
  useTocMachine,
} from "#toc/machine.ts";

/**
 * Nav element that provides the recipe's variants to the parts.
 */
const Landmark = withProvider("nav", "root");

/**
 * Describes the props of Toc.Root: the machine options, the recipe's variants and the props of a
 * nav element.
 *
 * @remarks
 *   The element's `id` and `dir` are omitted, because the machine sets both. It derives the
 *   landmark's `aria-labelledby` from the ID and writes the direction to every part. The CSS
 *   `scrollBehavior` style prop is omitted, so the name reaches the machine option that scrolls
 *   the page to a heading.
 */
export interface RootProps
  extends Omit<ComponentProps<typeof Landmark>, "dir" | "id" | "scrollBehavior">, TocOptions {
  /**
   * Headings of the page in document order, each with its element ID as `value` and its level as
   * `depth`.
   */
  readonly items: TocItem[];
}

/**
 * Renders a `nav` that runs the machine and provides its api to the parts.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitTocProps(props);
  const api = useTocMachine(options);

  return (
    <ApiProvider value={api}>
      <Landmark {...rest} {...api.getRootProps()} />
    </ApiProvider>
  );
}
