# Add Categories - Quick Reference

## 📁 Files Created

1. **[manage-categories.html](manage-categories.html)** - Admin page for managing categories
2. **[js/categories-admin.js](js/categories-admin.js)** - JavaScript for CRUD operations
3. **[ADD_CATEGORIES_EXAMPLES.js](ADD_CATEGORIES_EXAMPLES.js)** - Code examples and snippets

---

## 🚀 How to Use

### Step 1: Open Admin Panel
Visit: `manage-categories.html`

### Step 2: Add Category
1. Enter category title (e.g., "Burgers", "Pizza")
2. Enter icon URL (optional - use emoji placeholders)
3. Click "Add Category"
4. See it in the table immediately

### Step 3: Edit/Delete
- Click "Edit" to modify a category
- Click "Delete" to remove a category
- Confirmation required before delete

---

## 🔌 API Endpoints

### Add New Category
```javascript
POST /api/categories
{
  "title": "Burgers",
  "icon_url": "https://..."
}
```

### Get All Categories
```javascript
GET /api/categories
```

### Update Category
```javascript
PUT /api/categories/:id
{
  "title": "Updated Name",
  "icon_url": "https://..."
}
```

### Delete Category
```javascript
DELETE /api/categories/:id
```

---

## 💻 Code Examples

### Quick Add (Copy & Paste)
```javascript
fetch('http://localhost:5000/api/categories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Burgers',
    icon_url: 'https://via.placeholder.com/80/FF6347/FFFFFF?text=🍔'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Load & Display All
```javascript
async function showCategories() {
  const res = await fetch('http://localhost:5000/api/categories');
  const data = await res.json();
  console.log(data.data); // Array of categories
}
showCategories();
```

### With Error Handling
```javascript
async function addCategory(title, iconUrl) {
  try {
    const res = await fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, icon_url: iconUrl })
    });
    
    const data = await res.json();
    
    if (data.success) {
      console.log('✓ Added:', data.data);
      return true;
    } else {
      console.error('✗ Error:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Network error:', error);
    return false;
  }
}

// Usage
addCategory('Pizza', 'https://via.placeholder.com/80/FFD700/FFFFFF?text=🍕');
```

---

## 🎨 Emoji Placeholder URLs

Use these for quick testing:

| Category | URL |
|----------|-----|
| 🍔 Burgers | `https://via.placeholder.com/80/FF6347/FFFFFF?text=🍔` |
| 🍕 Pizza | `https://via.placeholder.com/80/FFD700/FFFFFF?text=🍕` |
| 🥗 Salads | `https://via.placeholder.com/80/90EE90/FFFFFF?text=🥗` |
| 🍝 Pasta | `https://via.placeholder.com/80/FFB6C1/FFFFFF?text=🍝` |
| 🍰 Desserts | `https://via.placeholder.com/80/FF1493/FFFFFF?text=🍰` |
| 🥤 Beverages | `https://via.placeholder.com/80/87CEEB/FFFFFF?text=🥤` |
| 🍜 Asian | `https://via.placeholder.com/80/FFA500/FFFFFF?text=🍜` |
| 🥬 Vegetarian | `https://via.placeholder.com/80/32CD32/FFFFFF?text=🥬` |

---

## 📝 Form Fields

### Add Category
- **Title** (Required) - Category name
- **Icon URL** (Optional) - Image URL for category icon

### Edit Category
- **Title** - Update category name
- **Icon URL** - Update icon image

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Server error | Ensure backend is running: `npm start` |
| Title already exists | Use unique category names |
| Icon not showing | Check if URL is valid and accessible |
| Categories not loading | Check browser console for errors |
| Can't delete | Ensure server is responding |

---

## 🔄 Features

✅ **Add Categories** - Create new food categories
✅ **View All** - Display in responsive table
✅ **Search** - Filter categories by name
✅ **Edit** - Update title and icon
✅ **Delete** - Remove with confirmation
✅ **Icon Preview** - See icon before saving
✅ **Live Stats** - Total categories count
✅ **Toast Notifications** - Success/error messages

---

## 📊 Navigation

- Home: `index.html`
- Menu: `menu.html`
- Dishes Admin: `manage-dishes.html`
- **Categories Admin: `manage-categories.html`** ← You are here
- Cart: `cart.html`

---

## 🎯 Next Steps

1. Add more categories
2. Link categories to dishes
3. Filter menu by category
4. Show popular categories on home

---

**Start managing categories now! 🎉**
