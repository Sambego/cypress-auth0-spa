import Navigo from "navigo";
import { isAuthenticated } from "./authentication";

const router = new Navigo();
const setContent = (content) => {
    const allContent = document.querySelectorAll("[data-content]");
    const visibleContent = document.querySelectorAll(
        `[data-content="${content}"]`
    );

    allContent.forEach((c) => c.setAttribute("hidden", true));
    visibleContent.forEach((c) => c.removeAttribute("hidden"));
};

const setPrivateContent = (content) => {
    if (isAuthenticated) {
        return setContent(content);
    }
    return window.history.back();
};
export const navigate = (e) => {
    e.preventDefault();
    router.navigate(e.target.dataset.href);
};

router
    .on({
        public: () => {
            setContent("public");
        },
        private: () => {
            setPrivateContent("private");
        },
        "*": () => {
            setContent("home");
        },
    })
    .resolve();

document
    .querySelectorAll("[data-href]")
    .forEach((link) => link.addEventListener("click", navigate));

export default router;