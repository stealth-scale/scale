import { type ReactElement } from "react";

import { Link } from "@stealthscale/component-navigation";
import { useWords } from "@stealthscale/specimen";

import { Markdown } from "#markdown/index.ts";

const COMPONENTS: Parameters<typeof Markdown>[0]["components"] = {
  link: ({ children, href, title }) =>
    href.startsWith("#") ? (
      <Link href={href} title={title}>
        {children}
      </Link>
    ) : (
      <Link href={href} rel="noopener noreferrer" target="_blank" title={title}>
        {children}
      </Link>
    ),
};

export function Links(): ReactElement {
  const { t } = useWords("markdown");

  return <Markdown components={COMPONENTS} headingLevel={3} source={t("links.source")} />;
}
