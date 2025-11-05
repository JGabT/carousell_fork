# Carousell Fork - E-commerce Application

A full-stack e-commerce application with user authentication, built with React, Node.js/Express, and MySQL. Styled with TailwindCSS.

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Password Hashing**: Using bcryptjs for secure password storage
- **Protected Routes**: Authentication-based access control
- **Product Listing**: Browse products from various sellers
- **Responsive Design**: Beautiful UI with TailwindCSS
- **RESTful API**: Clean API structure with Express.js
- **MySQL Database**: Persistent data storage

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- TailwindCSS
- Vite

### Backend
- Node.js
- Express.js
- MySQL2
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- dotenv

## Prerequisites

Before running this application, make sure you have:
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd carousell_fork
```

### 2. Database Setup

Start your MySQL server and create the database:

```bash
mysql -u root -p
```

Then run the SQL schema:

```sql
source backend/database/schema.sql
```

Or manually:
```sql
CREATE DATABASE IF NOT EXISTS carousell_db;
USE carousell_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  seller_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Configure environment variables by copying `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=carousell_db
JWT_SECRET=your_secret_key_here
```

Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal and:

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. **Sign Up**: Create a new account at `/signup`
2. **Login**: Sign in with your credentials at `/login`
3. **Browse Products**: View all available products on the home page
4. **Logout**: Click the logout button to end your session

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login and receive JWT token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

## Project Structure

```
carousell_fork/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── products.js
│   ├── database/
│   │   └── schema.sql
│   ├── .env
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── .gitignore
└── README.md
```

## Security Features

- Passwords are hashed using bcryptjs before storage
- JWT tokens for secure authentication
- Protected API routes requiring valid tokens
- CORS enabled for cross-origin requests
- Environment variables for sensitive data

## Development

To run both frontend and backend concurrently during development:

Terminal 1 (Backend):
```bash
cd backend && npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend && npm run dev
```

## Future Enhancements

- Add product creation UI
- Implement user profile pages
- Add shopping cart functionality
- Integrate payment gateway
- Add product search and filters
- Implement product categories
- Add image upload functionality
- User reviews and ratings

## License

ISC

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
