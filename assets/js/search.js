// Search Functionality - Client-side product search

let searchIndex = [];
let searchResults = [];

// Build search index from products
function buildSearchIndex(products) {
  searchIndex = products.map(product => ({
    id: product.id,
    name: product.name.toLowerCase(),
    category: product.category.toLowerCase(),
    description: product.description.toLowerCase(),
    specifications: product.specifications ? product.specifications.join(' ').toLowerCase() : '',
    features: product.features ? product.features.join(' ').toLowerCase() : '',
    partner: product.partner ? product.partner.toLowerCase() : '',
    product: product // Store original product reference
  }));
}

// Search products by query
function searchProducts(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  const searchTerm = query.toLowerCase().trim();
  const words = searchTerm.split(' ').filter(word => word.length > 0);
  
  const results = searchIndex.filter(item => {
    // Check if any search word matches in any field
    return words.some(word => 
      item.name.includes(word) ||
      item.category.includes(word) ||
      item.description.includes(word) ||
      item.specifications.includes(word) ||
      item.features.includes(word) ||
      item.partner.includes(word)
    );
  });
  
  // Score and sort results by relevance
  const scored = results.map(item => {
    let score = 0;
    
    words.forEach(word => {
      // Exact match in name (highest priority)
      if (item.name === searchTerm) score += 100;
      else if (item.name.includes(word)) score += 50;
      
      // Match in category
      if (item.category.includes(word)) score += 30;
      
      // Match in description
      if (item.description.includes(word)) score += 10;
      
      // Match in specifications
      if (item.specifications.includes(word)) score += 8;
      
      // Match in features
      if (item.features.includes(word)) score += 8;
      
      // Match in partner
      if (item.partner.includes(word)) score += 15;
    });
    
    return { ...item, score };
  });
  
  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);
  
  return scored.map(item => item.product);
}

// Render search results dropdown
function renderSearchResults(results, containerId = 'search-results') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  
  if (results.length === 0) {
    container.innerHTML = `
      <div style="padding: 1rem; text-align: center; color: var(--color-gray-500);">
        No products found
      </div>
    `;
    container.style.display = 'block';
    return;
  }
  
  // Limit to top 8 results in dropdown
  const limitedResults = results.slice(0, 8);
  
  limitedResults.forEach(product => {
    const item = document.createElement('div');
    item.className = 'search-result-item';
    item.style.cssText = `
      padding: 0.75rem 1rem;
      cursor: pointer;
      border-bottom: 1px solid var(--color-gray-200);
      transition: background-color var(--transition-fast);
    `;
    
    item.innerHTML = `
      <div style="font-weight: 600; color: var(--color-primary); margin-bottom: 0.25rem;">
        ${product.name}
      </div>
      <div style="font-size: 0.875rem; color: var(--color-gray-600);">
        ${product.category}
      </div>
    `;
    
    item.addEventListener('mouseenter', () => {
      item.style.backgroundColor = 'var(--color-gray-100)';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.backgroundColor = '';
    });
    
    item.addEventListener('click', () => {
      showProductDetails(product.id);
      container.style.display = 'none';
      document.getElementById('search-input').value = '';
    });
    
    container.appendChild(item);
  });
  
  // Add "View all results" if more than 8 results
  if (results.length > 8) {
    const viewAll = document.createElement('div');
    viewAll.style.cssText = `
      padding: 0.75rem 1rem;
      text-align: center;
      font-weight: 600;
      color: var(--color-accent);
      cursor: pointer;
    `;
    viewAll.textContent = `View all ${results.length} results`;
    
    viewAll.addEventListener('click', () => {
      window.location.href = `products.html?search=${encodeURIComponent(document.getElementById('search-input').value)}`;
    });
    
    container.appendChild(viewAll);
  }
  
  container.style.display = 'block';
}

// Initialize search functionality
function initSearch(inputId = 'search-input', resultsId = 'search-results') {
  const searchInput = document.getElementById(inputId);
  const searchResults = document.getElementById(resultsId);
  
  if (!searchInput) return;
  
  // Create results container if it doesn't exist
  if (!searchResults) {
    const resultsDiv = document.createElement('div');
    resultsDiv.id = resultsId;
    resultsDiv.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border-radius: 0.5rem;
      box-shadow: var(--shadow-lg);
      margin-top: 0.5rem;
      max-height: 400px;
      overflow-y: auto;
      display: none;
      z-index: var(--z-dropdown);
    `;
    searchInput.parentElement.style.position = 'relative';
    searchInput.parentElement.appendChild(resultsDiv);
  }
  
  // Build search index from loaded products
  if (allProducts.length > 0) {
    buildSearchIndex(allProducts);
  } else {
    // Wait for products to load
    loadProducts().then(products => {
      buildSearchIndex(products);
    });
  }
  
  // Debounced search handler
  const debouncedSearch = debounce((query) => {
    if (query.trim().length < 2) {
      document.getElementById(resultsId).style.display = 'none';
      return;
    }
    
    const results = searchProducts(query);
    renderSearchResults(results, resultsId);
  }, 300);
  
  // Handle input
  searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });
  
  // Handle Enter key
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value.trim();
      if (query.length >= 2) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
      }
    }
  });
  
  // Close results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !document.getElementById(resultsId).contains(e.target)) {
      document.getElementById(resultsId).style.display = 'none';
    }
  });
}

// Handle search on products page from URL parameter
function handleProductsPageSearch() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  
  if (searchQuery && allProducts.length > 0) {
    const results = searchProducts(searchQuery);
    renderProducts(results);
    
    // Update page title or add search indicator
    const pageTitle = document.querySelector('.section-title');
    if (pageTitle) {
      pageTitle.textContent = `Search Results for "${searchQuery}"`;
    }
    
    // Optionally show result count
    const container = document.getElementById('products-grid');
    if (container && results.length > 0) {
      const resultCount = document.createElement('p');
      resultCount.style.cssText = 'text-align: center; color: var(--color-gray-600); margin-bottom: 2rem;';
      resultCount.textContent = `Found ${results.length} product${results.length !== 1 ? 's' : ''}`;
      container.parentElement.insertBefore(resultCount, container);
    }
  }
}

// Initialize search when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure products are loaded
  setTimeout(() => {
    initSearch();
    
    // Handle search parameter on products page
    if (window.location.pathname.includes('products.html')) {
      handleProductsPageSearch();
    }
  }, 500);
});
