import { type ReactElement } from "react";

import { ChevronDownIcon, DownloadIcon } from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import * as Accordion from "#accordion/index.ts";

const DOCUMENTS = ["contract", "invoice", "nda"] as const;

export function Documents(): ReactElement {
  const { t } = useWords("accordion");

  return (
    <Accordion.Root collapsible defaultValue={["contract"]} variant="surface">
      {DOCUMENTS.map((document) => (
        <Accordion.Item key={document} value={document}>
          <Accordion.ItemHeading>
            <Accordion.ItemTrigger>
              {t(`documents.${document}.title`)}
              <Accordion.ItemIndicator>
                <ChevronDownIcon size="100%" />
              </Accordion.ItemIndicator>
            </Accordion.ItemTrigger>
            <IconButton
              aria-label={t("documents.download", { file: t(`documents.${document}.title`) })}
              size="sm"
              variant="ghost"
            >
              <DownloadIcon />
            </IconButton>
          </Accordion.ItemHeading>
          <Accordion.ItemContent>
            <Accordion.ItemBody>{t(`documents.${document}.body`)}</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
