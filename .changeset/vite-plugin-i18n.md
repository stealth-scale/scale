---
"@stealthscale/vite-plugin-i18n": minor
---

- Watch every catalogue file and a stamp for added or removed languages and namespaces.
- Write the types again on an edit.
- Reload the catalogues module when the languages or namespaces change.
- Emit an empty loader table as an object.
- Peer on `vite` 8.3.
- Send a changed catalogue to the page under a server that bundles.
- Reload the page under a server that bundles when the languages or namespaces change.
- Rewrite the stamp when a catalogue file appears or disappears.
- Watch each package's `locales` directory, so a dev server finds a new language.
