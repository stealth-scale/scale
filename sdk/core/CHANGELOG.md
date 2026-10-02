# @stealthscale/sdk-core

## 0.2.0

### Minor Changes

- [#44](https://github.com/stealth-scale/scale/pull/44) [`61bde17`](https://github.com/stealth-scale/scale/commit/61bde17f9d1b3605d50885cf30b1ca0cde267406) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add the package.
  - Add `isPluginId`, `isName` and `HOST`, the plugin id of the host's own contract.
  - Add `needs`, `compatible`, `below`, `isVersion` and `isCaretRange`.
  - Add `Session`, `NOBODY`, `subjectOf` and `constantSession`.
  - Add `flag`, `setFlag`, `FlagReference` and `FlagSource`.
  - Add `When`, `evaluateWhen`, `flagIs` and `conditionContext`.
  - Add `permission`, `resource`, `role`, `entitlement`, `AccessSource` and `KnownDecision`.
  - Add `defineQuery`, `defineMutation`, `defineSubscription`, `query` and `mutation`.
  - Add `route`, `params`, `slot`, `extension` and `props`.
  - Type a keyed slot's references by `slot()`'s overloads, so `Slot` requires `match` on it.
  - Add `command`, `args`, `returns` and `event`.
  - Add `settingsPage`, `settingsSection` and `ValuesOf`.
  - Add `defineConfigSchema` and `ConfigOf`.
  - Add `defineContract`, `qualify` and `pluginOf`.
  - Add `hostContract`, with the host's regions, slots, menus, settings pages and events.
  - Add `Change` and `ChangeBatch`.
  - Add `definePlugin`, `PluginDeclaration` and `API_RANGE`.
  - Add `HostApi` and `Toaster` for a command's function.
  - Add `defineProduct`, `installed`, `FilledSlot` and `SlotPlacement`.
  - Add `resolveProduct`, `ResolveOptions`, `ResolvedProduct`, `Problem` and `lineOf`.
  - Refuse a ring of plugin conditions and requirements.
  - Resolve a route per settings page, `host/settings/<page id>`, in the settings menu.
  - Add `AccessCatalogue`, `FlagCatalogue` and `OperationCatalogue`.
  - Refuse a plugin id that any package but its contract package publishes as a namespace.
  - Add `deprecated` to `ResolvedName` and `ResolvedFlag`.
