/**
 * Renders an extension placed in a slot as a target of its own: with the extensions attached to
 * it, and inside the wrappers of every extension.
 */

import { type ReactNode } from "react";

import { type ResolvedExtension } from "@stealthscale/sdk-core";

import { Hosted } from "#slots/hosted.tsx";
import { positionsOf } from "#slots/positions.ts";

/**
 * Describes the props of `Decorated`.
 */
export interface DecoratedProps {
  /**
   * The content a wrapping extension renders around.
   */
  readonly children?: ReactNode;

  /**
   * The decorators the slot renders, of every extension in it.
   */
  readonly decorators: readonly ResolvedExtension[];

  /**
   * The extension.
   */
  readonly extension: ResolvedExtension;

  /**
   * The wrappers of every extension the slot renders.
   */
  readonly halos: readonly ResolvedExtension[];

  /**
   * The props the extension renders with: the slot's, and `targetId`.
   */
  readonly props: Readonly<Record<string, unknown>>;
}

/**
 * Renders an extension with its decorators by position, inside the wrappers of every extension.
 *
 * @remarks
 *   A decorator renders with the extension's props and the extension's id as `targetId`, and
 *   renders without decorators of its own, so decoration ends after one level.
 */
export function Decorated({
  children,
  decorators,
  extension,
  halos,
  props,
}: DecoratedProps): ReactNode {
  const own = { ...props, targetId: extension.id };
  const { after, before, replacing, wraps } = positionsOf(
    decorators.filter((one) => one.target === `extension:${extension.id}`),
  );
  let whole: ReactNode = (
    <>
      {before.map((one) => (
        <Hosted extension={one} key={one.id} props={own} />
      ))}
      {replacing === undefined ? (
        <Hosted extension={extension} props={props}>
          {children}
        </Hosted>
      ) : (
        <Hosted extension={replacing} props={own} />
      )}
      {after.map((one) => (
        <Hosted extension={one} key={one.id} props={own} />
      ))}
    </>
  );

  for (const wrapping of [...wraps, ...halos.toReversed()]) {
    whole = (
      <Hosted extension={wrapping} key={wrapping.id} props={own}>
        {whole}
      </Hosted>
    );
  }

  return whole;
}
