import { type SettingsSectionProps, type TargetedProps } from "#code.ts";
import { type Approval, type SidebarProps } from "#define.fixtures.ts";

export function lazy<Module>(module: Module): () => Promise<Module> {
  return () => Promise.resolve(module);
}

export function overview(): null {
  return null;
}

export function balance(props: SidebarProps & TargetedProps): string {
  return `${props.targetId}:${props.requestId}`;
}

export function reminders(props: SettingsSectionProps): string {
  return props.sectionId;
}

export function approve(_args: Approval): void {}

export function request(): void {}

export function delegated(
  _args: Approval,
  needs: { readonly request: () => Promise<void> },
): Promise<void> {
  return needs.request();
}

export function requested(props: { readonly requestId: string }): string {
  return props.requestId;
}

export function invoiced(props: { readonly invoiceId: string }): string {
  return props.invoiceId;
}

export function counted(_args: { readonly count: number }): void {}

export const DECLARATION = {
  commands: { approve: { run: lazy({ approve }) }, request: { run: lazy({ request }) } },
  extensions: { balance: { component: lazy({ balance }) } },
  routes: {
    overview: lazy({ overview }),
    request: { component: lazy({ overview }), fallback: lazy({ overview }) },
  },
  settings: { reminders: { component: lazy({ reminders }) } },
};
