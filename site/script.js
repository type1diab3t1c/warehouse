// ===== Mobile Navigation Toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ===== Lightbox =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');

let currentImages = [];
let currentIndex = 0;

// Collect gallery items and attach click handlers
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const section = item.getAttribute('data-section');
    const sectionItems = document.querySelectorAll(`.gallery-item[data-section="${section}"]`);
    currentImages = Array.from(sectionItems).map(el => el.querySelector('img'));
    currentIndex = currentImages.indexOf(item.querySelector('img'));
    openLightbox();
  });
});

function openLightbox() {
  lightboxImg.src = currentImages[currentIndex].src;
  lightboxImg.alt = currentImages[currentIndex].alt;
  lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  resetZoom();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateLightbox();
}

function showNext() {
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateLightbox();
}

function updateLightbox() {
  resetZoom();
  lightboxImg.src = currentImages[currentIndex].src;
  lightboxImg.alt = currentImages[currentIndex].alt;
  lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
}

// ===== Lightbox Zoom =====
const lightboxContent = lightbox.querySelector('.lightbox-content');

function resetZoom() {
  lightboxContent.classList.remove('zoomed');
  lightboxContent.scrollTop = 0;
  lightboxContent.scrollLeft = 0;
}

lightboxImg.addEventListener('click', (e) => {
  e.stopPropagation();
  const isZoomed = lightboxContent.classList.toggle('zoomed');
  if (isZoomed) {
    // Scroll to the click point after zoom
    requestAnimationFrame(() => {
      const rect = lightboxContent.getBoundingClientRect();
      const img = lightboxImg;
      const scaleX = img.naturalWidth / rect.width;
      const scaleY = img.naturalHeight / rect.height;
      const clickX = (e.clientX - rect.left) / rect.width;
      const clickY = (e.clientY - rect.top) / rect.height;
      lightboxContent.scrollLeft = (img.naturalWidth - rect.width) * clickX;
      lightboxContent.scrollTop = (img.naturalHeight - rect.height) * clickY;
    });
  }
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

// Close on background click
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
    closeLightbox();
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// ===== Scroll-based nav active state =====
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = '#d4a04a';
        } else {
          link.style.color = '';
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ===== Fade-in on scroll =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply fade-in to key elements
document.querySelectorAll('.spec-card, .area-card, .gallery-item, .area-details, .contact-card, .contact-info-card, .summary-table-wrap').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(el);
});

// Stagger gallery items
document.querySelectorAll('.gallery').forEach(gallery => {
  const items = gallery.querySelectorAll('.gallery-item');
  items.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.08}s`;
  });
});

// ===== Touch swipe support for lightbox =====
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) showNext();
    else showPrev();
  }
});
