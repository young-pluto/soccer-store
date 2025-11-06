# ⚽ Soccer Store

A minimalist luxury e-commerce platform for soccer equipment, inspired by Zara and H&M's clean design aesthetic.

## 🎨 Features

- **Minimalist Luxury Design** - Clean, elegant UI with premium aesthetics
- **Product Catalog** - Browse premium soccer boots, jerseys, balls, and accessories
- **Shopping Cart** - Add items, update quantities, clear cart
- **Checkout System** - Simple checkout with order confirmation
- **Responsive Design** - Works beautifully on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: React, CSS3
- **Backend**: Node.js, Express
- **Database**: SQLite
- **Deployment**: Render (backend) + Vercel (frontend)

## 🚀 Quick Start

### Local Development

1. **Backend**:
```bash
cd backend
npm install
npm start
```
Backend runs on `http://localhost:5050`

2. **Frontend**:
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

3. **Environment Variables** (Frontend):
Create `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5050
PORT=3000
```

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Render + Vercel.

### Quick Deploy Steps:

1. Push code to GitHub
2. Deploy backend to Render
3. Deploy frontend to Vercel (set `REACT_APP_API_URL` to your Render URL)

## 📁 Project Structure

```
vibe-commerce/
├── backend/
│   ├── routes/          # API routes
│   ├── database.js      # SQLite setup
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   └── App.js       # Main app
│   └── public/          # Static files
└── README.md
```

## 🎯 API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/checkout` - Process checkout

## 📝 License

ISC

---

Built with ❤️ for soccer enthusiasts

