/**
 * Aventude Website - Main JavaScript
 */

// Determine base path for components based on current page location
function getBasePath() {
  const path = window.location.pathname;
  // If we're in a subdirectory like case-studies/, go up one level
  if (path.includes("/case-studies/")) {
    return "../";
  }
  return "./";
}

// Load common components (header & footer)
async function loadComponents() {
  const basePath = getBasePath();

  // Re-initialize Lucide icons after components are loaded
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

// Initialize Lucide icons
document.addEventListener("DOMContentLoaded", async () => {
  await loadComponents();
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  try {
    initHeroCarousel();
  } catch (e) {
    console.log("Hero carousel not found");
  }
  try {
    initGloballyLocalCarousel();
  } catch (e) {
    console.log("Global carousel not found");
  }
  try {
    initScrollAnimations();
  } catch (e) {
    console.log("Scroll animations error");
  }
  try {
    initHeaderScroll();
  } catch (e) {
    console.log("Header scroll error");
  }
  try {
    initMobileMenu();
  } catch (e) {
    console.log("Mobile menu error", e);
  }
  try {
    initServiceButtonAnimations();
  } catch (e) {
    console.log("Service button error");
  }
  try {
    initInquiryTypeButtons();
  } catch (e) {
    console.log("Inquiry type buttons error");
  }
});

/**
 * Hero Carousel Functionality
 */
function initHeroCarousel() {
  const slides = document.querySelectorAll(".hero__slide");
  const navItems = document.querySelectorAll(".hero__nav-item");

  if (!slides.length || !navItems.length) return;

  let currentSlide = 0;
  let autoplayInterval;

  function showSlide(index) {
    // Wrap around
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    // Remove active from all slides
    slides.forEach((slide) => slide.classList.remove("active"));

    // Add active to current slide
    slides[index].classList.add("active");

    // Remove active from all nav items
    navItems.forEach((item) => item.classList.remove("active"));

    // Add active to current nav item
    navItems[index].classList.add("active");

    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  // Click handlers for nav items
  navItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      showSlide(index);
      resetAutoplay();
    });
  });

  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  // startAutoplay();

  // Pause on hover
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.addEventListener("mouseenter", () => clearInterval(autoplayInterval));
    // hero.addEventListener('mouseleave', startAutoplay);
  }
}

/**
 * Globally Local Carousel
 */
function initGloballyLocalCarousel() {
  const track = document.querySelector(".globally-local__track");
  const slides = document.querySelectorAll(".globally-local__slide");
  const prevBtn = document.getElementById("global-prev");
  const nextBtn = document.getElementById("global-next");

  if (!track || !slides.length || !prevBtn || !nextBtn) return;

  let currentSlide = 0;

  function updateCarousel() {
    // Translate the track
    const offset = -currentSlide * 100;
    track.style.transform = `translateX(${offset}%)`;

    // Update active class for content animations
    slides.forEach((slide, index) => {
      if (index === currentSlide) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
      }
    });
  }

  function showSlide(index) {
    // Wrap around
    if (index >= slides.length) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide = index;
    }
    updateCarousel();
  }

  prevBtn.addEventListener("click", () => {
    showSlide(currentSlide - 1);
  });

  nextBtn.addEventListener("click", () => {
    showSlide(currentSlide + 1);
  });

  // Initialize
  const initialActive = document.querySelector(".globally-local__slide.active");
  if (initialActive) {
    currentSlide = Array.from(slides).indexOf(initialActive);
  }
  updateCarousel();
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll("[data-animate]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  animatedElements.forEach((el) => observer.observe(el));
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
  const header = document.getElementById("header");
  const homeHeader = document.getElementById("home-header");

  if (header) {
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScroll > 100) {
            header.classList.add("scrolled");
          } else {
            header.classList.remove("scrolled");
          }

          lastScroll = currentScroll;
          ticking = false;
        });

        ticking = true;
      }
    });
  }

  if (homeHeader) {
    const heroSection = document.getElementById("hero");
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Get the height of the hero section
          const heroHeight = heroSection ? heroSection.offsetHeight : 0;
          const scrollThreshold = heroHeight * 0.8; // Start showing at 80% of hero height

          // Smoothly transition the header - only show when scrolling, stay visible
          if (currentScroll > scrollThreshold) {
            homeHeader.classList.add("scrolled");
            homeHeader.classList.add("slide-down");
            homeHeader.classList.remove("slide-up");
          } else {
            homeHeader.classList.remove("scrolled");
            homeHeader.classList.remove("slide-down");
            homeHeader.classList.remove("slide-up");
          }

          lastScroll = currentScroll;
          ticking = false;
        });

        ticking = true;
      }
    });
  }
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  // Regular header
  const toggle = document.getElementById("mobile-toggle");
  const nav = document.getElementById("nav");
  const dropdowns = document.querySelectorAll(".header__dropdown");

  if (toggle && nav) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      nav.classList.toggle("active");
      toggle.classList.toggle("active");
      document.body.style.overflow = nav.classList.contains("active")
        ? "hidden"
        : "";
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("active");
        toggle.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Handle dropdown accordion on mobile
    dropdowns.forEach((dropdown) => {
      const link = dropdown.querySelector(".header__nav-link");

      link.addEventListener("click", (e) => {
        // Only handle accordion on mobile
        if (window.innerWidth <= 962) {
          e.preventDefault();

          // Close other dropdowns
          dropdowns.forEach((other) => {
            if (other !== dropdown) {
              other.classList.remove("active");
            }
          });

          // Toggle current dropdown
          dropdown.classList.toggle("active");
        }
      });
    });

    // Close menu on sub-link click (not main nav links)
    nav.querySelectorAll(".header__dropdown-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        toggle.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // Home header
  const homeToggle = document.getElementById("home-mobile-toggle");
  const homeNav = document.getElementById("home-nav");
  const homeDropdowns = document.querySelectorAll(".home-header__dropdown");

  if (homeToggle && homeNav) {
    homeToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      homeNav.classList.toggle("active");
      homeToggle.classList.toggle("active");
      document.body.style.overflow = homeNav.classList.contains("active")
        ? "hidden"
        : "";
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!homeNav.contains(e.target) && !homeToggle.contains(e.target)) {
        homeNav.classList.remove("active");
        homeToggle.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Handle dropdown accordion on mobile
    homeDropdowns.forEach((dropdown) => {
      const link = dropdown.querySelector(".home-header__nav-link");

      link.addEventListener("click", (e) => {
        // Only handle accordion on mobile
        if (window.innerWidth <= 962) {
          e.preventDefault();

          // Close other dropdowns
          homeDropdowns.forEach((other) => {
            if (other !== dropdown) {
              other.classList.remove("active");
            }
          });

          // Toggle current dropdown
          dropdown.classList.toggle("active");
        }
      });
    });

    // Close menu on sub-link click (not main nav links)
    homeNav
      .querySelectorAll(".home-header__dropdown-menu a")
      .forEach((link) => {
        link.addEventListener("click", () => {
          homeNav.classList.remove("active");
          homeToggle.classList.remove("active");
          document.body.style.overflow = "";
        });
      });
  }
}

/**
 * Smooth Scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

/**
 * Service Button Animation - Calculate text width for proper arrow positioning
 */
function initServiceButtonAnimations() {
  const serviceButtons = document.querySelectorAll(".service-btn");

  serviceButtons.forEach((btn) => {
    const textElement = btn.querySelector(".service-btn__text");
    if (textElement) {
      // Calculate the text width and set it as a CSS variable
      const textWidth = textElement.offsetWidth;
      btn.style.setProperty("--btn-text-width", `${textWidth}px`);
    }
  });

  // Recalculate on window resize
  window.addEventListener("resize", () => {
    serviceButtons.forEach((btn) => {
      const textElement = btn.querySelector(".service-btn__text");
      if (textElement) {
        const textWidth = textElement.offsetWidth;
        btn.style.setProperty("--btn-text-width", `${textWidth}px`);
      }
    });
  });
}

// Contact Form - Inquiry Type Buttons
function initInquiryTypeButtons() {
  const inquiryButtons = document.querySelectorAll(".div-4 button");
  const descriptionText = document.querySelector(".div-3 .p");

  console.log("Inquiry buttons found:", inquiryButtons.length);
  console.log("Description text found:", descriptionText);

  if (!inquiryButtons.length || !descriptionText) return;

  const descriptions = {
    "aventude-services":
      "Ask us about our services and how we can help you. Our team is ready to<br> assist with your sales inquiries. We're excited to connect with you.",
    "products-platforms":
      "How we can help you. We're excited to connect with you.",
    "general-inquiry":
      "How we can help you. We're excited to connect with you.",
    careers:
      "Send your information — we are in a rapid growth phase, and we continuously hire great personalities with talent.<br><br> If your profile interests us, you will definitely hear from us.",
  };

  inquiryButtons.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      console.log("Button clicked:", index, button);
      e.preventDefault();

      // Remove active state from all buttons
      inquiryButtons.forEach((btn) => {
        btn.setAttribute("aria-pressed", "false");
        btn.classList.remove("general-inquiry-wrapper");
        btn.classList.add("div-wrapper-2");

        // Update button text span class
        const textSpan = btn.querySelector("span");
        if (textSpan) {
          textSpan.classList.remove("general-inquiry");
          textSpan.classList.add("text-wrapper-3");
        }
      });

      // Add active state to clicked button
      button.setAttribute("aria-pressed", "true");
      button.classList.remove("div-wrapper-2");
      button.classList.add("general-inquiry-wrapper");

      console.log("Button classes after:", button.className);

      // Update clicked button text span class
      const activeTextSpan = button.querySelector("span");
      if (activeTextSpan) {
        activeTextSpan.classList.remove("text-wrapper-3");
        activeTextSpan.classList.add("general-inquiry");
        console.log("Text span classes after:", activeTextSpan.className);
      }

      // Update description text based on button index
      const buttonTexts = [
        "aventude-services",
        "products-platforms",
        "general-inquiry",
        "careers",
      ];
      const descriptionKey = buttonTexts[index];
      descriptionText.innerHTML = descriptions[descriptionKey];
      console.log("Description updated to:", descriptionKey);
    });
  });
}
