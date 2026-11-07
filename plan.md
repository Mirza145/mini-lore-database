# Mini Lore Database — Project Plan

## 1. Project overview

**Working name:** Mini Lore Database  
**Project type:** Small full-stack web application  
**Primary goal:** Build a personal, searchable database for one fictional universe, where characters, relationships, important lore and source references are organised in one place.

This is the first, deliberately small step towards a larger idea such as LoreGraph. The first release should be useful without AI, automated scraping, microservices or complex infrastructure.

### The problem

Information about a fictional universe is often scattered across wikis, episode or chapter discussions, fan theories and personal notes. It can be difficult to remember who is connected to whom, where an event occurred, and whether a statement is established canon or only a theory.

### The proposed solution

A web application that lets a user:

- Create and browse characters for one fictional universe.
- Record relationships between characters.
- Save important lore notes and events.
- Label each note as **Canon**, **Theory**, **Question** or **Disputed**.
- Attach a source reference, such as a wiki page, episode or chapter.
- Explore character relationships in a simple interactive graph.

## 2. MVP boundaries

### Included in version 1

1. One fictional universe only.
2. A character directory with search.
3. Character detail pages.
4. Create, edit and delete characters.
5. Create and view relationships between characters.
6. Create, edit and delete lore notes.
7. A source reference for each lore note.
8. A simple relationship graph.
9. Basic input validation and useful error messages.

### Explicitly out of scope for version 1

Do **not** build these yet:

- AI chatbot or AI-generated lore answers.
- Automatic web scraping or wiki ingestion.
- Multiple-universe support in the user interface.
- User accounts, social features or public contributions.
- Complex spoiler filtering.
- Recommendation systems or semantic/vector search.
- Microservices, Kubernetes or distributed infrastructure.
- A sophisticated analytics dashboard.

These can be considered after the core application works and has been tested.

## 3. Initial content scope

Choose **one** universe before implementation and keep the dataset small.

Suggested seed dataset:

- 10–15 characters.
- 10–20 relationships.
- 5–10 lore notes.
- At least one source reference for every lore note.

Enter this information manually at first. Use short descriptions written in your own words. Record source titles, links and episode/chapter references instead of copying long passages or copyrighted artwork.

## 4. Target user and main use cases

**Initial user:** You, using the application as a personal lore notebook and exploration tool.

Main use cases:

- Find a character by name.
- Open a character profile and see their relationships.
- Add a relationship, such as `mentor`, `rival`, `family`, `ally` or `enemy`.
- Record an important event or fact.
- Mark a note as canon, theory, question or disputed.
- Open the source reference to check where the information came from.
- View a character's immediate connections in a graph.

## 5. Suggested technology

Use technologies you already know for the first release.

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | User interface |
| Styling | Tailwind CSS | Layout and styling |
| Backend | Node.js + Express | REST API |
| Database | MongoDB Atlas or local MongoDB | Store lore data |
| ODM | Mongoose | Schemas, validation and database access |
| HTTP client | Axios or native `fetch` | Call the backend |
| Graph | Cytoscape.js | Display character relationships |
| Version control | Git + GitHub | Track changes and publish the code |

Keep the frontend and backend in one repository with two folders:

```text
mini-lore-database/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── app.js
│   ├── .env.example
│   └── package.json
├── README.md
└── plan.md
```

Adjust filenames to match the conventions you use, but keep responsibilities separated. Avoid creating folders that have no real purpose yet.

## 6. Data model

Start with four collections. Keep the model understandable; do not over-normalise the first version.

### 6.1 Character

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `aliases` | Array of strings | Optional |
| `description` | String | Short, original description |
| `universe` | String or ObjectId | The selected universe; can be a fixed value in v1 |
| `firstAppearance` | String | Optional episode/chapter reference |
| `createdAt` / `updatedAt` | Date | Timestamps |

### 6.2 Relationship

| Field | Type | Notes |
|---|---|---|
| `fromCharacter` | ObjectId | Reference to a Character |
| `toCharacter` | ObjectId | Reference to a Character |
| `type` | String | For example: ally, rival, family, mentor, enemy |
| `description` | String | Optional explanation |
| `sourceReference` | String | Optional link or chapter/episode reference |
| `createdAt` / `updatedAt` | Date | Timestamps |

Treat relationships as directed records in storage. For example, `A is mentor of B` does not automatically mean `B is mentor of A`. The UI can describe the relationship from the selected character's perspective.

### 6.3 LoreEntry

Use one collection for important facts, events and fan theories. This keeps version 1 smaller than creating separate collections for every kind of lore.

| Field | Type | Notes |
|---|---|---|
| `title` | String | Required |
| `content` | String | Short note written in your own words |
| `category` | String | `canon`, `theory`, `question` or `disputed` |
| `characters` | Array of ObjectIds | Characters connected to the entry |
| `sourceTitle` | String | Name of the source |
| `sourceUrl` | String | Optional URL |
| `episodeOrChapter` | String | Optional location in the source material |
| `createdAt` / `updatedAt` | Date | Timestamps |

### 6.4 Universe (optional for the first coding session)

If you want to keep the data model ready for expansion, create a simple Universe model with `name`, `description` and `mediaType`. Otherwise, use one fixed universe in the first version and add this collection only when you genuinely need it.

### Data integrity rules

- A character name must not be empty.
- A relationship must connect two different existing characters.
- Do not create duplicate relationships with the same direction and type.
- A lore entry must have a title, content and valid category.
- A source URL, when provided, must be a valid URL.
- Deleting a character must not leave broken references. Decide whether to block deletion or remove/repair related records; for this MVP, blocking deletion while references exist is the safer behaviour.

## 7. Main screens

### Screen 1: Home / Universe overview

Show:

- Universe name and short description.
- Number of characters.
- Number of relationships.
- Number of lore entries.
- Recently added lore notes.
- Links to Characters, Lore and Relationship Graph.

Keep the dashboard simple. These counts are useful status information, not a major analytics feature.

### Screen 2: Character directory

Show a list or grid of characters with:

- Name.
- Short description.
- First appearance, if available.
- Search by name or alias.
- Button to add a character.

### Screen 3: Character detail

Show:

- Character name and description.
- Aliases and first appearance.
- Connected characters and relationship types.
- Lore entries associated with this character.
- Actions to edit or delete the character.

### Screen 4: Lore library

Show lore entries with:

- Title and short content preview.
- Category label: Canon, Theory, Question or Disputed.
- Related characters.
- Source and episode/chapter reference.
- Filters by category and search by title.

### Screen 5: Relationship graph

Display characters as nodes and relationships as labelled edges.

For the first version:

- Show the selected character and its direct connections, rather than the entire universe by default.
- Use different edge labels for relationship types.
- Allow a node to be selected and open its character detail.
- Include a simple empty state when no relationships exist.

Do not spend time building complex graph physics or elaborate animations.

## 8. API outline

Use REST endpoints and consistent JSON responses. The exact route organisation can be adjusted during implementation.

### Characters

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/characters` | List characters; support `q` search |
| `GET` | `/api/characters/:id` | Get one character |
| `POST` | `/api/characters` | Create a character |
| `PATCH` | `/api/characters/:id` | Update a character |
| `DELETE` | `/api/characters/:id` | Delete if it has no references |

### Relationships

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/relationships` | List relationships; optionally filter by `characterId` |
| `POST` | `/api/relationships` | Create a relationship |
| `PATCH` | `/api/relationships/:id` | Update a relationship |
| `DELETE` | `/api/relationships/:id` | Delete a relationship |

### Lore entries

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/lore-entries` | List entries; support category and search filters |
| `GET` | `/api/lore-entries/:id` | Get one entry |
| `POST` | `/api/lore-entries` | Create an entry |
| `PATCH` | `/api/lore-entries/:id` | Update an entry |
| `DELETE` | `/api/lore-entries/:id` | Delete an entry |

### General API behaviour

- Return suitable HTTP status codes (`200`, `201`, `400`, `404`, `500`).
- Validate MongoDB IDs before querying.
- Return clear error messages without exposing stack traces or secrets.
- Keep database logic out of route definitions where practical.
- Add one central Express error-handling middleware.

## 9. Implementation sequence

Work in small, verifiable steps. Do not start the next feature until the current one works.

### Milestone 0 — Define the sample universe

- [ ] Choose one universe.
- [ ] List 10–15 characters.
- [ ] Record 10–20 relationships.
- [ ] Write 5–10 short lore entries.
- [ ] Attach a source reference to every lore entry.
- [ ] Decide how to represent episode/chapter references.

**Done when:** You have enough sample data to test every main screen without needing scraping.

### Milestone 1 — Set up the application

- [ ] Create the repository and `client` and `server` folders.
- [ ] Initialise the React/Vite frontend.
- [ ] Initialise the Express backend.
- [ ] Connect Express to MongoDB using an environment variable.
- [ ] Add a health endpoint such as `GET /api/health`.
- [ ] Add `.gitignore` and `.env.example`.
- [ ] Confirm the frontend can call the backend.

**Done when:** Both applications run locally and the backend confirms its database connection.

### Milestone 2 — Build character management

- [ ] Create the Character schema.
- [ ] Implement character list and detail endpoints.
- [ ] Implement create, update and delete endpoints.
- [ ] Build the character directory.
- [ ] Build the character detail page.
- [ ] Add search by name; add alias search if straightforward.
- [ ] Add form validation and loading/error states.

**Done when:** You can create, view, edit, search and safely delete a character through the UI.

### Milestone 3 — Add relationships

- [ ] Create the Relationship schema.
- [ ] Implement relationship endpoints.
- [ ] Add a form to connect two existing characters.
- [ ] Show relationships on character detail pages.
- [ ] Add relationship type labels.
- [ ] Prevent self-links and invalid character references.

**Done when:** A character profile shows its correct connected characters and relationship labels.

### Milestone 4 — Add lore entries and sources

- [ ] Create the LoreEntry schema.
- [ ] Implement lore-entry endpoints.
- [ ] Build a form to create and edit lore entries.
- [ ] Add category selection: Canon, Theory, Question, Disputed.
- [ ] Allow one or more related characters to be selected.
- [ ] Save source title, URL and episode/chapter reference.
- [ ] Build category filters and a basic search.

**Done when:** You can create, edit, browse and filter sourced lore entries.

### Milestone 5 — Build the relationship graph

- [ ] Install and configure Cytoscape.js.
- [ ] Convert the selected character and its relationships into graph nodes and edges.
- [ ] Label edges with relationship types.
- [ ] Make character nodes selectable.
- [ ] Open a character detail page when a node is selected.
- [ ] Handle empty and disconnected states.

**Done when:** The graph accurately represents the same relationships shown on character detail pages.

### Milestone 6 — Test, polish and document

- [ ] Test all create, read, update and delete flows.
- [ ] Test invalid IDs, missing fields and nonexistent records.
- [ ] Test duplicate relationships and self-relationships.
- [ ] Test behaviour when a character has related records.
- [ ] Check that secrets are not committed to Git.
- [ ] Add a useful README with setup instructions and screenshots.
- [ ] Deploy a working demo only after local testing is complete.

**Done when:** A new developer can follow the README, run the project and use its core features without guidance.

## 10. Security and reliability checklist

Even a small project should establish good habits.

- Keep database credentials and API secrets in `.env`; never commit them.
- Validate and normalise all data on the server, not only in React forms.
- Restrict CORS to the frontend origin used by the application.
- Do not render user-provided text as raw HTML.
- Validate source URLs and do not fetch arbitrary URLs from the backend.
- Use Mongoose validation and handle database errors safely.
- Add request-size limits and basic rate limiting before exposing write endpoints publicly.
- Do not expose stack traces, connection strings or secrets in API responses.
- Back up the database before making destructive changes to a populated dataset.

For a local, single-user MVP, full authentication is not required. Do not expose unauthenticated write endpoints to the public internet. Add authentication and authorisation before allowing public or multi-user access.

## 11. Testing checklist

### Characters

- [ ] Create a character with all fields.
- [ ] Reject a character with no name.
- [ ] Search by full and partial name.
- [ ] Open a character that exists.
- [ ] Return `404` for a character that does not exist.
- [ ] Update a character.
- [ ] Prevent unsafe deletion when relationships or lore entries reference it.

### Relationships

- [ ] Create a valid relationship.
- [ ] Reject a relationship to a nonexistent character.
- [ ] Reject a relationship from a character to itself.
- [ ] Prevent duplicate relationships.
- [ ] Show the correct connections on both relevant character views, while preserving the stored direction and meaning.

### Lore entries

- [ ] Create one entry for each category.
- [ ] Reject invalid categories and missing required fields.
- [ ] Save a source URL and chapter/episode reference.
- [ ] Filter by category.
- [ ] Find an entry by title.
- [ ] Display related characters correctly.

### Graph

- [ ] Show nodes and edges for a character with relationships.
- [ ] Show a useful empty state for a character without relationships.
- [ ] Ensure edge labels match the database.
- [ ] Open the correct character when a node is selected.

## 12. Definition of done

Version 1 is complete when:

1. The application runs locally from documented setup instructions.
2. The sample universe has at least 10 characters, 10 relationships and 5 sourced lore entries.
3. Character creation, editing, searching and viewing work.
4. Relationships can be created and displayed correctly.
5. Lore entries can be classified, sourced, searched and filtered.
6. The graph displays accurate character relationships.
7. Invalid input is handled safely and the UI shows useful errors.
8. The code is committed to GitHub and the README explains how to run it.

A deployed demo is a valuable final step, but do not let deployment prevent completion of the core application.

## 13. Future roadmap — only after version 1 works

Possible upgrades, in increasing complexity:

1. **Spoiler-aware browsing:** Let users set an episode/chapter progress point and hide later information.
2. **Timeline:** Display important lore entries and events in chronological or story order.
3. **Multiple universes:** Support more than one fictional universe.
4. **Import/export:** Export and import a universe as JSON.
5. **Automated ingestion:** Import permitted metadata from official APIs or sources whose terms allow it; keep provenance for every imported record.
6. **AI-assisted extraction:** Suggest characters, relationships and lore notes from supplied text, but require review before saving.
7. **Semantic search:** Search lore by meaning rather than exact words.
8. **Community contributions:** Add accounts, permissions, edit history and moderation.
9. **Advanced graph exploration:** Explore paths, clusters and relationship changes over time.

Do not implement these upgrades just because they are listed here. Choose them based on actual usage and learning goals.

## 14. Suggested first-week schedule

This is a guide, not a deadline. Complete each milestone before moving on.

| Session | Focus | Expected result |
|---|---|---|
| 1 | Choose the universe, prepare sample data, design schemas | Clear scope and sample dataset |
| 2 | Set up React, Express and MongoDB | Working local application and health endpoint |
| 3 | Character API and character pages | Character CRUD works |
| 4 | Relationships | Character connections appear on profiles |
| 5 | Lore entries and source references | Sourced, classified notes work |
| 6 | Relationship graph | Interactive graph works |
| 7 | Testing, README and optional deployment | Complete, documented MVP |

If a session takes longer, continue it. Do not skip understanding or testing to keep to the table.

## 15. Working rules

- Build one feature at a time.
- Understand the data flow before writing code: React form → API request → Express route/controller → Mongoose model → MongoDB → response → UI update.
- Predict what the code should do before running it, then compare the result.
- When something breaks, inspect the error and trace the request before rewriting code.
- Prefer a small working feature over a large unfinished abstraction.
- Do not add AI, scraping or advanced infrastructure until the manual workflow is reliable.
- Commit working milestones with clear Git messages.
- Finish version 1 before starting another project.

**First action:** Choose one fictional universe and prepare the initial list of 10–15 characters. Do not start coding until you know what sample data the application must support.
