// ==================== ADD CATEGORIES - CODE EXAMPLES ====================

// 1. SIMPLE FETCH REQUEST TO ADD CATEGORY
fetch('http://localhost:5000/api/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Burgers',
    icon_url: 'https://via.placeholder.com/80/FF6347/FFFFFF?text=🍔'
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Category added:', data.data);
    // Show success message
    alert(`Category "${data.data.title}" added successfully!`);
  } else {
    console.error('Error:', data.message);
  }
})
.catch(error => console.error('Network error:', error));


// ==================== 2. ADD CATEGORY WITH FORM DATA ====================

const categoryForm = document.getElementById('addCategoryForm');

categoryForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    title: document.getElementById('categoryTitle').value,
    icon_url: document.getElementById('categoryIcon').value
  };

  try {
    const response = await fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
      console.log('Category added successfully:', result.data);
      categoryForm.reset();
      // Reload categories list
      loadCategories();
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error adding category:', error);
    alert('Failed to add category');
  }
});


// ==================== 3. ADD CATEGORY WITH VALIDATION ====================

async function addCategoryWithValidation(title, iconUrl) {
  // Validation
  if (!title || title.trim() === '') {
    alert('Please enter category title');
    return false;
  }

  if (title.length < 3) {
    alert('Title must be at least 3 characters');
    return false;
  }

  // Show loading
  const loadingSpinner = document.getElementById('loading');
  if (loadingSpinner) loadingSpinner.style.display = 'block';

  try {
    const response = await fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        icon_url: iconUrl || null
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('✓ Category added:', data.data);
      return true;
    } else {
      console.error('✗ Error:', data.message);
      alert('Error: ' + data.message);
      return false;
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Failed to connect to server');
    return false;
  } finally {
    if (loadingSpinner) loadingSpinner.style.display = 'none';
  }
}


// ==================== 4. LOAD ALL CATEGORIES ====================

async function loadCategories() {
  try {
    const response = await fetch('http://localhost:5000/api/categories');
    const result = await response.json();

    if (result.success) {
      console.log('Categories:', result.data);
      displayCategories(result.data);
    } else {
      console.error('Error loading categories:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

function displayCategories(categories) {
  const container = document.getElementById('categoriesContainer');
  
  if (categories.length === 0) {
    container.innerHTML = '<p>No categories found</p>';
    return;
  }

  container.innerHTML = categories.map(category => `
    <div class="category-item">
      <img src="${category.icon_url}" alt="${category.title}">
      <h4>${category.title}</h4>
      <p>ID: ${category.id}</p>
    </div>
  `).join('');
}


// ==================== 5. UPDATE CATEGORY ====================

async function updateCategory(categoryId, title, iconUrl) {
  try {
    const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        icon_url: iconUrl
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('✓ Category updated');
      loadCategories(); // Reload list
      return true;
    } else {
      alert('Error: ' + data.message);
      return false;
    }
  } catch (error) {
    console.error('Error updating category:', error);
    return false;
  }
}


// ==================== 6. DELETE CATEGORY ====================

async function deleteCategory(categoryId) {
  // Confirm before delete
  if (!confirm('Are you sure you want to delete this category?')) {
    return false;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      console.log('✓ Category deleted');
      loadCategories(); // Reload list
      return true;
    } else {
      alert('Error: ' + data.message);
      return false;
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
}


// ==================== 7. GET SINGLE CATEGORY ====================

async function getCategory(categoryId) {
  try {
    const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`);
    const result = await response.json();

    if (result.success) {
      console.log('Category:', result.data);
      return result.data;
    } else {
      console.error('Error:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}


// ==================== 8. COMPLETE EXAMPLE WITH HTML ====================

/*
HTML:
------
<form id="categoryForm">
  <input type="text" id="categoryTitle" placeholder="Category Title" required>
  <input type="url" id="categoryIcon" placeholder="Icon URL (optional)">
  <button type="submit">Add Category</button>
</form>

<div id="categoriesList"></div>

JavaScript:
-----------
*/

document.getElementById('categoryForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('categoryTitle').value;
  const iconUrl = document.getElementById('categoryIcon').value;

  const response = await fetch('http://localhost:5000/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, icon_url: iconUrl })
  });

  const data = await response.json();

  if (data.success) {
    document.getElementById('categoryForm').reset();
    loadCategoriesList();
  }
});

async function loadCategoriesList() {
  const response = await fetch('http://localhost:5000/api/categories');
  const data = await response.json();

  if (data.success) {
    const html = data.data.map(cat => `
      <div class="category-row">
        <img src="${cat.icon_url}" alt="${cat.title}" width="50">
        <h5>${cat.title}</h5>
        <button onclick="updateCategory(${cat.id}, '${cat.title}', '${cat.icon_url}')">Edit</button>
        <button onclick="deleteCategory(${cat.id})">Delete</button>
      </div>
    `).join('');
    
    document.getElementById('categoriesList').innerHTML = html;
  }
}

loadCategoriesList();


// ==================== 9. SAMPLE CATEGORIES TO ADD ====================

/*
Sample Categories:

{
  "title": "Burgers",
  "icon_url": "https://via.placeholder.com/80/FF6347/FFFFFF?text=🍔"
}

{
  "title": "Pizza",
  "icon_url": "https://via.placeholder.com/80/FFD700/FFFFFF?text=🍕"
}

{
  "title": "Salads",
  "icon_url": "https://via.placeholder.com/80/90EE90/FFFFFF?text=🥗"
}

{
  "title": "Pasta",
  "icon_url": "https://via.placeholder.com/80/FFB6C1/FFFFFF?text=🍝"
}

{
  "title": "Desserts",
  "icon_url": "https://via.placeholder.com/80/FF1493/FFFFFF?text=🍰"
}

{
  "title": "Beverages",
  "icon_url": "https://via.placeholder.com/80/87CEEB/FFFFFF?text=🥤"
}

{
  "title": "Asian",
  "icon_url": "https://via.placeholder.com/80/FFA500/FFFFFF?text=🍜"
}

{
  "title": "Vegetarian",
  "icon_url": "https://via.placeholder.com/80/32CD32/FFFFFF?text=🥬"
}
*/


// ==================== 10. CURL COMMANDS ====================

/*
Add Category via CURL:
---------------------
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Burgers",
    "icon_url": "https://via.placeholder.com/80/FF6347/FFFFFF?text=🍔"
  }'

Get All Categories:
-------------------
curl http://localhost:5000/api/categories

Get Single Category:
--------------------
curl http://localhost:5000/api/categories/1

Update Category:
----------------
curl -X PUT http://localhost:5000/api/categories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fast Food",
    "icon_url": "https://..."
  }'

Delete Category:
----------------
curl -X DELETE http://localhost:5000/api/categories/1
*/
