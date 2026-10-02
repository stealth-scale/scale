/**
 * Renders the hooks the specifications read under a data client.
 */

import { type ReactElement, type ReactNode } from "react";

import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, type RenderHookResult } from "@testing-library/react";

import { DataProvider } from "#provider.tsx";

/**
 * Describes a promise that a case settles itself.
 */
export interface Deferred<Value> {
  /**
   * The promise.
   */
  readonly promise: Promise<Value>;

  /**
   * Resolves the promise with a value.
   */
  readonly release: (value: Value) => void;
}

/**
 * Builds a wrapper that renders a tree under the data provider.
 *
 * @param client - The client the provider renders.
 * @returns The wrapper.
 */
export function providing(
  client: QueryClient,
): (props: { readonly children?: ReactNode }) => ReactElement {
  return function Provided({ children }: { readonly children?: ReactNode }): ReactElement {
    return <DataProvider client={client}>{children}</DataProvider>;
  };
}

/**
 * Renders a hook under a client.
 *
 * @param hook - The hook, called on every render.
 * @param client - The client the hook reads.
 * @returns What the testing library returns for the hook.
 */
export function hookOf<Result>(
  hook: () => Result,
  client: QueryClient,
): RenderHookResult<Result, unknown> {
  return renderHook(hook, {
    wrapper: ({ children }: { readonly children?: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}

/**
 * Returns a promise with the function that resolves it, for a transport a case releases.
 *
 * @returns The promise and its resolver.
 */
export function deferred<Value>(): Deferred<Value> {
  const resolvers: Array<(value: Value) => void> = [];
  const promise = new Promise<Value>((resolve) => {
    resolvers.push(resolve);
  });

  return {
    promise,
    release: (value) => {
      for (const resolve of resolvers) resolve(value);
    },
  };
}
