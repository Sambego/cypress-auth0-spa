## Setup

- Add Auth0 credentials to [src/config.js](https://github.com/Sambego/cypress-auth0-spa/blob/master/src/config.js)
- Add Auth0 credentials to [cypress.json](https://github.com/Sambego/cypress-auth0-spa/blob/master/cypress.json)
- Run dev server with `npm run start`
- Run tests with `npm run test`

Optionally

- When changing things in the code, run `npm run dev` to recompile the code.

## Cypress task usage

```js
describe("Auth0 cypress command test", () => {
    it("Navigates trough the website", () => {
        // Go to the homepage
        cy.visit("http://localhost:8080").then(() => {
            cy.loginWithAuth0(Cypress.env("username"), Cypress.env("password"));

            ...

            cy.logout();
        });
    });
});
```

The Cypress command assumes the Auth0 credentials, a username and password are set in the `cypress.json` file.
