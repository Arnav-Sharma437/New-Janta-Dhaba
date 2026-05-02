(function () {
  "use strict";

  /** Update with your real WhatsApp number (country code, no + or spaces) */
  var WA_PHONE = "919876543210";
  var WA_DEFAULT_TEXT = "Namaste, mujhe Mandyali Dham order karna hai";

  function waUrl(extra) {
    var text = WA_DEFAULT_TEXT + (extra ? "\n\n" + extra : "");
    return "https://wa.me/" + WA_PHONE + "?text=" + encodeURIComponent(text);
  }

  function bindWhatsAppLinks() {
    var nodes = document.querySelectorAll("[data-wa-order]");
    nodes.forEach(function (el) {
      el.setAttribute("href", waUrl());
      el.setAttribute("rel", "noopener noreferrer");
      el.setAttribute("target", "_blank");
    });
  }

  function initInquiryForm() {
    var form = document.getElementById("inquiry-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var name = (fd.get("name") || "").toString().trim();
      var phone = (fd.get("phone") || "").toString().trim();
      var message = (fd.get("message") || "").toString().trim();

      var lines = [];
      if (name) lines.push("Name: " + name);
      if (phone) lines.push("Phone: " + phone);
      if (message) lines.push("Details: " + message);
      var extra = lines.join("\n");

      window.open(waUrl(extra), "_blank", "noopener,noreferrer");
    });
  }

  function initScrollReveal() {
    var prefersReduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      document.querySelectorAll("[data-reveal]").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var elements = document.querySelectorAll("[data-reveal]");
    if (!elements.length || !("IntersectionObserver" in window)) {
      elements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initTestimonials() {
    var track = document.getElementById("testimonials-track");
    var dotsRoot = document.getElementById("testimonials-dots");
    if (!track || !dotsRoot) return;

    var items = track.querySelectorAll(".testimonial");
    if (!items.length) return;

    var current = 0;
    var timer;

    items.forEach(function (_, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-label", "Testimonial " + (i + 1));
      btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
      btn.addEventListener("click", function () {
        goTo(i);
        resetTimer();
      });
      dotsRoot.appendChild(btn);
    });

    function goTo(index) {
      items[current].classList.remove("active");
      current = (index + items.length) % items.length;
      items[current].classList.add("active");

      var buttons = dotsRoot.querySelectorAll("button");
      buttons.forEach(function (b, i) {
        b.setAttribute("aria-selected", i === current ? "true" : "false");
      });
    }

    function next() {
      goTo(current + 1);
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, 5500);
    }

    resetTimer();

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) clearInterval(timer);
      else resetTimer();
    });
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindWhatsAppLinks();
    initInquiryForm();
    initScrollReveal();
    initTestimonials();
    initSmoothAnchors();
  });
})();
