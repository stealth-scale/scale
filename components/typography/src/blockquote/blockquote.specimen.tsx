/**
 * Catalogue page for the block quotation.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. Every scene renders a customer testimonial with
 *   a lucide quote icon, the quotation and a caption. The look, size and alignment scenes render
 *   one quotation per row in a 512px room. The palette scene renders the surface look. Every scene
 *   renders a component from `examples/` and shows that file as its source. The words are keys
 *   under `blockquote` in `locales/en/specimen/blockquote.json`.
 */

import { Room, scenesOf, specimen } from "@stealthscale/specimen";

import * as testimonial from "#blockquote/examples/testimonial.example.tsx";
import { recipe } from "#blockquote/recipe.ts";

/**
 * Props of the testimonial example.
 */
type Props = Parameters<typeof testimonial.Testimonial>[0];

/**
 * Renders the testimonial in a 512px room.
 */
function roomed(props: Props): ReturnType<typeof testimonial.Testimonial> {
  return (
    <Room size="lg">
      <testimonial.Testimonial {...props} />
    </Room>
  );
}

export default specimen({
  about: "blockquote.about",
  id: "components/typography/blockquote",
  imports: 'import { Blockquote } from "@stealthscale/component-typography";',
  scenes: scenesOf<Props>(recipe, {
    axes: {
      justify: { direction: "column", draw: roomed },
      palette: { with: { variant: "surface" } },
      size: { direction: "column", draw: roomed },
      variant: { direction: "column", draw: roomed },
    },
    draw: (props) => <testimonial.Testimonial {...props} />,
    example: testimonial,
    namespace: "blockquote",
    order: ["variant", "palette", "size", "justify", "motion"],
  }),
  title: "blockquote.title",
});
