import { render } from "../support/e2e";
import { tabbable } from "../../index";

describe("tabbable", () => {
  describe('correctly identifies tabbable elements in the "basic" example', () => {
    it("container mounted", () => {
      cy.fixture("basic.html")
        .then(render)
        .then(([container]) => {
          expect(tabbable(container).map((el) => el.id)).to.eql([
            "tabindex-hrefless-anchor",
            "contenteditable-true",
            "contenteditable-nesting",
            "contenteditable-NaN-tabindex",
            "input",
            "input-readonly",
            "select",
            "select-readonly",
            "href-anchor",
            "textarea",
            "textarea-readonly",
            "button",
            "tabindex-div",
            "hiddenParentVisible-button",
            "displaycontents-child",
            "audio-control",
            "audio-control-NaN-tabindex",
            "video-control",
            "video-control-NaN-tabindex",
          ]);
        });
    });

    it("container unmount", () => {
      cy.fixture("basic.html")
        .then(render)
        .then(([container]) => {
          container.remove();

          expect(tabbable(container).map((el) => el.id)).to.eql([]);
        });
    });
  });

  describe('correctly identifies tabbable elements in the "nested" example', () => {
    it("container mount", () => {
      cy.fixture("nested.html")
        .then(render)
        .then(([container]) => {
          expect(tabbable(container).map((el) => el.id)).to.eql([
            "tabindex-div-2",
            "tabindex-div-0",
            "input",
          ]);
        });
    });
  });

  describe('correctly identifies tabbable elements in the "non-linear" example', () => {
    it("container mount", () => {
      cy.fixture("non-linear.html")
        .then(render)
        .then(([container]) => {
          expect(tabbable(container).map((el) => el.id)).to.eql([
            // 1
            "input-1",
            "href-anchor-1",
            // 2
            "button-2",
            // 3
            "select-3",
            "tabindex-div-3",
            // 4
            "tabindex-hrefless-anchor-4",
            //12
            "textarea-12",
            // 0
            "input",
            "select",
            "href-anchor",
            "textarea",
            "button",
            "tabindex-div-0",
          ]);
        });
    });
  });

  describe('correctly identifies tabbable elements in the "changing content" example', () => {
    it("container mount", () => {
      cy.fixture("changing-content.html")
        .then(render)
        .then(([container]) => {
          expect(tabbable(container).map((el) => el.id)).to.eql([
            "visible-button-1",
            "visible-button-2",
            "visible-button-3",
          ]);

          const element = container.querySelector("#initially-hidden");
          if (element instanceof HTMLElement) element.style.display = "block";

          expect(tabbable(container).map((el) => el.id)).to.eql([
            "visible-button-1",
            "visible-button-2",
            "visible-button-3",
            "initially-hidden-button-1",
            "initially-hidden-button-2",
          ]);
        });
    });
  });

  describe('correctly identifies tabbable elements in the "svg" example', () => {
    it("container mount", () => {
      cy.fixture("svg.html")
        .then(render)
        .then(([container]) => {
          expect(tabbable(container).map((el) => el.id)).to.eql([
            "svg-btn",
            "svg-1",
          ]);
        });
    });
  });

  describe('correctly identifies tabbable elements in the "radio" example', () => {
    it("container mount", () => {
      cy.fixture("radio.html")
        .then(render)
        .then(([container]) => {
          expect(tabbable(container).map((el) => el.id)).to.eql([
            "form1-radioA",
            "form2-radioA",
            "form2-radioB",
            "form3-radioA",
            "form3-radioB",
            "noform-radioA",
            "noform-groupB-radioA",
            "noform-groupB-radioB",
            "noform-groupC-radioA",
          ]);
        });
    });
  });

  describe('correctly identifies tabbable elements in the "details" example', () => {
    it("container mount", () => {
      cy.fixture("details.html")
        .then(render)
        .then(([container]) => {
          expect(tabbable(container).map((el) => el.id)).to.eql([
            "details-a-summary",
            "details-b-summary",
            "visible-input",
            "details-c",
          ]);
        });
    });
  });

  describe('correctly identifies tabbable elements in the "fieldset" example', () => {
    it("container mount", () => {
      cy.fixture("fieldset.html")
        .then(render)
        .then(([container]) => {
          expect(tabbable(container).map((el) => el.id)).to.eql([
            "free-enabled-button",
            "fieldset-enabled-legend-button",
            "fieldset-enabled-legend-input",
            "fieldset-enabled-legend-select",
            "fieldset-enabled-legend-textarea",
            "fieldset-enabled-button",
            "fieldset-enabled-input",
            "fieldset-enabled-select",
            "fieldset-enabled-textarea",
            "fieldset-enabled-fieldset-disabled-legend-button",
            "fieldset-enabled-anchor",
            "fieldset-disabled-legend1-button",
            "fieldset-disabled-legend1-input",
            "fieldset-disabled-legend1-select",
            "fieldset-disabled-legend1-textarea",
            "fieldset-disabled-anchor",
          ]);
        });
    });
  });
});
