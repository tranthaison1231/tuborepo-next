import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { add, endOfWeek, format, startOfWeek, sub } from "date-fns";
import { describe, expect, it } from "vitest";
import { Calendar } from "../Calendar";
import { MonthCalendar } from "../MonthCalendar";
import { axe } from "vitest-axe";

describe("Integration: Calendar with MonthCalendar", () => {
  const setup = () => {
    userEvent.setup();
    const { container } = render(
      <Calendar value={new Date(0)}>
        <Calendar.Header>
          <Calendar.Button action="previous year">{"<<"}</Calendar.Button>
          <Calendar.Button action="previous month">{"<"}</Calendar.Button>

          <Calendar.Title />

          <Calendar.Button action="next month">{">"}</Calendar.Button>
          <Calendar.Button action="next year">{">>"}</Calendar.Button>
        </Calendar.Header>

        <MonthCalendar>
          <MonthCalendar.ColumnHeader />

          <MonthCalendar.GridCell />
        </MonthCalendar>
      </Calendar>
    );

    return () => axe(container);
  };

  it("when click previous/next month, should change the month and year displayed in the calendar", async () => {
    const axe = setup();

    const nextMonth = screen.getByRole("button", { name: /next month/ });
    const prevMonth = screen.getByRole("button", { name: /previous month/ });
    const nextYear = screen.getByRole("button", { name: /next year/ });
    const prevYear = screen.getByRole("button", { name: /previous year/ });

    expect(screen.getAllByRole(/(grid)?cell/).at(4)).toHaveTextContent("01");
    expect(screen.getAllByRole(/(grid)?cell/).at(-1)).toHaveTextContent("31");
    expect(screen.getByRole("heading")).toHaveTextContent("January 1970");
    expect(await axe()).toHaveNoViolations();

    await userEvent.click(nextMonth);
    expect(screen.getAllByRole(/(grid)?cell/).at(0)).toHaveTextContent("01");
    expect(screen.getAllByRole(/(grid)?cell/).at(-1)).toHaveTextContent("28");
    expect(screen.getByRole("heading")).toHaveTextContent("February 1970");
    expect(await axe()).toHaveNoViolations();

    await userEvent.click(prevMonth);
    expect(screen.getAllByRole(/(grid)?cell/).at(4)).toHaveTextContent("01");
    expect(screen.getAllByRole(/(grid)?cell/).at(-1)).toHaveTextContent("31");
    expect(screen.getByRole("heading")).toHaveTextContent("January 1970");
    expect(await axe()).toHaveNoViolations();

    await userEvent.click(nextYear);
    expect(screen.getAllByRole(/(grid)?cell/).at(5)).toHaveTextContent("01");
    expect(screen.getAllByRole(/(grid)?cell/).at(-1)).toHaveTextContent("31");
    expect(screen.getByRole("heading")).toHaveTextContent("January 1971");
    expect(await axe()).toHaveNoViolations();

    await userEvent.click(prevYear);
    expect(screen.getAllByRole(/(grid)?cell/).at(4)).toHaveTextContent("01");
    expect(screen.getAllByRole(/(grid)?cell/).at(-1)).toHaveTextContent("31");
    expect(screen.getByRole("heading")).toHaveTextContent("January 1970");
    expect(await axe()).toHaveNoViolations();
  });

  it("user can change month/year using keyboard", async () => {
    const axe = setup();

    await userEvent.keyboard("{PageDown}");
    expect(screen.getByRole("heading")).toHaveTextContent("February 1970");
    expect(await axe()).toHaveNoViolations();

    await userEvent.keyboard("{PageUp}");
    expect(screen.getByRole("heading")).toHaveTextContent("January 1970");
    expect(await axe()).toHaveNoViolations();

    await userEvent.keyboard("{Shift>}{PageDown}{/Shift}");
    expect(screen.getByRole("heading")).toHaveTextContent("January 1971");
    expect(await axe()).toHaveNoViolations();

    await userEvent.keyboard("{Shift>}{PageUp}{/Shift}");
    expect(screen.getByRole("heading")).toHaveTextContent("January 1970");
    expect(await axe()).toHaveNoViolations();
  });

  it(
    "Sets focus on the same day of the same week." +
      "If that day does not exist, then moves focus to the same day of the previous or next week.",
    async () => {
      const axe = setup();

      let index = screen
        .getAllByRole(/(grid)?cell/)
        .findIndex((el) => el === document.activeElement);
      expect(index % 7).toBe(4);
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("{PageDown}");
      index = screen
        .getAllByRole(/(grid)?cell/)
        .findIndex((el) => el === document.activeElement);
      expect(index % 7).toBe(0);
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("{PageUp}");
      index = screen
        .getAllByRole(/(grid)?cell/)
        .findIndex((el) => el === document.activeElement);
      expect(index % 7).toBe(4);
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("{Shift>}{PageDown}{/Shift}");
      index = screen
        .getAllByRole(/(grid)?cell/)
        .findIndex((el) => el === document.activeElement);
      expect(index % 7).toBe(5);
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("{Shift>}{PageUp}{/Shift}");
      index = screen
        .getAllByRole(/(grid)?cell/)
        .findIndex((el) => el === document.activeElement);
      expect(index % 7).toBe(4);
      expect(await axe()).toHaveNoViolations();
    }
  );

  describe("When the component contains focus and the user presses a navigation key", () => {
    it(`set tabindex="-1" on the element that has tabindex="0"`, async () => {
      const axe = setup();

      const element = screen.getByText("01");
      expect(element).toHaveAttribute("tabindex", "0");
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("[ArrowDown]");
      expect(element).toHaveAttribute("tabindex", "-1");
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("[ArrowUp]");
      expect(element).toHaveAttribute("tabindex", "0");
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("[ArrowLeft]");
      expect(element).toHaveAttribute("tabindex", "-1");
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("[ArrowRight]");
      expect(element).toHaveAttribute("tabindex", "0");
      expect(await axe()).toHaveNoViolations();
    });

    it(`set tabindex="0" on the element that will become focused`, async () => {
      const axe = setup();

      let current = new Date(0);
      const getByText = screen.getByText;
      expect(getByText(format(current, "dd")))
        //
        .toHaveAttribute("tabindex", "0");
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("[ArrowDown]");
      current = add(current, { weeks: 1 });
      expect(getByText(format(current, "dd")))
        //
        .toHaveAttribute("tabindex", "0");
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("[ArrowUp]");
      current = sub(current, { weeks: 1 });
      expect(getByText(format(current, "dd")))
        //
        .toHaveAttribute("tabindex", "0");
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("[ArrowLeft]");
      current = sub(current, { days: 1 });
      expect(getByText(format(current, "dd")))
        //
        .toHaveAttribute("tabindex", "0");
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("[ArrowRight]");
      current = add(current, { days: 1 });
      expect(getByText(format(current, "dd")))
        //
        .toHaveAttribute("tabindex", "0");
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("[Home]");
      current = startOfWeek(current);
      expect(getByText(format(current, "dd")))
        //
        .toHaveAttribute("tabindex", "0");
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("[End]");
      current = endOfWeek(current);
      expect(getByText(format(current, "dd")))
        //
        .toHaveAttribute("tabindex", "0");
      expect(await axe()).toHaveNoViolations();
    });

    it(`Set focus, element.focus(), on the element that has tabindex="0"`, async () => {
      const axe = setup();

      let current = new Date(0);
      const getByText = screen.getByText;
      expect(getByText(format(current, "dd"))).toHaveFocus();
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("[ArrowDown]");
      current = add(current, { weeks: 1 });
      expect(getByText(format(current, "dd"))).toHaveFocus();
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("[ArrowUp]");
      current = sub(current, { weeks: 1 });
      expect(getByText(format(current, "dd"))).toHaveFocus();
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("[ArrowLeft]");
      current = sub(current, { days: 1 });
      expect(getByText(format(current, "dd"))).toHaveFocus();
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("[ArrowRight]");
      current = add(current, { days: 1 });
      expect(getByText(format(current, "dd"))).toHaveFocus();
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("[Home]");
      current = startOfWeek(current);
      expect(getByText(format(current, "dd"))).toHaveFocus();
      expect(await axe()).toHaveNoViolations();

      await userEvent.keyboard("[End]");
      current = endOfWeek(current);
      expect(getByText(format(current, "dd"))).toHaveFocus();
      expect(await axe()).toHaveNoViolations();
    });
  });
});
