import { renderToString } from "react-dom/server";

import { MutationObserver, onlineManager, QueryClientProvider } from "@tanstack/react-query";
import { act, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { hookOf } from "#client.fixtures.tsx";
import { Connection } from "#network.fixtures.tsx";
import { useNetwork } from "#network.ts";
import { ADA, type Person, RENAME } from "#operation.fixtures.ts";
import { createTestDataClient, sampledTransport } from "#testing.ts";

describe("useNetwork", () => {
  it("reports the page online with nothing waiting", () => {
    const client = createTestDataClient(sampledTransport({}));

    expect(hookOf(() => useNetwork(), client).result.current).toStrictEqual({
      online: true,
      paused: 0,
    });
  });

  it("reports the page offline", () => {
    const { result } = hookOf(() => useNetwork(), createTestDataClient(sampledTransport({})));

    act(() => {
      onlineManager.setOnline(false);
    });

    expect(result.current.online).toBe(false);

    act(() => {
      onlineManager.setOnline(true);
    });
  });

  it("counts a mutation paused while the page is offline", async () => {
    expect.hasAssertions();

    const transport = sampledTransport({ [RENAME.id]: { data: ADA } });
    const client = createTestDataClient(transport);
    const { result } = hookOf(() => useNetwork(), client);

    act(() => {
      onlineManager.setOnline(false);
    });

    const mutating = new MutationObserver(client, {
      mutationFn: (): Promise<Person> => transport.run(RENAME, ADA),
    }).mutate();

    await waitFor(() => {
      expect(result.current.paused).toBe(1);
    });

    act(() => {
      onlineManager.setOnline(true);
    });
    await act(async () => {
      await client.resumePausedMutations();
    });
    await waitFor(() => {
      expect(result.current.paused).toBe(0);
    });

    await expect(mutating).resolves.toStrictEqual(ADA);
  });

  it("renders the page online on a server", () => {
    const client = createTestDataClient(sampledTransport({}));

    expect(
      renderToString(
        <QueryClientProvider client={client}>
          <Connection />
        </QueryClientProvider>,
      ),
    ).toContain("online");
  });
});
