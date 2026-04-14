// Navigation - Mobile menu, active states, smooth scrolling

// Toggle mobile menu
function toggleMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (!mobileMenuBtn || !mobileNav) return;
  
  const isActive = mobileNav.classList.contains('active');
  
  if (isActive) {
    mobileNav.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    document.body.style.overflow = '';
  } else {
    mobileNav.classList.add('active');
    mobileMenuBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// Close mobile menu
function closeMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (mobileNav) {
    mobileNav.classList.remove('active');
  }
  
  if (mobileMenuBtn) {
    mobileMenuBtn.classList.remove('active');
  }
  
  document.body.style.overflow = '';
}

// Set active navigation link based on current page
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Get all nav links
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    
    // Remove active class from all links
    link.classList.remove('active');
    
    // Add active class to current page link
    if (linkHref === currentPage || 
        (currentPage === '' && linkHref === 'index.html') ||
        (currentPage === 'index.html' && linkHref === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Smooth scroll to section
function smoothScrollTo(targetId, offset = 80) {
  const target = document.getElementById(targetId);
  
  if (target) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = targetPosition - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// Handle hash navigation (e.g., #about)
function handleHashNavigation() {
  const hash = window.location.hash;
  
  if (hash) {
    const targetId = hash.substring(1);
    setTimeout(() => {
      smoothScrollTo(targetId);
    }, 100);
  }
}

// Sticky header on scroll
function handleStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  const scrollThreshold = 100;
  
  const handleScroll = throttle(() => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, 100);
  
  window.addEventListener('scroll', handleScroll);
}

// Hide header on scroll down, show on scroll up
function handleAutoHideHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let lastScrollTop = 0;
  const scrollThreshold = 5;
  
  const handleScroll = throttle(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (Math.abs(scrollTop - lastScrollTop) < scrollThreshold) {
      return;
    }
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, 100);
  
  // Uncomment to enable auto-hide header
  // window.addEventListener('scroll', handleScroll);
}

// Back to top button
function initBackToTop() {
  // Create back to top button
  const backToTop = document.createElement('button');
  backToTop.id = 'back-to-top';
  backToTop.innerHTML = '↑';
  backToTop.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--color-accent);
    color: white;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-fixed);
  `;
  
  document.body.appendChild(backToTop);
  
  // Show/hide on scroll
  const handleScroll = throttle(() => {
    if (window.scrollY > 300) {
      backToTop.style.opacity = '1';
      backToTop.style.visibility = 'visible';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.visibility = 'hidden';
    }
  }, 100);
  
  window.addEventListener('scroll', handleScroll);
  
  // Scroll to top on click
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Hover effect
  backToTop.addEventListener('mouseenter', () => {
    backToTop.style.transform = 'scale(1.1)';
  });
  
  backToTop.addEventListener('mouseleave', () => {
    backToTop.style.transform = 'scale(1)';
  });
}

// Initialize navigation
function initNavigation() {
  // Set active nav link
  setActiveNavLink();
  
  // Handle mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  // Close mobile menu when clicking on a link
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  // Close mobile menu on window resize (when switching to desktop)
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth >= 768) {
      closeMobileMenu();
    }
  }, 250));
  
  // Handle hash navigation
  handleHashNavigation();
  window.addEventListener('hashchange', handleHashNavigation);
  
  // Initialize sticky header
  handleStickyHeader();
  
  // Initialize back to top button
  initBackToTop();
  
  // Handle internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      
      if (targetId) {
        e.preventDefault();
        smoothScrollTo(targetId);
        
        // Update URL hash without jumping
        history.pushState(null, null, `#${targetId}`);
        
        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });
}

// Handle keyboard navigation
function initKeyboardNavigation() {
  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });
  
  // Trap focus in mobile menu when open
  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileNav) {
    mobileNav.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && !mobileNav.classList.contains('active')) {
        return;
      }
      
      const focusableElements = mobileNav.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }
}

// Initialize breadcrumbs
function initBreadcrumbs() {
  const breadcrumbContainer = document.querySelector('.breadcrumb');
  if (!breadcrumbContainer) return;
  
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const pageName = currentPage.replace('.html', '').replace('-', ' ');
  
  breadcrumbContainer.innerHTML = `
    <a href="index.html">Home</a>
    <span> / </span>
    <span>${pageName.charAt(0).toUpperCase() + pageName.slice(1)}</span>
  `;
}

// Initialize all navigation features on page load
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initKeyboardNavigation();
  initBreadcrumbs();
});

// Export functions for use in other files
if (typeof window !== 'undefined') {
  window.toggleMobileMenu = toggleMobileMenu;
  window.closeMobileMenu = closeMobileMenu;
  window.smoothScrollTo = smoothScrollTo;
}
