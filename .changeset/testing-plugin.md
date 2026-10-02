---
"@stealthscale/testing-plugin": minor
---

- Add the package.
- Add `renderPlugin` and `renderPluginHook`, which render under a real host and a memory router.
- Add `checks`, which derives the cases every plugin runs from its contract and its manifest.
- Add `productChecks`, which derives the cases of a product from its definition and its frame.
- Peer on `sdk-host`, `sdk-plugin`, `provider-data`, `provider-form`, `provider-router`, `settings`,
  `testing-react`, `@testing-library/react`, `react`, `react-i18next` and `vitest`.
