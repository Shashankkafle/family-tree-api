# Family Tree API

A RESTful backend for a family tree web application. Allows users to create, store, and retrieve family members and their relationships, powering a visual interactive family tree in the frontend.

## Tech Stack

- **Node.js** + **Express** — server and routing
- **PostgreSQL** — relational database
- **Sequelize** — ORM for schema definition and queries
- **UUID** — primary key generation
- **dotenv** — environment variable management
- **CORS** — cross-origin support for the React frontend

## Project Structure

```
family-tree-api/
├── config/          # Database connection config (Sequelize setup)
├── controllers/     # Route handler logic
├── models/          # Sequelize models (family members, relationships)
├── routes/          # Express route definitions
├── app.js           # App entry point
└── .env             # Environment variables (not committed)
```

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL running locally (or a connection string to a hosted instance)

### Installation

```bash
git clone https://github.com/Shashankkafle/family-tree-api.git
cd family-tree-api
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=familytree
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
PORT=5000
```

### Running the Server

```bash
# Development (with nodemon)
npm run dev

# Production
node app.js
```

The API will be available at `http://localhost:5000`.

## API Endpoints

> Base URL: `/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/members` | Get all family members |
| GET | `/members/:id` | Get a single member by ID |
| POST | `/members` | Create a new family member |
| PUT | `/members/:id` | Update a family member |
| DELETE | `/members/:id` | Delete a family member |

## Related

- **Frontend**: [family-tree-frontend](https://github.com/Shashankkafle/family-tree-frontend) — React + Tailwind + visx interactive tree visualization

## Status

Work in progress. Core CRUD for family members is implemented. Relationship traversal and authentication are planned.
