/**
 * Fixtures for the tour specs: a page with a search field and an export button, a button that
 * starts the tour, the whole tour over them, and the waits for the machine's timers and the exit.
 */

import { type ReactElement, type ReactNode, useEffect } from "react";

import { act, screen } from "@testing-library/react";

import { drawn, pressed } from "@stealthscale/testing-react";

import {
  Actions,
  ActionTrigger,
  Arrow,
  ArrowTip,
  Backdrop,
  CloseTrigger,
  Content,
  Control,
  Description,
  Positioner,
  ProgressText,
  Root,
  type RootProps,
  Spotlight,
  type StepDetails,
  Title,
  type TourOptions,
  useTour,
} from "#tour/index.ts";

/**
 * Returns a function that finds the element with the id, which a step points at.
 *
 * @param id - The element's id.
 */
function byId(id: string): () => HTMLElement | null {
  return () => globalThis.document.querySelector<HTMLElement>(`[id="${id}"]`);
}

/**
 * Returns the steps of the fixture tour: a dialog, a tooltip at the search field and a tooltip at
 * the export button.
 */
export function steps(): StepDetails[] {
  return [
    {
      actions: [{ action: "next", label: "Start" }],
      description: "Three steps over the page.",
      id: "welcome",
      title: "Welcome",
      type: "dialog",
    },
    {
      actions: [
        { action: "prev", label: "Back" },
        { action: "next", label: "Next" },
      ],
      description: "Find a report by its name.",
      id: "search",
      target: byId("search"),
      title: "Search",
    },
    {
      actions: [
        { action: "prev", label: "Back" },
        { action: "dismiss", label: "Done" },
      ],
      description: "Download the report.",
      id: "export",
      target: byId("export"),
      title: "Export",
    },
  ];
}

/**
 * Describes the props of the fixture page.
 */
interface PageProps {
  /**
   * The id of the step the tour starts at as the page mounts, for an audit of an open step.
   */
  readonly begin?: string | undefined;

  /**
   * The card's children, which replace the fixture's card.
   */
  readonly card?: ReactNode;

  /**
   * The machine's options, which replace the fixture's steps where they name steps.
   */
  readonly options?: TourOptions | undefined;

  /**
   * The root's props.
   */
  readonly root?: Omit<RootProps, "tour"> | undefined;
}

/**
 * Renders the card the fixture tour shows at every step.
 *
 * @returns The arrow, the title, the description, the close trigger and the control row.
 */
function card(): ReactElement {
  return (
    <>
      <Arrow>
        <ArrowTip />
      </Arrow>
      <Title />
      <Description />
      <CloseTrigger aria-label="End the tour">x</CloseTrigger>
      <Control>
        <ProgressText />
        <Actions>
          {(actions) =>
            actions.map((action) => <ActionTrigger action={action} key={action.label} />)
          }
        </Actions>
      </Control>
    </>
  );
}

/**
 * Renders the page, the button that starts the tour and the tour.
 *
 * @param props - The card, the machine's options and the root's props.
 * @returns The page with the tour.
 */
// eslint-disable-next-line react/only-export-components -- the specifications render the machine through this page, and fast refresh never loads a fixture
function Page({ begin, card: children = card(), options, root }: PageProps): ReactElement {
  const tour = useTour({ steps: steps(), ...options });

  useEffect(() => {
    if (begin !== undefined) tour.start(begin);
    // eslint-disable-next-line react/exhaustive-effect-dependencies, react-hooks/exhaustive-deps -- the page starts the tour once, as it mounts
  }, []);

  return (
    <>
      <button
        onClick={() => {
          tour.start();
        }}
        type="button"
      >
        Take the tour
      </button>
      <input aria-label="Search" id="search" />
      <button id="export" type="button">
        Export
      </button>
      <Root tour={tour} {...root}>
        <Backdrop />
        <Spotlight />
        <Positioner>
          <Content>{children}</Content>
        </Positioner>
      </Root>
    </>
  );
}

/**
 * Renders the page with the tour, closed.
 *
 * @param props - The card, the machine's options and the root's props.
 * @returns The page.
 */
export function toured(props: PageProps = {}): ReactElement {
  return <Page {...props} />;
}

/**
 * Waits inside `act` for a delay the machine started to run out.
 *
 * @remarks
 *   A tooltip step scrolls its target into view and settles 100ms later. The wait runs 150ms by
 *   default.
 * @param ms - The time to wait.
 */
export async function elapsed(ms = 150): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

/**
 * Waits for the next animation frame inside `act`, in which the presence reads the closed card's
 * animation.
 */
export async function framed(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
    await Promise.resolve();
  });
}

/**
 * Renders the page with the tour and presses the button that starts it.
 *
 * @param props - The card, the machine's options and the root's props.
 * @returns The rendered page.
 */
export async function started(props: PageProps = {}): ReturnType<typeof drawn> {
  const rendered = await drawn(toured(props));

  await pressed(screen.getByRole("button", { name: "Take the tour" }));
  await elapsed();

  return rendered;
}

/**
 * Presses the button with the name in the open card and waits for the step to settle.
 *
 * @param name - The button's accessible name.
 */
export async function stepped(name: string): Promise<void> {
  await pressed(screen.getByRole("button", { name }));
  await elapsed();
}
