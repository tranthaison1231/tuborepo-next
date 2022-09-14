/// <reference types="vitest-axe/extend-expect" />
/// <reference types="vitest-dom/extend-expect" />

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MonthCalendar } from "../MonthCalendar";
import { add, eachDayOfInterval, endOfMonth, format } from "date-fns";

describe("<MonthCalendar />", () => {
  describe("WeekDay Header", () => {
    it.each([
      ["Su", "Sunday"],
      ["Mo", "Monday"],
      ["Tu", "Tuesday"],
      ["We", "Wednesday"],
      ["Th", "Thursday"],
      ["Fr", "Friday"],
      ["Sa", "Saturday"],
    ])("the day %s in the column headers", (name, abbr) => {
      render(
        <MonthCalendar>
          <MonthCalendar.ColumnHeader />
        </MonthCalendar>
      );

      const el = screen.getByRole("columnheader", { name });
      expect(el).toBeInTheDocument();
      expect(el).toHaveAttribute("abbr", abbr);
    });
  });

  describe("Date Grid", () => {
    //
    it("Identifies the table element as a grid widget.", () => {
      render(<MonthCalendar />);

      expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    describe("If focus on January 1970", () => {
      it("Should render days in month correctly", () => {
        const { container } = render(
          <MonthCalendar focus={new Date(0)}>
            <MonthCalendar.GridCell />
          </MonthCalendar>
        );

        eachDayOfInterval({
          start: new Date(0),
          end: endOfMonth(new Date(0)),
        }).forEach((day) =>
          expect(container).toHaveTextContent(RegExp(format(day, "dd")))
        );
      });

      it("the first day should Thursday", () => {
        render(
          <MonthCalendar focus={new Date(0)}>
            <MonthCalendar.GridCell />
          </MonthCalendar>
        );

        expect(screen.getAllByRole(/(grid)?cell/).at(4))
          //
          .toHaveTextContent("01");
      });

      it("If focus on January 1970 first, then change focus to February 1970", () => {
        const first = new Date(0);
        const { rerender } = render(
          <MonthCalendar focus={first}>
            <MonthCalendar.GridCell />
          </MonthCalendar>
        );
        expect(screen.getAllByRole(/(grid)?cell/).at(4))
          //
          .toHaveTextContent("01");

        const second = add(new Date(0), { months: 1 });
        rerender(
          <MonthCalendar focus={second}>
            <MonthCalendar.GridCell />
          </MonthCalendar>
        );
        expect(screen.getAllByRole(/(grid)?cell/).at(0))
          //
          .toHaveTextContent("01");
      });
    });

    describe("Makes the cell focusable, and implement Roving tabindex", () => {
      //
      describe("When the component container is loaded or created", () => {
        it("If focus is January 1970, should be focus on January 1970", () => {
          render(
            <MonthCalendar focus={new Date(0)}>
              <MonthCalendar.GridCell />
            </MonthCalendar>
          );

          expect(document.activeElement)
            //
            .toHaveTextContent("01");
        });

        it("Default focus on today", () => {
          render(
            <MonthCalendar>
              <MonthCalendar.GridCell />
            </MonthCalendar>
          );

          expect(document.activeElement)
            //
            .toHaveTextContent(RegExp(format(new Date(), "dd")));
        });

        it(`Set tabindex="0" on the element that will initially be included in the tab sequence`, () => {
          render(
            <MonthCalendar>
              <MonthCalendar.GridCell />
            </MonthCalendar>
          );

          expect(document.activeElement)
            //
            .toHaveAttribute("tabindex", "0");
        });

        it(`Set tabindex="-1" on all other focusable elements it contains.`, () => {
          Array.from(
            render(<MonthCalendar />).container.querySelectorAll(`[tabindex]`)
          )
            .filter((el) => el !== document.activeElement)
            .forEach((el) => expect(el).toHaveAttribute("tabindex", "-1"));
        });
      });
    });
  });
});
