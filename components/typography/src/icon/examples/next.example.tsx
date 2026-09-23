import { type ReactElement } from "react";

import { ArrowRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { Icon } from "#icon/index.ts";

export function Next(props: Parameters<typeof Icon>[0]): ReactElement {
  const { t } = useWords("icon");

  return <Icon aria-hidden={false} aria-label={t("arrow")} as={ArrowRightIcon} {...props} />;
}
