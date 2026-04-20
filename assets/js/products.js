// Products Management - Load, render, and filter products

let allProducts = [];
let currentFilter = 'all';

function getSafeImagePath(path) {
  if (!path) return 'assets/images/products/placeholder.jpg';
  return encodeURI(path);
}

// Load products from JSON
async function loadProducts() {
  try {
    const response = await fetch('data/products.json');
    if (!response.ok) throw new Error('Failed to load products');
    
    const data = await response.json();
    allProducts = data.products;
    return allProducts;
  } catch (error) {
    console.error('Error loading products:', error);
    showToast('Error loading products. Please refresh the page.', 'error');
    return [];
  }
}

// Get unique product categories
function getCategories() {
  const categories = [...new Set(allProducts.map(product => product.category))];
  return ['All', ...categories];
}

// Filter products by category
function filterProducts(category) {
  currentFilter = category;
  
  if (category === 'all' || category === 'All') {
    return allProducts;
  }
  
  return allProducts.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
}

// Render product card
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card fade-in-up';
  card.dataset.category = product.category;
  card.dataset.productId = product.id;
  
  // Create a placeholder or use actual image
  const imageSrc = getSafeImagePath(product.imagePath);
  
  card.innerHTML = `
    <div class="product-card-image">
      <img src="${imageSrc}" alt="${product.name}" loading="lazy" 
           onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;background:#f5f5f5;color:#999;\\'>${product.category}</div>'">
    </div>
    <div class="product-card-content">
      <span class="product-card-category">${product.category}</span>
      <h3 class="product-card-title">${product.name}</h3>
      <p class="product-card-description">${truncateText(product.description, 120)}</p>
      ${product.partner ? `<p class="product-card-partner">Partner: ${product.partner}</p>` : ''}
      <button class="btn btn-outline btn-sm mt-4" onclick="showProductDetails(${product.id})">
        View Details
      </button>
    </div>
  `;
  
  // Add click handler for product modal
  card.addEventListener('click', (e) => {
    if (!e.target.closest('button')) {
      showProductDetails(product.id);
    }
  });
  
  return card;
}

// Render all products or filtered products
function renderProducts(products, containerId = 'products-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Show loading state
  container.innerHTML = '<div class="loading-container"><div class="loading"></div></div>';
  
  // Clear and render products
  setTimeout(() => {
    container.innerHTML = '';
    
    if (products.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
          <p style="font-size: 1.125rem; color: var(--color-gray-500);">
            No products found matching your criteria.
          </p>
        </div>
      `;
      return;
    }
    
    products.forEach((product, index) => {
      const card = createProductCard(product);
      // Add stagger animation delay
      card.style.animationDelay = `${index * 0.05}s`;
      container.appendChild(card);
    });
    
    // Trigger scroll reveal animations
    if (typeof observeScrollAnimations === 'function') {
      observeScrollAnimations();
    }
  }, 300);
}

// Render category filter buttons
function renderCategoryFilters(containerId = 'category-filters') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const categories = getCategories();
  container.innerHTML = '';
  
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = `filter-btn ${category === 'All' ? 'active' : ''}`;
    button.textContent = category;
    button.dataset.category = category;
    
    button.addEventListener('click', () => {
      // Update active state
      container.querySelectorAll('.filter-btn').forEach(btn => 
        btn.classList.remove('active')
      );
      button.classList.add('active');
      
      // Filter and render products
      const filtered = filterProducts(category);
      renderProducts(filtered);
    });
    
    container.appendChild(button);
  });
}

// Show product details in modal
function showProductDetails(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;
  
  const modalOverlay = document.getElementById('product-modal');
  if (!modalOverlay) {
    createProductModal();
    return showProductDetails(productId);
  }
  
  const modalBody = modalOverlay.querySelector('.modal-body');
  
  modalBody.innerHTML = `
    <div class="product-detail">
      <div class="product-detail-image" style="margin-bottom: 1.5rem;">
        <img src="${getSafeImagePath(product.imagePath)}" 
             alt="${product.name}" 
             style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 0.5rem;"
             onerror="this.style.display='none'">
      </div>
      
      <div class="product-detail-content">
        <span class="product-card-category">${product.category}</span>
        <h2 class="modal-title" style="margin-top: 0.75rem; margin-bottom: 1rem;">${product.name}</h2>
        
        <p style="color: var(--color-gray-600); line-height: 1.75; margin-bottom: 1.5rem;">
          ${product.description}
        </p>
        
        ${product.specifications && product.specifications.length > 0 ? `
          <h3 style="font-size: 1.125rem; margin-bottom: 0.75rem; color: var(--color-primary);">
            Specifications
          </h3>
          <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem;">
            ${product.specifications.map(spec => `
              <li style="margin-bottom: 0.5rem; color: var(--color-gray-700);">${spec}</li>
            `).join('')}
          </ul>
        ` : ''}
        
        ${product.features && product.features.length > 0 ? `
          <h3 style="font-size: 1.125rem; margin-bottom: 0.75rem; color: var(--color-primary);">
            Key Features
          </h3>
          <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem;">
            ${product.features.map(feature => `
              <li style="margin-bottom: 0.5rem; color: var(--color-gray-700);">${feature}</li>
            `).join('')}
          </ul>
        ` : ''}
        
        ${product.partner ? `
          <p style="font-style: italic; color: var(--color-gray-500); margin-bottom: 1.5rem;">
            <strong>Partner:</strong> ${product.partner}
          </p>
        ` : ''}
        
        <div style="margin-top: 2rem;">
          <a href="quote.html?product=${encodeURIComponent(product.name)}" class="btn btn-accent">
            Request Quote
          </a>
        </div>
      </div>
    </div>
  `;
  
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Create product modal if it doesn't exist
function createProductModal() {
  const modal = document.createElement('div');
  modal.id = 'product-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">Product Details</h2>
        <span class="modal-close" onclick="closeProductModal()">&times;</span>
      </div>
      <div class="modal-body"></div>
    </div>
  `;
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProductModal();
    }
  });
  
  document.body.appendChild(modal);
}

// Close product modal
function closeProductModal() {
  const modalOverlay = document.getElementById('product-modal');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Initialize products page
async function initProducts(containerId = 'products-grid') {
  await loadProducts();
  
  // Render filters if container exists
  const filtersContainer = document.getElementById('category-filters');
  if (filtersContainer) {
    renderCategoryFilters();
  }
  
  // Render all products initially
  renderProducts(allProducts, containerId);
}

// Get random products for homepage
function getRandomProducts(count = 6) {
  const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Get products by category
function getProductsByCategory(category, limit = null) {
  const filtered = filterProducts(category);
  return limit ? filtered.slice(0, limit) : filtered;
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal();
  }
});

// Auto-initialize if on products page
if (document.getElementById('products-grid')) {
  document.addEventListener('DOMContentLoaded', () => {
    initProducts();
  });
}
