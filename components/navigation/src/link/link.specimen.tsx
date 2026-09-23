/**
 * Catalogue page for the link.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. Every scene renders a component from
 *   `examples/` and shows that file as its source. Each link stands inside a sentence, because a
 *   reader finds a link by its contrast with the text around it. The inherit scene sets the
 *   sentence in muted text, because a link that inherits body text is identical to one that
 *   inherits nothing. The words are keys under `link` in `locales/en/specimen/link.json`.
 */

import { scenesOf, specimen } from "@stealthscale/specimen";

import * as footnote from "#link/examples/footnote.example.tsx";
import * as terms from "#link/examples/terms.example.tsx";
import { recipe } from "#link/recipe.ts";

export default specimen({
  about: "link.about",
  id: "components/navigation/link",
  imports: 'import { Link } from "@stealthscale/component-navigation";',
  scenes: scenesOf<Parameters<typeof terms.Terms>[0]>(recipe, {
    axes: {
      inherit: { draw: (props) => <footnote.Footnote {...props} />, example: footnote },
    },
    draw: (props) => <terms.Terms {...props} />,
    example: terms,
    namespace: "link",
    order: ["variant", "palette", "inherit"],
  }),
  title: "link.title",
});
