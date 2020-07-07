// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import createAuth0Client from "@auth0/auth0-spa-js";

const debug = (message) =>
    Cypress.log({
        name: "loginByAuth0",
        displayName: "Login with Auth0",
        message: [`: ${message}`],
    });

const createLoginUrl = async(username) => {
    debug(`🔒 Login as ${username}`);
    const auth0 = await createAuth0Client({
        cacheLocation: "localstorage",
        ...Cypress.env("auth0_config"),
    });
    const url = await auth0.buildAuthorizeUrl();
    debug(`🔗 The login url is ${url}`);
    return url;
};

const logout = async() => {
    debug(`🔒 Logging out`);
    const auth0 = await createAuth0Client({
        cacheLocation: "localstorage",
        ...Cypress.env("auth0_config"),
    });
    return auth0.logout();
};

Cypress.Commands.add("createLoginUrl", (username) => {
    return createLoginUrl(username);
});

Cypress.Commands.add("enterUserCredentials", (username, password) => {
    cy.wait(500);
    cy.get("body").then(($body) => {
        if ($body.find(".auth0-lock-last-login-pane").length > 0) {
            // Use the saved credentials to re-authenticate
            cy.get('.auth0-lock-last-login-pane a[type="button"]').click();
        } else {
            // Fill in login form
            cy.get('[name="email"].auth0-lock-input').clear().type(username);
            cy.get('[name="password"].auth0-lock-input')
                .clear()
                .type(password, { log: false });
            cy.get(".auth0-lock-submit").click();
        }

        // If OAuth consent screen, allow
        if ($body.find("#allow").length > 0) {
            cy.get("#allow").click();
        }
    });
});

Cypress.Commands.add("loginWithAuth0", (username, password) => {
    cy.createLoginUrl(username).then((url) => {
        cy.window().then((window) => {
            // cy.visit() doesn't work 🤷‍♂️
            window.location.assign(url);
            cy.enterUserCredentials(username, password);
        });
    });
});

Cypress.Commands.add("logout", () => {
    logout();
    cy.reload();
});