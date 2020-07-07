describe("Authentication test", () => {
    it("Visits the homepage", () => {
        cy.visit("http://localhost:8080");
        cy.contains("Home");

        // Log out if already logged in
        cy.wait(500);
        cy.contains("Logout").click();

        // Navigate to the home page
        cy.contains("Cypress demo").click();
        cy.url().should("eq", "http://localhost:8080/");
    });

    it("Should be able to navigate to a public route", () => {
        cy.contains("Public").click();
        cy.contains("Public content");
        cy.url().should("eq", "http://localhost:8080/public");
    });

    it("Should not be able to navigate to a private route", () => {
        cy.contains("Private").click();
        // Should not have navigated
        cy.get('[data-content="private"]').should("not.visible");
        cy.url().should("eq", "http://localhost:8080/public");
    });

    it("Should redirect to Auth0", () => {
        cy.contains("Login").click();
        cy.wait(2000);
        cy.url().should("include", "sambego.eu.auth0.com");
    });

    it("Should fill in login form", () => {
        // Enter user detail
        cy.get('[name="email"].auth0-lock-input')
            .clear()
            .type(Cypress.env("username"));
        cy.get('[name="password"].auth0-lock-input')
            .clear()
            .type(Cypress.env("password"));
        cy.get(".auth0-lock-submit").click();

        // If OAuth consent screen, allow
        cy.get("body").then(($body) => {
            if ($body.find("#allow").length) {
                cy.get("#allow").click();
            }
        });
        cy.wait(2000);
    });

    it("Should return to the homepage and display email", () => {
        cy.url().should("eq", "http://localhost:8080/");
        cy.get(`[data-placeholder="user"]`).contains(Cypress.env("username"));
    });

    it("Should be able to navigate to a private route", () => {
        cy.contains("Private").click();
        cy.contains("Private content");
        cy.url().should("eq", "http://localhost:8080/private");
    });
});