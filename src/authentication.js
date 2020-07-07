import createAuth0Client from "@auth0/auth0-spa-js";
import { auth0_domain, auth0_client_id } from "./config";

const loginButton = document.querySelector('[data-button="login"]');
const logoutButton = document.querySelector('[data-button="logout"]');
const userPlaceholder = document.querySelector('[data-placeholder="user"]');

let auth0;
export let token;
export let isAuthenticated;
export let user;

const init = async() => {
    auth0 = await createAuth0Client({
        domain: auth0_domain,
        client_id: auth0_client_id,
        cacheLocation: "localstorage",
    });
};

export const login = async() => {
    if (auth0) {
        await auth0.loginWithRedirect({
            redirect_uri: "http://localhost:8080",
        });
    }
};

export const logout = async() => {
    if (auth0) {
        await auth0.logout({
            returnTo: window.location.origin,
        });
    }
};

window.onload = async() => {
    await init();

    isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
        user = await auth0.getUser();
        userPlaceholder.innerHTML = user.email;
        loginButton.setAttribute("hidden", true);
        return window.history.replaceState({},
            document.title,
            window.location.pathname
        );
    }
    logoutButton.setAttribute("hidden", true);

    const query = window.location.search;
    const shouldParseResult = query.includes("code=") && query.includes("state=");

    if (shouldParseResult) {
        try {
            token = await auth0.handleRedirectCallback();
        } catch (err) {
            console.log("Error parsing redirect:", err);
        }

        window.history.replaceState({}, document.title, "/");
    }
};

export default auth0;