---
"@stealthscale/provider-router": minor
---

Add `basepathOf`, which derives the path a router mounts under from the base the bundler was given:
a path-only base gives its path without the trailing slash, and a base naming another host gives the
root unless the documents' path is named.
