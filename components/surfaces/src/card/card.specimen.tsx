/**
 * Shows the card: every look in every status, every corner at every size, both orientations, the
 * shares of the footer, a divided card, an interactive one, and the motions.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every card carries the same invoice: a header with its mark, title,
 *   description and aside, the substance, and a footer with two controls. The words are keys
 *   under `card` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/card.json`.
 */

import { type ReactElement } from "react";

import { Button, IconButton } from "@stealthscale/component-actions";
import { Link } from "@stealthscale/component-navigation";
import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Card from "#card/index.ts";
import { recipe } from "#card/recipe.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * The path of three dots, in a 24 unit box.
 */
const DOTS = "M5 12h.01M12 12h.01M19 12h.01";

/**
 * Describes what the invoice takes.
 */
interface InvoiceProps {
  /**
   * Whether the title is a link, which is what a card a reader presses follows.
   */
  readonly linked?: boolean;
}

/**
 * Draws the bands of an invoice, with a link in the title where the card is pressed.
 */
function Invoice({ linked = false }: InvoiceProps): ReactElement {
  const { t } = useWords("card");

  return (
    <>
      <Card.Header>
        <Card.Indicator aria-hidden>●</Card.Indicator>
        <Card.Title>
          {linked ? (
            <Link href="#invoice" inherit>
              {t("invoice")}
            </Link>
          ) : (
            t("invoice")
          )}
        </Card.Title>
        <Card.Description>{t("issued")}</Card.Description>
        <Card.Aside>
          <IconButton aria-label={t("more")} size="sm" variant="ghost">
            <Icon viewBox="0 0 24 24">
              <path
                d={DOTS}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="3"
              />
            </Icon>
          </IconButton>
        </Card.Aside>
      </Card.Header>
      <Card.Content>{t("lines")}</Card.Content>
      <Card.Footer>
        <Button size="sm" variant="subtle">
          {t("remind")}
        </Button>
        <Button size="sm">{t("send")}</Button>
      </Card.Footer>
    </>
  );
}

/**
 * Draws the invoice in every look in every status.
 */
function Looks(): ReactElement {
  return (
    <Matrix
      across={{ knob: "status", of: valuesOf(recipe, "status") }}
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, status) => (
        <Card.Root as="div" status={status} variant={variant}>
          <Invoice />
        </Card.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the invoice at every corner at every size.
 */
function Corners(): ReactElement {
  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="radius"
      of={valuesOf(recipe, "radius")}
    >
      {(radius, size) => (
        <Card.Root as="div" radius={radius} size={size}>
          <Invoice />
        </Card.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the invoice in both orientations.
 */
function Orientation(): ReactElement {
  return (
    <Matrix direction="column" knob="orientation" of={valuesOf(recipe, "orientation")}>
      {(orientation) => (
        <Card.Root as="div" orientation={orientation}>
          <Invoice />
        </Card.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the invoice with its footer shared out every way.
 */
function Distribution(): ReactElement {
  return (
    <Matrix direction="column" knob="justify" of={valuesOf(recipe, "justify")}>
      {(justify) => (
        <Card.Root as="div" justify={justify}>
          <Invoice />
        </Card.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the invoice divided and whole.
 */
function Divided(): ReactElement {
  return (
    <Matrix knob="divided" of={EITHER}>
      {(divided) => (
        <Card.Root as="div" divided={divided}>
          <Invoice />
        </Card.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the invoice as a card a reader presses, beside one that only holds.
 */
function Interactive(): ReactElement {
  return (
    <Matrix knob="interactive" of={EITHER}>
      {(interactive) => (
        <Card.Root as="div" interactive={interactive}>
          <Invoice linked={interactive} />
        </Card.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the invoice entering with every motion.
 */
function Motion(): ReactElement {
  return (
    <Matrix knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => (
        <Card.Root as="div" motion={motion}>
          <Invoice />
        </Card.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the invoice behind every pattern the theme states, and under the glow.
 */
function Backdrop(): ReactElement {
  return (
    <Matrix knob="backdrop" of={valuesOf(recipe, "backdrop")}>
      {(backdrop) => (
        <Card.Root as="div" backdrop={backdrop}>
          <Invoice />
        </Card.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the invoice under the light the card offers.
 */
function Effect(): ReactElement {
  return (
    <Matrix knob="effect" of={valuesOf(recipe, "effect")}>
      {(effect) => (
        <Card.Root as="div" effect={effect} status="info">
          <Invoice />
        </Card.Root>
      )}
    </Matrix>
  );
}

/**
 * Every look in every status.
 */
export const looks: Scene = { about: "card.looks.about", draw: Looks, title: "card.looks.title" };

/**
 * Every pattern a card is drawn behind.
 */
export const backdrop: Scene = {
  about: "card.backdrop.about",
  draw: Backdrop,
  title: "card.backdrop.title",
};

/**
 * The light a card is drawn under.
 */
export const effect: Scene = {
  about: "card.effect.about",
  draw: Effect,
  title: "card.effect.title",
};

/**
 * Every corner at every size.
 */
export const corners: Scene = {
  about: "card.corners.about",
  draw: Corners,
  title: "card.corners.title",
};

/**
 * Both orientations.
 */
export const orientation: Scene = {
  about: "card.orientation.about",
  draw: Orientation,
  title: "card.orientation.title",
};

/**
 * Every share of the footer.
 */
export const distribution: Scene = {
  about: "card.distribution.about",
  draw: Distribution,
  title: "card.distribution.title",
};

/**
 * Divided beside whole.
 */
export const divided: Scene = {
  about: "card.divided.about",
  draw: Divided,
  title: "card.divided.title",
};

/**
 * Pressed beside held.
 */
export const interactive: Scene = {
  about: "card.interactive.about",
  draw: Interactive,
  title: "card.interactive.title",
};

/**
 * Every motion.
 */
export const motion: Scene = {
  about: "card.motion.about",
  draw: Motion,
  title: "card.motion.title",
};

export default specimen({
  about: "card.about",
  group: "Surfaces",
  id: "surfaces/card",
  scenes: [
    looks,
    backdrop,
    effect,
    corners,
    orientation,
    distribution,
    divided,
    interactive,
    motion,
  ],
  title: "card.title",
});
