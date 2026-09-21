---
"@stealthscale/provider-color-mode": minor
---

Write every `<` in the inlined script as its JavaScript escape, so an HTML parser ends the script
element where the application closes it whatever the application is called. Publish
`colorModeScript` under the `./script` subpath as well, for a server that writes the document
without React.
