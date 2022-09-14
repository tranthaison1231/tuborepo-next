/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      setup(done: DoneFn): Chainable<void>;
    }
  }
}

import "@testing-library/cypress/add-commands";

type DoneFn = (window: Window) => void;
function setup(done: DoneFn) {
  cy.visit("./cypress/test.html");
  cy.window().then(done);
}

Cypress.Commands.add("setup", setup);
