/**
 * Catalogues the alert across its variants, one scene per axis.
 *
 * @remarks
 *   Each scene enumerates its axis from the recipe, so a value added to the theme appears on the
 *   page without an edit here. Every alert on the page is rendered with `live="off"`, because the
 *   whole grid mounts at once and a live region would have a screen reader read out forty notices
 *   in a row. The copy is keyed under `alert` in the catalogue namespace and stored beside this
 *   file at `locales/en/specimen/alert.json`.
 */

import { type ReactElement } from "react";

import { IconButton } from "@stealthscale/component-actions";
import { Icon } from "@stealthscale/component-typography";
import {
  Matrix,
  type Scene,
  specimen,
  useWords,
  type ValueOf,
  valuesOf,
} from "@stealthscale/specimen";

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
 * The copy of one notice and the variants of the alert it is rendered inside.
 */
interface NoticeProps {
  /**
   * The body text of the notice.
   */
  readonly description: string;

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
        <Alert.Description>{description}</Alert.Description>
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
 * Renders a failed payment once per variant, crossed against every status.
 */
function Looks(): ReactElement {
  const { t } = useWords("alert");

  return (
    <Matrix
      across={{ knob: "status", of: valuesOf(recipe, "status") }}
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, status) => (
        <Alert.Root live="off" status={status} variant={variant}>
          <Notice
            description={t("declined")}
            status={status}
            title={t("failed")}
            variant={variant}
          />
        </Alert.Root>
      )}
    </Matrix>
  );
}

/**
 * Renders a saved draft under each layout, so that the stacked and inline forms sit side by side.
 */
function Layouts(): ReactElement {
  const { t } = useWords("alert");

  return (
    <Matrix knob="layout" of={valuesOf(recipe, "layout")}>
      {(layout) => (
        <Alert.Root layout={layout} live="off" status="success">
          <Notice description={t("restored")} status="success" title={t("saved")} />
        </Alert.Root>
      )}
    </Matrix>
  );
}

/**
 * Renders a saved draft once per radius, crossed against every size.
 */
function Corners(): ReactElement {
  const { t } = useWords("alert");

  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="radius"
      of={valuesOf(recipe, "radius")}
    >
      {(radius, size) => (
        <Alert.Root live="off" radius={radius} size={size}>
          <Notice description={t("restored")} title={t("saved")} />
        </Alert.Root>
      )}
    </Matrix>
  );
}

/**
 * Renders a failed payment once per entrance animation.
 */
function Motion(): ReactElement {
  const { t } = useWords("alert");

  return (
    <Matrix knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => (
        <Alert.Root live="off" motion={motion} status="error">
          <Notice description={t("declined")} status="error" title={t("failed")} />
        </Alert.Root>
      )}
    </Matrix>
  );
}

/**
 * Renders a saved draft once per edge the rule can be drawn along.
 */
function Edge(): ReactElement {
  const { t } = useWords("alert");

  return (
    <Matrix knob="edge" of={valuesOf(recipe, "edge")}>
      {(edge) => (
        <Alert.Root edge={edge} live="off" status="warning">
          <Notice description={t("restored")} status="warning" title={t("saved")} />
        </Alert.Root>
      )}
    </Matrix>
  );
}

/**
 * The scene crossing every variant with every status.
 */
export const looks: Scene = {
  about: "alert.looks.about",
  draw: Looks,
  title: "alert.looks.title",
};

/**
 * The scene showing the edge rule.
 */
export const edge: Scene = {
  about: "alert.edge.about",
  draw: Edge,
  title: "alert.edge.title",
};

/**
 * The scene comparing the stacked and inline layouts.
 */
export const layouts: Scene = {
  about: "alert.layouts.about",
  draw: Layouts,
  title: "alert.layouts.title",
};

/**
 * The scene crossing every radius with every size.
 */
export const corners: Scene = {
  about: "alert.corners.about",
  draw: Corners,
  title: "alert.corners.title",
};

/**
 * The scene showing each entrance animation.
 */
export const motion: Scene = {
  about: "alert.motion.about",
  draw: Motion,
  title: "alert.motion.title",
};

export default specimen({
  about: "alert.about",
  group: "Feedback",
  id: "feedback/alert",
  imports: 'import { Alert } from "@stealthscale/component-feedback";',
  scenes: [looks, edge, layouts, corners, motion],
  title: "alert.title",
});
