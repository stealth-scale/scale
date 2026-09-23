/**
 * Lays out the catalogue page for the alert.
 *
 * @remarks
 *   The scenes are generated from the recipe, so an axis added there appears here without an edit
 *   to this file. Every alert on the page is rendered with `live="off"`, because the whole grid
 *   mounts at once and a live region would have a screen reader read out forty notices in a row.
 *   Each scene carries the notice its axis reads best against: a failed payment where the axis
 *   turns colour or motion, and a saved draft where it turns shape. The copy is keyed under `alert`
 *   in the catalogue namespace and stored beside this file at `locales/en/specimen/alert.json`.
 */

import { type ReactElement } from "react";

import { IconButton } from "@stealthscale/component-actions";
import { Icon } from "@stealthscale/component-typography";
import { scenesOf, specimen, useWords, type ValueOf } from "@stealthscale/specimen";

import * as Alert from "#alert/index.ts";
import { recipe } from "#alert/recipe.ts";

/**
 * The SVG path of a warning triangle, drawn in a 24 unit viewBox.
 */
const TRIANGLE = "M12 3 2 21h20L12 3zm0 6v6m0 3v.5";

/**
 * The SVG path of a cross, drawn in a 24 unit viewBox.
 */
const CROSS = "M6 6l12 12M18 6 6 18";

/**
 * Narrows the recipe's variant map, so that a scene can type a value it reads off one axis.
 */
type Axes = NonNullable<typeof recipe.variants>;

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Alert.Indicator>{icon}</Alert.Indicator>",
    "<Alert.Content>",
    "  <Alert.Title>Payment failed</Alert.Title>",
    "  <Alert.Description>The card was declined.</Alert.Description>",
    "</Alert.Content>",
  ].join("\n"),
  imports: 'import { Alert } from "@stealthscale/component-feedback";',
  name: "Alert.Root",
};

/**
 * The copy of one notice and the variants of the alert it is rendered inside.
 */
interface NoticeProps {
  /**
   * The body text of the notice, where the scene draws one.
   *
   * @remarks
   *   The grid of looks against statuses draws none. Twenty-five cells of a title and a sentence
   *   wrapped every sentence over four lines and squeezed the dismiss control into the middle of
   *   a column of text. What that grid is about is the colour, which a title carries on one line.
   */
  readonly description?: string | undefined;

  /**
   * The status of the surrounding alert, which the dismiss control is tinted from. Defaults to the
   * recipe's own default where a scene does not vary this axis.
   */
  readonly status?: ValueOf<Axes, "status">;

  /**
   * The headline of the notice.
   */
  readonly title: string;

  /**
   * The variant of the surrounding alert, which selects the dismiss control's. Defaults to the
   * recipe's own default where a scene does not vary this axis.
   */
  readonly variant?: ValueOf<Axes, "variant">;
}

/**
 * Fills the four inner slots of an alert, which every scene on this page shares.
 *
 * @remarks
 *   The dismiss control inherits the alert's status and derives its own variant from the alert's:
 *   `solid` on a solid alert, so that it paints the alert's own fill and reads in the contrast
 *   foreground, and `ghost` everywhere else, so that it reads in the palette foreground the title
 *   uses. Leaving it ghost throughout put a dark cross on a solid fill.
 */
function Notice({
  description,
  status = "info",
  title,
  variant = "subtle",
}: NoticeProps): ReactElement {
  const { t } = useWords("alert");

  return (
    <>
      <Alert.Indicator>
        <Icon viewBox="0 0 24 24">
          <path d={TRIANGLE} fill="none" stroke="currentColor" strokeWidth="2" />
        </Icon>
      </Alert.Indicator>
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        {description === undefined ? null : <Alert.Description>{description}</Alert.Description>}
      </Alert.Content>
      <Alert.Aside>
        <IconButton
          aria-label={t("dismiss")}
          size="xs"
          status={status}
          variant={variant === "solid" ? "solid" : "ghost"}
        >
          <Icon viewBox="0 0 24 24">
            <path d={CROSS} fill="none" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </IconButton>
      </Alert.Aside>
    </>
  );
}

/**
 * Builds a scene renderer whose alerts all carry the same notice.
 *
 * @remarks
 *   An axis the scene left out is omitted from the notice rather than passed as `undefined`, so the
 *   notice's own defaults still tint the dismiss control.
 * @param title - The translation key of the headline, not the headline itself.
 * @param description - The translation key of the body, not the body itself.
 */
function noticing(title: string, description?: string): (props: Alert.RootProps) => ReactElement {
  return function Noticing({ status, variant, ...rest }: Alert.RootProps): ReactElement {
    const { t } = useWords("alert");

    return (
      <Alert.Root
        live="off"
        {...(status === undefined ? {} : { status })}
        {...(variant === undefined ? {} : { variant })}
        {...rest}
      >
        <Notice
          {...(description === undefined ? {} : { description: t(description) })}
          {...(status === undefined ? {} : { status })}
          title={t(title)}
          {...(variant === undefined ? {} : { variant })}
        />
      </Alert.Root>
    );
  };
}

export default specimen({
  about: "alert.about",
  id: "components/feedback/alert",
  imports: 'import { Alert } from "@stealthscale/component-feedback";',
  scenes: [
    ...scenesOf<Alert.RootProps>(recipe, {
      axes: {
        edge: { with: { status: "warning" } },
        layout: { with: { status: "success" } },
        motion: { draw: noticing("failed", "declined"), with: { status: "error" } },
        radius: { across: "size" },
        variant: { across: "status", draw: noticing("failed") },
      },
      draw: noticing("saved", "restored"),
      namespace: "alert",
      order: ["variant", "radius", "layout", "edge", "motion"],
      sample: SAMPLE,
    }),
  ],
  title: "alert.title",
});
