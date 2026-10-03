(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- theme toggle ---------- */
  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    var icon = themeBtn.querySelector("i");
    themeBtn.addEventListener("click", function () {
      document.body.classList.toggle("light-mode");
      var isLight = document.body.classList.contains("light-mode");
      icon.className = isLight ? "fa-solid fa-sun" : "fa-solid fa-moon";
    });
  }

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById("navBurger");
  var mobileNav = document.getElementById("mobileNav");
  if (burger && mobileNav) {
    burger.addEventListener("click", function () {
      var open = burger.classList.toggle("open");
      mobileNav.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        burger.classList.remove("open");
        mobileNav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- sliding nav highlight + scroll-spy ---------- */
  var highlight = document.getElementById("navHighlight");
  var navLinks = [].slice.call(document.querySelectorAll(".nav-link"));
  var mobileLinks = [].slice.call(document.querySelectorAll(".mobile-nav a"));
  var sections = navLinks
    .map(function (link) { return document.getElementById(link.dataset.id); })
    .filter(Boolean);

  function moveHighlight(link) {
    if (!highlight || !link) return;
    highlight.style.width = link.offsetWidth + "px";
    highlight.style.transform = "translateX(" + link.offsetLeft + "px)";
  }

  function setActive(id) {
    navLinks.forEach(function (link) {
      var isActive = link.dataset.id === id;
      link.classList.toggle("active", isActive);
      if (isActive) moveHighlight(link);
    });
    mobileLinks.forEach(function (link) {
      link.classList.toggle("active", link.dataset.id === id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) { navObserver.observe(section); });
  }

  window.addEventListener("load", function () { moveHighlight(document.querySelector(".nav-link.active")); });
  window.addEventListener("resize", function () { moveHighlight(document.querySelector(".nav-link.active")); });

  /* ---------- reveal-on-scroll ---------- */
  var revealEls = [].slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
    /* safety net: never leave content invisible if something stops the observer firing */
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    }, 4000);
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- subtle tilt on hover (desktop only) ---------- */
  if (fineHover) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        card.style.setProperty("--mx", (px * 100) + "%");
        card.style.setProperty("--my", (py * 100) + "%");
        if (!reduceMotion) {
          var x = px - 0.5, y = py - 0.5;
          card.style.transform = "perspective(600px) rotateX(" + (-y * 5) + "deg) rotateY(" + (x * 5) + "deg) translateY(-3px)";
        }
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- copy email to clipboard ---------- */
  var copyBtn = document.getElementById("copyEmail");
  var toast = document.getElementById("toast");
  if (copyBtn && toast) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.dataset.email;
      var showToast = function () {
        toast.classList.add("show");
        setTimeout(function () { toast.classList.remove("show"); }, 1800);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(showToast).catch(function () {
          window.location.href = "mailto:" + email;
        });
      } else {
        window.location.href = "mailto:" + email;
      }
    });
  }
})();
