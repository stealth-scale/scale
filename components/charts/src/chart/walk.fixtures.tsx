import { type ReactElement, useRef } from "react";

import { useOpened, useWalk } from "#chart/walk.ts";

/**
 * Describes what the walked box reports: the marks entered, left and pressed, and the keys and the
 * focus its tab stop received.
 */
export interface WalkSpies {
  readonly entered: (at: number) => void;
  readonly focused: () => void;
  readonly keyed: (key: string) => void;
  readonly left: (at: number) => void;
  readonly pressed: (at: number) => void;
}

/**
 * Renders a box with a tab stop, three marks whose places run against their order in the document
 * and a link, and a button outside the box.
 */
// eslint-disable-next-line react/only-export-components -- the hook runs in a component, and fast refresh never loads a fixture
function Walked({ spies }: { readonly spies: WalkSpies }): ReactElement {
  const walk = useWalk();

  return (
    <>
      <div {...walk}>
        <button
          onFocus={spies.focused}
          onKeyDown={(event) => {
            spies.keyed(event.key);
          }}
          type="button"
        >
          stop
        </button>
        {[2, 1, 0].map((at) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- the walk clicks a mark on Enter and Space
          <span
            data-walk={at}
            key={at}
            onClick={() => {
              spies.pressed(at);
            }}
            onMouseEnter={() => {
              spies.entered(at);
            }}
            onMouseLeave={() => {
              spies.left(at);
            }}
          />
        ))}
        <a href="#inside">inside</a>
      </div>
      <button type="button">outside</button>
    </>
  );
}

/**
 * Renders a box with a tab stop and no marks.
 */
// eslint-disable-next-line react/only-export-components -- the hook runs in a component, and fast refresh never loads a fixture
function Bare(): ReactElement {
  const walk = useWalk();

  return (
    <div {...walk}>
      <button type="button">stop</button>
    </div>
  );
}

/**
 * Renders a mark that opens the tooltip at itself when `opened` is on, and reports each time the
 * pointer enters it.
 */
// eslint-disable-next-line react/only-export-components -- the hook runs in a component, and fast refresh never loads a fixture
function Opened(props: { readonly entered: () => void; readonly opened: boolean }): ReactElement {
  const mark = useRef<HTMLSpanElement>(null);

  useOpened(mark, props.opened);

  return (
    <span
      onMouseEnter={() => {
        props.entered();
      }}
      ref={mark}
    />
  );
}

/**
 * Renders a mark that opens the tooltip at itself when `opened` is on.
 */
export function openedMark(opened: boolean, entered: () => void): ReactElement {
  return <Opened entered={entered} opened={opened} />;
}

/**
 * Renders the walked box, which reports to the spies.
 */
export function walkedBox(spies: WalkSpies): ReactElement {
  return <Walked spies={spies} />;
}

/**
 * Renders a walked box without marks.
 */
export function bareBox(): ReactElement {
  return <Bare />;
}
