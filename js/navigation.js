
/* =========================================================
   NIT NAGALAND CONFERENCE 2027
   NAVIGATION CONTROLLER
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  function initialiseNavigation() {

    const mainNav = document.querySelector(".main-nav");
    const mobileButton = document.querySelector(
      "[data-mobile-menu-toggle]"
    );

    if (!mainNav) {
      console.warn("Main navigation was not found.");
      return;
    }

    const dropdownButtons = mainNav.querySelectorAll(
      "[data-menu-toggle]"
    );

    const dropdownParents = mainNav.querySelectorAll(
      ".has-dropdown"
    );

    // ---------- CLOSE ONE DROPDOWN ----------

    function closeDropdown(parent) {
      if (!parent) return;

      parent.classList.remove("is-open");

      const button = parent.querySelector("[data-menu-toggle]");

      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    }

    // ---------- CLOSE ALL DROPDOWNS ----------

    function closeAllDropdowns(exceptParent = null) {
      dropdownParents.forEach((parent) => {
        if (parent === exceptParent) return;

        closeDropdown(parent);
      });
    }

    // ---------- OPEN ONE DROPDOWN ----------

    function openDropdown(parent) {
      if (!parent) return;

      closeAllDropdowns(parent);

      parent.classList.add("is-open");

      const button = parent.querySelector("[data-menu-toggle]");

      if (button) {
        button.setAttribute("aria-expanded", "true");
      }
    }

    // ---------- TOGGLE DROPDOWN ----------

    function toggleDropdown(parent) {
      if (!parent) return;

      const isOpen = parent.classList.contains("is-open");

      if (isOpen) {
        closeDropdown(parent);
      } else {
        openDropdown(parent);
      }
    }

    // ---------- MOBILE MENU ----------

    function closeMobileMenu() {
      mainNav.classList.remove("is-open");

      if (mobileButton) {
        mobileButton.setAttribute("aria-expanded", "false");
        mobileButton.setAttribute(
          "aria-label",
          "Open navigation menu"
        );
      }

      closeAllDropdowns();
    }

    if (mobileButton) {
      mobileButton.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("is-open");

        mobileButton.setAttribute(
          "aria-expanded",
          String(isOpen)
        );

        mobileButton.setAttribute(
          "aria-label",
          isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
        );

        if (!isOpen) {
          closeAllDropdowns();
        }
      });
    }

    // ---------- DESKTOP HOVER ----------

    dropdownParents.forEach((parent) => {

      parent.addEventListener("mouseenter", () => {
        if (window.innerWidth > 850) {
          openDropdown(parent);
        }
      });

      parent.addEventListener("mouseleave", () => {
        if (window.innerWidth > 850) {
          closeDropdown(parent);
        }
      });

    });

    // ---------- CLICK ON DROPDOWN BUTTON ----------

    dropdownButtons.forEach((button) => {

      button.addEventListener("click", (event) => {
        event.preventDefault();

        const parent = button.closest(".has-dropdown");

        if (parent) {
          toggleDropdown(parent);
        }

      });

    });

    // ---------- CLICK OUTSIDE NAVIGATION ----------

    document.addEventListener("click", (event) => {

      if (!mainNav.contains(event.target)) {
        closeAllDropdowns();
        closeMobileMenu();
      }

    });

    // ---------- CLICK ON A NAVIGATION LINK ----------

    mainNav.addEventListener("click", (event) => {

      const link = event.target.closest("a");

      if (!link) return;

      closeAllDropdowns();
      closeMobileMenu();

    });

    // ---------- ESCAPE KEY ----------

    document.addEventListener("keydown", (event) => {

      if (event.key === "Escape") {
        closeAllDropdowns();
        closeMobileMenu();

        if (mobileButton) {
          mobileButton.focus();
        }
      }

    });

    // ---------- RESPONSIVE RESIZE ----------

    window.addEventListener("resize", () => {

      if (window.innerWidth > 850) {
        closeMobileMenu();
        closeAllDropdowns();
      }

    });

    // ---------- INITIAL STATE ----------


// ---------- STICKY NAVIGATION ON SCROLL ----------

const headerTop = document.querySelector(".header-top");

// Create a spacer to preserve the original layout.
const navSpacer = document.createElement("div");
navSpacer.className = "main-nav-spacer";

mainNav.parentNode.insertBefore(navSpacer, mainNav);

let stickyNavHeight = 0;

function updateStickyNavigation() {

  if (!headerTop) return;

  const headerBottom = headerTop.getBoundingClientRect().bottom;

  if (headerBottom <= 0) {

    // Measure navigation before fixing it.
    stickyNavHeight = mainNav.offsetHeight;

    navSpacer.style.height = `${stickyNavHeight}px`;
    navSpacer.classList.add("is-active");

    mainNav.classList.add("is-fixed");

  } else {

    // Return navigation to its original position.
    mainNav.classList.remove("is-fixed");

    navSpacer.classList.remove("is-active");
    navSpacer.style.height = "0px";

  }
}

// Listen for scrolling.
window.addEventListener(
  "scroll",
  updateStickyNavigation,
  { passive: true }
);

// Recalculate after resizing.
window.addEventListener("resize", updateStickyNavigation);

// Set the correct initial state.
updateStickyNavigation();


    closeAllDropdowns();

    if (mobileButton) {
      mobileButton.setAttribute("aria-expanded", "false");
    }

    console.log("Conference navigation initialised.");

  }

  // Wait until components.js has inserted the shared header.
  document.addEventListener(
    "partials:loaded",
    initialiseNavigation,
    { once: true }
  );

});
