# Phoneme-Based Activity Builder

A data-driven web application for Speech Pathology teachers to create, save, and manage phoneme-based Wordle and Word Search activities for classroom use. Built as a three-tier application: a Next.js frontend, a separate Next.js API backend, and a PostgreSQL database, all orchestrated with Docker Compose.

## Architecture

This project follows a three-tier architecture, with each tier running as its own Docker container:

- **Frontend** (`frontend/`) — a Next.js application responsible only for the user interface. It has no direct database access; all data comes from the API over HTTP.
- **API** (`api/`) — a separate Next.js application exposing REST-style API routes. This is the only tier with a database connection, using Prisma as the ORM.
- **Database** (`postgres` service) — a PostgreSQL container holding all persistent data.

The frontend automatically detects the API's address at runtime from the browser's own hostname, so no manual configuration is needed when the app is deployed to a new host — see `frontend/app/lib/config.tsx`.

## Data model

Defined in `api/prisma/schema.prisma`:

- **User** — a teacher. Created implicitly by name the first time they save an activity (no authentication in this stage).
- **Word** — a shared word bank entry: English spelling, locale (`au`/`uk`/`us`, since pronunciation varies by region), an array of IPA phoneme symbols, and an optional hint. Words are reusable across many activities.
- **WordSearch** — a saved word search configuration: title, difficulty, grid size, a many-to-many link to the `Word`s it uses, and the creating `User`.
- **Wordle** — a saved Wordle configuration: title, difficulty, a link to its target `Word`, and the creating `User`.

Deleting a `User` cascades to delete their saved `WordSearch`/`Wordle` records, but never touches the shared `Word` bank.

## API endpoints

All routes live under `api/app/api/`:

| Route | Methods | Notes |
|---|---|---|
| `/api/words` | GET, POST, PATCH, DELETE | Word bank CRUD. Validates phonemes against a fixed IPA legend; enforces uniqueness per (text, locale). |
| `/api/word-searches` | GET, POST, PATCH, DELETE | Filter by `?id=` or `?creator=name`. |
| `/api/wordles` | GET, POST, PATCH, DELETE | Same filtering as above. |
| `/api/users` | GET, DELETE | Lists teachers; delete cascades to their saved activities. |
| `/api/health` | GET | Returns 200 with a live database connectivity check (not just process liveness). |

## Running locally

Requires Docker and Docker Compose installed.

```bash
git clone <repo-url>
cd w7dockerp2
sudo docker-compose up
```

This starts all three services. The frontend is served on port 80, the API on port 4080, and Postgres on port 5432.

First-time setup also requires running the Prisma migration against the database (see `api/prisma/migrations/`):

```bash
cd api
npx prisma migrate dev
```

## Environment variables

`api/.env` requires:DATABASE_URL="postgresql://user:password@localhost:5432/mydb"


(matches the credentials in `docker-compose.yml`'s `postgres` service).

## Tech stack

- Next.js 16 (both frontend and API)
- React 19
- Prisma 7 with the `@prisma/adapter-pg` driver adapter
- PostgreSQL 15
- Tailwind CSS
- Docker / Docker Compose