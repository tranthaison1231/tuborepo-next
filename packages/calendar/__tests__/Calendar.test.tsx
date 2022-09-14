import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Calendar } from "../Calendar";

describe("<Calendar />", () => {
  describe("calendar should render correctly", () => {
    it("should render button for change previous/next month/year", () => {
      render(
        <Calendar>
          <Calendar.Button action="previous year" />
          <Calendar.Button action="previous month" />
          <Calendar.Button action="next year" />
          <Calendar.Button action="next month" />
        </Calendar>
      );
      expect(screen.getByRole("button", { name: /previous year/ }));
      expect(screen.getByRole("button", { name: /previous month/ }));
      expect(screen.getByRole("button", { name: /next year/ }));
      expect(screen.getByRole("button", { name: /next month/ }));
    });

    it("calendar heading displaying the month and year is marked up as a live region", () => {
      render(
        <Calendar value={new Date(0)}>
          <Calendar.Title />
        </Calendar>
      );
      const element = screen.getByRole("heading");
      expect(element).toHaveTextContent("January 1970");
      expect(element).toHaveAttribute("aria-live", "polite");
    });
  });
});
