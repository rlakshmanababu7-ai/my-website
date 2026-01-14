# Categories Management - Complete Setup

## 📦 What You Get

### Files Created
1. ✅ **manage-categories.html** - Full admin interface
2. ✅ **js/categories-admin.js** - Complete CRUD logic
3. ✅ **ADD_CATEGORIES_EXAMPLES.js** - Code snippets
4. ✅ **MANAGE_CATEGORIES_GUIDE.md** - User guide

### Features
- ✨ Add new categories
- ✏️ Edit existing categories  
- 🗑️ Delete categories
- 🔍 Search functionality
- 📊 Category count display
- 🎨 Icon preview
- 📱 Responsive design
- ⚡ Toast notifications

---

## 🚀 Quick Start (3 Steps)

### 1. Start Backend Server
```bash
cd backend
npm start
```

You should see:
```
✓ FoodHub API Server running on http://localhost:5000
✓ Categories table initialized successfully
```

### 2. Open Admin Panel
Open this URL in your browser:
```
file:///d:/New%20folder/hotel-website/manage-categories.html
```

Or simply open `manage-categories.html` in VS Code Live Server

### 3. Add Categories!
Fill the form and click "Add Category"

---

## 📡 API Reference

### Create Category
```
POST /api/categories
Content-Type: application/json

{
  "title": "Burgers",
  "icon_url": "https://example.com/burger.png"
}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Burgers",
    "icon_url": "https://..."
  }
}
```

### Get All Categories
```
GET /api/categories

Response:
{
  "success": true,
  "data": [
    { "id": 1, "title": "Burgers", "icon_url": "..." },
    { "id": 2, "title": "Pizza", "icon_url": "..." }
  ],
  "count": 2
}
```

### Get Single Category
```
GET /api/categories/:id
```

### Update Category
```
PUT /api/categories/:id
Content-Type: application/json

{
  "title": "Fast Food",
  "icon_url": "https://..."
}
```

### Delete Category
```
DELETE /api/categories/:id
```

---

## 💻 JavaScript Functions

### Load All Categories
```javascript
async function loadCategories() {
  const response = await fetch('http://localhost:5000/api/categories');
  const result = await response.json();
  if (result.success) {
    console.log(result.data); // Array of categories
  }
}
```

### Add Category
```javascript
async function addCategory(title, iconUrl) {
  const response = await fetch('http://localhost:5000/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, icon_url: iconUrl })
  });
  return await response.json();
}
```

### Update Category
```javascript
async function updateCategory(id, title, iconUrl) {
  const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, icon_url: iconUrl })
  });
  return await response.json();
}
```

### Delete Category
```javascript
async function deleteCategory(id) {
  const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
    method: 'DELETE'
  });
  return await response.json();
}
```

---

## 🎨 Icon URL Examples

### Emoji Placeholders (Free)
```
https://via.placeholder.com/80/FF6347/FFFFFF?text=🍔
https://via.placeholder.com/80/FFD700/FFFFFF?text=🍕
https://via.placeholder.com/80/90EE90/FFFFFF?text=🥗
https://via.placeholder.com/80/FFB6C1/FFFFFF?text=🍝
https://via.placeholder.com/80/FF1493/FFFFFF?text=🍰
https://via.placeholder.com/80/87CEEB/FFFFFF?text=🥤
https://via.placeholder.com/80/FFA500/FFFFFF?text=🍜
https://via.placeholder.com/80/32CD32/FFFFFF?text=🥬
```

### Or Use Your Own
```
https://mysite.com/images/burgers.png
https://mysite.com/images/pizza.png
etc...
```

---

## 📋 Database Schema

```sql
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE,
  icon_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `id` - Auto-increment category ID
- `title` - Category name (must be unique)
- `icon_url` - URL to category icon image
- `created_at` - Auto timestamp

---

## 🖥️ Admin Panel Features

### Form Section
- Input fields for title and icon URL
- Icon preview while typing
- Submit and reset buttons
- Error handling with toast notifications

### Table Section
- Responsive data table
- Shows ID, title, icon, created date
- Edit and delete buttons
- Search bar to filter categories
- Refresh button to reload data

### Modals
- **Edit Modal** - Update category details
- **Delete Modal** - Confirm before deletion

### Statistics
- Total categories count
- API status indicator

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Make sure server is running" | Start backend: `cd backend && npm start` |
| Categories table not found | Server creates it automatically on first run |
| "Title already exists" error | Category titles must be unique |
| Icon not loading | Use valid image URL or placeholder |
| Form not submitting | Check browser console for JavaScript errors |
| Can't delete category | Ensure category ID is valid |
| Search not working | Check if text matches category title |

---

## 🔗 File Locations

```
hotel-website/
├── manage-categories.html          ← Open this
├── js/
│   └── categories-admin.js         ← Handles all CRUD
├── backend/
│   ├── server.js                   ← API endpoints
│   └── db.js                       ← Categories table
└── ADD_CATEGORIES_EXAMPLES.js      ← Code snippets
```

---

## 🔄 How It Works

```
User fills form
     ↓
JavaScript validates input
     ↓
Sends POST to /api/categories
     ↓
Backend saves to MySQL
     ↓
Returns success response
     ↓
UI refreshes with new category
     ↓
Show toast notification
```

---

## ✅ Verification Checklist

- [x] Backend server running
- [x] Categories table created
- [x] Admin page accessible
- [x] Add form works
- [x] Categories display in table
- [x] Edit functionality works
- [x] Delete confirmation shows
- [x] Search filters results
- [x] Icon preview displays
- [x] Toast notifications show

---

## 📞 Support Resources

- **Admin Guide**: [MANAGE_CATEGORIES_GUIDE.md](MANAGE_CATEGORIES_GUIDE.md)
- **Code Examples**: [ADD_CATEGORIES_EXAMPLES.js](ADD_CATEGORIES_EXAMPLES.js)
- **Backend Setup**: [backend/README.md](backend/README.md)
- **Categories API**: [backend/server.js](backend/server.js)

---

## 🎉 You're All Set!

Your categories management system is ready to use!

**Next Steps:**
1. Add your first categories
2. Display them on home page ✓ (Already done)
3. Link dishes to categories (Optional)
4. Filter menu by category (Optional)

**Happy managing! 🍕🍔🥗**
