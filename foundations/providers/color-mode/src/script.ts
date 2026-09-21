/**
 * Builds the inline script that sets the color mode attribute before the first paint.
 */

import { settingKey } from "@stealthscale/settings";
import { COLOR_MODE_ATTRIBUTE } from "@stealthscale/theme";

import { COLOR_MODE_SETTING } from "#setting.ts";

/**
 * Quotes a string as a JavaScript literal with every `<` escaped.
 *
 * @remarks
 *   The script is inlined as the body of a `script` element, and an HTML parser ends that element
 *   at the first `</script` it meets, string literal or not. Writing `<` as its JavaScript escape
 *   leaves the parser nothing to match, and the engine reads the value back unchanged.
 * @param value - The string to quote.
 * @returns The quoted literal.
 */
function scripted(value: string): string {
  return JSON.stringify(value).replaceAll("<", String.raw`\u003c`);
}

/**
 * Returns the script an application inlines in its document head.
 *
 * @remarks
 *   The provider reads the same setting and writes the same attribute, but one paint too late for
 *   anyone whose stored choice disagrees with their machine. Every other case is covered by the
 *   stylesheet, which follows the machine for a document with no attribute set. A page under a
 *   content security policy that forbids inline script has to allow this one by nonce or hash.
 * @param app - Application name, which has to match the one the provider is given.
 * @returns The script text, without the `script` tags around it.
 */
export function colorModeScript(app: string): string {
  const key = settingKey(app, COLOR_MODE_SETTING);

  return [
    "(function(){try{",
    `var c=localStorage.getItem(${scripted(key)});`,
    `if(c==="dark"||c==="light"){`,
    `document.documentElement.setAttribute(${scripted(COLOR_MODE_ATTRIBUTE)},c)}`,
    "}catch(e){}})()",
  ].join("");
}
