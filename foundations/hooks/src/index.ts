/**
 * Publishes the React hooks a component uses to read the page it draws into: how the page is read,
 * what it measures, and what a value was on the previous render. It also publishes the context
 * factory a component drawn in parts needs. Every hook depends on React and on the document and on
 * nothing else, so a package that draws no component installs only React to use them.
 *
 * @packageDocumentation
 */

export { createRequiredContext, type ProvidedProps } from "#create-required-context.ts";
export { splitEnumerable, type Splitter } from "#split-enumerable.ts";
export { type AnnouncePoliteness, speakable, useAnnounce } from "#use-announce.ts";
export { useCallbackRef } from "#use-callback-ref.ts";
export { useCoarsePointer } from "#use-coarse-pointer.ts";
export { useConst } from "#use-const.ts";
export { useControllableState, type UseControllableStateProps } from "#use-controllable-state.ts";
export { type Overflow, useIsOverflowing } from "#use-is-overflowing.ts";
export { useLiveRef } from "#use-live-ref.ts";
export { type MatrixCrosshair, useMatrixCrosshair } from "#use-matrix-crosshair.ts";
export { useMediaQuery, type UseMediaQueryOptions } from "#use-media-query.ts";
export { useSafeLayoutEffect } from "#use-safe-layout-effect.ts";
export { useStickyOffsets, type UseStickyOffsetsOptions } from "#use-sticky-offsets.ts";
