/**
 * Renders the splitter's root and provides the api `useSplitter` returns to the parts.
 *
 * @remarks
 *   The machine writes the root's layout inline: a flex row or column at 100% of its container,
 *   which runs past the end of a flex column with a toolbar above it. The root drops that style,
 *   and the recipe lays the root out from `data-orientation` instead: it grows in a flex container
 *   and fills any other. A splitter in a container without a height is as tall as its panels'
 *   content. The root passes `palette` to every part.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withProvider } from "#splitter/context.ts";
import { ApiProvider, type SplitterApi } from "#splitter/machine.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the api, the recipe's variants and the props of a `div`.
 */
export interface RootProps extends ComponentProps<typeof Framed> {
  /**
   * Api `useSplitter` returns, which every part reads.
   */
  readonly splitter: SplitterApi;
}

/**
 * Renders the root with the machine's root props but its inline layout, and provides the api to
 * the parts.
 *
 * @param props - The api, the recipe's variants and the props of a `div`.
 * @returns The `div` element inside the api provider.
 */
export function Root({ splitter, ...props }: RootProps): ReactElement {
  const { style: _layout, ...machine } = splitter.getRootProps();

  return (
    <ApiProvider value={splitter}>
      <Framed {...mergeProps(machine, props)} />
    </ApiProvider>
  );
}
