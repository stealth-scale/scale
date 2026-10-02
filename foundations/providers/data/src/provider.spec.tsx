import { useQueryClient } from "@tanstack/react-query";
import { render, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { providing } from "#client.fixtures.tsx";
import { createDataClient } from "#client.ts";
import { CHANGES } from "#operation.fixtures.ts";
import { DataProvider } from "#provider.tsx";
import { scripted } from "#stream.fixtures.ts";

describe("DataProvider", () => {
  it("renders the client for its children", () => {
    const client = createDataClient({ transport: scripted() });
    const { result } = renderHook(() => useQueryClient(), { wrapper: providing(client) });

    expect(result.current).toBe(client);
  });

  it("runs the changes stream while it is mounted", () => {
    const transport = scripted();

    render(<DataProvider client={createDataClient({ changes: CHANGES, transport })} />);

    expect(transport.subscribe).toHaveBeenCalledTimes(1);
  });

  it("stops the changes stream when it unmounts", () => {
    const transport = scripted();
    const { unmount } = render(
      <DataProvider client={createDataClient({ changes: CHANGES, transport })} />,
    );

    unmount();

    expect(transport.subscribe.mock.lastCall?.[3].aborted).toBe(true);
  });

  it("runs no stream for a client without a changes subscription", () => {
    const transport = scripted();

    render(<DataProvider client={createDataClient({ transport })} />);

    expect(transport.subscribe).not.toHaveBeenCalled();
  });
});
