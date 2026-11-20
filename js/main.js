
/* =========================================================
   NIT NAGALAND CONFERENCE 2027
   MAIN JAVASCRIPT
   ========================================================= */

"use strict";


/* ---------------------------------------------------------
   01. DOM READY
--------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  initialiseSmoothScrolling();
  initialiseBackToTop();
  initialiseExternalLinks();
  initialiseLazyLoading();
  initialiseActivePageLinks();
  initialiseScrollAnimations();

});


/* ---------------------------------------------------------
   02. SMOOTH SCROLLING
--------------------------------------------------------- */

function initialiseSmoothScrolling() {

  const anchorLinks = document.querySelectorAll(
    'a[href^="#"]'
  );

  anchorLinks.forEach(link => {

    link.addEventListener("click", event => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "instant" : "smooth",
        block: "start"
      });

    });

  });

}


/* ---------------------------------------------------------
   03. BACK TO TOP
--------------------------------------------------------- */

function initialiseBackToTop() {

  const backToTopLinks = document.querySelectorAll(
    ".footer-back-top"
  );

  backToTopLinks.forEach(link => {

    link.addEventListener("click", event => {

      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "instant" : "smooth"
      });

    });

  });

}


/* ---------------------------------------------------------
   04. EXTERNAL LINKS
--------------------------------------------------------- */

function initialiseExternalLinks() {

  const externalLinks = document.querySelectorAll(
    'a[data-external="true"]'
  );

  externalLinks.forEach(link => {

    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");

  });

}


/* ---------------------------------------------------------
   05. IMAGE LAZY LOADING
--------------------------------------------------------- */

function initialiseLazyLoading() {

  const images = document.querySelectorAll(
    "img[data-lazy]"
  );

  images.forEach(image => {

    if (image.dataset.src) {

      image.src = image.dataset.src;

      image.removeAttribute("data-src");

      image.removeAttribute("data-lazy");

    }

  });

}


/* ---------------------------------------------------------
   06. ACTIVE PAGE NAVIGATION
--------------------------------------------------------- */

function initialiseActivePageLinks() {

  const currentPage = document.body.dataset.page;

  if (!currentPage) return;

  const navigationLinks = document.querySelectorAll(
    ".main-nav__link"
  );

  navigationLinks.forEach(link => {

    const href = link.getAttribute("href");

    if (!href) return;

    if (
      (currentPage === "home" && href === "/index.html") ||
      (currentPage !== "home" &&
        href.includes(currentPage))
    ) {

      link.classList.add("is-active");

      link.setAttribute("aria-current", "page");

    }

  });

}


/* ---------------------------------------------------------
   07. SCROLL REVEAL ANIMATIONS
--------------------------------------------------------- */

function initialiseScrollAnimations() {

  const animatedElements = document.querySelectorAll(
    ".section-heading, " +
    ".highlight-card, " +
    ".date-card, " +
    ".focused__placeholder, " +
    ".speakers__empty, " +
    ".about__content, " +
    ".institute__content"
  );

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("is-visible");

          observerInstance.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  animatedElements.forEach(element => {

    element.classList.add("reveal-on-scroll");

    observer.observe(element);

  });

}


/* ---------------------------------------------------------
   08. CONSOLE INFORMATION
--------------------------------------------------------- */

console.info(
  "NIT Nagaland Conference 2027 | Frontend initialised."
);

// New home code


/* =========================================================
   HOMEPAGE SPEAKER CAROUSEL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const carousels = document.querySelectorAll(
    "[data-speaker-carousel]"
  );

  carousels.forEach((carousel) => {

    const track = carousel.querySelector(
      "[data-speaker-track]"
    );

    const previousButton = carousel.querySelector(
      "[data-speaker-prev]"
    );

    const nextButton = carousel.querySelector(
      "[data-speaker-next]"
    );

    if (!track || !previousButton || !nextButton) {
      return;
    }

    // ---------- CALCULATE SCROLL DISTANCE ----------

    function getScrollDistance() {

      const firstCard = track.querySelector(".speaker-card");

      if (!firstCard) {
        return track.clientWidth;
      }

      const cardWidth = firstCard.getBoundingClientRect().width;

      const trackStyle = window.getComputedStyle(track);
      const gap = parseFloat(trackStyle.columnGap) || 0;

      return cardWidth + gap;
    }

    // ---------- UPDATE BUTTON STATES ----------

    function updateButtons() {

      const maximumScroll =
        track.scrollWidth - track.clientWidth;

      const currentScroll = track.scrollLeft;

      previousButton.disabled = currentScroll <= 2;

      nextButton.disabled =
        currentScroll >= maximumScroll - 2;

    }

    // ---------- PREVIOUS SPEAKERS ----------

    previousButton.addEventListener("click", () => {

      track.scrollBy({
        left: -getScrollDistance(),
        behavior: "smooth"
      });

    });

    // ---------- NEXT SPEAKERS ----------

    nextButton.addEventListener("click", () => {

      track.scrollBy({
        left: getScrollDistance(),
        behavior: "smooth"
      });

    });

    // ---------- TRACK SCROLL EVENT ----------

    track.addEventListener(
      "scroll",
      updateButtons,
      { passive: true }
    );

    // ---------- WINDOW RESIZE ----------

    window.addEventListener("resize", updateButtons);

    // ---------- INITIAL BUTTON STATE ----------

    updateButtons();

    // Recalculate after speaker images and layout load.
    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(updateButtons);
      observer.observe(track);
    }

  });

});


/* =========================================
   ABOUT CITY IMAGE SLIDER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const sliders = document.querySelectorAll("[data-city-slider]");

  sliders.forEach((slider) => {

    const slides = Array.from(
      slider.querySelectorAll(".about-city__slide")
    );

    const indicators = Array.from(
      slider.querySelectorAll("[data-city-indicators] button")
    );

    const previousButton = slider.querySelector("[data-city-prev]");
    const nextButton = slider.querySelector("[data-city-next]");

    if (!slides.length) return;

    let currentIndex = 0;
    let autoplay;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function showSlide(index) {

      currentIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === currentIndex);
      });

      indicators.forEach((indicator, i) => {
        indicator.classList.toggle("is-active", i === currentIndex);
        indicator.setAttribute(
          "aria-current",
          i === currentIndex ? "true" : "false"
        );
      });

    }

    function startAutoplay() {
      if (reducedMotion || slides.length < 2) return;

      clearInterval(autoplay);

      autoplay = setInterval(() => {
        showSlide(currentIndex + 1);
      }, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplay);
      startAutoplay();
    }

    previousButton?.addEventListener("click", () => {
      showSlide(currentIndex - 1);
      resetAutoplay();
    });

    nextButton?.addEventListener("click", () => {
      showSlide(currentIndex + 1);
      resetAutoplay();
    });

    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        showSlide(index);
        resetAutoplay();
      });
    });

    slider.addEventListener("mouseenter", () => {
      clearInterval(autoplay);
    });

    slider.addEventListener("mouseleave", startAutoplay);

    slider.addEventListener("focusin", () => {
      clearInterval(autoplay);
    });

    slider.addEventListener("focusout", startAutoplay);

    showSlide(0);
    startAutoplay();

  });

});


/* =========================================
   ABOUT INSTITUTE IMAGE SLIDER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const sliders = document.querySelectorAll("[data-institute-slider]");

  sliders.forEach((slider) => {

    const slides = Array.from(
      slider.querySelectorAll(".about-institute__slide")
    );

    const indicators = Array.from(
      slider.querySelectorAll("[data-institute-indicators] button")
    );

    const previousButton = slider.querySelector("[data-institute-prev]");
    const nextButton = slider.querySelector("[data-institute-next]");

    if (!slides.length) return;

    let currentIndex = 0;
    let autoplay;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function showSlide(index) {

      currentIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === currentIndex);
      });

      indicators.forEach((indicator, i) => {
        indicator.classList.toggle("is-active", i === currentIndex);

        indicator.setAttribute(
          "aria-current",
          i === currentIndex ? "true" : "false"
        );
      });

    }

    function startAutoplay() {

      if (reducedMotion || slides.length < 2) return;

      clearInterval(autoplay);

      autoplay = setInterval(() => {
        showSlide(currentIndex + 1);
      }, 5000);

    }

    function resetAutoplay() {
      clearInterval(autoplay);
      startAutoplay();
    }

    previousButton?.addEventListener("click", () => {
      showSlide(currentIndex - 1);
      resetAutoplay();
    });

    nextButton?.addEventListener("click", () => {
      showSlide(currentIndex + 1);
      resetAutoplay();
    });

    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        showSlide(index);
        resetAutoplay();
      });
    });

    slider.addEventListener("mouseenter", () => {
      clearInterval(autoplay);
    });

    slider.addEventListener("mouseleave", startAutoplay);

    slider.addEventListener("focusin", () => {
      clearInterval(autoplay);
    });

    slider.addEventListener("focusout", startAutoplay);

    showSlide(0);
    startAutoplay();

  });

});


