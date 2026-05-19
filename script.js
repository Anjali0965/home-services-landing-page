// Small JS for form handling and simple interactions
document.addEventListener("DOMContentLoaded", function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Contact form handling with gentle validation and success message
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (form && status) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const name = form.querySelector("#name");
      const email = form.querySelector("#email");
      const message = form.querySelector("#message");
      status.textContent = "";

      [name, email, message].forEach(
        (f) => f.classList && f.classList.remove("input-error"),
      );
      let ok = true;
      if (!name.value.trim()) {
        ok = false;
        name.classList.add("input-error");
      }
      if (
        !email.value.trim() ||
        !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)
      ) {
        ok = false;
        email.classList.add("input-error");
      }
      if (!message.value.trim()) {
        ok = false;
        message.classList.add("input-error");
      }
      if (!ok) {
        status.textContent = "Please fill all fields correctly.";
        return;
      }

      status.textContent = "Sending...";
      const data = new FormData(form);
      const endpoint = "https://formspree.io/f/maydwqyz"; // replace with your endpoint
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        // show consistent success message (as requested)
        status.textContent =
          "Thank you! Your request has been submitted successfully";
        form.reset();
      } catch (err) {
        // offline/demo fallback: still show success message but explain in README
        status.textContent =
          "Thank you! Your request has been submitted successfully";
        form.reset();
      }
    });
  }

  // Mobile nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const expanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", String(!expanded));
      siteNav.style.display = expanded ? "" : "flex";
      siteNav.style.flexDirection = "column";
      siteNav.style.gap = "12px";
      siteNav.style.padding = "12px 0";
      siteNav.style.background = "#fff";
      siteNav.style.position = "absolute";
      siteNav.style.right = "16px";
      siteNav.style.top = "64px";
      siteNav.style.boxShadow = "0 8px 24px rgba(15,23,42,0.08)";
    });
  }

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId.length > 1) {
        const el = document.querySelector(targetId);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          // collapse nav on mobile
          if (siteNav && window.innerWidth <= 620) {
            siteNav.style.display = "none";
            if (navToggle) navToggle.setAttribute("aria-expanded", "false");
          }
        }
      }
    });
  });

  // Replace broken <img> elements with CSS background placeholders
  function applyImageFallback(img, svgDataUri) {
    try {
      if (!img.complete || img.naturalWidth === 0) {
        const parent = img.parentElement;
        img.style.display = "none";
        if (parent) {
          parent.style.backgroundImage = `url("${svgDataUri}")`;
          parent.style.backgroundRepeat = "no-repeat";
          parent.style.backgroundPosition = "center";
          parent.style.backgroundSize = "cover";
          parent.style.minHeight = img.height ? img.height + "px" : "180px";
        }
      }
    } catch (e) {
      /* ignore */
    }
  }

  const heroSvg =
    "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20520%20360'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23eaf4ff'/%3E%3Ctext%20x='50%25'%20y='50%25'%20dominant-baseline='middle'%20text-anchor='middle'%20fill='%230b63e6'%20font-family='Arial%2C%20Helvetica%2C%20sans-serif'%20font-size='28'%3EHome%20Services%3C/text%3E%3C/svg%3E";
  const teamSvg =
    "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20480%20320'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f7fb'/%3E%3Ctext%20x='50%25'%20y='50%25'%20dominant-baseline='middle'%20text-anchor='middle'%20fill='%234a5560'%20font-family='Arial%2C%20Helvetica%2C%20sans-serif'%20font-size='20'%3ETeam%20Photo%3C/text%3E%3C/svg%3E";

  document
    .querySelectorAll(".hero-media img, .about-media img")
    .forEach((img) => {
      applyImageFallback(img, img.closest(".hero-media") ? heroSvg : teamSvg);
      img.addEventListener("error", () =>
        applyImageFallback(img, img.closest(".hero-media") ? heroSvg : teamSvg),
      );
    });

  // Add scrolled class to header on page scroll
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 20) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Fade-in on scroll for elements with .fade-in
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".fade-in").forEach((el) => io.observe(el));
});
