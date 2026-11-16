
/* =========================================================
   NIT NAGALAND CONFERENCE 2027
   COMPONENT LOADER
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  const partialElements = document.querySelectorAll("[data-partial]");

  if (!partialElements.length) {
    document.dispatchEvent(new Event("components:loaded"));
    return;
  }

  // Derive the project location from this script's URL.
  const scriptUrl = document.currentScript
    ? document.currentScript.src
    : new URL("../js/components.js", window.location.href).href;

  const componentBaseUrl = new URL("../components/", scriptUrl);

  const loadPartial = async (element) => {
    const partialName = element.dataset.partial;

    if (!partialName) return;

    const partialUrl = new URL(`${partialName}.html`, componentBaseUrl);

    try {
      const response = await fetch(partialUrl);

      if (!response.ok) {
        throw new Error(
          `Could not load ${partialName}.html: ${response.status}`
        );
      }

      const html = await response.text();
      element.innerHTML = html;
    } catch (error) {
      console.error("Component loading error:", error);

      element.innerHTML = `
        <div class="container">
          <p>Unable to load this page component. Please refresh the page.</p>
        </div>
      `;
    }
  };

  await Promise.all(
    Array.from(partialElements).map(loadPartial)
  );

  // Notify other scripts that the shared components are ready.
  document.dispatchEvent(new Event("components:loaded"));
});
