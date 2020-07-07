describe("Auth0 cypress command test", () => {
    it("Navigates trough the website", () => {
        // Go to the homepage
        cy.visit("http://localhost:8080").then(() => {
            // Should be able to navigate to a public page
            cy.contains("Public").click();
            cy.contains("Public content");
            cy.url().should("eq", "http://localhost:8080/public");

            // Should NOT be able to navigate to a private route
            cy.contains("Private").click();
            cy.get('[data-content="private"]').should("not.visible");
            cy.url().should("eq", "http://localhost:8080/public");

            // Should redirect to the Auth0 login page,
            // and successfully fill in the login form
            cy.loginWithAuth0(Cypress.env("username"), Cypress.env("password"));
            cy.contains(Cypress.env("username"));

            // Should've returned to the homepage after a successful login
            cy.url().should("eq", "http://localhost:8080/");

            // Should be able to navigate to a private route
            cy.contains("Private").click();
            cy.contains("Private content");
            cy.url().should("eq", "http://localhost:8080/private");

            // Should logout
            cy.visit("http://localhost:8080"); // My demo app's router doesn't work properly refreshing a route doesn't work :D
            cy.logout();
        });
    });
});