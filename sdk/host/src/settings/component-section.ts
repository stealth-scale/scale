/**
 * Renders a settings section's component from its plugin's manifest, loaded on its first render.
 */

import { createElement, type ReactElement } from "react";

import { useRouteContext } from "@stealthscale/provider-router";
import {
  type LazyComponent,
  type ResolvedSettingsSection,
  type SettingsSectionProps,
} from "@stealthscale/sdk-core";
import { lazyOf } from "@stealthscale/sdk-plugin";

import { internalsOf } from "#host/internals.ts";
import { type HostRouterContext } from "#routes/context.ts";

/**
 * Describes the props of a component section: the section.
 */
export interface ComponentSectionProps {
  /**
   * The section, which states no schema.
   */
  readonly section: ResolvedSettingsSection;
}

/**
 * Renders the component the section's manifest maps it to, with `{ sectionId }` as its props.
 *
 * @returns The component, which suspends while its module loads.
 */
export function ComponentSection({ section }: ComponentSectionProps): ReactElement {
  const { host }: HostRouterContext = useRouteContext({ strict: false });
  const name = section.id.slice(section.plugin.length + 1);
  const code = internalsOf(host).runtime.product.manifests[section.plugin]?.code;
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- createHost refuses a product whose manifest maps no component to a section without a schema
  const importer = code?.settings?.[name]?.component as LazyComponent<SettingsSectionProps>;
  const props: SettingsSectionProps = { sectionId: section.id };

  return createElement(lazyOf(importer, section.id), props);
}
