---
"@stealthscale/vite-plugin-sbom": patch
---

Match each reached package to the lockfile by its name and the version its manifest states, so two
installed versions of one name each carry their own digest and source. Write a source URL without
the credential in front of its host and without its query, keeping the fragment that names a commit.
