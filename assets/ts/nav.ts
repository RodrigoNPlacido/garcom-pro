// Imports
import { mainElements } from "./main.js"
import { orderElements } from "./order.js"


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

  if (!orderElements.order) {
    console.warn("Order not exists.");
    return;
  }

  const height = mainElements.main?.clientHeight;

  if (typeof height === "undefined") {
    console.warn("height dont is a number");
    return;
  }

  (orderElements.order as HTMLElement).style.marginTop = `${-height * Number(id)}px`;
}


// Events
function navEvents() {
  if (!navElements.navbarItems) {console.warn("Erro"); return;}
  navElements.navbarItems.forEach(navbarItem => {
    navbarItem.addEventListener("click", function() {
      mainScroll(navbarItem);
    });
  });
}


// Main
navEvents();