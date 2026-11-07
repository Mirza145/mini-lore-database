# Mini Lore Database — The Grand Line Archive

A small, personal lore database for **one** fictional universe: *One Piece*. It keeps characters, the relationships between them, sourced lore notes and a simple relationship graph in one place.

This is the version 1 MVP described in [plan.md](./plan.md): no AI, no scraping, no accounts and no microservices.

## Features

- **Universe overview** with character, relationship and lore totals plus the latest entries.
- **Character directory** with search by name or alias, and create / edit / delete flows.
- **Character profiles** showing aliases, first appearance, direct connections (with direction preserved), related lore and safe deletion rules.
- **Relationships** between two existing characters, with a type (`family`, `ally`, `rival`, `enemy`, `mentor`, `captain`, `crewmate`, `friend`), a description and an optional source.
- **Lore library** with `canon`, `theory`, `question` and `disputed` categories, category filters, title search, related characters and a required source (title, optional URL, episode/chapter). Entries can be created, edited and deleted.
- **Relationship graph** drawn with Cytoscape.js: the selected character in the centre, direct connections around them, labelled directed edges, and clickable nodes.
- **Server-side validation** with clear error messages, safe 404/409 handling, request size limits and rate limiting.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + React Router |
| Styling | Tailwind CSS v4 |
| Backend | Node.js + Express 5 |
| Database | MongoDB via Mongoose 9 |
| Dev database | `mongodb-memory-server` (no local install needed) |
| Graph | Cytoscape.js |
| HTTP | Native `fetch` wrapped in a small API service |

## Project structure

```text
mini-lore-database/
├── client/
│   ├── src/
│   │   ├── components/       # Layout, cards, modals, graph, icons
│   │   ├── pages/            # Overview, characters, lore, graph
│   │   ├── services/api.js   # fetch wrapper for the REST API
│   │   ├── hooks/useApi.js   # loading / error / reload helper
│   │   ├── constants.js      # relationship types, lore categories
│   │   ├── utils/format.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/           # env, database, universe metadata
│   │   ├── data/seedData.js  # Milestone 0 sample universe
│   │   ├── models/           # Character, Relationship, LoreEntry
│   │   ├── routes/           # REST route definitions
│   │   ├── controllers/      # request handling + validation
│   │   ├── middleware/       # errors, rate limits
│   │   ├── utils/
│   │   ├── app.js
│   │   ├── server.js
│   │   └── seed.js
│   ├── .env.example
│   └── package.json
├── plan.md
└── README.md
```

## Getting started

### Prerequisites

- Node.js 20.19+ (built with Node 22)
- npm 10+
- MongoDB is **optional**: the default development setup starts a real in-memory MongoDB instance automatically and persists it to `server/.mongo-data`.

### 1. Start the API

```bash
cd server
cp .env.example .env      # Windows: copy .env.example .env
npm install
npm run dev
```

The API listens on <http://127.0.0.1:5000>. On the first start it seeds the sample One Piece universe (15 characters, 20 relationships, 9 lore entries).

> **First run:** `mongodb-memory-server` downloads a MongoDB binary on first use (several hundred MB). This happens once and is cached in the package's `node_modules/.cache/mongodb-memory-server` folder or in your user cache (`%USERPROFILE%\.cache\mongodb-binaries` on Windows, `~/.cache/mongodb-binaries` on macOS/Linux), depending on the install. If the download is interrupted, run `npm start` again; it retries. You can pin a different server version with `MONGOMS_VERSION` in the environment.


Check it with:

```bash
curl http://127.0.0.1:5000/api/health
```

```json
{ "data": { "status": "ok", "database": "connected", ... } }
```

### 2. Start the frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open <http://localhost:5173>. Vite proxies `/api` requests to the API, so no frontend env file is needed for local development.

### Using a real MongoDB instead

Set these in `server/.env`:

```env
USE_MEMORY_DB=false
MONGODB_URI=mongodb://127.0.0.1:27017/mini-lore-database
```

Then start MongoDB (local service or Atlas connection string) and run `npm run dev` again. With Atlas, use the `mongodb+srv://` URI and keep it out of Git.

> **Note:** the in-memory database is a real `mongod` process. With `MEMORY_DB_PERSIST=true` the data survives restarts in `server/.mongo-data`. Set `MEMORY_DB_PERSIST=false` for a throwaway database that is reseeded every launch.

### Re-seeding

```bash
cd server
npm run seed
```

This deletes all current records and inserts the sample universe again. **Do not run it against a database you care about.**

## Sharing with friends (Cloudflare tunnel)

## Hosting it online (Cloudflare Pages + Render + MongoDB Atlas)

The tunnel above is only live while your PC runs. To host the app 24/7 on free tiers:

1. **Database** – create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) M0 cluster, make a database user, and copy the `mongodb+srv://…` connection string (replace `<password>`).
2. **API** – push this repo to GitHub, then create a free [Render](https://render.com) web service from the repo using the included `render.yaml`. Set the `MONGODB_URI` secret to your Atlas string and `CLIENT_ORIGIN` to your Cloudflare Pages URL.
3. **Frontend** – build the client (`cd client && VITE_API_URL=https://<your-render-app>.onrender.com/api npm run build`) and deploy `client/dist` to [Cloudflare Pages](https://pages.cloudflare.com).

Related limitations: the Render free tier sleeps after ~15 minutes idle (first visitor waits ~40&nbsp;s), and anyone with the frontend link can edit and delete — add real authentication before sharing a public URL widely.

The API has no accounts, but it stays on `127.0.0.1` — so the safe way to share is a Cloudflare quick tunnel: the app still runs on your machine, and Cloudflare hands out a public link.

```powershell
# 1. Start the API (keep this window running)
cd server
npm run dev

# 2. Start the frontend (keep this window running)
cd ..\client
npm run dev

# 3. Open the tunnel (keep this window running)
C:\Users\<you>\.cloudflared\cloudflared.exe tunnel --url http://localhost:5173
```

`cloudflared` prints a `https://<random-words>.trycloudflare.com` link. Share that with anyone; Vite is already configured to accept `*.trycloudflare.com` hosts.

Things to know:

- The link only works while your PC is on and all three windows are running.
- The URL is **new every time** you restart the tunnel. For a permanent link, create a free Cloudflare account and use a [named tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/).
- Fail-safe: the API's rate limits and validation still apply to visitors, but there is no login. Anyone with the link can add, edit and delete notes — share only with people you trust.

## API overview

All responses use `{ "data": ... }` on success and `{ "error": { "message": "...", "details": [...] } }` on failure.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Health + database status |
| `GET` | `/api/stats` | Universe metadata, counts, recent lore |
| `GET` | `/api/characters?q=` | List/search characters by name or alias |
| `GET` | `/api/characters/:id` | Get one character |
| `POST` | `/api/characters` | Create a character |
| `PATCH` | `/api/characters/:id` | Update a character |
| `DELETE` | `/api/characters/:id` | Delete (blocked while referenced) |
| `GET` | `/api/relationships?characterId=` | List relationships, optionally for one character |
| `POST` | `/api/relationships` | Create a relationship |
| `PATCH` | `/api/relationships/:id` | Update a relationship |
| `DELETE` | `/api/relationships/:id` | Delete a relationship |
| `GET` | `/api/lore-entries?category=&q=&characterId=` | List/filter lore entries |
| `GET` | `/api/lore-entries/:id` | Get one lore entry |
| `POST` | `/api/lore-entries` | Create a lore entry |
| `PATCH` | `/api/lore-entries/:id` | Update a lore entry |
| `DELETE` | `/api/lore-entries/:id` | Delete a lore entry |

### Data integrity rules enforced by the API

- A character must have a non-empty name.
- Relationship endpoints validate both MongoDB ids, require two different existing characters, and reject duplicates of the same direction + type.
- Lore entries require a title, content, a valid category and a source title. `sourceUrl`, when present, must be `http`/`https`.
- Deleting a character is **blocked** while relationships or lore entries still reference it, so no broken references are left behind.
- Invalid MongoDB ids return `400`, missing records return `404`, and reference conflicts return `409`.

## Sample universe (Milestone 0)

The seed is stored in [`server/src/data/seedData.js`](./server/src/data/seedData.js):

- 15 characters from *One Piece*, including the Straw Hats, Shanks, Ace, Blackbeard, Rayleigh and Law.
- 20 directed relationships using eight relationship types.
- 9 sourced lore entries covering all four categories (canon, theory, question, disputed).
- Descriptions and notes are original short summaries; sources are One Piece Wiki pages and manga chapter references, not copied text.

## Scripts

### `server/`

| Command | Description |
|---|---|
| `npm run dev` | Start the API with file watching |
| `npm start` | Start the API |
| `npm run seed` | Reset and re-insert the sample universe |
| `npm test` | Run the API integration tests against an isolated in-memory database |

### `client/`

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |

### Automated API tests

The integration tests in `server/tests/api.test.js` start an isolated in-memory MongoDB, seed it, start the Express app on a random port and exercise the main flows:

- health and stats;
- character search by name/alias, CRUD, invalid ids and `404`s;
- relationship creation, duplicates, self-links, unknown characters and filtering;
- blocked deletion of a referenced character;
- lore categories, sources, filters and invalid payloads.

```bash
cd server
npm test
```


## Security notes for this MVP

- `.env` is git-ignored; use `.env.example` as the template.
- CORS is restricted to `CLIENT_ORIGIN` (defaults to localhost/127.0.0.1 on port 5173).
- The API binds to `127.0.0.1` by default so unauthenticated write endpoints are not exposed to the local network.
- JSON bodies are capped at 50 kB and writes are rate-limited.
- React renders user content as text (no `dangerouslySetInnerHTML`), and source links are restricted to `http`/`https`.
- Error responses never include stack traces or connection strings.

This is a local, single-user tool. Add authentication and authorisation before exposing it publicly.

## Testing checklist

The flows below were exercised against the running API and UI:

- [x] Health endpoint reports a connected database.
- [x] Character create / read / update / delete.
- [x] Reject a character with no name.
- [x] Search by full and partial name and by alias.
- [x] Invalid character id returns `400`; missing character returns `404`.
- [x] Character deletion blocked while relationships or lore entries reference it (`409`).
- [x] Relationship create with valid characters; reject self-links, missing characters and duplicates.
- [x] Relationships appear correctly on both relevant profiles and in the graph.
- [x] Lore entry create for each category; reject invalid category and missing required fields.
- [x] Lore filter by category and search by title.
- [x] Lore edit and delete flows.
- [x] Source URL validation and episode/chapter storage.
- [x] Graph rendering, character switching and empty state.
- [x] Frontend loading, empty and error states.

## Known limitations / next steps

Deliberately out of scope for v1 (see `plan.md`): authentication, multiple universes, AI assistance, scraping, spoiler filtering, import/export and a deployed demo. The data model leaves room for a `Universe` collection later.
