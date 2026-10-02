---
"@stealthscale/sdk-host": minor
---

- Add the package.
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
