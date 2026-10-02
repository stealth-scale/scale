import { type Mock, vi } from "vitest";

import { type QueryClient } from "@stealthscale/provider-data";
import { createTestDataClient } from "@stealthscale/provider-data/testing";
import { type Session } from "@stealthscale/sdk-core";
import { type EventBus, type HostReport } from "@stealthscale/sdk-plugin";

import { busOf } from "#host/host.fixtures.ts";
import { PRODUCT } from "#host/product.fixtures.ts";
import { followSession, type Sequence } from "#host/sequence.ts";
import { sampledFrom } from "#host/transport.ts";
import { ADA, type Switchable, switchable } from "#stores/session.fixtures.ts";
import { createSessionStore } from "#stores/session.ts";

export interface Following {
  readonly bus: EventBus;
  readonly clear: Mock<() => void>;
  readonly data: QueryClient;
  readonly identify: Mock<(session: Session) => Promise<void>>;
  readonly sequence: Sequence;
  readonly source: Switchable;
}

export function following(): Following {
  const source = switchable(ADA);
  const session = createSessionStore({
    product: PRODUCT,
    report: vi.fn<(entry: HostReport) => void>(),
    source,
  });
  const bus = busOf();
  const data = createTestDataClient(sampledFrom(PRODUCT));
  const clear = vi.fn<() => void>();
  const identify = vi.fn<(session: Session) => Promise<void>>(() => Promise.resolve());
  const sequence = followSession({
    access: { clear },
    data,
    events: bus,
    flags: { identify },
    session,
  });

  return { bus, clear, data, identify, sequence, source };
}
