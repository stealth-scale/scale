import { type ReactElement } from "react";

import { ArrowUpIcon } from "lucide-react";

import { Stat } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as Card from "#card/index.ts";

export function Balance(props: Card.RootProps): ReactElement {
  const { t } = useWords("card");

  return (
    <Card.Root aria-label={t("balance.label")} variant="subtle" {...props}>
      <Card.Content>
        <Stat.Root>
          <Stat.Label>{t("balance.label")}</Stat.Label>
          <Stat.ValueText>{t("balance.value")}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.Indicator>
              <ArrowUpIcon aria-hidden />
            </Stat.Indicator>
            {t("balance.help")}
          </Stat.HelpText>
        </Stat.Root>
      </Card.Content>
    </Card.Root>
  );
}
