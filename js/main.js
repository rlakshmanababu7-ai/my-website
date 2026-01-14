

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// ==================== LOAD CATEGORIES ====================

async function loadCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const result = await response.json();

    if (result.success && result.data) {
      renderCategories(result.data);
    } else {
      console.log('No categories available');
    }
  } catch (error) {
    console.error('Error loading categories:', error);
    // Silent fail - categories are optional
  }
}

// Render categories
function renderCategories(categories) {
  const container = document.getElementById('categoriesContainer');
  
  if (!container) return;
  
  if (categories.length === 0) {
    container.innerHTML = '<p class="text-muted w-100">No categories available</p>';
    return;
  }

  container.innerHTML = categories.map(category => {
    const iconUrl = category.icon_url || 'https://via.placeholder.com/80/FF6347/FFFFFF?text=' + encodeURIComponent(category.title.substring(0, 1));
    
    return `
      <div class="col-md-4 col-lg-3 col-sm-6">
        <div class="category-card text-center p-4 bg-white rounded shadow-sm hover-lift" style="cursor: pointer; transition: all 0.3s ease;">
          <div class="category-icon mb-3">
            <img src="${iconUrl}" alt="${category.title}" style="width: 80px; height: 80px; object-fit: contain; margin: 0 auto;">
          </div>
          <h5 class="text-danger fw-bold">${category.title}</h5>
          <p class="text-muted small mb-0">Browse Menu</p>
        </div>
      </div>
    `;
  }).join('');

  // Add hover effect
  const categoryCards = container.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 8px 16px rgba(220, 53, 69, 0.2)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    });
  });
}

// ==================== LOAD DISHES ====================

async function loadDishes() {
  try {
    const response = await fetch(`${API_BASE_URL}/dishes`);
    const result = await response.json();

    if (result.success && result.data) {
      renderDishes(result.data);
      setupCategoryFilter();
    } else {
      showError('Failed to load dishes');
    }
  } catch (error) {
    console.error('Error loading dishes:', error);
    showError('Error loading dishes. Make sure the server is running on http://localhost:5000');
  }
}


// Render dishes to the page
function renderDishes(dishes) {
  const container = document.getElementById('menuItemsContainer');
  
  if (!container) return;
  
  if (dishes.length === 0) {
    container.innerHTML = '<div class="alert alert-info w-100">No dishes available</div>';
    return;
  }

  container.innerHTML = dishes.map(dish => {
    const stars = generateStars(dish.stars);
    const price = typeof dish.price === 'number' ? dish.price.toFixed(2) : dish.price;
    
    return `
      <div class="col-md-6 col-lg-4 menu-item" data-category="all">
        <div class="food-card">
          <div class="food-image">
            <img src="${dish.image_url}" alt="${dish.title}" onerror="this.src='https://via.placeholder.com/280/FF6347/FFFFFF?text=No+Image'">
          </div>
          <div class="food-info p-3">
            <h5>${dish.title}</h5>
            <p class="text-muted small">${dish.description}</p>
            <div class="rating mb-2">
              ${stars}
              <span class="text-muted small ms-2">(${dish.ratings})</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <span class="price fw-bold text-danger h5">$${price}</span>
              <button class="btn btn-sm btn-danger add-to-cart-btn" data-id="${dish.id}" data-title="${dish.title}" data-price="${price}">
                <i class="fas fa-plus"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Add cart functionality
  setupAddToCart();
}

// Generate star rating HTML
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let starsHtml = '';

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star text-warning"></i>';
  }

  // Half star
  if (hasHalfStar) {
    starsHtml += '<i class="fas fa-star-half text-warning"></i>';
  }

  // Empty stars
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star text-warning"></i>';
  }

  return starsHtml;
}

// Setup add to cart functionality
function setupAddToCart() {
  const addButtons = document.querySelectorAll('.add-to-cart-btn');
  
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const dishId = btn.getAttribute('data-id');
      const dishTitle = btn.getAttribute('data-title');
      const dishPrice = btn.getAttribute('data-price');

      // Get existing cart from localStorage
      let cart = JSON.parse(localStorage.getItem('foodHubCart')) || [];

      // Check if item already exists in cart
      const existingItem = cart.find(item => item.id === parseInt(dishId));

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: parseInt(dishId),
          title: dishTitle,
          price: parseFloat(dishPrice),
          quantity: 1
        });
      }

      // Save to localStorage
      localStorage.setItem('foodHubCart', JSON.stringify(cart));

      // Show success message
      showSuccessMessage(`${dishTitle} added to cart!`);
    });
  });
}

// Show success message
function showSuccessMessage(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
  alertDiv.style.top = '20px';
  alertDiv.style.right = '20px';
  alertDiv.style.zIndex = '9999';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

// Show error message
function showError(message) {
  const container = document.getElementById('menuItemsContainer');
  if (container) {
    container.innerHTML = `
      <div class="alert alert-danger w-100">
        <strong>Error:</strong> ${message}
      </div>
    `;
  }
}

// Setup category filter
function setupCategoryFilter() {
  const categoryButtons = document.querySelectorAll('[data-category]');
  
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Since all items are loaded dynamically as 'all', we show/hide based on button
      const menuItems = document.querySelectorAll('.menu-item');
      menuItems.forEach(item => {
        item.style.display = 'block';
      });
    });
  });
}

// Cart functionality
document.addEventListener('DOMContentLoaded', () => {
  // Load categories on home page
  if (document.getElementById('categoriesContainer')) {
    loadCategories();
  }

  // Load dishes from API when on menu page
  if (document.getElementById('menuItemsContainer')) {
    loadDishes();
  }

  // Contact form
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for contacting FoodHub. We will respond within 2 hours.');
      contactForm.reset();
    });
  }
});

