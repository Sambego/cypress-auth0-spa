import router from "./router";
import { login, logout, user } from "./authentication";

const loginButton = document.querySelector('[data-button="login"]');
const logoutButton = document.querySelector('[data-button="logout"]');

loginButton.addEventListener("click", login);
logoutButton.addEventListener("click", logout);