import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Iframe, type IframeProps } from "#iframe/index.ts";

const BODY =
  "margin:0;padding:24px;font:15px/1.5 system-ui,sans-serif;color:#1f2328;background:#fff";

export function Email(props: Omit<IframeProps, "title">): ReactElement {
  const { i18n, t } = useWords("iframe");
  const html = [
    `<!doctype html><html lang="${i18n.language}"><body style="${BODY}">`,
    `<p style="margin:0 0 16px;font-weight:600">${t("email.from")}</p>`,
    `<h1 style="margin:0 0 8px;font-size:20px">${t("email.heading")}</h1>`,
    `<p style="margin:0 0 16px">${t("email.body")}</p>`,
    `<p style="margin:0;font-size:24px;font-weight:600">${t("email.amount")}</p>`,
    "</body></html>",
  ].join("");

  return <Iframe srcDoc={html} title={t("email.title")} {...props} />;
}
