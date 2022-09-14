import { isTabbable } from "../../index";
import { render, screen } from "../support/e2e";

describe("isTabbable", () => {
  describe("follow should be true", () => {
    it("`button`", () => {
      render(`<button data-testid="test">Click</button>`);
      expect(isTabbable(screen.getByTestId("test"))).to.eq(true);
    });

    it("`input`", () => {
      render(`<input data-testid="test" />`);
      expect(isTabbable(screen.getByTestId("test"))).to.eq(true);
    });

    it("`select`", () => {
      render(`<select data-testid="test"></select>`);
      expect(isTabbable(screen.getByTestId("test"))).to.eq(true);
    });

    it("`textarea`", () => {
      render(`<textarea data-testid="test"></textarea>`);
      expect(isTabbable(screen.getByTestId("test"))).to.eq(true);
    });

    it("`a` with href", () => {
      render(`<a href="https://google.com" data-testid="test">Link</a>`);
      expect(isTabbable(screen.getByTestId("test"))).to.eq(true);
    });

    it("`audio` with controls", () => {
      render(`<audio data-testid="test" controls></audio>`);
      expect(isTabbable(screen.getByTestId("test"))).to.eq(true);
    });

    it("`video` with controls", () => {
      render(`<video data-testid="test" controls></video>`);
      expect(isTabbable(screen.getByTestId("test"))).to.eq(true);
    });

    it("the first `summary` in `details`", () => {
      render(`
        <details data-testid="test">
          <summary>summary 1</summary>
          <summary>summary 2</summary>
        </details>
      `);
      expect(isTabbable(screen.getByTestId("test"))).to.eq(false);
      expect(isTabbable(screen.getByText("summary 1"))).to.eq(true);
      expect(isTabbable(screen.getByText("summary 2"))).to.eq(false);
    });

    it("`details` without any `summary`", () => {
      render(`
        <details data-testid="test">
        </details>
      `);
      expect(isTabbable(screen.getByTestId("test"))).to.eq(true);
    });

    it("element with `contenteditable`", () => {
      render(`
        <div contenteditable="true">contenteditable div</div>
        <p contenteditable="true">contenteditable paragraph</p>
        <div contenteditable="true" tabindex="-1">contenteditable div focusable but not tabbable</div>
        <div contenteditable="true" tabindex="NaN">contenteditable div focusable and tabbable</div>
      `);
      expect(isTabbable(screen.getByText("contenteditable div"))).to.eq(true);
      expect(isTabbable(screen.getByText("contenteditable paragraph"))).to.eq(
        true
      );
      expect(
        isTabbable(
          screen.getByText("contenteditable div focusable but not tabbable")
        )
      ).to.eq(false);
      expect(
        isTabbable(
          screen.getByText("contenteditable div focusable and tabbable")
        )
      ).to.eq(true);
    });

    it("element with non-negative `tabindex`", () => {
      render(`
        <p tabIndex="2">Focusable paragraph</p>
        <div tabIndex="1">Focusable div</div>
        <span tabIndex="0">Focusable span</span>
      `);
      expect(isTabbable(screen.getByText("Focusable paragraph"))).to.eq(true);
      expect(isTabbable(screen.getByText("Focusable div"))).to.eq(true);
      expect(isTabbable(screen.getByText("Focusable span"))).to.eq(true);
    });
  });

  describe("follow should be false", () => {
    it("element generally not tabbable", () => {
      render(`
        <p>paragraph</p>
        <div>div</div>
        <span>span</span>
      `);
      expect(isTabbable(screen.getByText("paragraph"))).to.eq(false);
      expect(isTabbable(screen.getByText("div"))).to.eq(false);
      expect(isTabbable(screen.getByText("span"))).to.eq(false);
    });

    it("`a` without `href`", () => {
      render(`<a>Not focusable</a>`);
      expect(isTabbable(screen.getByText("Not focusable"))).to.eq(false);
    });

    it("`audio` without `controls`", () => {
      render(`<audio data-testid="test"></audio>`);
      expect(isTabbable(screen.getByTestId("test"))).to.eq(false);
    });

    it("`video` without `controls`", () => {
      render(`<video data-testid="test"></video>`);
      expect(isTabbable(screen.getByTestId("test"))).to.eq(false);
    });

    it("`summary` but not in `details`", () => {
      render(`<summary data-testid="test"></summary>`);
      expect(isTabbable(screen.getByTestId("test"))).to.eq(false);
    });

    it('element with `contenteditable="false"`', () => {
      render(`
        <div contenteditable="false">contenteditable div</div>
        <p contenteditable="false">contenteditable paragraph</p>
      `);
      expect(isTabbable(screen.getByText("contenteditable div"))).to.eq(false);
      expect(isTabbable(screen.getByText("contenteditable paragraph"))).to.eq(
        false
      );
    });

    it("element with negative `tabindex`", () => {
      render(`<input tabindex="-1" data-testid="test" />`);
      expect(isTabbable(screen.getByTestId("test"))).to.eq(false);
    });

    it("element with `disabled`", () => {
      render(`
        <input disabled="true" data-testid="test" />
        <button disabled="true">Click me</button>
      `);
      expect(isTabbable(screen.getByTestId("test"))).to.eq(false);
      expect(isTabbable(screen.getByText("Click me"))).to.eq(false);
    });

    it("element with `display: none`", () => {
      render(`<input style="display: none;" data-testid="test" />`);
      expect(isTabbable(screen.getByTestId("test"))).to.eq(false);
    });

    it("element with `visibility: hidden`", () => {
      render(`<input style="visibility: hidden;" data-testid="test" />`);
      expect(isTabbable(screen.getByTestId("test"))).to.eq(false);
    });

    it("element's ancestor has `display: none`", () => {
      render(`
        <div style="display: none;">
          <input data-testid="input" />
        </div>
      `);
      expect(isTabbable(screen.getByTestId("input"))).to.eq(false);
    });

    it("element's ancestor has `visibility: hidden`", () => {
      render(`
        <div style="visibility: hidden;">
          <input data-testid="input" />
        </div>
      `);
      expect(isTabbable(screen.getByTestId("input"))).to.eq(false);
    });

    it("non `summary` element in a closed `details`", () => {
      render(`
        <details data-testid="close">
          <input data-testid="close-input" />
        </details>
        <details open data-testid="open">
          <input data-testid="open-input" />
        </details>
      `);
      expect(isTabbable(screen.getByTestId("close"))).to.eq(true);
      expect(isTabbable(screen.getByTestId("close-input"))).to.eq(false);
      expect(isTabbable(screen.getByTestId("open"))).to.eq(true);
      expect(isTabbable(screen.getByTestId("open-input"))).to.eq(true);
    });

    it("radio `input` but a different radio in the group is checked", () => {
      render(`
        <form>
          <fieldset>
            <legend>form 1 groupA - initial checked</legend>
            <input type="radio" name="groupA" checked value="a" data-testid="radioA" />
            <input type="radio" name="groupA" value="b" data-testid="radioB" />
          </fieldset>
        </form>
      `);
      expect(isTabbable(screen.getByTestId("radioA"))).to.eq(true);
      expect(isTabbable(screen.getByTestId("radioB"))).to.eq(false);
    });

    it("form element inside a disabled fieldset", () => {
      cy.fixture("fieldset.html")
        .then(render)
        .then(() => {
          expect(
            isTabbable(screen.getById("fieldset-disabled-legend2-button"))
          ).to.eq(false);
          expect(
            isTabbable(screen.getById("fieldset-disabled-legend2-input"))
          ).to.eq(false);
          expect(
            isTabbable(screen.getById("fieldset-disabled-legend2-select"))
          ).to.eq(false);
          expect(
            isTabbable(screen.getById("fieldset-disabled-legend2-textarea"))
          ).to.eq(false);

          expect(isTabbable(screen.getById("fieldset-disabled-button"))).to.eq(
            false
          );
          expect(isTabbable(screen.getById("fieldset-disabled-input"))).to.eq(
            false
          );
          expect(isTabbable(screen.getById("fieldset-disabled-select"))).to.eq(
            false
          );
          expect(
            isTabbable(screen.getById("fieldset-disabled-textarea"))
          ).to.eq(false);

          expect(
            isTabbable(
              screen.getById("fieldset-disabled-fieldset-enabled-legend-button")
            )
          ).to.eq(false);
          expect(
            isTabbable(
              screen.getById("fieldset-disabled-fieldset-enabled-input")
            )
          ).to.eq(false);

          expect(
            isTabbable(
              screen.getById("fieldset-disabled-fieldset-enabled-legend-button")
            )
          ).to.eq(false);
          expect(
            isTabbable(
              screen.getById("fieldset-disabled-fieldset-enabled-input")
            )
          ).to.eq(false);

          expect(isTabbable(screen.getById("fieldset-disabled-anchor"))).to.eq(
            true
          );
        });
    });
  });
});
