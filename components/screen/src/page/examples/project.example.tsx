import { type ReactElement } from "react";

import { Breadcrumb } from "@stealthscale/component-navigation";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Page from "#page/index.ts";

export function Project(props: Page.RootProps): ReactElement {
  const { t } = useWords("page");

  return (
    <Page.Root {...props}>
      <Page.Header>
        <Page.When when="wide">
          <Page.Context>
            <Breadcrumb.Root aria-label={t("trail")}>
              <Breadcrumb.List>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="#workspace">{t("workspace")}</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator>/</Breadcrumb.Separator>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="#projects">{t("projects")}</Breadcrumb.Link>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb.Root>
          </Page.Context>
        </Page.When>
        <Page.When when="narrow">
          <Page.Trail href="#projects">{t("projects")}</Page.Trail>
        </Page.When>
        <Page.Title as="h3">{t("launch")}</Page.Title>
        <Page.Description>{t("launchAbout")}</Page.Description>
      </Page.Header>
      <Page.Body>
        <Text>{t("launchBody")}</Text>
      </Page.Body>
    </Page.Root>
  );
}
