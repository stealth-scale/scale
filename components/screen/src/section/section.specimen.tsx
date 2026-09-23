/**
 * Shows the section: both looks at every size, and the heading beside the body as an annotation.
 *
 * @remarks
 *   The scenes are generated from the recipe, so a value added to it reaches the page without this
 *   file changing. The size is crossed with the look, because the pair reads as a grid rather than
 *   as two lists, and the annotation runs down the page, because the heading beside the body takes
 *   the whole width to show.
 *   Every section holds the same block: a title, a description, one action and a body. The title is
 *   drawn as an `h3`, under the scene's own `h2`. The words are keys under `section` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/section.json`.
 */

import { type ReactElement } from "react";

import { CreditCard } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Divider, Stack } from "@stealthscale/component-layout";
import { Icon, Text } from "@stealthscale/component-typography";
import { Room, scenesOf, specimen, useWords } from "@stealthscale/specimen";
import { type Scale } from "@stealthscale/theme/authoring";

import * as Section from "#section/index.ts";
import { recipe } from "#section/recipe.ts";

/**
 * The cards the body lists: which card it is, the digits it ends on, and when it runs out.
 */
const CARDS = [
  ["visa", "7732", "04 / 27"],
  ["mastercard", "4419", "11 / 26"],
] as const;

/**
 * Writes the look every control on the block takes, at the step the block is read at.
 *
 * @remarks
 *   A control written as `Section.Action as={Button}` is typed as the slot rather than as the
 *   button, so the button's own axes are set through its props provider rather than as props on the
 *   slot. The step is threaded down from the scene, because the controls are the one part of the
 *   block that would otherwise stand at one size through the whole size axis.
 */
function looked(size: Scale): { size: Scale; variant: "subtle" } {
  return { size, variant: "subtle" };
}

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Section.Header>",
    "  <Section.Title>Payment methods</Section.Title>",
    "</Section.Header>",
    "<Section.Body>…</Section.Body>",
  ].join("\n"),
  imports: 'import { Section } from "@stealthscale/component-screen";',
  name: "Section.Root",
};

/**
 * Draws one card a person can be charged on: the mark, what it is and what it ends on, when it runs
 * out, and the control that changes it.
 */
function Card({
  card,
  digits,
  expiry,
  size,
}: { readonly size: Scale } & Record<"card" | "digits" | "expiry", string>): ReactElement {
  const { t } = useWords("section");

  return (
    <Stack direction="row" justify="between">
      <Stack direction="row" gap="md">
        <Icon size="lg" tone="muted">
          <CreditCard />
        </Icon>
        <Stack gap="xs">
          <Text>{t("ending", { card: t(card), digits })}</Text>
          <Text size="sm" tone="muted">
            {t("expires", { expiry })}
          </Text>
        </Stack>
      </Stack>
      <Button size={size} variant="ghost">
        {t("change")}
      </Button>
    </Stack>
  );
}

/**
 * Draws the block every section holds: the cards an account can be charged on.
 *
 * @remarks
 *   Real rows rather than blocks standing in for them. A section states where its bands begin, how
 *   far they are held off the page's edge and what a rule between them does, and none of that can
 *   be read against a column of grey slabs: the slabs are the same shape as the bands.
 *   The rows are ruled apart rather than boxed. A list of settings inside a block that already
 *   draws a box reads as boxes inside a box, which is the shape the page is meant to be showing.
 */
function Payment({ size = "md" }: { readonly size?: Scale | undefined }): ReactElement {
  const { t } = useWords("section");

  return (
    <>
      <Section.Header>
        <Section.Title as="h3">{t("payment")}</Section.Title>
        <Section.Description>{t("cards")}</Section.Description>
        <Section.Actions>
          <ButtonPropsProvider value={looked(size)}>
            <Section.Action as={Button} priority="secondary">
              {t("add")}
            </Section.Action>
          </ButtonPropsProvider>
        </Section.Actions>
      </Section.Header>
      <Section.Body>
        <Stack gap="sm">
          {CARDS.map(([card, digits, expiry], at) => (
            <Stack gap="sm" key={card}>
              {at === 0 ? null : <Divider />}
              <Card card={card} digits={digits} expiry={expiry} size={size} />
            </Stack>
          ))}
        </Stack>
      </Section.Body>
    </>
  );
}

/**
 * Draws the section in whatever the scene hands over, in a room a block of a page is read at.
 *
 * @remarks
 *   The root is drawn as a `div`. A section names itself from its own title, so every drawing on
 *   this page would be a landmark called `Payment methods` and a reader moving by landmark would
 *   hear the one name a dozen times. The page cannot vary the name without varying the title,
 *   which is the drawing itself.
 *   A section takes the width of what holds it, and a matrix lays its cells out as flex children,
 *   which shrink-wrap. Drawn without a room the title wrapped after its first word and every row of
 *   the body broke over two lines.
 */
function Held(props: Section.RootProps): ReactElement {
  return (
    <Room size="2xl">
      <Section.Root as="div" {...props}>
        <Payment {...(props.size === undefined ? {} : { size: props.size })} />
      </Section.Root>
    </Room>
  );
}

/**
 * Draws the section on a surface in a room wide enough for two columns, which is what the
 * annotation needs.
 *
 * @remarks
 *   The plain look draws no box, so a heading moved beside the body has no edge to sit against and
 *   the two columns read as one block of text. The wider room is the other half of it: annotated in
 *   a room the width of a block, the heading had nowhere to stand beside the body and stacked over
 *   it, which is the look the axis was meant to be read against.
 */
function Raised(props: Section.RootProps): ReactElement {
  return (
    <Room size="4xl">
      <Section.Root as="div" variant="surface" {...props}>
        <Payment {...(props.size === undefined ? {} : { size: props.size })} />
      </Section.Root>
    </Room>
  );
}

export default specimen({
  about: "section.about",
  id: "components/screen/section",
  imports: 'import { Section } from "@stealthscale/component-screen";',
  scenes: scenesOf<Section.RootProps>(recipe, {
    axes: {
      annotated: { direction: "column", draw: (props) => <Raised {...props} /> },
      size: { direction: "column" },
      variant: { direction: "column" },
    },
    draw: (props) => <Held {...props} />,
    namespace: "section",
    order: ["variant", "size", "annotated"],
    sample: SAMPLE,
  }),
  title: "section.title",
});
