import {
  Children,
  cloneElement,
  ComponentProps,
  isValidElement,
  ReactNode,
  RefObject,
  useEffect,
  useId,
  useRef,
} from "react";
import { tabbable } from "tabbable";

type DescriptionProps = ComponentProps<"div">;
function Description(props: DescriptionProps) {
  return <div {...props} />;
}

type TitleProps = ComponentProps<"h2">;
function Title(props: TitleProps) {
  return <h2 {...props} style={{ color: 'red'}}/>;
}

type BackdropProps = ComponentProps<"div">;
function Backdrop(props: BackdropProps) {
  if (props.children) {
    return <div {...props}>{props.children}</div>;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backdropFilter: "brightness(30%)",
      }}
      {...props}
    />
  );
}

function focus(node?: HTMLElement | null) {
  return node?.focus();
}

const IS_TEST_ENV = process.env.NODE_ENV !== "test";

type DialogProps = ComponentProps<"div"> & {
  onDismiss?: () => void;
  initialFocusRef?: RefObject<HTMLElement>;
};
export function Dialog(_props: DialogProps) {
  const { children, onDismiss, initialFocusRef, ...props } = _props;

  const id = useId();

  let labelledby: string | undefined = undefined;
  let describedby: string | undefined = undefined;
  let backdrop: ReactNode | undefined = undefined;
  Children.forEach(children, (element) => {
    if (!isValidElement(element)) return;

    if (element.type === Title) {
      labelledby = id + "label";
    }
    if (element.type === Description) {
      describedby = id + "description";
    }
    if (element.type === Backdrop) {
      const onClick = () => {
        element.props.onClick?.();
        onDismiss?.();
      };
      backdrop = cloneElement(element, { ...element.props, onClick });
    }
  });

  if (!labelledby && !props["aria-label"]) {
    throw new Error(
      "dialog should has either: \n" +
        "- a value set for the aria-labelledby property that refers to a visible dialog title.\n" +
        "- a label specified by aria-label."
    );
  }

  const lastFocus = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const tabbables = tabbable(element, {
      displayCheck: IS_TEST_ENV,
    }) as HTMLElement[];

    focus(initialFocusRef?.current ?? tabbables.at(lastFocus.current));

    function onKeyDown(event: KeyboardEvent) {
      if (!(document.activeElement instanceof HTMLElement)) return;
      if (!element?.contains(document.activeElement)) return;

      const index = tabbables.indexOf(document.activeElement);
      const { key, shiftKey } = event;

      if (shiftKey && key === "Tab") {
        event.preventDefault();

        const nextFocusIndex = (index - 1) % tabbables.length;
        lastFocus.current = nextFocusIndex;
        return focus(tabbables.at(nextFocusIndex));
      }
      if (key === "Tab") {
        event.preventDefault();

        const nextFocusIndex = (index + 1) % tabbables.length;
        lastFocus.current = nextFocusIndex;
        return focus(tabbables.at(nextFocusIndex));
      }
      if (key === "Escape") {
        event.preventDefault();
        return onDismiss?.();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => void window.removeEventListener("keydown", onKeyDown);
  }, [ref.current, initialFocusRef?.current, lastFocus.current, onDismiss]);

  return (
    <>
      {backdrop ?? <Backdrop onClick={onDismiss} />}
      <div
        {...props}
        aria-modal="true"
        role="dialog"
        aria-labelledby={labelledby}
        aria-describedby={describedby}
        ref={ref}
      >
        {Children.map(children, (element) => {
          if (isValidElement(element)) {
            let id = undefined;

            if (element.type === Title) {
              id = labelledby;
            }
            if (element.type === Description) {
              id = describedby;
            }
            if (element.type === Backdrop) {
              return;
            }

            return cloneElement(element, { ...element.props, id });
          }

          return element;
        })}
      </div>
    </>
  );
}

Dialog.Title = Title;
Dialog.Description = Description;
Dialog.Backdrop = Backdrop;
