/**
 * Writes the script that settles the first paint before the page draws.
 */

import { settingKey } from "@stealthscale/settings";
import { COLOR_MODE_ATTRIBUTE } from "@stealthscale/theme";

import { COLOR_MODE_SETTING } from "#setting.ts";

/**
 * Writes a string as a JavaScript literal that an HTML parser reads as script text and nothing
 * else.
 *
 * @remarks
 *   The script is inlined as the body of a `script` element, and an HTML parser ends that element
 *   at the first `</script` it meets, inside a string literal or not. A `<` is therefore written
 *   as its JavaScript escape, which the parser passes over and the engine reads back as `<`.
 * @param value - The string to write.
 * @returns The literal, quoted.
 */
function scripted(value: string): string {
  return JSON.stringify(value).replaceAll("<", String.raw`\u003c`);
}

/**
 * Writes the script an application inlines in its document head.
 *
 * @remarks
 *   Needed only where a person chose a mode that disagrees with their machine, and only where the
 *   choice is kept in local storage. Somebody who chose nothing is drawn correctly by the
 *   stylesheet alone, which follows the machine for a page carrying no attribute. An application
 *   rendered on a server keeps the choice in a cookie and writes the attribute itself, and needs
 *   none of this.
 *   The script does before the first paint what the provider does after it: reads the choice and
 *   writes the attribute. A provider runs after the page has drawn, which is one paint too late.
 *   Inline it as the whole body of a `script` element in the head. The text carries no `<`, so
 *   the element ends where the application closes it, whatever the application is called. A
 *   page under a content security policy that forbids inline script has to allow this one by a
 *   nonce or a hash, which is the page's to state.
 * @param app - The application's name, which has to match what the provider is given.
 * @returns The script's text, without the tags around it.
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
