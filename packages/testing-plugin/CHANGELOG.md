# @stealthscale/testing-plugin

## 0.2.0

### Minor Changes

- [#44](https://github.com/stealth-scale/scale/pull/44) [`8749cdc`](https://github.com/stealth-scale/scale/commit/8749cdcdc5aa6755e8de44c87aa3eb3b33312a18) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add the package.
  - Add `renderPlugin` and `renderPluginHook`, which render under a real host and a memory router.
  - Add `checks`, which derives the cases every plugin runs from its contract and its manifest.
  - Add `productChecks`, which derives the cases of a product from its definition and its frame.
  - Peer on `sdk-host`, `sdk-plugin`, `provider-data`, `provider-form`, `provider-router`, `settings`,
    `testing-react`, `@testing-library/react`, `react`, `react-i18next` and `vitest`.

### Patch Changes

- Updated dependencies [[`c2b043d`](https://github.com/stealth-scale/scale/commit/c2b043d8920079147cff49708eded5d946972096), [`02dda13`](https://github.com/stealth-scale/scale/commit/02dda131a19849e9d7ea4018c1c973525ce47014), [`9c2af0c`](https://github.com/stealth-scale/scale/commit/9c2af0cbd07058744c266740ee1188f46eaa6a3f), [`345722c`](https://github.com/stealth-scale/scale/commit/345722c508064b16202cb9363668b44352f7a706), [`61bde17`](https://github.com/stealth-scale/scale/commit/61bde17f9d1b3605d50885cf30b1ca0cde267406), [`c5a1a71`](https://github.com/stealth-scale/scale/commit/c5a1a711924e51e88c48e7cc2e099abf3ccb038b), [`841534c`](https://github.com/stealth-scale/scale/commit/841534c29a34be92766169d0742e6e6412d8890d), [`4a42977`](https://github.com/stealth-scale/scale/commit/4a42977d47a88b2053038c54e515cfa8488c406e)]:
  - @stealthscale/provider-data@0.2.0
  - @stealthscale/provider-form@0.2.0
  - @stealthscale/provider-router@0.2.0
  - @stealthscale/sdk-core@0.2.0
  - @stealthscale/sdk-host@0.2.0
  - @stealthscale/sdk-plugin@0.2.0
  - @stealthscale/testing-react@0.9.0
  - @stealthscale/settings@0.1.0
