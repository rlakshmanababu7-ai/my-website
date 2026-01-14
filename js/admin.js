// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
let allDishes = [];
let deleteTargetId = null;

// ==================== LOAD DISHES ====================

async function loadDishes() {
  try {
    const response = await fetch(`${API_BASE_URL}/dishes`);
    const result = await response.json();

    if (result.success && result.data) {
      allDishes = result.data;
      renderDishesTable(allDishes);
      updateStats(result.data);
      showToast('Dishes loaded successfully', 'success');
    } else {
      showError('Failed to load dishes');
    }
  } catch (error) {
    console.error('Error loading dishes:', error);
    showError('Error loading dishes. Make sure the server is running on http://localhost:5000');
  }
}

// ==================== RENDER TABLE ====================

function renderDishesTable(dishes) {
  const tableBody = document.getElementById('dishesTableBody');

  if (dishes.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4 text-muted">
          No dishes found. Add one to get started!
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = dishes.map(dish => {
    const price = typeof dish.price === 'number' ? dish.price.toFixed(2) : dish.price;
    const stars = dish.stars || 0;
    
    return `
      <tr>
        <td><strong>#${dish.id}</strong></td>
        <td>
          <div class="d-flex align-items-center">
            <img src="${dish.image_url}" alt="${dish.title}" 
                 style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; margin-right: 10px;"
                 onerror="this.src='https://via.placeholder.com/40/FF6347/FFFFFF?text=Img'">
            <div>
              <div class="fw-bold">${dish.title}</div>
              <small class="text-muted">ID: ${dish.id}</small>
            </div>
          </div>
        </td>
        <td>
          <small class="text-truncate d-block" style="max-width: 200px;" title="${dish.description}">
            ${dish.description}
          </small>
        </td>
        <td><strong class="text-danger">$${price}</strong></td>
        <td>
          <div>
            <i class="fas fa-star text-warning"></i> ${stars}
            <br>
            <small class="text-muted">${dish.ratings} ratings</small>
          </div>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-warning" onclick="openEditModal(${dish.id})">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-sm btn-danger" onclick="openDeleteModal(${dish.id}, '${dish.title}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ==================== ADD DISH ====================

document.getElementById('addDishForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    price: parseFloat(document.getElementById('price').value),
    image_url: document.getElementById('image_url').value,
    stars: parseFloat(document.getElementById('stars').value) || 0,
    ratings: parseInt(document.getElementById('ratings').value) || 0
  };

  try {
    const response = await fetch(`${API_BASE_URL}/dishes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
      showToast(`Dish "${formData.title}" added successfully!`, 'success');
      document.getElementById('addDishForm').reset();
      loadDishes();
    } else {
      showToast(result.message || 'Error adding dish', 'error');
    }
  } catch (error) {
    console.error('Error adding dish:', error);
    showToast('Error adding dish. Check server connection.', 'error');
  }
});

// ==================== EDIT DISH ====================

function openEditModal(dishId) {
  const dish = allDishes.find(d => d.id === dishId);
  
  if (!dish) {
    showToast('Dish not found', 'error');
    return;
  }

  document.getElementById('editDishId').value = dish.id;
  document.getElementById('editTitle').value = dish.title;
  document.getElementById('editDescription').value = dish.description;
  document.getElementById('editPrice').value = dish.price;
  document.getElementById('editStars').value = dish.stars || 0;
  document.getElementById('editRatings').value = dish.ratings || 0;
  document.getElementById('editImageUrl').value = dish.image_url;

  const editModal = new bootstrap.Modal(document.getElementById('editModal'));
  editModal.show();
}

async function submitEditForm() {
  const dishId = document.getElementById('editDishId').value;
  
  const formData = {
    title: document.getElementById('editTitle').value,
    description: document.getElementById('editDescription').value,
    price: parseFloat(document.getElementById('editPrice').value),
    image_url: document.getElementById('editImageUrl').value,
    stars: parseFloat(document.getElementById('editStars').value),
    ratings: parseInt(document.getElementById('editRatings').value)
  };

  try {
    const response = await fetch(`${API_BASE_URL}/dishes/${dishId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
      showToast(`Dish "${formData.title}" updated successfully!`, 'success');
      
      // Close modal
      const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
      editModal.hide();
      
      loadDishes();
    } else {
      showToast(result.message || 'Error updating dish', 'error');
    }
  } catch (error) {
    console.error('Error updating dish:', error);
    showToast('Error updating dish. Check server connection.', 'error');
  }
}

// ==================== DELETE DISH ====================

function openDeleteModal(dishId, dishTitle) {
  deleteTargetId = dishId;
  document.getElementById('deleteDishName').textContent = dishTitle;
  
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  deleteModal.show();
}

async function confirmDelete() {
  if (deleteTargetId === null) return;

  try {
    const response = await fetch(`${API_BASE_URL}/dishes/${deleteTargetId}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (result.success) {
      showToast('Dish deleted successfully!', 'success');
      
      // Close modal
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
      deleteModal.hide();
      
      deleteTargetId = null;
      loadDishes();
    } else {
      showToast(result.message || 'Error deleting dish', 'error');
    }
  } catch (error) {
    console.error('Error deleting dish:', error);
    showToast('Error deleting dish. Check server connection.', 'error');
  }
}

// ==================== SEARCH ====================

document.getElementById('searchInput').addEventListener('keyup', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  
  const filteredDishes = allDishes.filter(dish =>
    dish.title.toLowerCase().includes(searchTerm) ||
    dish.description.toLowerCase().includes(searchTerm)
  );

  renderDishesTable(filteredDishes);
});

// ==================== STATS ====================

function updateStats(dishes) {
  // Total dishes
  document.getElementById('totalDishes').textContent = dishes.length;

  // Average rating
  if (dishes.length > 0) {
    const avgRating = (dishes.reduce((sum, dish) => sum + (dish.stars || 0), 0) / dishes.length).toFixed(1);
    document.getElementById('avgRating').textContent = avgRating;
  } else {
    document.getElementById('avgRating').textContent = '-';
  }
}

// ==================== TOAST NOTIFICATIONS ====================

function showToast(message, type = 'info') {
  const alertDiv = document.createElement('div');
  const bgClass = {
    'success': 'alert-success',
    'error': 'alert-danger',
    'info': 'alert-info'
  }[type] || 'alert-info';

  alertDiv.className = `alert ${bgClass} alert-dismissible fade show position-fixed`;
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
  }, 4000);
}

function showError(message) {
  const tableBody = document.getElementById('dishesTableBody');
  tableBody.innerHTML = `
    <tr>
      <td colspan="6" class="text-center py-4">
        <div class="alert alert-danger mb-0">
          <i class="fas fa-exclamation-circle"></i> ${message}
        </div>
      </td>
    </tr>
  `;
}

// ==================== INITIALIZE ====================

document.addEventListener('DOMContentLoaded', () => {
  loadDishes();
});
