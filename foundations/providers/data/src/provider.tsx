/**
 * Renders the data client for a tree, and runs its changes stream while mounted.
 */

import { type ReactElement, type ReactNode, useEffect } from "react";

import { noop, type QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { settingsOf } from "#client.ts";
import { streamChanges } from "#stream.ts";

/**
 * Lists what `DataProvider` renders.
 */
export interface DataProviderProps {
  /**
   * The tree that reads the client.
   */
  readonly children?: ReactNode;

  /**
   * The client `createDataClient` created.
   */
  readonly client: QueryClient;
}

/**
 * Renders the data client for its children, and runs the changes stream while it is mounted.
 *
 * @remarks
 *   The stream runs in an effect, so it runs in the browser alone. The library's provider resumes
 *   the paused mutations when the page is online or focused again.
 * @throws {@link Error} When another function than `createDataClient` created the client.
 */
export function DataProvider({ children, client }: DataProviderProps): ReactElement {
  const settings = settingsOf(client);

  useEffect(() => {
    const controller = new AbortController();

    streamChanges(client, settings, controller.signal).catch(noop);

    return (): void => {
      controller.abort();
    };
  }, [client, settings]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
