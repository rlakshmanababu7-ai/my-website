# FoodHub Menu Integration - Setup Guide

## What's Been Done

✅ **Updated menu.html** - Replaced hardcoded menu items with dynamic API integration
✅ **Updated main.js** - Added API fetch and dish rendering functions
✅ **Backend API** - Already created with GET /api/dishes endpoint

---

## 🚀 How to Run

### Step 1: Start the Backend Server
```bash
cd backend
npm start
```

Server will run on: **http://localhost:5000**

You should see:
```
✓ FoodHub API Server running on http://localhost:5000
✓ Dishes table initialized successfully
```

### Step 2: Open menu.html in Browser
Simply open **menu.html** in your browser or serve it with a local server.

The page will:
- Show a loading spinner
- Fetch dishes from `http://localhost:5000/api/dishes`
- Display all dishes dynamically with images, ratings, and prices
- Show "Add to Cart" button for each dish

---

## 📱 Features Implemented

### 1. **Fetch Dishes from API**
```javascript
fetch('http://localhost:5000/api/dishes')
  .then(response => response.json())
  .then(data => renderDishes(data.data))
```

### 2. **Dynamic Rendering**
- Dishes loaded from database
- Star ratings generated dynamically
- Price formatted with 2 decimal places
- Image with fallback for broken URLs

### 3. **Add to Cart**
- Click "Add to Cart" button
- Item saved to localStorage
- Success toast notification
- Support for quantity increments

### 4. **API Response Format**
```json
{
  "success": true,
  "message": "Dishes fetched successfully",
  "data": [
    {
      "id": 2,
      "title": "Crispy Fried Chicken",
      "description": "Good chicken",
      "stars": 4.5,
      "ratings": 260,
      "price": 7.99,
      "image_url": "https://..."
    }
  ],
  "count": 1
}
```

---

## 🛠️ File Structure

```
hotel-website/
├── menu.html           ← Updated with API integration
├── js/
│   └── main.js         ← Updated with loadDishes() function
├── backend/
│   ├── server.js       ← API server
│   ├── db.js           ← Database connection
│   └── package.json    ← Dependencies
```

---

## 📝 JavaScript Functions Added

### `loadDishes()`
- Fetches dishes from API
- Calls renderDishes() on success
- Shows error if API is unavailable

### `renderDishes(dishes)`
- Creates HTML for each dish
- Displays title, description, stars, ratings, price
- Attaches click handlers for Add to Cart

### `setupAddToCart()`
- Saves items to localStorage
- Shows success notification
- Supports quantity increment

### `generateStars(rating)`
- Converts numeric rating to star icons
- Supports half stars
- Uses Font Awesome icons

---

## ⚠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Loading..." spinner shows forever** | Backend server not running. Start it with `npm start` in /backend |
| **CORS Error in console** | CORS is enabled. Check if server URL is correct |
| **No dishes appear** | Check if database has dishes. Add sample data with sample-data.sql |
| **Images not loading** | Check image_url in database. Use valid image URLs |
| **Add to Cart not working** | Check browser console for JavaScript errors |

---

## 🔄 Add More Dishes to Database

### Option 1: Insert via MySQL
```sql
INSERT INTO foodHub.dishes (title, description, stars, ratings, price, image_url) 
VALUES ('Pizza Margherita', 'Classic Italian pizza', 4.8, 350, 12.99, 'https://image-url');
```

### Option 2: Use API
```bash
curl -X POST http://localhost:5000/api/dishes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pasta Carbonara",
    "description": "Creamy pasta",
    "stars": 4.6,
    "ratings": 200,
    "price": 10.99,
    "image_url": "https://image-url"
  }'
```

---

## 🎯 Next Steps

1. Test the integration by visiting menu.html
2. Add items to cart and check localStorage
3. Add more dishes to the database
4. Integrate cart.html with order checkout
5. Add admin panel for managing dishes

**Happy coding! 🍕**
