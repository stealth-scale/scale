import { type ReactElement } from "react";

import * as CodeBlock from "#code-block/index.ts";

function sgr(...codes: number[]): string {
  return `\u001B[${codes.join(";")}m`;
}

const RESET = sgr(0);

const OUTPUT = [
  `${sgr(2)}$ ls -l --color releases/1093${RESET}`,
  "total 112",
  `drwxr-xr-x 4 deploy deploy  4096 Sep 30 09:12 ${sgr(1, 34)}assets${RESET}`,
  "-rw-r--r-- 1 deploy deploy  1204 Sep 30 09:12 config.yaml",
  `lrwxrwxrwx 1 deploy deploy    18 Sep 30 09:12 ${sgr(1, 36)}current${RESET} -> ${sgr(1, 34)}shared${RESET}`,
  `-rwxr-xr-x 1 deploy deploy  2311 Sep 30 09:12 ${sgr(1, 32)}deploy.sh${RESET}`,
  `prw-r--r-- 1 deploy deploy     0 Sep 30 09:12 ${sgr(40, 33)}events${RESET}`,
  `-rw-r--r-- 1 deploy deploy 20480 Sep 30 09:12 ${sgr(1, 35)}logo.png${RESET}`,
  `-rw-r--r-- 1 deploy deploy 81920 Sep 30 09:12 ${sgr(1, 31)}release.tar.gz${RESET}`,
].join("\n");

export function Deploy(): ReactElement {
  return (
    <CodeBlock.Root code={OUTPUT} language="ansi">
      <CodeBlock.Header>
        <CodeBlock.Title>deploy.log</CodeBlock.Title>
      </CodeBlock.Header>
      <CodeBlock.Content>
        <CodeBlock.Code />
      </CodeBlock.Content>
    </CodeBlock.Root>
  );
}
