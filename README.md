# Search Service (`searchsvc`)

A web crawling and full-text search platform. It allows users to register websites, run scheduled extraction jobs to parse structured data with Cheerio, store documents in MongoDB, and query indexed content through a fast text search API.

## Project Structure

This project is organized into two independent directories:

- **[`backend/`](./backend)**: RESTful API built with **NestJS**, **MongoDB** (Mongoose), and **Cheerio**. Handles account management, crawling configurations, content indexing, and search.
- **[`frontend/`](./frontend)**: Modern web interface built with **Next.js** (App Router), **React**, and **Tailwind CSS**.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)

---

### Backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Configure your environment variables in `backend/.env` (MongoDB connection URI, port, Auth0/SSO secrets).

Run the development server:

```bash
npm run start:dev
```

- Swagger API docs will be available at: `http://localhost:3000/api`

Run tests:

```bash
npm run test:e2e
```

---

### Frontend

Navigate to the frontend directory:

```bash
cd frontend
npm install
```

Run the development server:

```bash
npm run dev
```

The web app will be available at `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied by the backend).

---

## Tech Stack

- **Backend:** Node.js, NestJS, TypeScript, MongoDB / Mongoose, Cheerio, Vitest, Oxlint
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, ESLint
