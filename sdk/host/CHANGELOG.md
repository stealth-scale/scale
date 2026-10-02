# @stealthscale/sdk-host

## 0.2.0

### Minor Changes

- [#44](https://github.com/stealth-scale/scale/pull/44) [`c5a1a71`](https://github.com/stealth-scale/scale/commit/c5a1a711924e51e88c48e7cc2e099abf3ccb038b) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add the package.
  - Add `createHost`, `HostOptions` and `Host`.
  - Add `createHostRoutes`, `HostRouterContext`, `HostCondition` and `NotFoundData`.
  - Add `HostProvider`, `HostRoot`, `HostContent` and `HostNotFound`.
  - Add the command palette, the toast region and the keys of the product's commands.
  - Add the settings route, a route per settings page, schema and component sections, and the Plugins
    page.
  - Reload a page once per build version after a plugin's module fails to import.
  - Measure each plugin's first import as `stealth:load:<plugin id>`.
  - Add `setupHostIntegration`, so a browser's first render matches a server render's flags and
    decisions.
  - Add `openFeatureFlags` in `./openfeature`.
  - Add `standaloneProduct`, `standaloneFrom` and `standaloneSources` in `./standalone`.
  - Add `renderStandalone` in `./standalone/app`, with the development panel.
  - Peer on `sdk-plugin`, the providers and component packages it renders, and
    `@tanstack/react-router-ssr-query` 1.167, and optionally on `@openfeature/web-sdk` 1.10.
  - Peer optionally on `provider-color-mode`, `provider-locale` and `provider-shell`, which
    `./standalone/app` imports.

### Patch Changes

- Updated dependencies [[`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf), [`c8b2f1e`](https://github.com/stealth-scale/scale/commit/c8b2f1ea3cd9f92a5e80a0c275c69d5f4d5da8fd), [`85466a2`](https://github.com/stealth-scale/scale/commit/85466a26f86bfb00efc2695d7b57aaedb8c87b08), [`b4823f8`](https://github.com/stealth-scale/scale/commit/b4823f832c93d3a70fe2935c9026cea7c36746bc), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`d577ce3`](https://github.com/stealth-scale/scale/commit/d577ce3a013b0af1f6cd2dce358f496382a58616), [`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`dece6ae`](https://github.com/stealth-scale/scale/commit/dece6ae8193e5204079c50c5a9311360243d3557), [`c2b043d`](https://github.com/stealth-scale/scale/commit/c2b043d8920079147cff49708eded5d946972096), [`02dda13`](https://github.com/stealth-scale/scale/commit/02dda131a19849e9d7ea4018c1c973525ce47014), [`9d2dd1b`](https://github.com/stealth-scale/scale/commit/9d2dd1b6a573174fca3711d63465dbdd0605fc0f), [`9c2af0c`](https://github.com/stealth-scale/scale/commit/9c2af0cbd07058744c266740ee1188f46eaa6a3f), [`345722c`](https://github.com/stealth-scale/scale/commit/345722c508064b16202cb9363668b44352f7a706), [`3385a3c`](https://github.com/stealth-scale/scale/commit/3385a3c8d3d1f1c19affe900b6e046ca22c1619f), [`61bde17`](https://github.com/stealth-scale/scale/commit/61bde17f9d1b3605d50885cf30b1ca0cde267406), [`841534c`](https://github.com/stealth-scale/scale/commit/841534c29a34be92766169d0742e6e6412d8890d), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf)]:
  - @stealthscale/component-feedback@0.2.0
  - @stealthscale/component-forms@0.2.0
  - @stealthscale/component-modals@0.1.0
  - @stealthscale/component-navigation@0.2.0
  - @stealthscale/component-screen@0.1.0
  - @stealthscale/component-actions@0.2.0
  - @stealthscale/component-layout@0.2.0
  - @stealthscale/component-typography@0.2.0
  - @stealthscale/hooks@0.2.0
  - @stealthscale/provider-color-mode@0.2.0
  - @stealthscale/provider-data@0.2.0
  - @stealthscale/provider-form@0.2.0
  - @stealthscale/provider-hotkeys@0.2.0
  - @stealthscale/provider-router@0.2.0
  - @stealthscale/provider-shell@0.2.0
  - @stealthscale/sdk-core@0.2.0
  - @stealthscale/sdk-plugin@0.2.0
  - @stealthscale/provider-i18n@0.1.0
  - @stealthscale/provider-locale@0.1.0
  - @stealthscale/settings@0.1.0
