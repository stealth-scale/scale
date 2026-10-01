/**
 * Re-exports the names of TanStack Query that a component reads and changes data with.
 *
 * @remarks
 *   A written list, so the package publishes the hooks and the helpers that work over the
 *   foundation's options, and leaves the library's cache internals to the library. The library is
 *   a peer, so one copy of its context serves the page.
 */

export {
  infiniteQueryOptions,
  keepPreviousData,
  onlineManager,
  type QueryClient,
  queryOptions,
  skipToken,
  useInfiniteQuery,
  useIsFetching,
  useIsMutating,
  useMutation,
  useMutationState,
  useQueries,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
