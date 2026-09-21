# @stealthscale/provider-color-mode

`@stealthscale/provider-color-mode` puts a colour mode in scope, remembers what a person chose, and
settles the first paint before the page draws. A choice is kept per application, so two applications
on one origin keep their own.

Following the machine is written as the absence of the attribute rather than as a resolved mode. The
design system's own rules draw a page carrying no attribute by the operating system's setting, so
somebody following the machine keeps following it when they change it, with nothing to re-run.

## Install

```bash
pnpm add @stealthscale/provider-color-mode
```

The package peers on `@stealthscale/settings`, `@stealthscale/theme` and `react`.

## Usage

Wrap the tree and name the application. Everything below reads the mode through `useColorMode`.

```tsx
import { ColorModeProvider } from "@stealthscale/provider-color-mode";

export function Root({ children }: { children: ReactNode }) {
  return <ColorModeProvider app="docs">{children}</ColorModeProvider>;
}
```

```tsx
import { useColorMode } from "@stealthscale/provider-color-mode";

export function ColorModeToggle() {
  const { choice, colorMode, setColorMode } = useColorMode();

  return (
    <button onClick={() => setColorMode(colorMode === "dark" ? "light" : "dark")}>
      {choice === "system" ? `following the machine, drawn ${colorMode}` : choice}
    </button>
  );
}
```

`colorMode` is how the page is drawn and is always `light` or `dark`. `choice` is what the person
picked and may also be `system`. A picker lists all three. Read `colorMode` for anything that has to
resolve to one of the two, such as which image to load.

## The first paint

A person who has never chosen gets the right first paint from CSS alone. The provider writes the
attribute before the browser paints React's first commit, so nothing React draws is painted in the
wrong mode. The flash only happens when a stored choice disagrees with the machine and the page
painted something before React mounted, because the provider cannot affect that paint.

An application rendered on a server keeps the choice in a cookie and writes the attribute itself:

```tsx
import { cookieStore } from "@stealthscale/settings";

const store = cookieStore({ header: request.headers.get("cookie") ?? "" });

<ColorModeProvider app="docs" store={store}>
  {children}
</ColorModeProvider>;
```

A static single-page application has no server to personalise the document, so it inlines a blocking
script in the head. `colorModeScript` writes that script's body, and the name it is given has to
match the one the provider is given.

```tsx
<script dangerouslySetInnerHTML={{ __html: colorModeScript("docs") }} />
```

The script reads local storage and writes the attribute. An application keeping the choice in a
cookie needs none of it. A server that writes the document can import the script alone, without the
provider or React, from the `./script` subpath:

```ts
import { colorModeScript } from "@stealthscale/provider-color-mode/script";
```

The text carries no `<`: every one in the application's name is written as its JavaScript escape, so
an HTML parser ends the element where the application closes it whatever the name holds. A page
under a content security policy that forbids inline script allows this one by a nonce or a hash,
which the page states.

## Reference

| Export               | Signature                                                      |
| -------------------- | -------------------------------------------------------------- |
| `ColorModeProvider`  | `(props: ColorModeProviderProps) => ReactElement`              |
| `useColorMode`       | `() => ColorModeContextValue`                                  |
| `useSystemColorMode` | `() => ColorMode`                                              |
| `colorModeScript`    | `(app: string) => string`                                      |
| `colorModeSetting`   | `(store?: SettingStore) => SettingDefinition<ColorModeChoice>` |
| `COLOR_MODE_SETTING` | `"color-mode"`                                                 |
| `COLOR_MODES`        | `readonly ColorMode[]`                                         |
| `DARK_SCHEME_QUERY`  | `"(prefers-color-scheme: dark)"`                               |

`useSystemColorMode` reads the machine's own setting and follows it as it changes. It returns
`light` on a server, which nothing about the first paint rests on, because the stylesheet decides
that for a page carrying no attribute.

`colorModeSetting` returns the definition the provider uses, for a server or a script that has to
read the same choice without React around it.

Warning: `useColorMode` throws where there is no provider above it. A hook that returned a default
instead would let a subtree draw in a mode nothing is writing.

## The attribute

The mode is written on the document root rather than on an element of the provider's own, so a
portal drawn at the end of the document is in the same mode as the tree that opened it. A subtree
drawn the other way writes the attribute on its own element and needs nothing from here.

## Licence

MIT. See [LICENSE](LICENSE).
