// Imports
import { mainElements } from "./main.js"


// Type
type NavbarItem = Element & { getAttribute(attribute: string): string | null };


// Const
const navElements = {
  navbarItems: document.querySelectorAll<HTMLElement>(".navbar-item")
};


// Functions
function mainScroll(element: NavbarItem): void {
  const id = element.getAttribute("data-id");

  if (!id) {
    console.warn("Element dont have 'data-id'");
    return;
  }

  if (!mainElements.main) {
    console.warn("main not exists.");
    return;
  }

  if (!mainElements.main_item__first) {
    console.warn("main not exists.");
    return;
  }

  const height = mainElements.main?.clientHeight;

  if (typeof height === "undefined") {
    console.warn("height dont is a number");
    return;
  }

  mainElements.main_item__first.style.marginTop = `${-height * Number(id)}px`;
}


// Events
function navEvents() {
  navElements.navbarItems.forEach(navbarItem => {
    navbarItem.addEventListener("click", function() {
      mainScroll(navbarItem);
    });
  });
}


// Main
navEvents();