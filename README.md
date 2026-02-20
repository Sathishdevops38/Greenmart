# Greenmart

Plants and flowers e-commerce website with Next.js frontend and FastAPI backend.

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS (green theme)
- **Backend:** FastAPI, SQLAlchemy, SQLite

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate    # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload
```

API runs at http://localhost:8000. Docs at http://localhost:8000/docs.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:3000.

## Project Structure

```
d:\Greenmart\
├── backend/           # FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── routers/   # products, categories, orders, admin
│   │   └── ...
│   ├── greenmart.db   # SQLite (created on first run)
│   ├── seed.py
│   └── requirements.txt
├── frontend/          # Next.js
│   └── src/
│       ├── app/       # pages
│       ├── components/
│       └── lib/       # API client
└── README.md
```

## Features

- Product catalog with categories (Plants, Flowers, Seeds)
- Product detail pages
- Shopping cart (localStorage)
- Checkout and order placement
- Admin panel to view products and orders

## Adding Products

1. Use the admin panel at `/admin` (read-only in current build), or
2. Edit `backend/seed.py` and run `python seed.py` (will skip if data exists), or
3. Use the FastAPI docs at http://localhost:8000/docs to POST to `/admin/products`

## Environment

- **Frontend:** `NEXT_PUBLIC_API_URL` (default: http://localhost:8000)
- **Backend:** Uses SQLite file `greenmart.db` in the backend folder
