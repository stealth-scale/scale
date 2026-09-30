/**
 * Serves the server example's requests for a page of transfers: sorted by amount, searched by
 * reference and paged on the "server", after the delay a network adds.
 */

import { useEffect, useState } from "react";

import { type Transfer, TRANSFERS } from "./transfers.ts";

/**
 * Describes a sort: the field and the direction.
 */
export interface Sort {
  /**
   * Whether the sort is descending.
   */
  readonly desc: boolean;

  /**
   * Field the transfers are sorted by.
   */
  readonly id: string;
}

/**
 * Describes a request for a page: the page, its size, the search and the sort.
 */
export interface Request {
  /**
   * Index of the page, from zero.
   */
  readonly pageIndex: number;

  /**
   * Number of transfers on a page.
   */
  readonly pageSize: number;

  /**
   * Text the transfers' references contain, or empty for every transfer.
   */
  readonly search: string;

  /**
   * Field the transfers are sorted by and the direction, or none for the server's order.
   */
  readonly sort?: Sort | undefined;
}

/**
 * Describes a page the server returns: its transfers and the number of transfers that match.
 */
export interface Page {
  /**
   * Number of transfers that match the search on every page.
   */
  readonly count: number;

  /**
   * Transfers on the page.
   */
  readonly rows: readonly Transfer[];
}

/**
 * Describes what the example renders: the last page that arrived and whether a newer request
 * waits.
 */
export interface PageState {
  /**
   * Whether the latest request's page has not arrived yet.
   */
  readonly loading: boolean;

  /**
   * The last page that arrived, empty before the first one.
   */
  readonly page: Page;
}

/**
 * Describes a page that arrived and the key of its request.
 */
interface Arrival {
  /**
   * Key of the request the page is for.
   */
  readonly key: string;

  /**
   * The page that arrived.
   */
  readonly page: Page;
}

/**
 * Delay of every page, in milliseconds.
 */
export const DELAY = 400;

/**
 * Arrival before the first page, for no request.
 */
const NONE: Arrival = { key: "", page: { count: 0, rows: [] } };

/**
 * Returns the page of transfers a request asks for.
 *
 * @param request - The page, its size, the search and the sort.
 * @returns The transfers on the page and the number that match.
 */
export function pageOf({ pageIndex, pageSize, search, sort }: Request): Page {
  const found = TRANSFERS.filter((transfer) =>
    transfer.reference.toLowerCase().includes(search.toLowerCase()),
  );
  const sorted =
    sort?.id === "amount"
      ? found.toSorted((a, b) => (sort.desc ? b.amount - a.amount : a.amount - b.amount))
      : found;

  return {
    count: found.length,
    rows: sorted.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
  };
}

/**
 * Resolves a request with its page after the delay.
 *
 * @param request - The page, its size, the search and the sort.
 * @returns The page, once the delay has passed.
 */
export function fetchPage(request: Request): Promise<Page> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(pageOf(request));
    }, DELAY);
  });
}

/**
 * Requests a page whenever the request changes, and returns the last page that arrived.
 *
 * @remarks
 *   A page that arrives for a request a newer one replaced is dropped.
 * @param request - The page, its size, the search and the sort.
 * @returns The last page that arrived and whether a newer request waits.
 */
export function useServerPage(request: Request): PageState {
  const { pageIndex, pageSize, search, sort } = request;
  const id = sort?.id;
  const desc = sort?.desc === true;
  const key = JSON.stringify([pageIndex, pageSize, search, id, desc]);
  const [arrived, setArrived] = useState(NONE);

  useEffect((): (() => void) => {
    let current = true;
    const sorted = id === undefined ? undefined : { desc, id };

    /**
     * Requests the page and keeps it while no newer request replaced this one.
     */
    async function load(): Promise<void> {
      const page = await fetchPage({ pageIndex, pageSize, search, sort: sorted });

      if (current) setArrived({ key, page });
    }

    void load();

    return (): void => {
      current = false;
    };
  }, [desc, id, key, pageIndex, pageSize, search]);

  return { loading: arrived.key !== key, page: arrived.page };
}
