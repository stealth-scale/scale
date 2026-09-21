/**
 * A workspace to find catalogues in.
 *
 * @remarks
 *   An application depending on two packages of the house, one of which depends on a third, and on
 *   a package outside the house whose catalogue must not be found. The application overrides one
 *   word of the overlays, translates one, and has words of its own, and its manifest is private, as
 *   an application's is. Every package is installed under the application's `node_modules`, the
 *   way a consumer has them, so the search resolves them as an import would.
 */

import { manifest, packageFiles, type ScratchFiles } from "@stealthscale/testing";

/**
 * Where the application lives inside the scratch workspace.
 */
export const APP = "apps/site";

/**
 * The files the scratch workspace is built from.
 */
export const WORKSPACE: ScratchFiles = {
  ...packageFiles(APP, {
    dependencies: {
      "@house/controls": "1",
      "@house/hooks": "1",
      "@house/overlays": "1",
      outsider: "1",
    },
    name: "@house/site",
    private: true,
  }),
  [`${APP}/locales/en/overlays.json`]: JSON.stringify({ commands: "Actions" }),
  [`${APP}/locales/en/site.json`]: JSON.stringify({ welcome: "Welcome to {{name}}" }),
  [`${APP}/locales/en/site/legal.yaml`]: "terms: Terms of use\n",
  [`${APP}/locales/nl/overlays.json`]: JSON.stringify({ menu: "Menu" }),
  [`${APP}/locales/nl/site.json`]: JSON.stringify({ welcome: "Welkom bij {{name}}" }),
  [`${APP}/node_modules/@house/controls/locales/en/controls.demo.json`]: JSON.stringify({
    press: "Press me",
  }),
  [`${APP}/node_modules/@house/controls/locales/en/controls.json`]: JSON.stringify({
    pages_one: "{{count}} page",
    pages_other: "{{count}} pages",
  }),
  [`${APP}/node_modules/@house/controls/package.json`]: manifest({
    dependencies: { "@house/hooks": "1" },
    name: "@house/controls",
  }),
  [`${APP}/node_modules/@house/hooks/locales/en/hooks.json`]: JSON.stringify({ wait: "Wait" }),
  [`${APP}/node_modules/@house/hooks/package.json`]: manifest({
    devDependencies: { "@house/never": "1" },
    name: "@house/hooks",
  }),
  [`${APP}/node_modules/@house/never/locales/en/never.json`]: JSON.stringify({ no: "No" }),
  [`${APP}/node_modules/@house/never/package.json`]: manifest({ name: "@house/never" }),
  [`${APP}/node_modules/@house/overlays/locales/en/overlays.json`]: JSON.stringify({
    commands: "Commands",
    menu: "Menu",
    nested: { close: "Close {{what}}" },
  }),
  [`${APP}/node_modules/@house/overlays/locales/nl/overlays.json`]: JSON.stringify({
    commands: "Opdrachten",
    nested: { close: "Sluit {{what}}" },
  }),
  [`${APP}/node_modules/@house/overlays/package.json`]: manifest({ name: "@house/overlays" }),
  [`${APP}/node_modules/outsider/locales/en/outsider.json`]: JSON.stringify({ out: "Out" }),
  [`${APP}/node_modules/outsider/package.json`]: manifest({ name: "outsider" }),
};
