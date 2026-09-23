import { type ReactElement } from "react";

import { StarIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { Icon } from "#icon/index.ts";

export function Favourite(props: Parameters<typeof Icon>[0]): ReactElement {
  const { t } = useWords("icon");

  return <Icon aria-hidden={false} aria-label={t("star")} as={StarIcon} {...props} />;
}
