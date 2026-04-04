# Zap AI

> An AI-powered SaaS platform for creating, managing, and hosting intelligent AI agents in video meetings.

Zap AI lets you define custom AI agents with specific instructions and personas, then have them join real-time video calls. After each meeting the platform automatically generates transcripts, summaries, and recordings — all surfaced in a clean dashboard.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [How It Works](#how-it-works)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Caching Strategy](#caching-strategy)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **AI Agent Management** – Create, edit, and delete AI agents with custom names, instructions, and auto-generated DiceBear avatars
- **Video Meetings** – Schedule and host real-time video meetings powered by Stream.io
- **Meeting Lifecycle** – Track meetings through statuses: `upcoming → active → processing → completed`
- **Post-Meeting Analytics** – Auto-generated transcripts, summaries, and recordings via Stream.io
- **Authentication** – Email/password and OAuth (Google & GitHub) via BetterAuth
- **Redis Caching** – 5-minute TTL caching on all list endpoints with automatic cache invalidation on writes
- **Responsive Dashboard** – Paginated agent and meeting lists with real-time filtering, search, and URL-synced state (nuqs)
- **Type Safety** – End-to-end TypeScript with Zod validation on all API inputs

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, Shadcn UI (Radix UI primitives) |
| State / Data | TanStack Query v5, TanStack Table v8 |
| Forms | React Hook Form + Zod |
| URL State | nuqs |
| Avatars | DiceBear |
| Video | Stream.io Video React SDK |
| Backend | Express 5 (Node.js, TypeScript, tsx watch) |
| Database | PostgreSQL (Neon Serverless) + Drizzle ORM |
| Caching | Redis (ioredis) |
| Auth | BetterAuth (Drizzle adapter, Google OAuth, GitHub OAuth) |

---

## Architecture Overview

```
┌─────────────────────────────────┐
│         Browser (Next.js)        │
│  App Router + React 19 + TSQuery │
└────────────┬────────────────────┘
             │ REST (port 3000 → 8000)
             ▼
┌─────────────────────────────────┐
│     Express 5 API Server         │
│  requireAuth → controller        │
│  Redis cache (5 min TTL)         │
└────────────┬────────────────────┘
             │
     ┌───────┴────────┐
     ▼                ▼
┌─────────┐    ┌────────────┐
│ Neon DB │    │  Stream.io │
│(Drizzle)│    │  Video API │
└─────────┘    └────────────┘
```

- The **Next.js** frontend communicates with the **Express** backend over REST.
- The **BetterAuth** session is verified on every protected request by forwarding browser cookies to the Express middleware.
- **Redis** caches list responses for 5 minutes; cache entries are pattern-invalidated whenever data is mutated.
- **Stream.io** handles all real-time video, automatic transcription, and recording.

---

## How It Works

### 1 · Create an Agent
Define an agent's name and a system-prompt that describes its persona and behaviour. A DiceBear avatar is generated automatically from the agent's name.

### 2 · Schedule a Meeting
Create a meeting, pick the agent you want to join, and give the meeting a name. The backend simultaneously:
- Inserts the meeting row into PostgreSQL with status `upcoming`
- Creates a matching Stream.io call (with auto-transcription and 1080p recording enabled)
- Upserts the agent as a Stream user
- Returns a short-lived Stream user token to the client

### 3 · Join the Video Call
Navigate to the live call page (`/call/[meetingId]`). The meeting status becomes `active`. The AI agent joins the call using its Stream identity and responds according to its instructions.

### 4 · Post-Meeting
After the call ends Stream.io:
- Sets the meeting status to `processing`
- Generates a transcript and summary
- Uploads the recording

Once processing is complete the status moves to `completed` and the transcript, summary, and recording URLs are stored in the `meetings` table.

---

## Prerequisites

- **Node.js** v18+ (LTS recommended)
- **PostgreSQL** database — [Neon](https://neon.tech) serverless is preconfigured
- **Redis** instance (local Docker or a cloud provider)
- **Stream.io** account — [getstream.io](https://getstream.io) for video, transcription, and recording
- **Google** OAuth app credentials (optional)
- **GitHub** OAuth app credentials (optional)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/APrem-7/Zap-ai.git
cd Zap-ai/ai-saas
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the `ai-saas/` directory (see [Environment Variables](#environment-variables) for details):

```bash
cp .env.example .env.local   # if an example file is provided, otherwise create manually
```

### 4. Push the database schema

```bash
npm run db:push
```

### 5. Start the development servers

Open **two terminals** from the `ai-saas/` directory.

**Terminal 1 — Express backend (port 8000):**
```bash
npm run server
```

**Terminal 2 — Next.js frontend (port 3000):**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Tip:** You can verify the backend is up by visiting [http://localhost:8000/health](http://localhost:8000/health).

---

## Environment Variables

Create `ai-saas/.env.local` with the following keys:

```env
# ── Database ──────────────────────────────────────────────────────────────────
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require

# ── BetterAuth ────────────────────────────────────────────────────────────────
# Generate a strong random string, e.g.: openssl rand -base64 32
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000

# ── Google OAuth ──────────────────────────────────────────────────────────────
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ── GitHub OAuth ──────────────────────────────────────────────────────────────
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# ── Stream.io ─────────────────────────────────────────────────────────────────
# Dashboard → Application → API Credentials
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
STREAM_SECRET_KEY=your_stream_secret_key

# ── Redis ─────────────────────────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ── Backend ───────────────────────────────────────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:8000
PORT=8000
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | ✅ | Long random string used to sign sessions |
| `BETTER_AUTH_URL` | ✅ | Public URL of the Next.js app |
| `GOOGLE_CLIENT_ID` | optional | Google OAuth app client ID |
| `GOOGLE_CLIENT_SECRET` | optional | Google OAuth app client secret |
| `GITHUB_CLIENT_ID` | optional | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | optional | GitHub OAuth app client secret |
| `NEXT_PUBLIC_STREAM_API_KEY` | ✅ | Stream.io public API key |
| `STREAM_SECRET_KEY` | ✅ | Stream.io secret key (server-side only) |
| `REDIS_URL` | ✅ | Redis connection URL |
| `NEXT_PUBLIC_API_URL` | ✅ | Base URL of the Express server |
| `PORT` | optional | Express server port (default: 8000) |

---

## Available Scripts

All scripts are run from the `ai-saas/` directory.

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js development server on port 3000 |
| `npm run build` | Build Next.js for production |
| `npm run start` | Start Next.js production server |
| `npm run lint` | Lint the codebase with ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check code formatting without writing |
| `npm run server` | Start Express backend with `tsx watch` on port 8000 |
| `npm run db:push` | Push Drizzle ORM schema changes to the database |
| `npm run db:studio` | Open Drizzle Studio for visual database management |

---

## Project Structure

```
ai-saas/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Public auth pages (sign-in, sign-up)
│   │   ├── (dashboard)/            # Protected dashboard pages
│   │   │   ├── agents/             # Agent list & detail pages
│   │   │   └── meetings/           # Meeting list & detail pages
│   │   ├── call/[meetingId]/       # Live video call page
│   │   ├── api/                    # BetterAuth API route handler
│   │   ├── layout.tsx              # Root layout with providers
│   │   └── providers.tsx           # TanStack Query + theme providers
│   │
│   ├── modules/                    # Feature modules (collocated views + logic)
│   │   ├── agents/                 # Agent CRUD forms, list, detail, schemas
│   │   ├── meetings/               # Meeting forms, list, detail, hooks, schemas
│   │   ├── call/                   # Video call UI, Stream provider, controls
│   │   ├── dashboard/              # Dashboard home components
│   │   ├── home/                   # Landing / home module
│   │   └── auth/                   # Sign-in / sign-up forms
│   │
│   ├── server/                     # Express backend
│   │   ├── index.ts                # App entry — CORS, middleware, route registration
│   │   ├── routes/
│   │   │   ├── agents.ts           # Agent REST routes
│   │   │   └── meetings.ts         # Meeting REST routes
│   │   ├── controllers/
│   │   │   ├── agents.controller.ts    # Agent business logic
│   │   │   └── meetings.controller.ts  # Meeting business logic + Stream integration
│   │   └── middleware/
│   │       └── auth-middleware.ts  # requireAuth — validates BetterAuth session
│   │
│   ├── db/
│   │   ├── index.ts                # Drizzle + Neon client
│   │   └── schema.ts               # All table definitions & enums
│   │
│   ├── lib/
│   │   ├── auth.ts                 # BetterAuth server config
│   │   ├── auth-client.ts          # BetterAuth React client
│   │   ├── redis.ts                # RedisService wrapper (get / set / del / invalidate)
│   │   ├── stream-video.ts         # StreamClient singleton
│   │   └── utils.ts                # cn() and other utilities
│   │
│   ├── components/                 # Shared Shadcn UI components
│   ├── hooks/                      # Custom React hooks
│   ├── actions/                    # Next.js server actions
│   ├── types/                      # Global TypeScript types
│   └── utils/                      # Utility functions
│
├── drizzle.config.ts
├── next.config.ts
├── components.json                 # Shadcn UI config
└── package.json
```

---

## API Reference

The Express server listens on **port 8000**. All endpoints (except `/health`) require an authenticated BetterAuth session cookie.

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Returns `{ status: "ok" }` — use to verify the server is up |

### Agents

| Method | Endpoint | Description |
|---|---|---|
| GET | `/agents` | List the authenticated user's agents (paginated + search) |
| POST | `/agents` | Create a new agent |
| GET | `/agents/:agentId` | Get a single agent by ID |
| PUT | `/agents/:agentId` | Update an agent |
| DELETE | `/agents/:agentId` | Delete an agent |

#### `GET /agents` — query parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | Page number (1-indexed) |
| `pageSize` | number | `10` | Items per page |
| `search` | string | — | Case-insensitive name search |

#### `POST /agents` — request body

```json
{
  "name": "My Agent",
  "instruction": "You are a helpful meeting assistant..."
}
```

#### Response shape (list)

```json
{
  "data": [...],
  "totalPages": 3,
  "totalAgents": 25,
  "currentPage": 1,
  "pageSize": 10
}
```

---

### Meetings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/meetings` | List the authenticated user's meetings (paginated, filterable) |
| POST | `/meetings` | Create a meeting + Stream.io call |
| GET | `/meetings/:meetingId` | Get a single meeting (with agent and user info) |
| PUT | `/meetings/:meetingId` | Update a meeting's name or agent |
| DELETE | `/meetings/:meetingId` | Delete a meeting |
| POST | `/meetings/token` | Generate a short-lived Stream.io user token |

#### `GET /meetings` — query parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | Page number (1-indexed) |
| `pageSize` | number | `10` | Items per page |
| `search` | string | — | Case-insensitive meeting name search |
| `status` | string | — | Filter by status: `upcoming`, `active`, `processing`, `completed`, `cancelled` |
| `agentId` | string | — | Filter by a specific agent ID |

#### `POST /meetings` — request body

```json
{
  "name": "Weekly Sync",
  "agentId": "<agent-id>"
}
```

#### `POST /meetings` — response

```json
{
  "data": { /* meeting row */ },
  "meetingToken": "<stream-user-token>"
}
```

The `meetingToken` is used by the frontend Stream.io SDK to join the video call.

#### Response shape (list)

```json
{
  "data": [...],
  "totalPages": 2,
  "totalMeetings": 14,
  "currentPage": 1,
  "pageSize": 10
}
```

Each meeting object in the list includes `agentName` and a computed `duration` (seconds, derived from `startedAt`/`endedAt`).

---

## Database Schema

### Tables

| Table | Description |
|---|---|
| `user` | User accounts managed by BetterAuth |
| `session` | Active user sessions |
| `account` | OAuth provider links (Google, GitHub) |
| `verification` | Email verification tokens |
| `agents` | AI agent definitions — `id`, `name`, `instructions`, `userId` |
| `meetings` | Meetings — `id`, `name`, `userId`, `agentId`, `status`, timestamps, `transcriptUrl`, `recordingUrl`, `summary` |

### Meeting status flow

```
upcoming → active → processing → completed
                ↘
              cancelled
```

| Status | When |
|---|---|
| `upcoming` | Meeting created, not yet started |
| `active` | Video call is live |
| `processing` | Call ended; Stream.io is generating transcript/recording |
| `completed` | Transcript, summary, and recording are ready |
| `cancelled` | Meeting was cancelled before starting |

---

## Caching Strategy

All list endpoints (`GET /agents`, `GET /meetings`) use a Redis-backed **read-through cache** with a **5-minute TTL**.

**Cache keys** are scoped per user and per query parameters:
```
agents:<userId>:<search|all>:<page>:<pageSize>
meetings:<userId>:<search|all>:<status|all>:<agentId|all>:<page>:<pageSize>
```

**Cache invalidation** is pattern-based: any write operation (create, update, delete) uses `KEYS <pattern>` + `DEL` to purge all cached pages for that user, ensuring consistency.

---

## Authentication

Authentication is handled by **BetterAuth** with a Drizzle ORM adapter.

- **Email / Password** — traditional sign-up and sign-in
- **Google OAuth** — one-click sign-in with Google
- **GitHub OAuth** — one-click sign-in with GitHub

The Express backend validates every protected request by forwarding the incoming cookies to `auth.api.getSession()`. If no valid session is found the request is rejected with `401 Unauthorized`. The resolved user is attached to `req.user` for downstream controllers.

---

## Contributing

Contributions are welcome! Please open an issue before submitting large changes.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit using conventional commits: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature`
5. Open a pull request against `main`

Please make sure `npm run lint` and `npm run format:check` pass before opening a PR.

---

## License

This project is open source. See [LICENSE](./LICENSE) for details.
