import { type ReactElement } from "react";

import { FilterIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Link } from "@stealthscale/component-navigation";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Page from "#page/index.ts";

const HEADINGS = ["usage", "seats", "limits"] as const;

export function Workspace(props: Page.RootProps): ReactElement {
  const { t } = useWords("page");

  return (
    <Page.Root {...props}>
      <Page.Banner>
        <Text size="sm">{t("trial")}</Text>
      </Page.Banner>
      <Page.Header>
        <Page.Title as="h3">{t("workspace")}</Page.Title>
        <Page.Description>{t("workspaceAbout")}</Page.Description>
      </Page.Header>
      <Page.Toolbar sticky>
        <Button size="sm" variant="outline">
          <FilterIcon size="1em" />
          {t("filter")}
        </Button>
      </Page.Toolbar>
      <Page.Body>
        <Text size="sm" tone="muted">
          {t("workspaceBody")}
        </Text>
      </Page.Body>
      <Page.Aside aria-label={t("contents")} folds="hide" sticky>
        <Stack gap="xs">
          {HEADINGS.map((heading) => (
            <Link href={`#${heading}`} key={heading}>
              {t(heading)}
            </Link>
          ))}
        </Stack>
      </Page.Aside>
      <Page.Footer>
        <Text size="sm" tone="muted">
          {t("updated")}
        </Text>
      </Page.Footer>
    </Page.Root>
  );
}
