import { type ReactNode } from "react";

import { type Mock } from "vitest";

import { type QueryClient, useQueryClient } from "@stealthscale/provider-data";
import { useDocumentTitle } from "@stealthscale/sdk-plugin";

import { HostContent } from "#parts/content.tsx";
import { HostRoot } from "#parts/root.tsx";

export interface ClientProbeProps {
  readonly seen: Mock<(client: QueryClient) => void>;
}

export function ClientProbe({ seen }: ClientProbeProps): ReactNode {
  seen(useQueryClient());

  return <p>probe</p>;
}

export function Frame(): ReactNode {
  return (
    <HostRoot>
      <main>
        <HostContent />
      </main>
    </HostRoot>
  );
}

export function Crash(): ReactNode {
  throw new Error("crashed");
}

export function BrokenFrame(): ReactNode {
  return (
    <HostRoot>
      <Crash />
    </HostRoot>
  );
}

export function Banner(): ReactNode {
  return <p>banner</p>;
}

export function Dialogs(): ReactNode {
  return <p>dialogs</p>;
}

export function Notice(): ReactNode {
  return <p>notice</p>;
}

export function Socket(): ReactNode {
  return <p>socket</p>;
}

export function Titled(): ReactNode {
  useDocumentTitle("Invoices");

  return <p>titled</p>;
}
