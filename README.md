# EYVA Assignment

A full-stack project management application built with:

- **Frontend:** Vite + React  
- **Backend:** Node.js + Express  
- **Database:** PostgreSQL  

---

## Live Demo

- Frontend (Render Static Site): https://eyva-assignment-1.onrender.com/
- Backend (Render Web Service): https://eyva-assignment.onrender.com/

---

## Deployment

All services are hosted on **Render**:

- Frontend => Static Site  
- Backend => Web Service  
- Database => Managed PostgreSQL  

The backend connects to Render PostgreSQL using environment variables and SSL.

---

# Local Development Setup

## Clone the Repository

```bash
git clone https://github.com/Yash12122004/eyva-assignment
cd eyva-assignment
```

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

Make sure to create a `.env` file inside the `frontend` folder:
```
VITE_API_URL="http://localhost:5000/"
```

## Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs at http://localhost:5000

Make sure to create a `.env` file inside the `backend` folder:
```
DATABASE_URL=your_local_postgres_connection_string
JWT_SECRET=your_secret_key
```

## Database Setup
To initialize the database schema locally:
```bash
cd backend
npm run init-db
```
This will create required tables (users, projects, tasks)


