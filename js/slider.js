
/* =========================================================
   NIT NAGALAND CONFERENCE 2027
   HERO IMAGE SLIDER
   ========================================================= */

"use strict";


document.addEventListener("DOMContentLoaded", () => {

  initialiseHeroSlider();

});


/* ---------------------------------------------------------
   01. HERO SLIDER INITIALISATION
--------------------------------------------------------- */

function initialiseHeroSlider() {

  const slider = document.querySelector("[data-slider]");

  if (!slider) return;

  const slides = Array.from(
    slider.querySelectorAll("[data-slide]")
  );

  const previousButton = document.querySelector(
    "[data-slider-prev]"
  );

  const nextButton = document.querySelector(
    "[data-slider-next]"
  );

  const indicatorsContainer = document.querySelector(
    "[data-slider-indicators]"
  );

  if (slides.length === 0) return;


  /* Slider settings */

  const AUTO_PLAY_DELAY = 5500;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* Slider state */

  let currentIndex = 0;

  let autoPlayInterval = null;

  let isPaused = false;


  /* -------------------------------------------------------
     02. INDICATOR ELEMENTS
  ------------------------------------------------------- */

  let indicators = [];

  if (indicatorsContainer) {

    indicators = Array.from(
      indicatorsContainer.querySelectorAll(
        "[data-slide-to]"
      )
    );

  }


  /* -------------------------------------------------------
     03. DISPLAY SLIDE
  ------------------------------------------------------- */

  function showSlide(index) {

    if (index < 0) {
      index = slides.length - 1;
    }

    if (index >= slides.length) {
      index = 0;
    }

    currentIndex = index;


    /* Update slides */

    slides.forEach((slide, slideIndex) => {

      const isActive = slideIndex === currentIndex;

      slide.classList.toggle(
        "hero__slide--active",
        isActive
      );

      slide.setAttribute(
        "aria-hidden",
        String(!isActive)
      );

      /* Prevent keyboard focus on hidden slide links */

      slide.inert = !isActive;

    });


    /* Update indicators */

    indicators.forEach((indicator, indicatorIndex) => {

      const isActive = indicatorIndex === currentIndex;

      indicator.classList.toggle(
        "is-active",
        isActive
      );

      if (isActive) {

        indicator.setAttribute(
          "aria-current",
          "true"
        );

      } else {

        indicator.removeAttribute("aria-current");

      }

    });

  }


  /* -------------------------------------------------------
     04. NEXT AND PREVIOUS SLIDES
  ------------------------------------------------------- */

  function nextSlide() {

    showSlide(currentIndex + 1);

  }


  function previousSlide() {

    showSlide(currentIndex - 1);

  }


  /* -------------------------------------------------------
     05. AUTO PLAY
  ------------------------------------------------------- */

  function startAutoPlay() {

    if (reducedMotion) return;

    stopAutoPlay();

    if (isPaused || slides.length <= 1) return;

    autoPlayInterval = window.setInterval(() => {

      if (!document.hidden) {

        nextSlide();

      }

    }, AUTO_PLAY_DELAY);

  }


  function stopAutoPlay() {

    if (autoPlayInterval !== null) {

      window.clearInterval(autoPlayInterval);

      autoPlayInterval = null;

    }

  }


  /* -------------------------------------------------------
     06. PAUSE AND RESUME
  ------------------------------------------------------- */

  function pauseSlider() {

    isPaused = true;

    stopAutoPlay();

  }


  function resumeSlider() {

    isPaused = false;

    startAutoPlay();

  }


  /* -------------------------------------------------------
     07. BUTTON EVENTS
  ------------------------------------------------------- */

  if (nextButton) {

    nextButton.addEventListener("click", () => {

      nextSlide();

      if (!reducedMotion) {
        startAutoPlay();
      }

    });

  }


  if (previousButton) {

    previousButton.addEventListener("click", () => {

      previousSlide();

      if (!reducedMotion) {
        startAutoPlay();
      }

    });

  }


  /* -------------------------------------------------------
     08. INDICATOR EVENTS
  ------------------------------------------------------- */

  indicators.forEach(indicator => {

    indicator.addEventListener("click", () => {

      const targetIndex = Number(
        indicator.dataset.slideTo
      );

      if (
        Number.isInteger(targetIndex) &&
        targetIndex >= 0 &&
        targetIndex < slides.length
      ) {

        showSlide(targetIndex);

        if (!reducedMotion) {
          startAutoPlay();
        }

      }

    });

  });


  /* -------------------------------------------------------
     09. PAUSE WHEN HOVERING
  ------------------------------------------------------- */

  slider.addEventListener("mouseenter", pauseSlider);

  slider.addEventListener("mouseleave", resumeSlider);


  /* -------------------------------------------------------
     10. KEYBOARD NAVIGATION
  ------------------------------------------------------- */

  slider.addEventListener("keydown", event => {

    if (event.key === "ArrowRight") {

      event.preventDefault();

      nextSlide();

      if (!reducedMotion) {
        startAutoPlay();
      }

    }

    if (event.key === "ArrowLeft") {

      event.preventDefault();

      previousSlide();

      if (!reducedMotion) {
        startAutoPlay();
      }

    }

  });


  /* -------------------------------------------------------
     11. BROWSER TAB VISIBILITY
  ------------------------------------------------------- */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (document.hidden) {

        stopAutoPlay();

      } else {

        startAutoPlay();

      }

    }
  );


  /* -------------------------------------------------------
     12. TOUCH / SWIPE SUPPORT
  ------------------------------------------------------- */

  let touchStartX = 0;

  let touchEndX = 0;

  slider.addEventListener(
    "touchstart",
    event => {

      touchStartX = event.changedTouches[0].screenX;

    },
    { passive: true }
  );


  slider.addEventListener(
    "touchend",
    event => {

      touchEndX = event.changedTouches[0].screenX;

      const difference = touchStartX - touchEndX;

      if (Math.abs(difference) < 50) return;

      if (difference > 0) {

        nextSlide();

      } else {

        previousSlide();

      }

      if (!reducedMotion) {
        startAutoPlay();
      }

    },
    { passive: true }
  );


  /* -------------------------------------------------------
     13. INITIALISE
  ------------------------------------------------------- */

  showSlide(0);

  startAutoPlay();


  /* -------------------------------------------------------
     14. CLEANUP
  ------------------------------------------------------- */

  window.addEventListener("pagehide", stopAutoPlay);

}
