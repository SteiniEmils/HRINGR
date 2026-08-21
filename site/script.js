(() => {
  const data = window.HRINGR;
  if (!data) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ——— Hero video ——— */
  const hero = $(".hero");
  const heroVideo = $(".hero-video");
  if (hero && heroVideo) {
    const reduceHeroMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceHeroMotion) {
      hero.classList.add("reduced-motion");
      heroVideo.pause();
      heroVideo.removeAttribute("autoplay");
    } else {
      hero.classList.add("has-video");
      const tryPlay = () => {
        const play = heroVideo.play();
        if (play && typeof play.catch === "function") {
          play.catch(() => hero.classList.add("video-failed"));
        }
      };
      if (heroVideo.readyState >= 2) tryPlay();
      else heroVideo.addEventListener("loadeddata", tryPlay, { once: true });
      heroVideo.addEventListener("error", () => hero.classList.add("video-failed"));
    }
  }

  function setPicture(pictureEl, webpSrc, fallbackSrc, alt) {
    if (!pictureEl) return;
    let source = pictureEl.querySelector("source");
    let img = pictureEl.querySelector("img");
    if (!source) {
      source = document.createElement("source");
      source.type = "image/webp";
      pictureEl.insertBefore(source, img || null);
    }
    if (!img) {
      img = document.createElement("img");
      pictureEl.appendChild(img);
    }
    source.srcset = webpSrc;
    img.src = fallbackSrc || webpSrc;
    if (alt != null) img.alt = alt;
  }

  /* ——— Mobile nav ——— */
  const nav = $(".nav-bar");
  const toggle = $(".nav-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", open);
    });
    $$(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ——— Gallery ——— */
  let galleryIndex = 0;
  const galleryPicture = $("#gallery-picture");
  const thumbs = $$(".thumb");
  const galleryStatus = $("#gallery-status");

  function setGallery(index) {
    const item = data.gallery[index];
    if (!item || !galleryPicture) return;
    galleryIndex = index;
    setPicture(galleryPicture, item.src, item.fallback || item.src, item.alt);
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
  let selectedColor =
    data.colors.find((c) => c.available)?.id || data.colors[0].id;
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

  $$(".size-btn").forEach((btn) => {
    if (btn.dataset.size === selectedSize) btn.classList.add("is-active");
  });
  syncHiddenFields();

  /* ——— Waitlist forms (FormSubmit) ——— */
  async function handleWaitlist(form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]')?.value.trim();
      const status = form.querySelector(".form-status");
      const submitBtn = form.querySelector('button[type="submit"]');
      const notifyEmail = data.waitlist?.email?.trim();

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (status) {
          status.textContent = "Enter a valid email address.";
          status.className = "form-status is-error";
        }
        return;
      }

      if (!notifyEmail) {
        if (status) {
          status.textContent =
            "Waitlist inbox is not configured yet. Set waitlist.email in product.js.";
          status.className = "form-status is-error";
        }
        return;
      }

      const colorName =
        data.colors.find((c) => c.id === selectedColor)?.name || selectedColor;
      const payload = {
        email,
        product: data.product.name,
        productId: data.product.id,
        size: selectedSize,
        color: colorName,
        _subject: data.waitlist.subject || "HRINGR waitlist",
        _template: "table",
        _captcha: "false",
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }
      if (status) {
        status.textContent = "Sending…";
        status.className = "form-status";
      }

      try {
        const res = await fetch(
          `https://formsubmit.co/ajax/${encodeURIComponent(notifyEmail)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
          },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        try {
          const key = "hringr-waitlist";
          const existing = JSON.parse(localStorage.getItem(key) || "[]");
          existing.push({ ...payload, at: new Date().toISOString() });
          localStorage.setItem(key, JSON.stringify(existing));
        } catch {
          /* ignore */
        }

        if (status) {
          status.textContent = `You're on the list for ${selectedSize} / ${colorName}. We'll be in touch.`;
          status.className = "form-status is-ok";
        }
        form.reset();
        syncHiddenFields();
      } catch {
        if (status) {
          status.textContent =
            "Could not send right now. Try again, or email us directly.";
          status.className = "form-status is-error";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Join waitlist";
        }
      }
    });
  }

  $$(".waitlist-form").forEach(handleWaitlist);

  /* ——— Hotspots ——— */
  const panelTitle = $("#hotspot-title");
  const panelBody = $("#hotspot-body");
  const panelDetails = $("#hotspot-details");
  const hotspotPicture = $("#hotspot-picture");

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
    if (spot.image) {
      setPicture(
        hotspotPicture,
        spot.image,
        spot.imageFallback || spot.image,
        spot.imageAlt || spot.title,
      );
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
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    $$(".reveal").forEach((el) => io.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("in-view"));
  }

  /* ——— Mobile sticky CTA ——— */
  const mobileCta = $(".mobile-cta");
  const mqMobile = window.matchMedia("(max-width: 959px)");

  function updateMobileCta() {
    if (!mobileCta) return;
    if (!mqMobile.matches) {
      document.body.classList.remove("has-mobile-cta");
      mobileCta.classList.remove("is-visible");
      return;
    }
    document.body.classList.add("has-mobile-cta");
    const pastHero = window.scrollY > window.innerHeight * 0.35;
    const final = $("#final-waitlist");
    const inFinal =
      final && final.getBoundingClientRect().top < window.innerHeight - 80;
    const menuOpen = document.body.classList.contains("nav-open");
    mobileCta.classList.toggle("is-visible", pastHero && !inFinal && !menuOpen);
  }

  if (mobileCta) {
    window.addEventListener("scroll", updateMobileCta, { passive: true });
    mqMobile.addEventListener?.("change", updateMobileCta);
    updateMobileCta();
  }
})();
