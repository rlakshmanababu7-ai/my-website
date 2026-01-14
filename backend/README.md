# FoodHub API Backend Setup Guide

## Installation & Setup

### 1. **Prerequisites**
- Node.js (v14 or higher)
- MySQL Server running locally
- npm or yarn package manager

### 2. **Install Dependencies**
```bash
cd backend
npm install
```

This installs:
- **express** - Web framework
- **mysql2** - MySQL database driver
- **cors** - Cross-origin requests
- **nodemon** - Auto-reload during development

### 3. **Create Database**
Open MySQL and run:
```sql
CREATE DATABASE foodHub;
USE foodHub;
```

### 4. **Configure Database Connection** (Optional)
Edit `db.js` and update credentials if needed:
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',           // Your MySQL username
  password: '',           // Your MySQL password (if any)
  database: 'foodHub'
});
```

### 5. **Start the Server**
```bash
npm start
```
or for development with auto-reload:
```bash
npm run dev
```

Server will run on: **http://localhost:5000**

---

## API Endpoints

### **1. Get All Dishes** (Home Page)
```
GET /api/dishes
```
**Response:**
```json
{
  "success": true,
  "message": "Dishes fetched successfully",
  "data": [
    {
      "id": 1,
      "title": "Grilled Chicken Burger",
      "description": "Juicy grilled chicken...",
      "stars": 4.5,
      "ratings": 230,
      "price": 249,
      "image_url": "https://..."
    }
  ],
  "count": 8
}
```

### **2. Get Filtered Dishes**
```
GET /api/dishes/filter?minPrice=100&maxPrice=500&minRating=4&sortBy=price-low
```
**Query Parameters:**
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `minRating` - Minimum star rating filter
- `sortBy` - Sort by: `price-low`, `price-high`, `rating`, `newest`

### **3. Get Single Dish**
```
GET /api/dishes/:id
```
Example: `GET /api/dishes/1`

### **4. Add New Dish** (Admin)
```
POST /api/dishes
Content-Type: application/json

{
  "title": "Pasta Carbonara",
  "description": "Creamy pasta with bacon",
  "stars": 4.6,
  "ratings": 150,
  "price": 299,
  "image_url": "https://..."
}
```

### **5. Update Dish** (Admin)
```
PUT /api/dishes/:id
Content-Type: application/json

{
  "price": 349,
  "ratings": 160
}
```

### **6. Delete Dish** (Admin)
```
DELETE /api/dishes/:id
```

### **7. Health Check**
```
GET /api/health
```

---

## Database Schema

```sql
CREATE TABLE dishes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  stars DECIMAL(3, 2) DEFAULT 0,
  ratings INT DEFAULT 0,
  price DECIMAL(8, 2) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## Insert Sample Data

Run in MySQL:
```bash
mysql -u root foodHub < sample-data.sql
```

Or manually in MySQL:
```sql
INSERT INTO dishes (title, description, stars, ratings, price, image_url) 
VALUES ('Grilled Chicken Burger', 'Juicy grilled chicken...', 4.5, 230, 249, 'https://...');
```

---

## Frontend Integration (JavaScript)

### Fetch all dishes:
```javascript
fetch('http://localhost:5000/api/dishes')
  .then(res => res.json())
  .then(data => console.log(data.data))
  .catch(err => console.error(err));
```

### Fetch filtered dishes:
```javascript
fetch('http://localhost:5000/api/dishes/filter?sortBy=price-low&minRating=4')
  .then(res => res.json())
  .then(data => console.log(data.data))
  .catch(err => console.error(err));
```

### Add new dish (Admin):
```javascript
fetch('http://localhost:5000/api/dishes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Dish',
    description: 'Description here',
    price: 299,
    image_url: 'https://...'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **MySQL Connection Error** | Check if MySQL server is running and credentials are correct |
| **Port 5000 already in use** | Change PORT in `.env` or kill process: `lsof -ti :5000 \| xargs kill` |
| **CORS Error** | CORS is already enabled for all origins |
| **Table not created** | Ensure database `foodHub` exists before starting server |
| **nodemon not found** | Run `npm install -g nodemon` or use `npm start` |

---

## File Structure
```
backend/
├── db.js              # Database connection & initialization
├── server.js          # Express server & API routes
├── package.json       # Dependencies
├── .env.example       # Environment variables template
└── sample-data.sql    # Sample dishes data
```

---

**Happy coding! 🍕**
