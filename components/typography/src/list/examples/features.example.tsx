import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { Icon } from "#icon/index.ts";
import * as List from "#list/index.ts";

const FEATURES = ["invoices", "currencies", "sso"] as const;

export function Features(props: List.RootProps): ReactElement {
  const { t } = useWords("list");

  return (
    <List.Root variant="plain" {...props}>
      {FEATURES.map((feature) => (
        <List.Item key={feature}>
          <List.Indicator>
            <Icon as={CheckIcon} tone="success" />
          </List.Indicator>
          {t(`features.${feature}`)}
        </List.Item>
      ))}
    </List.Root>
  );
}
