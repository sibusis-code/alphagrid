// Animations - Scroll reveals, lazy loading, page transitions

// Intersection Observer for scroll animations
let scrollObserver = null;

// Initialize scroll reveal animations
function initScrollReveal() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible', 'revealed');
        
        // Optionally unobserve after animation
        if (entry.target.dataset.once !== 'false') {
          scrollObserver.unobserve(entry.target);
        }
      } else {
        // Remove class for elements that should re-animate
        if (entry.target.dataset.once === 'false') {
          entry.target.classList.remove('visible', 'revealed');
        }
      }
    });
  }, options);
  
  // Observe all elements with scroll animation classes
  observeScrollAnimations();
}

// Observe elements for scroll animations
function observeScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.fade-in-up, .scroll-reveal, .slide-up, .slide-in-left, .slide-in-right, .scale-in'
  );
  
  animatedElements.forEach(element => {
    if (scrollObserver) {
      scrollObserver.observe(element);
    }
  });
}

// Lazy load images
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if (!lazyImages.length) return;
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px'
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
}

// Stagger animation for elements
function staggerAnimation(selector, delay = 100) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element, index) => {
    element.style.animationDelay = `${index * delay}ms`;
  });
}

// Parallax effect for hero sections
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (!parallaxElements.length) return;
  
  const handleScroll = throttle(() => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }, 16); // ~60fps
  
  window.addEventListener('scroll', handleScroll);
}

// Count up animation for numbers
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;
  
  const updateCounter = () => {
    current += increment;
    
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };
  
  updateCounter();
}

// Initialize counters
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  
  if (!counters.length) return;
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.counter);
        const duration = parseInt(counter.dataset.duration) || 2000;
        
        animateCounter(counter, target, duration);
        counterObserver.unobserve(counter);
      }
    });
  }, {
    threshold: 0.5
  });
  
  counters.forEach(counter => counterObserver.observe(counter));
}

// Page transition animation
function initPageTransitions() {
  // Add page transition class to body
  document.body.classList.add('page-transition');
  
  // Handle internal link clicks for smoother transitions
  document.querySelectorAll('a[href^="/"]:not([target="_blank"]), a[href$=".html"]:not([target="_blank"])').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Skip if it's an anchor link or external
      if (href.startsWith('#') || href.startsWith('http')) {
        return;
      }
      
      // Only for same-domain links
      if (link.hostname === window.location.hostname) {
        e.preventDefault();
        
        // Fade out current page
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease-out';
        
        // Navigate after fade
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  });
}

// Typing effect for text
function typingEffect(element, text, speed = 50) {
  let index = 0;
  element.textContent = '';
  
  const type = () => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  };
  
  type();
}

// Initialize typing effects
function initTypingEffects() {
  const typingElements = document.querySelectorAll('[data-typing]');
  
  if (!typingElements.length) return;
  
  const typingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const text = element.dataset.typing || element.textContent;
        const speed = parseInt(element.dataset.typingSpeed) || 50;
        
        typingEffect(element, text, speed);
        typingObserver.unobserve(element);
      }
    });
  }, {
    threshold: 0.5
  });
  
  typingElements.forEach(element => typingObserver.observe(element));
}

// Ripple effect on click
function createRipple(e) {
  const button = e.currentTarget;
  const ripple = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  
  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${e.clientX - button.offsetLeft - radius}px`;
  ripple.style.top = `${e.clientY - button.offsetTop - radius}px`;
  ripple.classList.add('ripple-effect');
  
  const existingRipple = button.querySelector('.ripple-effect');
  if (existingRipple) {
    existingRipple.remove();
  }
  
  button.appendChild(ripple);
}

// Initialize ripple effects
function initRippleEffects() {
  const rippleButtons = document.querySelectorAll('[data-ripple]');
  
  rippleButtons.forEach(button => {
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.addEventListener('click', createRipple);
  });
  
  // Add ripple CSS
  const style = document.createElement('style');
  style.textContent = `
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple 600ms ease-out;
      pointer-events: none;
    }
    
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Fade in elements on scroll
function fadeInOnScroll() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  fadeElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementTop < windowHeight - 100) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
}

// Initialize all animations
function initAnimations() {
  // Initialize Intersection Observer for scroll reveals
  if ('IntersectionObserver' in window) {
    initScrollReveal();
    initLazyLoading();
    initCounters();
    initTypingEffects();
  } else {
    // Fallback for browsers without Intersection Observer
    document.querySelectorAll('.fade-in-up, .scroll-reveal').forEach(el => {
      el.classList.add('visible', 'revealed');
    });
    
    // Load all images immediately
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }
  
  // Initialize other animations
  initParallax();
  initPageTransitions();
  initRippleEffects();
  
  // Stagger product cards
  staggerAnimation('.product-card', 50);
}

// Refresh scroll animations (useful after dynamic content load)
function refreshScrollAnimations() {
  if (scrollObserver) {
    observeScrollAnimations();
  }
}

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
});

// Refresh animations on window load (for late-loaded content)
window.addEventListener('load', () => {
  refreshScrollAnimations();
});

// Export functions for use in other files
if (typeof window !== 'undefined') {
  window.refreshScrollAnimations = refreshScrollAnimations;
  window.observeScrollAnimations = observeScrollAnimations;
  window.staggerAnimation = staggerAnimation;
  window.animateCounter = animateCounter;
}
