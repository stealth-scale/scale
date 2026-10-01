import { type ReactNode } from "react";

import { usePlugin } from "#scope/context.ts";

export interface Item {
  readonly stock: number;
  readonly title: string;
  readonly type: string;
}

interface Wrapping {
  readonly children?: ReactNode;
  readonly targetId: string;
}

export function Lead(): ReactNode {
  return <span>lead</span>;
}

export function Tail({
  label,
  targetId,
}: {
  readonly label: string;
  readonly targetId: string;
}): ReactNode {
  return <span>{`tail ${label} ${targetId}`}</span>;
}

export function Chip({ targetId }: { readonly targetId: string }): ReactNode {
  return <span>{`chip ${targetId}`}</span>;
}

export function Mark({ targetId }: { readonly targetId: string }): ReactNode {
  return <span>{`mark ${targetId}`}</span>;
}

export function Cover({ targetId }: { readonly targetId: string }): ReactNode {
  return <span>{`cover ${targetId}`}</span>;
}

export function Hint(): ReactNode {
  return <span>hint</span>;
}

export function Ring({ children, targetId }: Wrapping): ReactNode {
  return <section aria-label={`ring ${targetId}`}>{children}</section>;
}

export function Border({ children }: Wrapping): ReactNode {
  return <section aria-label="border">{children}</section>;
}

export function Broken(): ReactNode {
  throw new Error("broken");
}

export function Mended(): ReactNode {
  return <span>mended</span>;
}

export function Flaky({ fail }: { readonly fail: boolean }): ReactNode {
  if (fail) throw new Error("flaky");

  return <span>steady</span>;
}

export function Book({ record }: { readonly record: Item }): ReactNode {
  return <span>{`book ${record.title}`}</span>;
}

export function Restock(): ReactNode {
  return <span>restock</span>;
}

export function First(): ReactNode {
  return <span>{`first ${usePlugin().pluginId}`}</span>;
}

export function Second(): ReactNode {
  return <span>second</span>;
}

export function Halo({ children, targetId }: Wrapping): ReactNode {
  return <section aria-label={`halo ${targetId}`}>{children}</section>;
}

export function Glow({ children, targetId }: Wrapping): ReactNode {
  return <section aria-label={`glow ${targetId}`}>{children}</section>;
}

export function Edge({ children, targetId }: Wrapping): ReactNode {
  return <section aria-label={`edge ${targetId}`}>{children}</section>;
}

export function Outline({ children, targetId }: Wrapping): ReactNode {
  return <section aria-label={`outline ${targetId}`}>{children}</section>;
}
