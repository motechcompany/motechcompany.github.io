"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.getElementById("main-nav");

if (menuToggle && mainNav) {
  const setMenu = (open) => {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    mainNav.classList.toggle("is-open", open);
  };
  menuToggle.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  mainNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuToggle.getAttribute("aria-expanded") === "true"
    ) {
      setMenu(false);
      menuToggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) setMenu(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 850) setMenu(false);
  });
}

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const bookingForm = document.getElementById("bookingForm");
const formMessage = document.getElementById("formMessage");

if (bookingForm && formMessage) {
  const serviceSelect = document.getElementById("serviceType");
  const requestedService = new URLSearchParams(window.location.search).get(
    "service",
  );
  if (
    serviceSelect &&
    Array.from(serviceSelect.options).some(
      (option) => option.value === requestedService,
    )
  ) {
    serviceSelect.value = requestedService;
  }

  let sending = false;
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending || !bookingForm.reportValidity()) return;
    sending = true;
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const submitLabel = submitButton.querySelector("span");
    submitButton.disabled = true;
    submitLabel.textContent = "Sending your request…";
    bookingForm.setAttribute("aria-busy", "true");
    formMessage.hidden = true;

    // Keep the request on this page so confirmation and errors are easy to find.
    try {
      const response = await fetch(bookingForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(Object.fromEntries(new FormData(bookingForm))),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true)
        throw new Error("Request not accepted");

      formMessage.className = "form-message success";
      formMessage.textContent =
        "Thank you. Your request has been sent to MOTECH. We’ll contact you to discuss the details and arrange the next step.";
      bookingForm.reset();
      bookingForm.classList.add("booking-complete");
    } catch {
      formMessage.className = "form-message error";
      formMessage.textContent =
        "We couldn’t confirm your request. Your details are still here. Please try again, or call +250 796 315 285 / WhatsApp +250 789 813 896.";
    } finally {
      sending = false;
      submitButton.disabled = false;
      submitLabel.textContent = "Send project request";
      bookingForm.removeAttribute("aria-busy");
      formMessage.hidden = false;
      formMessage.focus();
    }
  });
}
