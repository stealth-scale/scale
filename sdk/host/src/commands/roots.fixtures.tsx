import { type ReactNode } from "react";

import { Outlet } from "@stealthscale/provider-router";

import { CommandKeys } from "#commands/keys.ts";
import { CommandPalette } from "#commands/palette.tsx";

export function KeysRoot(): ReactNode {
  return (
    <>
      <CommandKeys />
      <Outlet />
    </>
  );
}

export function PaletteRoot(): ReactNode {
  return (
    <>
      <CommandPalette />
      <Outlet />
    </>
  );
}
