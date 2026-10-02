/**
 * Exports the React hooks and helpers the component packages share: media and pointer queries,
 * overflow and sticky-offset measurement, controlled state, live-region announcements, the
 * presence of an element that animates out, the runs of a text that match a search, a sideways
 * scroll that reveals an element without moving the page, and the context and props utilities for
 * components with parts. The package peers on React, runs
 * `@zag-js/presence` for the presence hook and `@zag-js/highlight-word` for the highlight.
 *
 * @packageDocumentation
 */

export { createLabelling, type Labelling } from "#create-labelling.ts";
export { createRequiredContext, type ProvidedProps } from "#create-required-context.ts";
export { type OmitUndefined, omitUndefined } from "#omit-undefined.ts";
export { revealSideways } from "#reveal-sideways.ts";
export { splitEnumerable, type Splitter } from "#split-enumerable.ts";
export { type AnnouncePoliteness, speakable, useAnnounce } from "#use-announce.ts";
export { useCallbackRef } from "#use-callback-ref.ts";
export { useCoarsePointer } from "#use-coarse-pointer.ts";
export { useConst } from "#use-const.ts";
export { useControllableState, type UseControllableStateProps } from "#use-controllable-state.ts";
export { useCrowded } from "#use-crowded.ts";
export {
  createFilterScope,
  FilterContext,
  type FilteredRow,
  type FilterScope,
  useFilterActive,
  useFilteredRow,
  useFilterEmpty,
  useFilterScope,
} from "#use-filter-scope.ts";
export { type HighlightChunk, useHighlight, type UseHighlightOptions } from "#use-highlight.ts";
export { type Overflow, useIsOverflowing } from "#use-is-overflowing.ts";
export { useLiveRef } from "#use-live-ref.ts";
export { type MatrixCrosshair, useMatrixCrosshair } from "#use-matrix-crosshair.ts";
export { useMediaQuery, type UseMediaQueryOptions } from "#use-media-query.ts";
export {
  type Presence,
  type PresenceOptions,
  type PresenceProps,
  usePresence,
} from "#use-presence.ts";
export { useSafeLayoutEffect } from "#use-safe-layout-effect.ts";
export { useStickyOffsets, type UseStickyOffsetsOptions } from "#use-sticky-offsets.ts";
