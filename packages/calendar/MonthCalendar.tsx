import {
  eachDayOfInterval,
  endOfMonth,
  getDay,
  isSameDay,
  startOfMonth,
  format,
  startOfWeek,
  add,
} from "date-fns";
import { concat, range, repeat, splitEvery } from "ramda";
import {
  Children,
  cloneElement,
  ComponentProps,
  createContext,
  isValidElement,
  useContext,
} from "react";
import { Context as CalendarContext } from "./Calendar";
import type { ReactNode } from "react";
import type { EP } from "./utils/type";

const getDatesInMonth = (focusOn: Date) =>
  eachDayOfInterval({
    start: startOfMonth(focusOn),
    end: endOfMonth(focusOn),
  });

const focus = (isFocus: boolean) =>
  isFocus
    ? {
        tabIndex: 0,
        ref: (el: HTMLElement | null) => el?.focus(),
      }
    : {
        tabIndex: -1,
      };

interface State {
  focus: Date;
  table: (Date | undefined)[][];
}
const Context = createContext<State | null>(null);
function useMonthCalendarContext(error: string) {
  const context = useContext(Context);

  if (!context) {
    throw new Error(error);
  }

  return context;
}

type _ColumnHeaderProps = {
  abbr?: (day: Date) => string;
  children?: (day: Date) => ReactNode;
};
type ColumnHeaderProps = EP<"th", _ColumnHeaderProps>;
function ColumnHeader(props: ColumnHeaderProps) {
  useMonthCalendarContext(
    `<ColumnHeader /> cannot be rendered outside <MonthCalendar />`
  );

  return (
    <>
      {range(0, 7)
        .map((days) => add(startOfWeek(new Date()), { days }))
        .map((day) => (
          <th
            {...props}
            role="columnheader"
            abbr={props.abbr?.(day) ?? format(day, "EEEE")}
            children={props.children?.(day) ?? format(day, "EEEEEE")}
            key={day.toString()}
          />
        ))}
    </>
  );
}

type _GridCellProps = {
  children?: (date: Date) => ReactNode;
};
export type GridCellProps = EP<"td", _GridCellProps>;
function GridCell(props: GridCellProps) {
  const context = useMonthCalendarContext(
    `<GridCell /> cannot be rendered outside <MonthCalendar />`
  );

  const { table, focus: focusOn } = context;

  return (
    <>
      {table.map((row, index) => (
        <tr key={index}>
          {row.map((day, index) => {
            const element = day && props.children?.(day);

            // if child is valid react element, pass focus to the child
            if (isValidElement<{}>(element)) {
              return (
                <td
                  key={index}
                  {...props}
                  children={cloneElement(element, {
                    ...element.props,
                    ...focus(Boolean(day && isSameDay(day, focusOn))),
                  })}
                />
              );
            }

            return (
              <td
                key={index}
                {...props}
                {...focus(Boolean(day && isSameDay(day, focusOn)))}
                children={element || (day && format(day, "dd"))}
              />
            );
          })}
        </tr>
      ))}
    </>
  );
}

export type MonthCalendarProps = ComponentProps<"table"> & {
  focus?: Date;
};
export const MonthCalendar = (props: MonthCalendarProps) => {
  let columnheader: ReturnType<typeof ColumnHeader> | null = null;
  let gridcell: ReturnType<typeof GridCell> | null = null;

  Children.forEach(props.children, (element) => {
    if (!isValidElement(element)) return;

    if (!columnheader && element.type === ColumnHeader) {
      columnheader = element;
    }
    if (!gridcell && element.type === GridCell) {
      gridcell = element;
    }
  });

  const context = useContext(CalendarContext);

  let { focus, ...rest } = props;
  focus = focus ?? context?.focus ?? new Date();

  const days = concat(
    repeat(undefined, getDay(startOfMonth(focus))),
    getDatesInMonth(focus)
  );

  const table = splitEvery(7, days);

  return (
    <Context.Provider value={{ focus, table }}>
      <table role="grid" {...rest}>
        <thead role="rowgroup">
          <tr role="row">{columnheader}</tr>
        </thead>
        <tbody>{gridcell}</tbody>
      </table>
    </Context.Provider>
  );
};

MonthCalendar.ColumnHeader = ColumnHeader;
MonthCalendar.GridCell = GridCell;
