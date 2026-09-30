import { type ReactElement } from "react";

import { Skeleton, SkeletonText } from "@stealthscale/component-feedback";
import { useWords } from "@stealthscale/specimen";

import * as Page from "#page/index.ts";

export function Loading(): ReactElement {
  const { t } = useWords("page");

  return (
    <Page.Root size="sm">
      <Page.Header>
        <Page.Title aria-label={t("pending.label")} as="h3">
          <Skeleton as="span">
            <span>{t("pending.title")}</span>
          </Skeleton>
        </Page.Title>
        <Page.Description>
          <Skeleton as="span">
            <span>{t("pending.about")}</span>
          </Skeleton>
        </Page.Description>
      </Page.Header>
      <Page.Body aria-busy="true">
        <SkeletonText lines={4} />
      </Page.Body>
    </Page.Root>
  );
}
