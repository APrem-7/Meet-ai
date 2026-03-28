# Zap AI – `ai-saas`

This is the main application package for **Zap AI**. It contains both the Next.js 15 frontend and the Express 5 backend server.

For full project documentation, setup instructions, and architecture overview, see the [root README](../README.md).

## Quick Start

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start the Express backend (port 8000)
npm run server

# In a separate terminal, start the Next.js dev server (port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js development server (port 3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run server` | Start Express backend with watch (port 8000) |
| `npm run db:push` | Push Drizzle schema to the database |
| `npm run db:studio` | Open Drizzle Studio |
