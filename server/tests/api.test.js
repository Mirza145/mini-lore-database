import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';

// Configure the isolated test database before importing anything that reads env.
process.env.USE_MEMORY_DB = 'true';
process.env.MEMORY_DB_PERSIST = 'false';
process.env.AUTO_SEED = 'false';
process.env.NODE_ENV = 'test';
process.env.PORT = '0';

let connectDatabase;
let disconnectDatabase;
let seedDatabase;
let server;
let baseUrl;

async function request(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  return {
    status: response.status,
    body: text ? JSON.parse(text) : null,
  };
}

before(async () => {
  ({ connectDatabase, disconnectDatabase } = await import('../src/config/db.js'));
  ({ seedDatabase } = await import('../src/seed.js'));
  const { default: app } = await import('../src/app.js');

  await connectDatabase();
  await seedDatabase({ reset: true });

  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await disconnectDatabase();
});

test('health endpoint reports a connected database', async () => {
  const response = await request('/health');
  assert.equal(response.status, 200);
  assert.equal(response.body.data.status, 'ok');
  assert.equal(response.body.data.database, 'connected');
});

test('stats expose the seeded universe counts', async () => {
  const response = await request('/stats');
  assert.equal(response.status, 200);
  assert.equal(response.body.data.counts.characters, 15);
  assert.equal(response.body.data.counts.relationships, 20);
  assert.equal(response.body.data.counts.loreEntries, 9);
  assert.ok(response.body.data.recentLore.length > 0);
});

test('character search matches names and aliases', async () => {
  const byName = await request('/characters?q=luffy');
  assert.equal(byName.status, 200);
  assert.ok(byName.body.data.some((character) => character.name === 'Monkey D. Luffy'));

  const byAlias = await request('/characters?q=mugiwara');
  assert.ok(byAlias.body.data.some((character) => character.name === 'Monkey D. Luffy'));
});

test('character CRUD and validation', async () => {
  const missingName = await request('/characters', { method: 'POST', body: { description: 'No name' } });
  assert.equal(missingName.status, 400);

  const created = await request('/characters', {
    method: 'POST',
    body: {
      name: 'Test Pirate',
      aliases: 'Testy, T. Pirate',
      description: 'A temporary character used by the smoke test.',
      firstAppearance: 'Manga Chapter 0',
    },
  });
  assert.equal(created.status, 201);
  const characterId = created.body.data.id;
  assert.deepEqual(created.body.data.aliases, ['Testy', 'T. Pirate']);

  const fetched = await request(`/characters/${characterId}`);
  assert.equal(fetched.status, 200);

  const updated = await request(`/characters/${characterId}`, {
    method: 'PATCH',
    body: { description: 'Updated by the smoke test.' },
  });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.data.description, 'Updated by the smoke test.');

  const deleted = await request(`/characters/${characterId}`, { method: 'DELETE' });
  assert.equal(deleted.status, 200);

  const missing = await request(`/characters/${characterId}`);
  assert.equal(missing.status, 404);

  const invalidId = await request('/characters/not-an-id');
  assert.equal(invalidId.status, 400);
});

test('relationships reject self-links, unknown characters and duplicates', async () => {
  const luffy = (await request('/characters?q=luffy')).body.data[0];
  const usopp = (await request('/characters?q=usopp')).body.data[0];

  const created = await request('/relationships', {
    method: 'POST',
    body: {
      fromCharacter: usopp.id,
      toCharacter: luffy.id,
      type: 'crewmate',
      description: 'Smoke-test connection.',
    },
  });
  assert.equal(created.status, 201);
  const relationshipId = created.body.data.id;

  const duplicate = await request('/relationships', {
    method: 'POST',
    body: { fromCharacter: usopp.id, toCharacter: luffy.id, type: 'crewmate' },
  });
  assert.equal(duplicate.status, 409);

  const selfLink = await request('/relationships', {
    method: 'POST',
    body: { fromCharacter: luffy.id, toCharacter: luffy.id, type: 'ally' },
  });
  assert.equal(selfLink.status, 400);

  const unknownCharacter = await request('/relationships', {
    method: 'POST',
    body: { fromCharacter: luffy.id, toCharacter: '0123456789abcdef01234567', type: 'ally' },
  });
  assert.equal(unknownCharacter.status, 400);

  const filtered = await request(`/relationships?characterId=${luffy.id}`);
  assert.ok(filtered.body.data.some((relationship) => relationship.id === relationshipId));
  assert.ok(filtered.body.data.every((relationship) => relationship.fromCharacter.name));

  const removed = await request(`/relationships/${relationshipId}`, { method: 'DELETE' });
  assert.equal(removed.status, 200);
});

test('a referenced character cannot be deleted', async () => {
  const luffy = (await request('/characters?q=luffy')).body.data[0];
  const response = await request(`/characters/${luffy.id}`, { method: 'DELETE' });
  assert.equal(response.status, 409);
  assert.match(response.body.error.message, /referenced/i);
});

test('lore entries validate categories, sources and filters', async () => {
  const luffy = (await request('/characters?q=luffy')).body.data[0];

  const missingFields = await request('/lore-entries', {
    method: 'POST',
    body: { title: 'Incomplete entry' },
  });
  assert.equal(missingFields.status, 400);

  const invalidCategory = await request('/lore-entries', {
    method: 'POST',
    body: {
      title: 'Bad category',
      content: 'Content',
      category: 'rumour',
      sourceTitle: 'A source',
    },
  });
  assert.equal(invalidCategory.status, 400);

  const invalidUrl = await request('/lore-entries', {
    method: 'POST',
    body: {
      title: 'Bad URL',
      content: 'Content',
      category: 'canon',
      sourceTitle: 'A source',
      sourceUrl: 'javascript:alert(1)',
    },
  });
  assert.equal(invalidUrl.status, 400);

  const created = await request('/lore-entries', {
    method: 'POST',
    body: {
      title: 'Smoke test theory',
      content: 'A temporary entry created by the automated test.',
      category: 'theory',
      characters: [luffy.id],
      sourceTitle: 'Test Source',
      sourceUrl: 'https://example.com/reference',
      episodeOrChapter: 'Chapter 0',
    },
  });
  assert.equal(created.status, 201);
  const entryId = created.body.data.id;
  assert.equal(created.body.data.characters[0].id, luffy.id);

  const filtered = await request('/lore-entries?category=theory&q=Smoke');
  assert.ok(filtered.body.data.some((entry) => entry.id === entryId));

  const byCharacter = await request(`/lore-entries?characterId=${luffy.id}`);
  assert.ok(byCharacter.body.data.every((entry) => entry.characters.some((character) => character.id === luffy.id)));

  const updated = await request(`/lore-entries/${entryId}`, {
    method: 'PATCH',
    body: { category: 'disputed' },
  });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.data.category, 'disputed');

  const removed = await request(`/lore-entries/${entryId}`, { method: 'DELETE' });
  assert.equal(removed.status, 200);

  const missing = await request(`/lore-entries/${entryId}`);
  assert.equal(missing.status, 404);
});
