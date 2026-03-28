# Zap AI

> An AI-powered SaaS platform for creating, managing, and hosting intelligent AI agents in video meetings.

Zap AI lets you define custom AI agents with specific instructions and have them join real-time video calls. After each meeting the platform automatically generates transcripts, summaries, and recordings.

---

## Features

- **AI Agent Management** – Create and configure AI agents with custom instructions and personas
- **Video Meetings** – Schedule and host real-time video meetings powered by Stream.io
- **Meeting Lifecycle** – Track meetings through statuses: `upcoming → active → processing → completed`
- **Post-Meeting Analytics** – Auto-generated transcripts, summaries, and recordings
- **Authentication** – Email/password and OAuth (Google & GitHub) via BetterAuth
- **Data Caching** – Redis-backed caching for fast data retrieval
- **Responsive Dashboard** – Paginated agent and meeting lists with filtering and search

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS 4, Shadcn UI (Radix UI) |
| State / Data | TanStack Query v5, React Hook Form, Zod |
| Video | Stream.io Video React SDK |
| Backend | Express 5 (Node.js, TypeScript) |
| Database | PostgreSQL (Neon Serverless) + Drizzle ORM |
| Caching | Redis (ioredis) |
| Auth | BetterAuth (Drizzle adapter, Google, GitHub OAuth) |

---

## Prerequisites

- **Node.js** v18+ (LTS recommended)
- **PostgreSQL** database – [Neon](https://neon.tech) is preconfigured
- **Redis** instance (local or cloud)
- **Stream.io** account – [stream.io](https://getstream.io) for video calling
- **Google** and/or **GitHub** OAuth application credentials

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

Create a `.env.local` file in the `ai-saas/` directory:

```env
# Database
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require

# Authentication (BetterAuth)
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Stream.io
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Redis
REDIS_URL=redis://localhost:6379

# Backend
NEXT_PUBLIC_API_URL=http://localhost:8000
PORT=8000
```

### 4. Set up the database

```bash
npm run db:push
```

### 5. Start the development servers

In one terminal, start the **Express backend** (port 8000):

```bash
npm run server
```

In a second terminal, start the **Next.js frontend** (port 3000):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

All scripts are run from the `ai-saas/` directory.

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js development server (port 3000) |
| `npm run build` | Build Next.js for production |
| `npm run start` | Start Next.js production server |
| `npm run lint` | Lint the codebase with ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run server` | Start Express backend server with watch (port 8000) |
| `npm run db:push` | Push Drizzle ORM schema to the database |
| `npm run db:studio` | Open Drizzle Studio for visual database management |

---

## Project Structure

```
ai-saas/
├── src/
│   ├── app/                   # Next.js App Router pages & API routes
│   │   ├── (auth)/            # Sign-in / sign-up pages
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── call/[meetingId]/  # Live video call page
│   │   └── api/               # BetterAuth & API client helpers
│   ├── modules/               # Feature modules
│   │   ├── agents/            # Agent CRUD views & components
│   │   ├── meetings/          # Meeting views, hooks & components
│   │   ├── call/              # Video call UI & providers
│   │   └── auth/              # Auth forms
│   ├── server/                # Express backend
│   │   ├── routes/            # agents.ts, meetings.ts
│   │   ├── controllers/       # Business logic
│   │   └── middleware/        # Auth middleware
│   ├── db/                    # Drizzle ORM setup & schema
│   ├── lib/                   # Auth, Redis, Stream.io, utilities
│   └── components/            # Shared UI components (Shadcn)
├── drizzle.config.ts
├── next.config.ts
└── package.json
```

---

## API Overview

The Express backend runs on port **8000** and exposes REST endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/agents` | List authenticated user's agents (paginated) |
| POST | `/agents` | Create a new agent |
| GET | `/agents/:id` | Get a specific agent |
| PUT | `/agents/:id` | Update an agent |
| DELETE | `/agents/:id` | Delete an agent |
| GET | `/meetings` | List meetings (paginated, filterable) |
| POST | `/meetings` | Create a new meeting |
| GET | `/meetings/:id` | Get meeting details |
| PUT | `/meetings/:id` | Update a meeting |
| DELETE | `/meetings/:id` | Delete a meeting |

All routes require authentication via the `requireAuth` middleware.

---

## Database Schema

| Table | Description |
|---|---|
| `user` | User accounts |
| `session` | Active user sessions |
| `account` | OAuth account links |
| `verification` | Email verification tokens |
| `agents` | AI agent definitions (name, instructions) |
| `meetings` | Meetings with status, transcript, summary, recording |

Meeting status flow: `upcoming` → `active` → `processing` → `completed` (or `cancelled`)

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## License

This project is open source. See [LICENSE](./LICENSE) for details.
