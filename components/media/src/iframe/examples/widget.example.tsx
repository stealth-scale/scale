import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Iframe } from "#iframe/index.ts";

const BODY =
  "margin:0;padding:16px;font:15px/1.5 system-ui,sans-serif;color:#1f2328;background:#fff";

const SCRIPT =
  "const input=document.querySelector('input');const output=document.querySelector('output');" +
  "const show=()=>{output.textContent=(Number(input.value)*0.92).toFixed(2)};" +
  "input.addEventListener('input',show);show();";

export function Widget(): ReactElement {
  const { i18n, t } = useWords("iframe");
  const html = [
    `<!doctype html><html lang="${i18n.language}"><body style="${BODY}">`,
    `<label style="display:block;margin:0 0 8px">${t("widget.amount")} `,
    '<input inputmode="decimal" style="font:inherit;width:8em" value="250"></label>',
    `<p style="margin:0">${t("widget.converted")} <output>0</output> EUR</p>`,
    `<script>${SCRIPT}</script>`,
    "</body></html>",
  ].join("");

  return <Iframe ratio="wide" sandbox="allow-scripts" srcDoc={html} title={t("widget.title")} />;
}
