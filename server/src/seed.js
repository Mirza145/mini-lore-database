import path from 'node:path';
import { pathToFileURL } from 'node:url';
import Character from './models/Character.js';
import Relationship from './models/Relationship.js';
import LoreEntry from './models/LoreEntry.js';
import { characters, relationships, loreEntries } from './data/seedData.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';

export async function seedDatabase({ reset = true } = {}) {
  if (reset) {
    await Promise.all([
      Character.deleteMany({}),
      Relationship.deleteMany({}),
      LoreEntry.deleteMany({}),
    ]);
  }

  const createdCharacters = await Character.insertMany(characters);
  const idByName = new Map(createdCharacters.map((character) => [character.name, character._id]));

  const resolve = (name) => {
    const id = idByName.get(name);
    if (!id) throw new Error(`Seed data references an unknown character: "${name}".`);
    return id;
  };

  const relationshipDocs = relationships.map(({ from, to, ...rest }) => ({
    ...rest,
    fromCharacter: resolve(from),
    toCharacter: resolve(to),
  }));

  const loreDocs = loreEntries.map(({ characters: names, ...rest }) => ({
    ...rest,
    characters: names.map(resolve),
  }));

  await Relationship.insertMany(relationshipDocs);
  await LoreEntry.insertMany(loreDocs);

  return {
    characters: createdCharacters.length,
    relationships: relationshipDocs.length,
    loreEntries: loreDocs.length,
  };
}

export async function seedIfEmpty() {
  const count = await Character.estimatedDocumentCount();
  if (count > 0) return null;
  return seedDatabase({ reset: true });
}

const isDirectRun =
  Boolean(process.argv[1]) && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isDirectRun) {
  try {
    await connectDatabase();
    const counts = await seedDatabase({ reset: true });
    console.log(
      `[seed] Inserted ${counts.characters} characters, ${counts.relationships} relationships and ${counts.loreEntries} lore entries.`,
    );
  } catch (error) {
    console.error('[seed] Failed:', error);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}
