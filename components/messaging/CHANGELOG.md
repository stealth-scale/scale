# @stealthscale/component-messaging

## 0.2.0

### Minor Changes

- [#44](https://github.com/stealth-scale/scale/pull/44) [`fc17826`](https://github.com/stealth-scale/scale/commit/fc17826f4164b86d25fe05cbca6f138d754e47f8) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add the package.
  - Add `Message`: `Root`, `Avatar`, `Content`, `Header`, `Bubble`, `Footer`, `Status`, `Actions`.
  - `Message` axes: `align`, `look`, `palette`, `size`, `reveal`.
  - Add `Conversation`: `Root`, `Content`, `JumpTrigger`, `Typing` and `useConversation` over
    `use-stick-to-bottom`.
  - Add `groupTurns`.
  - Add `Reactions`: `Root`, `Item`, `Picker`, `Choice`.
  - Add `Attachment`: `Root`, `Group`, `Media`, `Content`, `Title`, `Description`, `Actions`.
  - Add `Composer`: `Root`, `Input`, `Submit`, `AttachTrigger`, `Context`, `Attachments`, `Toolbar`,
    with mentions.

### Patch Changes

- Updated dependencies [[`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf), [`c8b2f1e`](https://github.com/stealth-scale/scale/commit/c8b2f1ea3cd9f92a5e80a0c275c69d5f4d5da8fd), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/component-disclosure@0.2.0
  - @stealthscale/component-actions@0.2.0
  - @stealthscale/component-primitives@0.2.0
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0
