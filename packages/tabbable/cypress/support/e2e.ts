// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')
import { getByTestId, getByText } from "@testing-library/dom";

let document: Document;

before(() => {
  cy.setup((window) => {
    document = window.document;
  });
});

export const screen = {
  getByTestId: (id: string) => getByTestId(document.body, id),
  getByText: (text: string) => getByText(document.body, text),
  getById: (id: string) => document.getElementById(id)!,
};

export function render(element: string) {
  const container = document.createElement("div");

  container.innerHTML = element;

  document.body.append(container);

  return container;
}

function clean() {
  document.body.innerHTML = "";
}
beforeEach(clean);
