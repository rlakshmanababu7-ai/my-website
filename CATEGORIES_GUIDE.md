# FoodHub Categories Integration Guide

## What's Been Added

✅ **Categories Table** - Database table with id, title, icon_url, created_at
✅ **Categories API** - Full CRUD endpoints for managing categories  
✅ **Categories Section** - Dynamic display on home page (index.html)
✅ **Frontend Integration** - JavaScript to fetch and display categories

---

## 📊 API Endpoints

### Get All Categories
```
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": 1,
      "title": "Burgers",
      "icon_url": "https://...",
      "created_at": "2026-01-13T..."
    }
  ],
  "count": 8
}
```

### Get Single Category
```
GET /api/categories/:id
```

### Add New Category
```
POST /api/categories
Content-Type: application/json

{
  "title": "Burgers",
  "icon_url": "https://example.com/burger-icon.png"
}
```

### Update Category
```
PUT /api/categories/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "icon_url": "https://new-url.com/icon.png"
}
```

### Delete Category
```
DELETE /api/categories/:id
```

---

## 🚀 Quick Setup

### 1. Database Setup
The categories table is created automatically when the server starts. If you need to manually create it:

```sql
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE,
  icon_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Add Sample Categories (Optional)
```bash
mysql -u root foodHub < backend/sample-categories.sql
```

Or manually in MySQL:
```sql
INSERT INTO categories (title, icon_url) 
VALUES ('Burgers', 'https://via.placeholder.com/80/FF6347/FFFFFF?text=🍔');
```

### 3. Start Server
```bash
cd backend
npm start
```

The server will show:
```
✓ Categories table initialized successfully
✓ Dishes table initialized successfully
```

### 4. View Categories on Home Page
Simply visit `index.html` in your browser. Categories will automatically load and display.

---

## 📝 Database Schema

```sql
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE,
  icon_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎨 Frontend Integration

### HTML Structure (index.html)
```html
<section class="categories-section py-5 bg-light">
  <div class="container">
    <h2 class="mb-4">Browse Categories</h2>
    <div class="row g-3" id="categoriesContainer">
      <!-- Categories loaded dynamically here -->
    </div>
  </div>
</section>
```

### JavaScript Functions (main.js)

#### Load Categories
```javascript
async function loadCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  const result = await response.json();
  if (result.success) {
    renderCategories(result.data);
  }
}
```

#### Render Categories
```javascript
function renderCategories(categories) {
  // Renders category cards with hover effects
  // Shows category title and icon
  // Responsive layout (3-4 columns)
}
```

---

## 🔧 Admin Panel for Categories

To manage categories in the admin panel, you can:

1. **View Categories** - See all categories in admin dashboard
2. **Add Categories** - Create new category with title and icon URL
3. **Edit Categories** - Update existing category details
4. **Delete Categories** - Remove categories from the system

### Add Categories Section to Admin Panel

You can extend the `manage-dishes.html` to include a categories management section. The API is already fully functional.

---

## 💡 Usage Examples

### Fetch All Categories (JavaScript)
```javascript
fetch('http://localhost:5000/api/categories')
  .then(res => res.json())
  .then(data => console.log(data.data))
  .catch(err => console.error(err));
```

### Add New Category (JavaScript)
```javascript
fetch('http://localhost:5000/api/categories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Chinese Food',
    icon_url: 'https://example.com/chinese-icon.png'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Update Category (JavaScript)
```javascript
fetch('http://localhost:5000/api/categories/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Updated Name',
    icon_url: 'https://example.com/new-icon.png'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Delete Category (JavaScript)
```javascript
fetch('http://localhost:5000/api/categories/1', {
  method: 'DELETE'
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🎯 Recommended Icon URLs

Use these emoji placeholder URLs for categories:

| Category | Icon URL |
|----------|----------|
| Burgers | `https://via.placeholder.com/80/FF6347/FFFFFF?text=🍔` |
| Pizza | `https://via.placeholder.com/80/FFD700/FFFFFF?text=🍕` |
| Salads | `https://via.placeholder.com/80/90EE90/FFFFFF?text=🥗` |
| Pasta | `https://via.placeholder.com/80/FFB6C1/FFFFFF?text=🍝` |
| Desserts | `https://via.placeholder.com/80/FF1493/FFFFFF?text=🍰` |
| Beverages | `https://via.placeholder.com/80/87CEEB/FFFFFF?text=🥤` |
| Asian | `https://via.placeholder.com/80/FFA500/FFFFFF?text=🍜` |
| Vegetarian | `https://via.placeholder.com/80/32CD32/FFFFFF?text=🥬` |

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Categories not showing** | Check if server is running and categories exist in DB |
| **API Error 500** | Verify categories table exists: `SHOW TABLES;` |
| **Icon not loading** | Use valid image URLs or placeholder URLs |
| **Cannot add category** | Ensure title is unique (no duplicates) |

---

## 📁 Files Modified/Created

- `backend/db.js` - Added categories table initialization
- `backend/server.js` - Added 5 category API endpoints
- `backend/sample-categories.sql` - Sample category data
- `frontend/index.html` - Added categories section
- `frontend/js/main.js` - Added loadCategories() function

---

## 🔄 Next Steps

1. **Test the integration** - Visit home page and verify categories display
2. **Add sample data** - Insert sample categories using SQL
3. **Extend admin panel** - Add categories management to admin dashboard
4. **Link categories to dishes** - Add category_id to dishes table (optional)
5. **Filter by category** - Add category filtering to menu page

**Happy coding! 🍕**
