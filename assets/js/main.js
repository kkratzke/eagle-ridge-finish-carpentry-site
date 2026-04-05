const { facebookUrl, galleryItems, projectHighlights, quoteEmailParts, services } = window.EagleRidgeSiteData;
const quoteEmail = Array.isArray(quoteEmailParts) ? quoteEmailParts.join("@") : "";

const servicesGrid = document.querySelector("[data-services-grid]");
const featuredGrid = document.querySelector("[data-featured-grid]");
const galleryTrack = document.querySelector("[data-gallery-track]");
const galleryViewport = document.querySelector("[data-gallery-viewport]");
const galleryPrev = document.querySelector("[data-gallery-prev]");
const galleryNext = document.querySelector("[data-gallery-next]");
const quoteForm = document.querySelector("[data-quote-form]");
const formStatus = document.querySelector("[data-form-status]");
const header = document.querySelector("[data-site-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-site-nav]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxCounter = document.querySelector("[data-lightbox-counter]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
const lightboxThumbs = document.querySelector("[data-lightbox-thumbs]");

const state = {
  carouselIndex: 0,
  lightboxItems: [...galleryItems],
  lightboxIndex: 0
};

function getCategoryLabel(item) {
  const primary = item.categories[0];

  switch (primary) {
    case "trim":
      return "Trim & Millwork";
    case "stairs":
      return "Stairs & Rails";
    case "builtins":
      return "Built-ins";
    case "ceilings":
      return "Ceilings";
    case "remodel":
      return "Remodel Finish";
    default:
      return "Project Detail";
  }
}

function renderServices() {
  servicesGrid.innerHTML = services
    .map(
      (service) => `
        <article class="service-card" data-reveal>
          <h3>${service.title}</h3>
          <p>${service.text}</p>
        </article>
      `
    )
    .join("");
}

function renderFeaturedProjects() {
  featuredGrid.innerHTML = projectHighlights
    .map((highlight) => {
      const image = galleryItems.find((item) => item.id === highlight.imageId);

      return `
        <button
          class="feature-card feature-card--interactive"
          type="button"
          data-open-image-id="${image.id}"
          data-reveal
          aria-label="Open full image: ${image.title}"
        >
          <div class="feature-card__image">
            <img
              src="${image.src}"
              alt="${image.alt}"
              width="${image.width}"
              height="${image.height}"
              loading="lazy"
            />
          </div>
          <div class="feature-card__body">
            <span class="feature-card__label">${highlight.label}</span>
            <h3>${highlight.title}</h3>
            <p>${highlight.text}</p>
          </div>
        </button>
      `;
    })
    .join("");
}

function getVisibleSlideStates() {
  return new Map(
    [...galleryTrack.querySelectorAll("[data-gallery-item-id]")].map((slide) => {
      const styles = window.getComputedStyle(slide);

      return [
        slide.dataset.galleryItemId,
        {
          rect: slide.getBoundingClientRect(),
          opacity: Number(styles.opacity) || 1,
          filter: styles.filter
        }
      ];
    })
  );
}

function animateCarousel(previousStates, direction) {
  if (!previousStates.size) {
    return;
  }

  const distance = Math.min(galleryViewport.clientWidth * 0.16, 120);

  galleryTrack.querySelectorAll("[data-gallery-item-id]").forEach((slide) => {
    slide.getAnimations().forEach((animation) => animation.cancel());

    const itemId = slide.dataset.galleryItemId;
    const previousState = previousStates.get(itemId);
    const newRect = slide.getBoundingClientRect();
    const targetStyles = window.getComputedStyle(slide);
    const targetOpacity = Number(targetStyles.opacity) || 1;
    const targetFilter = targetStyles.filter;

    let fromX = 0;
    let fromScale = 1;
    let fromOpacity = targetOpacity;
    let fromFilter = targetFilter;

    if (previousState) {
      fromX = previousState.rect.left - newRect.left;
      fromScale = previousState.rect.width / newRect.width;
      fromOpacity = previousState.opacity;
      fromFilter = previousState.filter;
    } else if (direction !== 0) {
      fromX = direction > 0 ? distance : -distance;
      fromScale = 0.92;
      fromOpacity = 0;
      fromFilter = "grayscale(0.45) saturate(0.45)";
    } else {
      return;
    }

    if (Math.abs(fromX) < 1 && Math.abs(fromScale - 1) < 0.01) {
      return;
    }

    slide.animate(
      [
        {
          translate: `${fromX}px 0`,
          scale: String(fromScale),
          opacity: fromOpacity,
          filter: fromFilter
        },
        {
          translate: "0 0",
          scale: "1",
          opacity: targetOpacity,
          filter: targetFilter
        }
      ],
      {
        duration: 920,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both"
      }
    );
  });
}

function renderCarousel(direction = 0) {
  const total = galleryItems.length;
  const previousStates = getVisibleSlideStates();

  if (!total) {
    galleryTrack.innerHTML = "";
    galleryPrev.disabled = true;
    galleryNext.disabled = true;
    return;
  }

  const offsets =
    total > 4
      ? [-2, -1, 0, 1, 2]
      : Array.from({ length: total }, (_, index) => index - Math.floor(total / 2));

  galleryTrack.innerHTML = offsets
    .map((offset) => {
      const index = (state.carouselIndex + offset + total) % total;
      const item = galleryItems[index];
      const offsetClass =
        offset === 0 ? "is-active" : Math.abs(offset) === 1 ? "is-near" : "is-edge";

      return `
        <article
          class="gallery-slide ${offsetClass}"
          data-gallery-item-id="${item.id}"
          data-carousel-index="${index}"
          data-carousel-offset="${offset}"
          tabindex="${offset === 0 ? "0" : "-1"}"
          aria-current="${offset === 0 ? "true" : "false"}"
          aria-label="${item.title}"
        >
          <button
            class="gallery-slide__image"
            type="button"
            data-gallery-open="${item.id}"
            aria-label="Open full image: ${item.title}"
          >
            <img
              src="${item.src}"
              alt="${item.alt}"
              width="${item.width}"
              height="${item.height}"
              loading="lazy"
              decoding="async"
            />
          </button>
          <div class="gallery-slide__body">
            <span class="gallery-slide__label">${getCategoryLabel(item)}</span>
            <h3>${item.title}</h3>
            <p>${item.alt}</p>
            <button class="button button--primary" type="button" data-gallery-open="${item.id}">
              View Full Image
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  animateCarousel(previousStates, direction);
  galleryPrev.disabled = galleryItems.length < 2;
  galleryNext.disabled = galleryItems.length < 2;
}

function setCarouselIndex(nextIndex, direction = 0) {
  const total = galleryItems.length;
  state.carouselIndex = (nextIndex + total) % total;
  renderCarousel(direction);
}

function renderLightboxThumbs() {
  lightboxThumbs.innerHTML = state.lightboxItems
    .map(
      (item, index) => `
        <button
          class="lightbox__thumb ${index === state.lightboxIndex ? "is-active" : ""}"
          type="button"
          data-lightbox-thumb="${item.id}"
          aria-label="View image ${index + 1}: ${item.title}"
        >
          <img
            src="${item.src}"
            alt=""
            width="${item.width}"
            height="${item.height}"
            loading="lazy"
            decoding="async"
          />
        </button>
      `
    )
    .join("");
}

function updateLightbox() {
  const item = state.lightboxItems[state.lightboxIndex];

  if (!item) {
    return;
  }

  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  lightboxTitle.textContent = item.title;
  lightboxCounter.textContent = `${state.lightboxIndex + 1} of ${state.lightboxItems.length}`;
  renderLightboxThumbs();
}

function openLightbox(itemId, items = galleryItems) {
  state.lightboxItems = items;
  state.lightboxIndex = state.lightboxItems.findIndex((item) => item.id === itemId);

  if (state.lightboxIndex < 0) {
    return;
  }

  updateLightbox();

  if (typeof lightbox.showModal === "function") {
    lightbox.showModal();
  } else {
    lightbox.setAttribute("open", "open");
  }

  document.body.classList.add("dialog-open");
}

function closeLightbox() {
  if (typeof lightbox.close === "function") {
    lightbox.close();
  } else {
    lightbox.removeAttribute("open");
  }

  document.body.classList.remove("dialog-open");
}

function stepLightbox(direction) {
  if (!state.lightboxItems.length) {
    return;
  }

  state.lightboxIndex =
    (state.lightboxIndex + direction + state.lightboxItems.length) % state.lightboxItems.length;
  updateLightbox();
}

function setupGallery() {
  galleryPrev.addEventListener("click", () => setCarouselIndex(state.carouselIndex - 1, -1));
  galleryNext.addEventListener("click", () => setCarouselIndex(state.carouselIndex + 1, 1));

  galleryTrack.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-gallery-open]");

    if (openButton) {
      openLightbox(Number(openButton.dataset.galleryOpen), galleryItems);
      return;
    }

    const slide = event.target.closest("[data-carousel-index]");

    if (slide) {
      setCarouselIndex(
        Number(slide.dataset.carouselIndex),
        Number(slide.dataset.carouselOffset || 0)
      );
    }
  });

  galleryTrack.addEventListener("keydown", (event) => {
    const slide = event.target.closest("[data-carousel-index]");

    if (!slide) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setCarouselIndex(
        Number(slide.dataset.carouselIndex),
        Number(slide.dataset.carouselOffset || 0)
      );
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setCarouselIndex(state.carouselIndex - 1, -1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setCarouselIndex(state.carouselIndex + 1, 1);
    }
  });

  let startX = 0;

  galleryViewport.addEventListener("touchstart", (event) => {
    startX = event.touches[0]?.clientX ?? 0;
  });

  galleryViewport.addEventListener("touchend", (event) => {
    const endX = event.changedTouches[0]?.clientX ?? 0;
    const distance = endX - startX;

    if (Math.abs(distance) < 45) {
      return;
    }

    if (distance > 0) {
      setCarouselIndex(state.carouselIndex - 1, -1);
    } else {
      setCarouselIndex(state.carouselIndex + 1, 1);
    }
  });

  window.addEventListener("resize", renderCarousel, { passive: true });
}

function setupLightbox() {
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => stepLightbox(-1));
  lightboxNext.addEventListener("click", () => stepLightbox(1));

  lightboxThumbs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lightbox-thumb]");

    if (!button) {
      return;
    }

    state.lightboxIndex = state.lightboxItems.findIndex(
      (item) => item.id === Number(button.dataset.lightboxThumb)
    );
    updateLightbox();
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightbox.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.open) {
      return;
    }

    if (event.key === "ArrowLeft") {
      stepLightbox(-1);
    }

    if (event.key === "ArrowRight") {
      stepLightbox(1);
    }
  });

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-open-image-id]");

    if (!trigger) {
      return;
    }

    openLightbox(Number(trigger.dataset.openImageId), galleryItems);
  });

  document.addEventListener("keydown", (event) => {
    const trigger = event.target.closest("[data-open-image-id]");

    if (!trigger) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(Number(trigger.dataset.openImageId), galleryItems);
    }
  });
}

function setupNav() {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    header.classList.toggle("is-open", !expanded);
  });

  nav.addEventListener("click", (event) => {
    if (!event.target.closest("a")) {
      return;
    }

    navToggle.setAttribute("aria-expanded", "false");
    header.classList.remove("is-open");
  });

  const syncHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const activeId = `#${entry.target.id}`;

        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === activeId);
        });
      });
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupReveal() {
  const revealItems = document.querySelectorAll("[data-reveal]");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupQuoteForm() {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!quoteForm.reportValidity()) {
      return;
    }

    const formData = new FormData(quoteForm);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const projectType = String(formData.get("projectType") || "").trim();
    const timeline = String(formData.get("timeline") || "").trim();
    const details = String(formData.get("details") || "").trim();

    const subject = `Quote Request - ${projectType || "Finish Carpentry"} - ${name || "Website Inquiry"}`;
    const body = [
      "New quote request from the Eagle Ridge Finish Carpentry, LLC website",
      "",
      `Name: ${name || "Not provided"}`,
      `Phone: ${phone || "Not provided"}`,
      `Email: ${email || "Not provided"}`,
      `City: ${city || "Not provided"}`,
      `Project type: ${projectType || "Not provided"}`,
      `Timeline: ${timeline || "Not provided"}`,
      "",
      "Project details:",
      details || "Not provided",
      "",
      `Facebook page referenced: ${facebookUrl}`
    ].join("\n");

    const mailtoLink = `mailto:${quoteEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    formStatus.textContent = quoteEmail
      ? "Opening your email app with your quote request filled in."
      : "Opening a draft email so your quote request is ready to send.";

    window.location.href = mailtoLink;
  });
}

function setCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

renderServices();
renderFeaturedProjects();
renderCarousel();
setupGallery();
setupLightbox();
setupNav();
setupReveal();
setupQuoteForm();
setCurrentYear();
