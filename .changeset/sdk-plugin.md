---
"@stealthscale/sdk-plugin": minor
---

- Add the package.
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
