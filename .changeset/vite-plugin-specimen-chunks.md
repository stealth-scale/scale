---
"@stealthscale/vite-plugin-specimen": minor
---

Write every page and what it reaches beyond the entry into one `pages` chunk, and every page's props
into one `props` chunk, rather than a chunk per page and one per page's props. A chunk per page put
a module several pages share in the first page's chunk, which every other page's chunk then
imported, and most page chunks were under two kilobytes gzipped.
