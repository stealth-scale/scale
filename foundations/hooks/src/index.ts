/**
 * Exports the React hooks and helpers the component packages share: media and pointer queries,
 * overflow and sticky-offset measurement, controlled state, live-region announcements, and the
 * context and props utilities for components with parts. The package peers on React and depends on
 * nothing else.
 *
 * @packageDocumentation
 */

export { createRequiredContext, type ProvidedProps } from "#create-required-context.ts";
export { type OmitUndefined, omitUndefined } from "#omit-undefined.ts";
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
