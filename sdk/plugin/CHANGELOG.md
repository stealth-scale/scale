# @stealthscale/sdk-plugin

## 0.2.0

### Minor Changes

- [#44](https://github.com/stealth-scale/scale/pull/44) [`841534c`](https://github.com/stealth-scale/scale/commit/841534c29a34be92766169d0742e6e6412d8890d) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add the package.
  - Add `HostContext`, `HostRuntime`, `HostStores` and the `HostReport` entries.
  - Add `PluginProvider`, `usePlugin`, `useConfig`, `useResolvedProduct`, `useToaster` and
    `useHostActions`.
  - Add `useSession`, `usePermission`, `useEntitlement`, `useAccess`, `useAccessActions`,
    `decisionKey` and `decisionOf`.
  - Add `useFeatureFlag`, `useFlagActions` and `useFlagStatuses`.
  - Add `useWhen` and `conditionContextOf`.
  - Add `useCommand`, `useCommands` and `isCommandEnabled`.
  - Add `useEvent` and `useEmit`.
  - Add `useNavigation` and `useDocumentTitle`.
  - Add `Slot`, `Into`, `useSlot` and `useExtensionStatuses`.
  - Add `RouteDecorations`, which records a page's decorations in the `mounted` store under
    `route:<id>`.
  - Add `Boundary` and `lazyOf`.
  - Add `section:<id>` to `RenderTarget`.
  - Read the host as always on in conditions and menus, and list its settings pages in the settings
    menu.
  - Add `useSettings` and `usePlacements`.
  - Add `useData`, `useChange` and `changesOf`.
  - Add `usePluginStatuses` and `useHostReports`.

### Patch Changes

- Updated dependencies [[`c2b043d`](https://github.com/stealth-scale/scale/commit/c2b043d8920079147cff49708eded5d946972096), [`9d2dd1b`](https://github.com/stealth-scale/scale/commit/9d2dd1b6a573174fca3711d63465dbdd0605fc0f), [`9c2af0c`](https://github.com/stealth-scale/scale/commit/9c2af0cbd07058744c266740ee1188f46eaa6a3f), [`345722c`](https://github.com/stealth-scale/scale/commit/345722c508064b16202cb9363668b44352f7a706), [`61bde17`](https://github.com/stealth-scale/scale/commit/61bde17f9d1b3605d50885cf30b1ca0cde267406)]:
  - @stealthscale/provider-data@0.2.0
  - @stealthscale/provider-hotkeys@0.2.0
  - @stealthscale/provider-router@0.2.0
  - @stealthscale/sdk-core@0.2.0
  - @stealthscale/provider-i18n@0.1.0
  - @stealthscale/settings@0.1.0
