(() => {
  const data = window.HRINGR;
  if (!data) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ——— Mobile nav ——— */
  const nav = $(".nav-bar");
  const toggle = $(".nav-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ——— Gallery ——— */
  let galleryIndex = 0;
  const mainImg = $("#gallery-image");
  const thumbs = $$(".thumb");
  const galleryStatus = $("#gallery-status");

  function setGallery(index) {
    const item = data.gallery[index];
    if (!item || !mainImg) return;
    galleryIndex = index;
    mainImg.src = item.src;
    mainImg.alt = item.alt;
    thumbs.forEach((t, i) => {
      t.classList.toggle("is-active", i === index);
      t.setAttribute("aria-pressed", String(i === index));
    });
    if (galleryStatus) {
      galleryStatus.textContent = `${index + 1} / ${data.gallery.length}`;
    }
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener("click", () => setGallery(i));
  });

  $(".gallery-nav.prev")?.addEventListener("click", () => {
    setGallery((galleryIndex - 1 + data.gallery.length) % data.gallery.length);
  });
  $(".gallery-nav.next")?.addEventListener("click", () => {
    setGallery((galleryIndex + 1) % data.gallery.length);
  });

  setGallery(0);

  /* ——— Color + size selection ——— */
  let selectedColor = data.colors.find((c) => c.available)?.id || data.colors[0].id;
  let selectedSize = "L";

  const colorNote = $("#color-note");
  const sizeInputs = $$('input[name="waitlist-size"]');
  const colorInputs = $$('input[name="waitlist-color"]');

  function syncHiddenFields() {
    sizeInputs.forEach((el) => {
      el.value = selectedSize;
    });
    colorInputs.forEach((el) => {
      el.value = selectedColor;
    });
  }

  $$(".swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.color;
      const color = data.colors.find((c) => c.id === id);
      if (!color) return;
      selectedColor = id;
      $$(".swatch").forEach((s) => s.classList.toggle("is-active", s === btn));
      if (colorNote) {
        colorNote.textContent = color.available
          ? `${color.name} — waitlist open`
          : `${color.name} — notify me when available`;
      }
      syncHiddenFields();
    });
  });

  $$(".size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedSize = btn.dataset.size;
      $$(".size-btn").forEach((s) => s.classList.toggle("is-active", s === btn));
      syncHiddenFields();
    });
  });

  // Default active size L
  $$(".size-btn").forEach((btn) => {
    if (btn.dataset.size === selectedSize) btn.classList.add("is-active");
  });
  syncHiddenFields();

  /* ——— Waitlist forms ——— */
  function handleWaitlist(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]')?.value.trim();
      const status = form.querySelector(".form-status");
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (status) {
          status.textContent = "Enter a valid email address.";
          status.className = "form-status is-error";
        }
        return;
      }
      const payload = {
        email,
        product: data.product.id,
        size: selectedSize,
        color: selectedColor,
        at: new Date().toISOString(),
      };
      try {
        const key = "hringr-waitlist";
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        existing.push(payload);
        localStorage.setItem(key, JSON.stringify(existing));
      } catch {
        /* localStorage may be blocked */
      }
      if (status) {
        status.textContent = `You're on the list for ${selectedSize} / ${
          data.colors.find((c) => c.id === selectedColor)?.name || selectedColor
        }. We'll be in touch.`;
        status.className = "form-status is-ok";
      }
      form.reset();
      syncHiddenFields();
    });
  }

  $$(".waitlist-form").forEach(handleWaitlist);

  /* ——— Hotspots ——— */
  const panelTitle = $("#hotspot-title");
  const panelBody = $("#hotspot-body");
  const panelDetails = $("#hotspot-details");

  function setHotspot(id) {
    const spot = data.hotspots.find((h) => h.id === id) || data.hotspots[0];
    if (!spot) return;
    $$(".hotspot, .feature-chip").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.hotspot === spot.id);
    });
    if (panelTitle) panelTitle.textContent = spot.title;
    if (panelBody) panelBody.textContent = spot.body;
    if (panelDetails) {
      panelDetails.innerHTML = spot.details.map((d) => `<li>${d}</li>`).join("");
    }
  }

  $$(".hotspot, .feature-chip").forEach((el) => {
    el.addEventListener("click", () => setHotspot(el.dataset.hotspot));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setHotspot(el.dataset.hotspot);
      }
    });
  });

  setHotspot(data.hotspots[0]?.id);

  /* ——— FAQ ——— */
  $$(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    btn?.addEventListener("click", () => {
      const open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* ——— Scroll reveals ——— */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    $$(".reveal").forEach((el) => io.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("in-view"));
  }

  /* ——— Mobile sticky CTA ——— */
  const mobileCta = $(".mobile-cta");
  const productStage = $("#product");
  if (mobileCta && productStage && window.matchMedia("(max-width: 959px)").matches) {
    document.body.classList.add("has-mobile-cta");
    const io = new IntersectionObserver(
      ([entry]) => {
        const pastHero = window.scrollY > window.innerHeight * 0.4;
        const inFinal = $("#final-waitlist")?.getBoundingClientRect().top < window.innerHeight;
        mobileCta.classList.toggle("is-visible", pastHero && !inFinal);
      },
      { threshold: [0, 0.1, 1] }
    );
    io.observe(productStage);
    window.addEventListener(
      "scroll",
      () => {
        const pastHero = window.scrollY > window.innerHeight * 0.35;
        const final = $("#final-waitlist");
        const inFinal = final && final.getBoundingClientRect().top < window.innerHeight - 80;
        mobileCta.classList.toggle("is-visible", pastHero && !inFinal);
      },
      { passive: true }
    );
  }
})();
