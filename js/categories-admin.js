// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
let allCategories = [];
let deleteTargetId = null;

// ==================== LOAD CATEGORIES ====================

async function loadCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const result = await response.json();

    if (result.success && result.data) {
      allCategories = result.data;
      renderCategoriesTable(allCategories);
      updateStats(result.data);
      showToast('Categories loaded successfully', 'success');
    } else {
      showError('Failed to load categories');
    }
  } catch (error) {
    console.error('Error loading categories:', error);
    showError('Error loading categories. Make sure the server is running on http://localhost:5000');
  }
}

// ==================== RENDER TABLE ====================

function renderCategoriesTable(categories) {
  const tableBody = document.getElementById('categoriesTableBody');

  if (categories.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4 text-muted">
          No categories found. Add one to get started!
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = categories.map(category => {
    const iconUrl = category.icon_url || 'https://via.placeholder.com/40/FF6347/FFFFFF?text=' + encodeURIComponent(category.title.substring(0, 1));
    const createdDate = new Date(category.created_at).toLocaleDateString();
    
    return `
      <tr>
        <td><strong>#${category.id}</strong></td>
        <td><strong>${category.title}</strong></td>
        <td>
          <img src="${iconUrl}" alt="${category.title}" 
               style="width: 40px; height: 40px; object-fit: contain; border-radius: 4px;"
               onerror="this.src='https://via.placeholder.com/40/FF6347/FFFFFF?text=Img'">
        </td>
        <td><small class="text-muted">${createdDate}</small></td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-warning" onclick="openEditModal(${category.id})">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-sm btn-danger" onclick="openDeleteModal(${category.id}, '${category.title}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ==================== ADD CATEGORY ====================

document.getElementById('addCategoryForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    title: document.getElementById('title').value,
    icon_url: document.getElementById('icon_url').value || null
  };

  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
      showToast(`Category "${formData.title}" added successfully!`, 'success');
      document.getElementById('addCategoryForm').reset();
      document.getElementById('addPreview').innerHTML = '<span class="text-muted">No image</span>';
      loadCategories();
    } else {
      showToast(result.message || 'Error adding category', 'error');
    }
  } catch (error) {
    console.error('Error adding category:', error);
    showToast('Error adding category. Check server connection.', 'error');
  }
});

// Preview icon while typing
document.getElementById('icon_url').addEventListener('change', function() {
  updateIconPreview(this.value, 'addPreview');
});

// ==================== EDIT CATEGORY ====================

function openEditModal(categoryId) {
  const category = allCategories.find(c => c.id === categoryId);
  
  if (!category) {
    showToast('Category not found', 'error');
    return;
  }

  document.getElementById('editCategoryId').value = category.id;
  document.getElementById('editTitle').value = category.title;
  document.getElementById('editIconUrl').value = category.icon_url || '';
  
  // Update preview
  if (category.icon_url) {
    updateIconPreview(category.icon_url, 'editPreview');
  } else {
    document.getElementById('editPreview').innerHTML = '<span class="text-muted">No image</span>';
  }

  const editModal = new bootstrap.Modal(document.getElementById('editModal'));
  editModal.show();
}

document.getElementById('editIconUrl').addEventListener('change', function() {
  updateIconPreview(this.value, 'editPreview');
});

async function submitEditForm() {
  const categoryId = document.getElementById('editCategoryId').value;
  
  const formData = {
    title: document.getElementById('editTitle').value,
    icon_url: document.getElementById('editIconUrl').value || null
  };

  try {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
      showToast(`Category "${formData.title}" updated successfully!`, 'success');
      
      // Close modal
      const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
      editModal.hide();
      
      loadCategories();
    } else {
      showToast(result.message || 'Error updating category', 'error');
    }
  } catch (error) {
    console.error('Error updating category:', error);
    showToast('Error updating category. Check server connection.', 'error');
  }
}

// ==================== DELETE CATEGORY ====================

function openDeleteModal(categoryId, categoryTitle) {
  deleteTargetId = categoryId;
  document.getElementById('deleteCategoryName').textContent = categoryTitle;
  
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  deleteModal.show();
}

async function confirmDelete() {
  if (deleteTargetId === null) return;

  try {
    const response = await fetch(`${API_BASE_URL}/categories/${deleteTargetId}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (result.success) {
      showToast('Category deleted successfully!', 'success');
      
      // Close modal
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
      deleteModal.hide();
      
      deleteTargetId = null;
      loadCategories();
    } else {
      showToast(result.message || 'Error deleting category', 'error');
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    showToast('Error deleting category. Check server connection.', 'error');
  }
}

// ==================== SEARCH ====================

document.getElementById('searchInput').addEventListener('keyup', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  
  const filteredCategories = allCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm)
  );

  renderCategoriesTable(filteredCategories);
});

// ==================== STATS ====================

function updateStats(categories) {
  document.getElementById('totalCategories').textContent = categories.length;
  document.getElementById('categoryStatus').textContent = '✓';
}

// ==================== ICON PREVIEW ====================

function updateIconPreview(imageUrl, previewId) {
  const preview = document.getElementById(previewId);
  
  if (!imageUrl) {
    preview.innerHTML = '<span class="text-muted">No image</span>';
    return;
  }

  const img = document.createElement('img');
  img.src = imageUrl;
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'contain';
  img.onerror = function() {
    preview.innerHTML = '<span class="text-danger">Invalid URL</span>';
  };
  
  preview.innerHTML = '';
  preview.appendChild(img);
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
  const tableBody = document.getElementById('categoriesTableBody');
  tableBody.innerHTML = `
    <tr>
      <td colspan="5" class="text-center py-4">
        <div class="alert alert-danger mb-0">
          <i class="fas fa-exclamation-circle"></i> ${message}
        </div>
      </td>
    </tr>
  `;
}

// ==================== INITIALIZE ====================

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
});
