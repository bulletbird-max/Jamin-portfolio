(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* typing effect for the hero code editor */
  var statusEl = document.getElementById("typedStatus");
  var statusText = "\"open to work\"";
  if (statusEl) {
    if (reduceMotion) {
      statusEl.textContent = statusText;
    } else {
      var i = 0;
      (function type() {
        statusEl.textContent = statusText.slice(0, i);
        i++;
        if (i <= statusText.length) {
          setTimeout(type, 45);
        }
      })();
    }
  }

  /* scroll-spy: highlight active dock link based on visible section */
  var links = [].slice.call(document.querySelectorAll(".dock-link"));
  var sections = links
    .map(function (link) { return document.getElementById(link.dataset.id); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            links.forEach(function (link) {
              link.classList.toggle("active", link.dataset.id === id);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) { observer.observe(section); });
  }

  /* theme toggle */
  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    var icon = themeBtn.querySelector("i");
    themeBtn.addEventListener("click", function () {
      document.body.classList.toggle("light-mode");
      var isLight = document.body.classList.contains("light-mode");
      icon.className = isLight ? "fa-solid fa-sun" : "fa-solid fa-moon";
    });
  }
})();
