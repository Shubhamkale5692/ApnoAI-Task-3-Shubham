/**
 * ============================================================================
 * PULSE FITNESS - PREMIUM GYM & FITNESS STUDIO
 * Master JavaScript File: script.js
 * Author: PULSE FITNESS Development Team (ApnoAI Final Project)
 * ============================================================================
 */

'use strict';

// ============================================================================
// EDITABLE PLACEHOLDER CONFIGURATION
// Change this single variable to update the WhatsApp phone number everywhere.
// WhatsApp format: +91 7972015757
// ============================================================================
const WHATSAPP_PHONE = '+91 7972015757';

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. THEME MANAGER: DARK MODE / LIGHT MODE (FEATURE 4)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;
  const THEME_STORAGE_KEY = 'pulse-fitness-theme';

  /**
   * Initializes theme based on localStorage or OS preference
   */
  const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      applyTheme(savedTheme);
    } else {
      // Default to dark mode for premium luxury fitness feel, or check OS
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      applyTheme(prefersLight ? 'light' : 'dark');
    }
  };

  /**
   * Applies the theme and updates ARIA attributes
   * @param {'dark'|'light'} theme 
   */
  const applyTheme = (theme) => {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  };

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  // Initialize theme immediately
  initTheme();


  /* ==========================================================================
     2. MOBILE NAVIGATION MENU & HEADER SCROLL BEHAVIOR
     ========================================================================== */
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  /**
   * Toggles mobile navigation menu
   */
  const toggleMobileMenu = () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', toggleMobileMenu);

    // Close when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          closeMobileMenu();
        }
      });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  /**
   * Header background scroll transition & Active nav links spy
   */
  const sections = document.querySelectorAll('section[id], header[id]');

  const handleScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header sticky shadow
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Active navigation spy
    const headerHeight = (header ? header.offsetHeight : 80) + 30;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - headerHeight;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-menu a[href*="#${sectionId}"]`);

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ==========================================================================
     3. FEATURE 1: SCROLL REVEAL ANIMATIONS & STAT COUNTERS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // Stat Counter & Circular Progress Ring Animation
  const statCards = document.querySelectorAll('.hero-stats .stat-card');
  let animatedStats = false;

  const animateCountersAndRings = () => {
    statCards.forEach(card => {
      const stat = card.querySelector('.stat-number');
      const ringFill = card.querySelector('.ring-fill');

      if (ringFill) {
        const percent = parseFloat(ringFill.getAttribute('data-percent')) || 100;
        const circumference = 201.06;
        const offset = circumference - (percent / 100) * circumference;
        ringFill.style.strokeDashoffset = offset;
      }

      if (!stat) return;
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.textContent.includes('%') ? '%' : '+';
      const duration = 1800;
      const stepTime = 25;
      const steps = duration / stepTime;
      const increment = target / steps;
      let currentVal = 0;

      const counterTimer = setInterval(() => {
        currentVal += increment;
        if (currentVal >= target) {
          stat.textContent = target.toLocaleString() + suffix;
          clearInterval(counterTimer);
        } else {
          stat.textContent = Math.floor(currentVal).toLocaleString() + suffix;
        }
      }, stepTime);
    });
  };

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          animateCountersAndRings();
          animatedStats = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }


  /* ==========================================================================
     4. MEMBERSHIP BILLING PERIOD SWITCH (MONTHLY / ANNUAL)
     ========================================================================== */
  const billingSwitch = document.getElementById('billing-switch');
  const monthlyLabel = document.querySelector('.billing-label.monthly');
  const annualLabel = document.querySelector('.billing-label.annual');
  const priceAmounts = document.querySelectorAll('.plan-price .amount');
  const billedNotes = document.querySelectorAll('.billed-note');

  /**
   * Sets the billing mode
   * @param {boolean} isAnnual - true for annual billing, false for monthly
   */
  const setBillingPeriod = (isAnnual) => {
    if (!billingSwitch) return;

    billingSwitch.classList.toggle('annual-active', isAnnual);
    billingSwitch.setAttribute('aria-checked', String(isAnnual));

    // Ensure Monthly label is active ONLY in Monthly mode
    if (monthlyLabel) {
      monthlyLabel.classList.toggle('active', !isAnnual);
    }

    // Ensure Annual label is active ONLY in Annual mode
    if (annualLabel) {
      annualLabel.classList.toggle('active', isAnnual);
    }

    // Update all membership pricing amounts smoothly
    priceAmounts.forEach(amt => {
      const monthlyPrice = amt.getAttribute('data-monthly');
      const annualPrice = amt.getAttribute('data-annual');
      amt.style.opacity = '0';
      setTimeout(() => {
        amt.textContent = isAnnual ? annualPrice : monthlyPrice;
        amt.style.opacity = '1';
      }, 120);
    });

    // Update billed notes
    billedNotes.forEach((note, index) => {
      if (isAnnual) {
        note.textContent = 'Billed annually • 20% savings applied';
      } else {
        const monthlyNotes = [
          'Billed monthly • Sample rate',
          'Billed monthly • Most selected',
          'Billed monthly • Complete VIP'
        ];
        note.textContent = monthlyNotes[index] || 'Billed monthly • Sample rate';
      }
    });

    // Update plan-select-btn data attributes for the contact inquiry form
    const planButtons = document.querySelectorAll('.plan-select-btn');
    planButtons.forEach(btn => {
      const card = btn.closest('.pricing-card');
      if (card) {
        const planName = card.querySelector('.plan-name') ? card.querySelector('.plan-name').textContent.trim() : 'Plan';
        const price = isAnnual 
          ? (card.querySelector('.amount') ? card.querySelector('.amount').getAttribute('data-annual') : '')
          : (card.querySelector('.amount') ? card.querySelector('.amount').getAttribute('data-monthly') : '');
        const billingPeriod = isAnnual ? 'annual billing' : 'monthly';
        btn.setAttribute('data-plan-title', `${planName} Membership (₹${price}/mo - ${billingPeriod})`);
      }
    });
  };

  if (billingSwitch) {
    billingSwitch.addEventListener('click', () => {
      const isCurrentlyAnnual = billingSwitch.classList.contains('annual-active');
      setBillingPeriod(!isCurrentlyAnnual);
    });
  }

  if (monthlyLabel) {
    monthlyLabel.addEventListener('click', () => {
      setBillingPeriod(false);
    });
  }

  if (annualLabel) {
    annualLabel.addEventListener('click', () => {
      setBillingPeriod(true);
    });
  }


  /* ==========================================================================
     5. FEATURE 2: PHOTO GALLERY FILTERING & LIGHTBOX PREVIEW
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCounter = document.getElementById('lightbox-counter');

  let currentGalleryIndex = 0;
  let lastActiveGalleryTrigger = null;

  /**
   * Helper to retrieve currently visible gallery items
   * @returns {HTMLElement[]}
   */
  const getActiveGalleryItems = () => {
    return Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
  };

  let activeGalleryItems = getActiveGalleryItems();

  /**
   * Filter Gallery Items
   */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterVal = (btn.getAttribute('data-filter') || 'all').toLowerCase().trim();

      galleryItems.forEach(item => {
        const itemCategories = (item.getAttribute('data-category') || '').toLowerCase().trim().split(/\s+/);
        if (filterVal === 'all' || itemCategories.includes(filterVal)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      // Update active items list for lightbox navigation
      activeGalleryItems = getActiveGalleryItems();
    });
  });

  /**
   * Lightbox Functions
   */
  const openLightbox = (index, triggerEl) => {
    activeGalleryItems = getActiveGalleryItems();
    if (!activeGalleryItems.length) return;

    lastActiveGalleryTrigger = triggerEl || null;
    currentGalleryIndex = Math.max(0, Math.min(index, activeGalleryItems.length - 1));
    updateLightboxContent();

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (lightboxClose) {
      setTimeout(() => lightboxClose.focus(), 50);
    }
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastActiveGalleryTrigger && typeof lastActiveGalleryTrigger.focus === 'function') {
      lastActiveGalleryTrigger.focus();
    }
  };

  const updateLightboxContent = () => {
    activeGalleryItems = getActiveGalleryItems();
    if (!activeGalleryItems.length) return;

    if (currentGalleryIndex >= activeGalleryItems.length) {
      currentGalleryIndex = 0;
    } else if (currentGalleryIndex < 0) {
      currentGalleryIndex = activeGalleryItems.length - 1;
    }

    const item = activeGalleryItems[currentGalleryIndex];
    if (!item) return;

    const img = item.querySelector('.gallery-img');
    const title = item.querySelector('.gallery-caption-title');

    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Pulse Fitness Gallery Photo';
    }
    if (title && lightboxTitle) {
      lightboxTitle.textContent = title.textContent.trim();
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `Photo ${currentGalleryIndex + 1} of ${activeGalleryItems.length}`;
    }
  };

  const nextLightboxImage = () => {
    activeGalleryItems = getActiveGalleryItems();
    if (!activeGalleryItems.length) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % activeGalleryItems.length;
    if (lightboxImg) {
      lightboxImg.classList.remove('slide-next-3d', 'slide-prev-3d');
      void lightboxImg.offsetWidth;
      lightboxImg.classList.add('slide-next-3d');
    }
    updateLightboxContent();
  };

  const prevLightboxImage = () => {
    activeGalleryItems = getActiveGalleryItems();
    if (!activeGalleryItems.length) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
    if (lightboxImg) {
      lightboxImg.classList.remove('slide-next-3d', 'slide-prev-3d');
      void lightboxImg.offsetWidth;
      lightboxImg.classList.add('slide-prev-3d');
    }
    updateLightboxContent();
  };

  // Bind clicks and keyboard activation to gallery cards
  galleryItems.forEach(item => {
    const handleItemTrigger = () => {
      activeGalleryItems = getActiveGalleryItems();
      const activeIndex = activeGalleryItems.indexOf(item);
      if (activeIndex !== -1) {
        openLightbox(activeIndex, item);
      }
    };

    item.addEventListener('click', handleItemTrigger);

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleItemTrigger();
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextLightboxImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightboxImage);

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextLightboxImage();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevLightboxImage();
    }
  });

  // Mobile Touch Swipe support for Lightbox
  let lbTouchStartX = 0;
  let lbTouchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      lbTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      lbTouchEndX = e.changedTouches[0].screenX;
      const swipeDistance = lbTouchStartX - lbTouchEndX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance > 0) {
          nextLightboxImage(); // swipe left -> next image
        } else {
          prevLightboxImage(); // swipe right -> previous image
        }
      }
    }, { passive: true });
  }

  // Graceful fallback for gallery images if an image fails to load
  const allGalleryImgs = document.querySelectorAll('.gallery-img');
  allGalleryImgs.forEach(img => {
    img.addEventListener('error', () => {
      img.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22600%22%20viewBox%3D%220%200%20800%20600%22%3E%3Crect%20fill%3D%22%230d121c%22%20width%3D%22800%22%20height%3D%22600%22%2F%3E%3Ctext%20fill%3D%22%2300ff88%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3EPULSE%20FITNESS%3C%2Ftext%3E%3C%2Fsvg%3E';
    });
  });

  if (lightboxImg) {
    lightboxImg.addEventListener('error', () => {
      lightboxImg.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221000%22%20height%3D%22700%22%20viewBox%3D%220%200%201000%20700%22%3E%3Crect%20fill%3D%22%230d121c%22%20width%3D%221000%22%20height%3D%22700%22%2F%3E%3Ctext%20fill%3D%22%2300ff88%22%20font-family%3D%22sans-serif%22%20font-size%3D%2232%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3EPULSE%20FITNESS%20GALLERY%3C%2Ftext%3E%3C%2Fsvg%3E';
    });
  }


  /* ==========================================================================
     6. SECTION G: TESTIMONIALS SLIDER
     ========================================================================== */
  const sliderTrack = document.getElementById('testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');

  let currentSlide = 0;
  let autoSlideInterval = null;
  const slideCount = slides.length;

  // Create pagination dots dynamically
  if (dotsContainer && slideCount > 0) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (idx === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.setAttribute('role', 'tab');
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  const updateSlider = () => {
    if (!sliderTrack) return;
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    slides.forEach((slide, idx) => {
      const card = slide.querySelector('.testimonial-card');
      if (card) {
        if (idx === currentSlide) {
          card.style.transform = 'scale(1) translateZ(0) rotateY(0deg)';
          card.style.opacity = '1';
        } else if (idx < currentSlide) {
          card.style.transform = 'scale(0.92) translateZ(-60px) rotateY(8deg)';
          card.style.opacity = '0.5';
        } else {
          card.style.transform = 'scale(0.92) translateZ(-60px) rotateY(-8deg)';
          card.style.opacity = '0.5';
        }
      }
    });

    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slideCount;
    updateSlider();
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    updateSlider();
  };

  const goToSlide = (idx) => {
    currentSlide = idx;
    updateSlider();
    resetAutoSlide();
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 6500);
  };

  const stopAutoSlide = () => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  };

  const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });
  }

  // Pause slider on mouse hover
  const sliderContainer = document.getElementById('testimonials-slider');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoSlide();
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchStartX - touchEndX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoSlide();
    }, { passive: true });
  }

  startAutoSlide();


  /* ==========================================================================
     7. SECTION H: CONTACT FORM WITH EMAILJS LIVE DELIVERY
     ========================================================================== */
  /**
   * EmailJS Configuration for Live Form Delivery
   * Destination Email: shubham.v.kale3355@gmail.com
   * 
   * Setup Instructions:
   * 1. Register a free account at https://www.emailjs.com/
   * 2. Go to 'Email Services' -> Add New Service (e.g. Gmail / Outlook) -> Note down your SERVICE_ID.
   * 3. Go to 'Email Templates' -> Create New Template -> Note down your TEMPLATE_ID.
   *    In the template editor, set 'To Email' to: shubham.v.kale3355@gmail.com
   *    Use template variables: {{from_name}}, {{from_email}}, {{phone_number}}, {{interest}}, {{message}}
   * 4. Go to 'Account' -> 'API Keys' -> Copy your PUBLIC_KEY.
   * 5. Replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', and 'YOUR_PUBLIC_KEY' below with your actual credentials.
   */
  const EMAILJS_CONFIG = {
    SERVICE_ID: 'YOUR_SERVICE_ID',       // Replace with your EmailJS Service ID (e.g. 'service_pulsefit')
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID',     // Replace with your EmailJS Template ID (e.g. 'template_inquiry')
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY',       // Replace with your EmailJS Public Key
    TARGET_EMAIL: 'shubham.v.kale3355@gmail.com'
  };

  const isEmailJSConfigured = () => {
    return (
      Boolean(EMAILJS_CONFIG.SERVICE_ID) &&
      EMAILJS_CONFIG.SERVICE_ID.trim() !== '' &&
      EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
      Boolean(EMAILJS_CONFIG.TEMPLATE_ID) &&
      EMAILJS_CONFIG.TEMPLATE_ID.trim() !== '' &&
      EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
      Boolean(EMAILJS_CONFIG.PUBLIC_KEY) &&
      EMAILJS_CONFIG.PUBLIC_KEY.trim() !== '' &&
      EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
    );
  };

  // Initialize EmailJS SDK if available and valid public key is supplied
  if (typeof window.emailjs !== 'undefined' && isEmailJSConfigured()) {
    try {
      window.emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
    } catch (e) {
      console.warn('EmailJS SDK initialization warning:', e);
    }
  }

  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const interestSelect = document.getElementById('contact-interest');
  const messageInput = document.getElementById('contact-message');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('contact-submit-btn');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');
  const messageError = document.getElementById('message-error');

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[+]?[\d\s\-().]{7,20}$/;

  /**
   * Clears field errors when user starts typing
   */
  const bindInputClearing = (input, errorEl) => {
    if (!input || !errorEl) return;
    input.addEventListener('input', () => {
      input.classList.remove('error');
      errorEl.textContent = '';
      if (formFeedback) formFeedback.style.display = 'none';
    });
  };

  bindInputClearing(nameInput, nameError);
  bindInputClearing(emailInput, emailError);
  bindInputClearing(phoneInput, phoneError);
  bindInputClearing(messageInput, messageError);

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (nameVal.length < 2) {
        if (nameInput) nameInput.classList.add('error');
        if (nameError) nameError.textContent = 'Please provide your full name (at least 2 characters).';
        isValid = false;
      } else {
        if (nameInput) nameInput.classList.remove('error');
        if (nameError) nameError.textContent = '';
      }

      // Validate Email
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!emailRegex.test(emailVal)) {
        if (emailInput) emailInput.classList.add('error');
        if (emailError) emailError.textContent = 'Please enter a valid email address (e.g. name@domain.com).';
        isValid = false;
      } else {
        if (emailInput) emailInput.classList.remove('error');
        if (emailError) emailError.textContent = '';
      }

      // Validate Phone (optional, but validated if provided)
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      if (phoneVal.length > 0 && !phoneRegex.test(phoneVal)) {
        if (phoneInput) phoneInput.classList.add('error');
        if (phoneError) phoneError.textContent = 'Please enter a valid phone number (e.g. +91 7972015757).';
        isValid = false;
      } else {
        if (phoneInput) phoneInput.classList.remove('error');
        if (phoneError) phoneError.textContent = '';
      }

      // Validate Message
      const messageVal = messageInput ? messageInput.value.trim() : '';
      if (messageVal.length < 10) {
        if (messageInput) messageInput.classList.add('error');
        if (messageError) messageError.textContent = 'Please tell us about your goals (minimum 10 characters).';
        isValid = false;
      } else {
        if (messageInput) messageInput.classList.remove('error');
        if (messageError) messageError.textContent = '';
      }

      if (!isValid) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.style.display = 'block';
          formFeedback.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Please review and correct the highlighted fields above.';
        }
        return;
      }

      // Verify email delivery configuration
      if (!isEmailJSConfigured()) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.style.display = 'block';
          formFeedback.innerHTML = `
            <strong><i class="fa-solid fa-triangle-exclamation"></i> Email Delivery Setup Required</strong><br>
            Direct email delivery is wired to <strong>${escapeHTML(EMAILJS_CONFIG.TARGET_EMAIL)}</strong> via EmailJS, but credentials are still set to placeholders in <code>script.js</code>.<br>
            <span style="font-size:0.86rem; opacity:0.95; display:inline-block; margin-top:6px;">
              Please add your <strong>SERVICE_ID</strong>, <strong>TEMPLATE_ID</strong>, and <strong>PUBLIC_KEY</strong> in the <code>EMAILJS_CONFIG</code> object in <code>script.js</code>. For immediate assistance, contact us at <a href="mailto:${escapeHTML(EMAILJS_CONFIG.TARGET_EMAIL)}" style="text-decoration:underline; font-weight:600;">${escapeHTML(EMAILJS_CONFIG.TARGET_EMAIL)}</a> or <a href="tel:+917972015757" style="text-decoration:underline; font-weight:600;">+91 7972015757</a>.
            </span>
          `;
        }
        return;
      }

      // Live delivery via EmailJS
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending Message...';

      const interest = interestSelect ? interestSelect.value : 'General Training';

      const templateParams = {
        from_name: nameVal,
        name: nameVal,
        from_email: emailVal,
        email: emailVal,
        reply_to: emailVal,
        phone_number: phoneVal || 'Not provided',
        phone: phoneVal || 'Not provided',
        interest: interest,
        program: interest,
        message: messageVal,
        to_email: EMAILJS_CONFIG.TARGET_EMAIL
      };

      try {
        let responseStatus = false;

        // Try EmailJS SDK first
        if (typeof window.emailjs !== 'undefined' && typeof window.emailjs.send === 'function') {
          const res = await window.emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams,
            { publicKey: EMAILJS_CONFIG.PUBLIC_KEY }
          );
          responseStatus = res && (res.status === 200 || res.text === 'OK');
        } else {
          // Fallback to direct EmailJS HTTP API endpoint
          const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              service_id: EMAILJS_CONFIG.SERVICE_ID,
              template_id: EMAILJS_CONFIG.TEMPLATE_ID,
              user_id: EMAILJS_CONFIG.PUBLIC_KEY,
              template_params: templateParams
            })
          });

          if (!res.ok) {
            const errTxt = await res.text();
            throw new Error(errTxt || `Service returned status ${res.status}`);
          }
          responseStatus = true;
        }

        if (responseStatus) {
          formFeedback.className = 'form-feedback success';
          formFeedback.style.display = 'block';
          formFeedback.innerHTML = `
            <strong><i class="fa-solid fa-circle-check"></i> Message Delivered Successfully!</strong><br>
            Thank you, <strong>${escapeHTML(nameVal)}</strong>! Your inquiry regarding <em>${escapeHTML(interest)}</em> has been successfully sent to <strong>${escapeHTML(EMAILJS_CONFIG.TARGET_EMAIL)}</strong>.<br>
            <span style="font-size:0.86rem; opacity:0.95; display:inline-block; margin-top:4px;">
              Our fitness advisors will review your goals and respond to <strong>${escapeHTML(emailVal)}</strong> within 24 hours.
            </span>
          `;
          contactForm.reset();
        } else {
          throw new Error('Email service did not confirm delivery.');
        }
      } catch (err) {
        console.error('Email delivery error:', err);
        formFeedback.className = 'form-feedback error';
        formFeedback.style.display = 'block';
        formFeedback.innerHTML = `
          <strong><i class="fa-solid fa-triangle-exclamation"></i> Email Delivery Failed</strong><br>
          We were unable to deliver your message at this time (${escapeHTML(err.message || 'Network / Delivery Error')}).<br>
          <span style="font-size:0.86rem; opacity:0.95; display:inline-block; margin-top:4px;">
            Please try again shortly or contact us directly at <a href="mailto:${escapeHTML(EMAILJS_CONFIG.TARGET_EMAIL)}" style="text-decoration:underline; font-weight:600;">${escapeHTML(EMAILJS_CONFIG.TARGET_EMAIL)}</a> or call <a href="tel:+917972015757" style="text-decoration:underline; font-weight:600;">+91 7972015757</a>.
          </span>
        `;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  function escapeHTML(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }


  /* ==========================================================================
     8. INTERACTIVE PROGRAM & MEMBERSHIP DETAILS MODAL
     ========================================================================== */
  const infoModal = document.getElementById('info-modal');
  const infoModalClose = document.getElementById('info-modal-close');
  const infoModalBackdrop = document.getElementById('info-modal-backdrop');
  const infoModalBody = document.getElementById('info-modal-body');

  const programDetailsData = {
    'Strength Training': {
      tag: 'POWER & PROGRESSION',
      desc: 'Build foundational absolute strength and bulletproof tendon health through structured compound lifting. Ideal for powerlifters, field athletes, and dedicated lifters.',
      items: [
        'Competition Eleiko barbells and calibrated steel plates',
        'Certified CSCS master coaching on squat, bench, and deadlift mechanics',
        'Periodized 12-week hypertrophy and peaking progressions',
        'Joint mobility & post-lift decompression protocols'
      ]
    },
    'Weight Loss': {
      tag: 'METABOLIC SHRED',
      desc: 'Accelerate fat oxidation and torch calories with science-backed high intensity intervals, circuit conditioning, and precise metabolic monitoring.',
      items: [
        'EPOC metabolic afterburn tracking with Polar telemetry',
        'Kettlebell complexes, sled pushes, and SkiErg sprints',
        'Bi-weekly InBody 770 composition scans',
        'Customized caloric deficit and macronutrient guidelines'
      ]
    },
    'Muscle Building': {
      tag: 'HYPERTROPHY ARCHITECT',
      desc: 'Achieve maximum muscular development through targeted mechanical tension, metabolic stress, and volume periodization designed to avoid plateaus.',
      items: [
        'Biomechanically optimized machine line (Prime, Arsenal, Hammer Strength)',
        'Custom hypertrophy training splits tailored to your recovery capacity',
        'Time-under-tension and drop-set intensity execution',
        'Protein synthesis and peri-workout supplementation guidance'
      ]
    },
    'Personal Training': {
      tag: '1-ON-1 BESPOKE COACHING',
      desc: 'Experience total customization with our premier coaches. We assess every kinetic angle, tailor your weekly programming, and keep you relentlessly accountable.',
      items: [
        'Comprehensive 60-minute movement screen & orthopedic assessment',
        'Direct 24/7 WhatsApp coach access for form checks and nutrition feedback',
        'Guaranteed progress tracking with biometrics and private gym reservations',
        'VIP access to the recovery suite and cold plunge post-workout'
      ]
    },
    'Cardio Training': {
      tag: 'AEROBIC & VO2 MAX',
      desc: 'Build an engine that never quits. Develop superior aerobic capacity and cardiovascular stamina with low-impact, high-yield conditioning systems.',
      items: [
        'Woodway curved manual treadmills & Concept2 rowers',
        'Zone-2 endurance pacing combined with anaerobic lactate threshold sprints',
        'Heart-rate variable biofeedback in our dedicated cardio stadium',
        'Pre-run mobility and foot-strike biomechanics analysis'
      ]
    },
    'Yoga & Flexibility': {
      tag: 'RESTORATION & ARTICULATION',
      desc: 'Cultivate pliable muscle tissue, increase joint range-of-motion, decompress the spine, and restore the nervous system after intense lifting sessions.',
      items: [
        'Athletic power vinyasa & deep fascia release yin sessions',
        'Theragun percussion massage integration',
        'Diaphragmatic breathwork to down-regulate sympathetic nervous system',
        'Spinal decompression and hip mobility routines'
      ]
    }
  };

  const openInfoModal = (contentHTML) => {
    if (!infoModal || !infoModalBody) return;
    infoModalBody.innerHTML = contentHTML;
    infoModal.classList.add('active');
    infoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeInfoModal = () => {
    if (!infoModal) return;
    infoModal.classList.remove('active');
    infoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (infoModalClose) infoModalClose.addEventListener('click', closeInfoModal);
  if (infoModalBackdrop) infoModalBackdrop.addEventListener('click', closeInfoModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && infoModal && infoModal.classList.contains('active')) {
      closeInfoModal();
    }
  });

  // Program Detail Buttons
  const programModalBtns = document.querySelectorAll('.program-modal-btn');
  programModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const progName = btn.getAttribute('data-program-name');
      const data = programDetailsData[progName] || {
        tag: 'SPECIALIZED DISCIPLINE',
        desc: 'Comprehensive training protocol designed to maximize physical performance.',
        items: ['Master coach instruction', 'Full facility equipment privileges', 'Personalized metrics']
      };

      const itemsList = data.items.map(item => `<li><i class="fa-solid fa-check"></i> ${item}</li>`).join('');

      const modalContent = `
        <span class="modal-header-badge">${data.tag}</span>
        <h3 class="modal-title">${progName}</h3>
        <p class="modal-desc">${data.desc}</p>
        <h4 style="font-size:1.05rem; font-weight:800; margin-bottom:12px; color:var(--text-primary);">Program Inclusions</h4>
        <ul class="modal-details-list">
          ${itemsList}
        </ul>
        <div class="modal-actions">
          <a href="#contact" class="btn btn-primary btn-full modal-inquire-btn" data-preset="${progName}">
            Inquire About This Program
          </a>
          <a href="https://wa.me/${WHATSAPP_PHONE.replace(/[^\d]/g, '')}?text=Hello!%20I'm%20interested%20in%20learning%20more%20about%20the%20${encodeURIComponent(progName)}%20program." 
             target="_blank" 
             rel="noopener noreferrer" 
             class="btn btn-outline btn-full"
             style="display:inline-flex; align-items:center; gap:8px;">
            <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp (+91 7972015757)
          </a>
        </div>
      `;

      openInfoModal(modalContent);

      // Handle the "Inquire About This Program" inside modal
      const modalInquireBtn = infoModalBody.querySelector('.modal-inquire-btn');
      if (modalInquireBtn) {
        modalInquireBtn.addEventListener('click', () => {
          closeInfoModal();
          if (interestSelect) {
            interestSelect.value = progName;
          }
        });
      }
    });
  });

  // Membership "Join" buttons
  const planSelectBtns = document.querySelectorAll('.plan-select-btn');
  planSelectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const planTitle = btn.getAttribute('data-plan-title');
      if (interestSelect) {
        interestSelect.value = 'Membership Membership Inquiry';
      }
      if (messageInput) {
        messageInput.value = `I would like to join the ${planTitle}. Please reach out with registration details and schedule my studio orientation.`;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Trainer "Book Consultation" buttons
  const trainerBtns = document.querySelectorAll('.book-trainer-btn');
  trainerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const trainerName = btn.getAttribute('data-trainer');
      if (interestSelect) {
        interestSelect.value = 'Personal Training';
      }
      if (messageInput) {
        messageInput.value = `I would like to schedule a personal coaching consultation with ${trainerName}.`;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Hero "Book a Free Trial" button
  const heroTrialBtn = document.getElementById('hero-trial-btn');
  if (heroTrialBtn) {
    heroTrialBtn.addEventListener('click', () => {
      if (interestSelect) {
        interestSelect.value = 'General Tour & Day Pass';
      }
      if (messageInput && !messageInput.value) {
        messageInput.value = 'Hello Pulse Fitness team! I would like to book a complimentary trial workout session and tour your studio.';
      }
    });
  }


  /* ==========================================================================
     9. FOOTER NEWSLETTER SUBSCRIPTION
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterFeedback = document.getElementById('newsletter-feedback');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();

      if (!emailRegex.test(email)) {
        newsletterFeedback.className = 'newsletter-feedback error';
        newsletterFeedback.textContent = 'Please enter a valid email address.';
        return;
      }

      newsletterFeedback.className = 'newsletter-feedback success';
      newsletterFeedback.textContent = 'Thank you for subscribing! Check your inbox for weekly protocols.';
      newsletterForm.reset();

      setTimeout(() => {
        newsletterFeedback.textContent = '';
      }, 5000);
    });
  }


  /* ==========================================================================
     10. DYNAMIC YEAR IN FOOTER
     ========================================================================== */
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }


  /* ==========================================================================
     11. FEATURE 3: FLOATING WHATSAPP BUTTON SYNCHRONIZATION
     ========================================================================== */
  const whatsappFloatBtn = document.getElementById('whatsapp-btn');
  if (whatsappFloatBtn) {
    const cleanWhatsAppDigits = WHATSAPP_PHONE.replace(/[^\d]/g, '');
    whatsappFloatBtn.href = `https://wa.me/${cleanWhatsAppDigits}?text=${encodeURIComponent("Hello Pulse Fitness! I'd like to learn more about your memberships and training programs.")}`;
    whatsappFloatBtn.setAttribute('aria-label', `Chat With Us on WhatsApp (${WHATSAPP_PHONE})`);
  }


  /* ==========================================================================
     12. PREMIUM 3D PRELOADER CONTROLLER
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  const preloaderProgress = document.getElementById('preloader-progress');
  if (preloader && preloaderProgress) {
    let pVal = 0;
    const pTimer = setInterval(() => {
      pVal += Math.floor(Math.random() * 25) + 15;
      if (pVal >= 100) {
        pVal = 100;
        preloaderProgress.style.width = '100%';
        clearInterval(pTimer);
        setTimeout(() => {
          preloader.classList.add('preloader-hidden');
          setTimeout(() => {
            if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
          }, 700);
        }, 250);
      } else {
        preloaderProgress.style.width = `${pVal}%`;
      }
    }, 40);
  }


  /* ==========================================================================
     13. INTERACTIVE 3D DESKTOP CURSOR
     ========================================================================== */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isCursorActive = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isCursorActive) {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
        ringX = mouseX;
        ringY = mouseY;
        isCursorActive = true;
      }
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
      isCursorActive = false;
    });

    const renderCursor = () => {
      if (isCursorActive) {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Hover states on interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, .card-3d, .gallery-item, .input-wrapper, input, select, textarea, [data-tilt="true"], .trainer-socials a, .social-link'
    );
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
      target.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
    });
  }


  /* ==========================================================================
     14. UNIVERSAL 3D CARD TILT ENGINE (VANILLA JS)
     ========================================================================== */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const tiltElements = document.querySelectorAll('[data-tilt="true"], .card-3d');
    tiltElements.forEach(el => {
      let isHovered = false;

      el.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      el.addEventListener('mousemove', (e) => {
        if (!isHovered) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const maxTilt = 12;
        const rotX = -y * maxTilt;
        const rotY = x * maxTilt;

        el.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

        // Update conic gradient border angle
        const angle = Math.atan2(e.clientY - (rect.top + rect.height / 2), e.clientX - (rect.left + rect.width / 2)) * (180 / Math.PI) + 90;
        el.style.setProperty('--glow-angle', `${angle}deg`);
      });

      el.addEventListener('mouseleave', () => {
        isHovered = false;
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        el.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          el.style.transition = '';
        }, 450);
      });
    });
  }


  /* ==========================================================================
     15. HERO 3D SCENE CONTROLLER (THREE.JS WEBGL + HTML5 CANVAS FALLBACK)
     ========================================================================== */
  const heroCanvas = document.getElementById('hero-3d-canvas');
  const heroContainerSection = document.getElementById('home');

  if (heroCanvas && heroContainerSection) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check if Three.js is available
    if (typeof THREE !== 'undefined') {
      try {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x070a0f, 0.015);

        const camera = new THREE.PerspectiveCamera(45, heroCanvas.clientWidth / heroCanvas.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 18);

        const renderer = new THREE.WebGLRenderer({
          canvas: heroCanvas,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        });
        renderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
        dirLight.position.set(8, 12, 10);
        scene.add(dirLight);

        const neonLight = new THREE.PointLight(0x25d366, 3.5, 45);
        neonLight.position.set(6, 0, 4);
        scene.add(neonLight);

        // Main 3D Equipment Master Group
        const heroGroup = new THREE.Group();
        scene.add(heroGroup);

        // Position entire 3D animation scene on desktop (76% toward right), centered on mobile
        const isMobileScreen = window.innerWidth <= 768;
        const initialHeroX = isMobileScreen ? 0 : (0.52 * 7.4558 * camera.aspect);
        heroGroup.position.set(initialHeroX, isMobileScreen ? 1.2 : 0, 0);

        // --- A. 3D METALLIC DUMBBELL ---
        const dumbbellGroup = new THREE.Group();

        // Materials
        const chromeMaterial = new THREE.MeshStandardMaterial({
          color: 0xd8d8d8,
          metalness: 0.92,
          roughness: 0.2
        });

        const knurlMaterial = new THREE.MeshStandardMaterial({
          color: 0x999999,
          metalness: 0.85,
          roughness: 0.4
        });

        const ironPlateMaterial = new THREE.MeshStandardMaterial({
          color: 0x161c24,
          metalness: 0.8,
          roughness: 0.35
        });

        const neonRingMaterial = new THREE.MeshStandardMaterial({
          color: 0x25d366,
          emissive: 0x25d366,
          emissiveIntensity: 0.8,
          roughness: 0.1
        });

        // Dumbbell Bar Handle
        const barGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.8, 32);
        barGeo.rotateZ(Math.PI / 2);
        const handle = new THREE.Mesh(barGeo, knurlMaterial);
        dumbbellGroup.add(handle);

        // Dual Retaining Collars
        const collarGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.2, 32);
        collarGeo.rotateZ(Math.PI / 2);
        const collarL = new THREE.Mesh(collarGeo, chromeMaterial);
        collarL.position.x = -1.1;
        const collarR = new THREE.Mesh(collarGeo, chromeMaterial);
        collarR.position.x = 1.1;
        dumbbellGroup.add(collarL, collarR);

        // Stepped Weight Plates (Left & Right)
        const plateDefs = [
          { r: 1.15, w: 0.28, x: 1.35 },
          { r: 1.45, w: 0.32, x: 1.70 },
          { r: 1.75, w: 0.38, x: 2.10 }
        ];

        plateDefs.forEach(p => {
          const pGeo = new THREE.CylinderGeometry(p.r, p.r, p.w, 40);
          pGeo.rotateZ(Math.PI / 2);

          // Right plate
          const mR = new THREE.Mesh(pGeo, ironPlateMaterial);
          mR.position.x = p.x;
          dumbbellGroup.add(mR);

          // Left plate
          const mL = new THREE.Mesh(pGeo, ironPlateMaterial);
          mL.position.x = -p.x;
          dumbbellGroup.add(mL);

          // Outer Plate Neon Glow Rings
          if (p.r >= 1.7) {
            const ringGeo = new THREE.TorusGeometry(p.r + 0.03, 0.05, 16, 64);
            const ringR = new THREE.Mesh(ringGeo, neonRingMaterial);
            ringR.position.x = p.x;
            ringR.rotateY(Math.PI / 2);

            const ringL = new THREE.Mesh(ringGeo, neonRingMaterial);
            ringL.position.x = -p.x;
            ringL.rotateY(Math.PI / 2);

            dumbbellGroup.add(ringR, ringL);
          }
        });

        // Hexagonal End Caps
        const hexGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 6);
        hexGeo.rotateZ(Math.PI / 2);
        const hexR = new THREE.Mesh(hexGeo, chromeMaterial);
        hexR.position.x = 2.45;
        const hexL = new THREE.Mesh(hexGeo, chromeMaterial);
        hexL.position.x = -2.45;
        dumbbellGroup.add(hexR, hexL);

        // Initial orientation and placement together at group origin
        dumbbellGroup.rotation.set(0.35, -0.4, 0.2);
        dumbbellGroup.position.set(0, 0, 0);
        heroGroup.add(dumbbellGroup);

        // --- B. ROTATING 3D OLYMPIC WEIGHT PLATE ---
        const plateGroup = new THREE.Group();
        const olymPlateGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.28, 48);
        olymPlateGeo.rotateX(Math.PI / 2);
        const olymPlate = new THREE.Mesh(olymPlateGeo, ironPlateMaterial);
        plateGroup.add(olymPlate);

        const olymNeonRim = new THREE.Mesh(
          new THREE.TorusGeometry(2.22, 0.045, 16, 64),
          neonRingMaterial
        );
        plateGroup.add(olymNeonRim);

        plateGroup.position.set(2.4, -2.2, -3.0);
        plateGroup.rotation.set(0.6, 0.4, 0.2);
        heroGroup.add(plateGroup);

        // --- C. 3D FLOATING KETTLEBELL (Black Glowing Spherical Orb) ---
        const kbGroup = new THREE.Group();
        const kbBodyGeo = new THREE.SphereGeometry(1.05, 32, 24);
        const kbBody = new THREE.Mesh(kbBodyGeo, ironPlateMaterial);
        kbGroup.add(kbBody);

        const kbHandleGeo = new THREE.TorusGeometry(0.65, 0.15, 16, 32, Math.PI);
        const kbHandle = new THREE.Mesh(kbHandleGeo, chromeMaterial);
        kbHandle.position.y = 0.95;
        kbHandle.rotateZ(Math.PI);
        kbGroup.add(kbHandle);

        kbGroup.position.set(-2.6, 1.8, -2.5);
        heroGroup.add(kbGroup);

        // --- D. NEON 3D ENERGY RINGS ---
        const energyRing1 = new THREE.Mesh(
          new THREE.TorusGeometry(3.6, 0.035, 16, 120),
          neonRingMaterial
        );
        energyRing1.rotation.x = Math.PI / 2.8;
        energyRing1.position.set(0, 0, 0);
        heroGroup.add(energyRing1);

        const energyRing2 = new THREE.Mesh(
          new THREE.TorusGeometry(4.3, 0.028, 16, 120),
          new THREE.MeshStandardMaterial({
            color: 0x10b981,
            emissive: 0x10b981,
            emissiveIntensity: 0.6
          })
        );
        energyRing2.rotation.y = Math.PI / 3.2;
        energyRing2.position.set(0, 0, 0);
        heroGroup.add(energyRing2);

        // --- E. GLOWING 3D PARTICLE CONSTELLATION ---
        const particleCount = isMobileScreen ? 120 : 320;
        const particlePositions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
          particlePositions[i] = (Math.random() - 0.5) * 14;
          particlePositions[i + 1] = (Math.random() - 0.5) * 16;
          particlePositions[i + 2] = (Math.random() - 0.5) * 16;
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        const particleMat = new THREE.PointsMaterial({
          color: 0x25d366,
          size: 0.24,
          transparent: true,
          opacity: 0.75,
          blending: THREE.AdditiveBlending
        });

        const particleField = new THREE.Points(particleGeo, particleMat);
        heroGroup.add(particleField);

        // --- MOUSE PARALLAX & ANIMATION LOOP ---
        let targetMouseX = 0;
        let targetMouseY = 0;
        let currentMouseX = 0;
        let currentMouseY = 0;

        window.addEventListener('mousemove', (e) => {
          targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
          targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });

        // Resize handler
        const handleResize = () => {
          if (!heroCanvas) return;
          const width = heroCanvas.clientWidth;
          const height = heroCanvas.clientHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);

          const mobileNow = window.innerWidth <= 768;
          // Move complete 3D scene to right side on desktop (76% of width), centered on mobile
          heroGroup.position.x = mobileNow ? 0 : (0.52 * 7.4558 * camera.aspect);
          heroGroup.position.y = mobileNow ? 1.2 : 0;
        };
        window.addEventListener('resize', handleResize, { passive: true });

        // Intersection Observer to stop render loop when hero is off-screen
        let isHeroVisible = true;
        if ('IntersectionObserver' in window) {
          const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              isHeroVisible = entry.isIntersecting;
            });
          }, { threshold: 0.05 });
          heroObserver.observe(heroContainerSection);
        }

        let clock = new THREE.Clock();

        const animateThreeScene = () => {
          requestAnimationFrame(animateThreeScene);

          if (!isHeroVisible) return;

          const elapsedTime = clock.getElapsedTime();

          // Smooth mouse lerp
          currentMouseX += (targetMouseX - currentMouseX) * 0.05;
          currentMouseY += (targetMouseY - currentMouseY) * 0.05;

          if (!prefersReducedMotion) {
            // Floating 3D Dumbbell rotation and levitation
            dumbbellGroup.rotation.y += 0.007;
            dumbbellGroup.rotation.x = Math.sin(elapsedTime * 0.8) * 0.18 + currentMouseY * 0.4;
            dumbbellGroup.rotation.z = Math.cos(elapsedTime * 0.6) * 0.12 - currentMouseX * 0.4;
            const floatY = Math.sin(elapsedTime * 1.2) * 0.35;
            dumbbellGroup.position.y = floatY;
            energyRing1.position.y = floatY;
            energyRing2.position.y = floatY;

            // Rotating Olympic Plate
            plateGroup.rotation.z += 0.012;
            plateGroup.rotation.x += 0.006;
            plateGroup.position.y = -2.2 + Math.cos(elapsedTime * 0.9) * 0.25;

            // Floating Kettlebell (Black Spherical Orb)
            kbGroup.rotation.y += 0.01;
            kbGroup.position.y = 1.8 + Math.sin(elapsedTime * 1.1) * 0.3;

            // Neon Energy Rings
            energyRing1.rotation.z += 0.015;
            energyRing2.rotation.z -= 0.012;

            // Particle drift around right-side 3D scene
            particleField.rotation.y = elapsedTime * 0.02 + currentMouseX * 0.15;
            particleField.rotation.x = currentMouseY * 0.1;
          }

          // Camera subtle parallax
          camera.position.x = currentMouseX * 1.8;
          camera.position.y = -currentMouseY * 1.4;
          camera.lookAt(0, 0, 0);

          renderer.render(scene, camera);
        };

        animateThreeScene();
      } catch (err) {
        console.warn('Three.js WebGL initialization notice; starting 3D Canvas engine:', err);
        initCanvas3DHeroScene(heroCanvas, heroContainerSection, prefersReducedMotion);
      }
    } else {
      // Three.js not present; start self-contained 3D Canvas Engine
      initCanvas3DHeroScene(heroCanvas, heroContainerSection, prefersReducedMotion);
    }
  }

  /**
   * HTML5 Canvas 3D Projection Engine Fallback
   */
  function initCanvas3DHeroScene(canvas, section, prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.clientWidth;
    let height = canvas.height = canvas.clientHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    }, { passive: true });

    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // 3D Particles
    const particles = [];
    const count = 150;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1200,
        y: (Math.random() - 0.5) * 800,
        z: Math.random() * 800 + 100,
        size: Math.random() * 2 + 1
      });
    }

    let rotY = 0;
    let isVisible = true;

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => isVisible = e.isIntersecting);
      }, { threshold: 0.05 });
      obs.observe(section);
    }

    const render = () => {
      requestAnimationFrame(render);
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      const fov = 400;
      const cx = width > 768 ? width * 0.65 : width * 0.5;
      const cy = height * 0.45;

      if (!prefersReducedMotion) rotY += 0.01;

      // Draw 3D Particles
      particles.forEach(p => {
        if (!prefersReducedMotion) {
          p.z -= 0.8;
          if (p.z <= 10) p.z = 800;
        }

        const scale = fov / (p.z + fov);
        const isMobileFallback = width <= 768;
        const dbBaseX = isMobileFallback ? cx : width * 0.76;
        const dbBaseY = isMobileFallback ? cy : height * 0.50;
        const px = (p.x * 0.4 + mouseX * 80) * scale + (isMobileFallback ? cx : dbBaseX);
        const py = (p.y * 0.5 + mouseY * 60) * scale + (isMobileFallback ? cy : dbBaseY);

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.beginPath();
          ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(37, 211, 102, ${0.4 * scale})`;
          ctx.fill();
        }
      });

      // Draw Complete 3D Scene: Dumbbell, Black Spherical Orb & Orbit Rings (Right side on desktop)
      const isMobileFallback = width <= 768;
      const dbBaseX = isMobileFallback ? cx : width * 0.76;
      const dbBaseY = isMobileFallback ? cy : height * 0.50;
      const dbCenter = { x: dbBaseX + mouseX * 30, y: dbBaseY + mouseY * 25 };
      const barLen = 140;
      const cosR = Math.cos(rotY);
      const sinR = Math.sin(rotY);

      const x1 = dbCenter.x - (barLen / 2) * cosR;
      const y1 = dbCenter.y - (barLen / 4) * sinR;
      const x2 = dbCenter.x + (barLen / 2) * cosR;
      const y2 = dbCenter.y + (barLen / 4) * sinR;

      // Energy Ring 3D Orbit (concentric on right side)
      ctx.beginPath();
      ctx.ellipse(dbCenter.x, dbCenter.y, 110, 45, rotY * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(37, 211, 102, 0.45)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Black Glowing Spherical Orb (upper-left of dumbbell on right side)
      const orbX = dbCenter.x - 70;
      const orbY = dbCenter.y - 45;
      ctx.beginPath();
      ctx.arc(orbX, orbY, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#161c24';
      ctx.fill();
      ctx.strokeStyle = '#25d366';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Dumbbell Bar
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Weight Plates Left
      ctx.beginPath();
      ctx.ellipse(x1, y1, 16, 50, rotY, 0, Math.PI * 2);
      ctx.fillStyle = '#161c24';
      ctx.fill();
      ctx.strokeStyle = '#25d366';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Weight Plates Right
      ctx.beginPath();
      ctx.ellipse(x2, y2, 16, 50, rotY, 0, Math.PI * 2);
      ctx.fillStyle = '#161c24';
      ctx.fill();
      ctx.strokeStyle = '#25d366';
      ctx.lineWidth = 3;
      ctx.stroke();
    };

    render();
  }


  /* ==========================================================================
     16. ABOUT SECTION LAYERED PARALLAX SCROLL
     ========================================================================== */
  const aboutSection = document.getElementById('about');
  const mainImgWrap = document.querySelector('.main-img-wrapper');
  const accentImgWrap = document.querySelector('.accent-img-wrapper');
  const floatIcons = document.querySelectorAll('.about-floating-icon');
  const floatBadge = document.querySelector('.floating-badge');

  if (aboutSection && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = aboutSection.getBoundingClientRect();
          const winHeight = window.innerHeight;
          if (rect.top < winHeight && rect.bottom > 0) {
            const scrollPercent = (winHeight - rect.top) / (winHeight + rect.height);
            const offset = (scrollPercent - 0.5) * 60;

            if (mainImgWrap) mainImgWrap.style.transform = `translateY(${offset * -0.4}px) translateZ(10px)`;
            if (accentImgWrap) accentImgWrap.style.transform = `translateY(${offset * 0.5}px) translateZ(30px)`;
            if (floatBadge) floatBadge.style.transform = `translateY(${offset * 0.8}px) translateZ(45px)`;

            floatIcons.forEach((icon, i) => {
              const speed = (i + 1) * 0.35;
              icon.style.transform = `translateY(${offset * speed}px) translateZ(${35 + i * 8}px)`;
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  /* ==========================================================================
     17. HERO MOUSE-FOLLOW 3D PARALLAX ON TEXT & GLOW
     ========================================================================== */
  const heroTextSection = document.getElementById('home');
  const heroTitle = document.querySelector('.hero-title[data-3d-text="true"]');
  const heroBadge = document.querySelector('.hero-badge');
  const heroGlow1 = document.querySelector('.hero-glow-1');
  const heroGlow2 = document.querySelector('.hero-glow-2');

  if (heroTextSection && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    heroTextSection.addEventListener('mousemove', (e) => {
      const rect = heroTextSection.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      if (heroTitle) {
        heroTitle.style.transform = `perspective(1000px) rotateX(${-normY * 10}deg) rotateY(${normX * 10}deg) translateZ(20px)`;
      }
      if (heroBadge) {
        heroBadge.style.transform = `translate3d(${normX * 15}px, ${normY * 15}px, 15px)`;
      }
      if (heroGlow1) {
        heroGlow1.style.transform = `translate3d(${normX * -35}px, ${normY * -35}px, 0)`;
      }
      if (heroGlow2) {
        heroGlow2.style.transform = `translate3d(${normX * 45}px, ${normY * 45}px, 0)`;
      }
    });

    heroTextSection.addEventListener('mouseleave', () => {
      if (heroTitle) heroTitle.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      if (heroBadge) heroBadge.style.transform = 'none';
      if (heroGlow1) heroGlow1.style.transform = 'none';
      if (heroGlow2) heroGlow2.style.transform = 'none';
    });
  }

});
