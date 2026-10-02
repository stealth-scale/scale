/**
 * Fixtures for the dialog specs: a closed root around a part, an open panel around a part, and a
 * whole dialog.
 */

import { type ReactElement, type ReactNode } from "react";

import {
  ActionTrigger,
  Backdrop,
  Body,
  CloseTrigger,
  Content,
  Description,
  Footer,
  Header,
  Positioner,
  Root,
  type RootProps,
  Title,
  Trigger,
} from "#dialog/index.ts";

/**
 * Renders a part beside the panel inside a closed root, for a part on the trigger's side.
 *
 * @param children - The part under test.
 * @returns The root with the part inside it.
 */
export function rooted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Renders a part inside the panel of an open root.
 *
 * @remarks
 *   The open machine tracks presses outside the content one frame after it opens, so the fixture
 *   renders the positioner and the content around the part.
 * @param children - The part under test.
 * @param props - The props the case sets on the root.
 * @returns The root with the part inside its panel.
 */
export function opened(children: ReactNode, props: RootProps = {}): ReactElement {
  return (
    <Root defaultOpen {...props}>
      <Positioner>
        <Content>{children}</Content>
      </Positioner>
    </Root>
  );
}

/**
 * Renders a backdrop and a panel with a header, a body, a footer and a close trigger.
 *
 * @returns The backdrop and the positioner around the panel.
 */
function panel(): ReactElement {
  return (
    <>
      <Backdrop />
      <Positioner>
        <Content>
          <Header>
            <Title>Rename the report</Title>
            <Description>The new name is shown to everyone.</Description>
          </Header>
          <Body>
            <input aria-label="Name" defaultValue="Quarterly" />
          </Body>
          <Footer>
            <ActionTrigger>Cancel</ActionTrigger>
          </Footer>
          <CloseTrigger aria-label="Close">x</CloseTrigger>
        </Content>
      </Positioner>
    </>
  );
}

/**
 * Renders an open dialog with every part of its panel and no trigger.
 *
 * @remarks
 *   A modal dialog hides the page outside its panel with `aria-hidden`. The DOM the specifications
 *   run in has no layout, so axe cannot see that a modal covers the page, and it reports a
 *   focusable trigger under `aria-hidden` that a browser reports as undecided. The panel is audited
 *   here and the trigger in a closed dialog.
 * @returns The open dialog.
 */
export function panelled(): ReactElement {
  return <Root defaultOpen>{panel()}</Root>;
}

/**
 * Renders a trigger, a backdrop and a panel with a header, a body, a footer and a close trigger,
 * with the props the case sets on the root.
 *
 * @param props - The props the case sets on the root.
 * @returns The dialog.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger>Rename</Trigger>
      {panel()}
    </Root>
  );
}
