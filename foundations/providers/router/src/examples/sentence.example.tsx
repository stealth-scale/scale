import { type ReactElement } from "react";

import { Link } from "@stealthscale/component-navigation";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { useRouteHref } from "#href.ts";
import { createLink } from "#tanstack.ts";

const StyledLink = createLink(Link);

export function Sentence(): ReactElement {
  const { t } = useWords("route-link");
  const href = useRouteHref("specimen.components.actions.button");

  return (
    <Text>
      {t("before")} <StyledLink to={href}>{t("named")}</StyledLink> {t("after")}
    </Text>
  );
}
