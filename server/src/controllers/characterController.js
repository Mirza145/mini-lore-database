import Character from '../models/Character.js';
import Relationship from '../models/Relationship.js';
import LoreEntry from '../models/LoreEntry.js';
import { ApiError } from '../utils/ApiError.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function normaliseAliases(value) {
  if (value === undefined) return undefined;
  if (value === null) return [];
  const list = Array.isArray(value) ? value : String(value).split(',');
  return [...new Set(list.map((alias) => String(alias).trim()).filter(Boolean))];
}

const asTrimmedString = (value) => (value === null || value === undefined ? '' : String(value).trim());

function buildPayload(body) {
  const payload = {};
  if (body.name !== undefined) payload.name = asTrimmedString(body.name);
  if (body.aliases !== undefined) payload.aliases = normaliseAliases(body.aliases);
  if (body.description !== undefined) payload.description = asTrimmedString(body.description);
  if (body.universe !== undefined) payload.universe = asTrimmedString(body.universe);
  if (body.firstAppearance !== undefined) payload.firstAppearance = asTrimmedString(body.firstAppearance);
  return payload;
}

export async function listCharacters(req, res) {
  const filter = {};
  const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';

  if (query) {
    const term = new RegExp(escapeRegex(query), 'i');
    filter.$or = [{ name: term }, { aliases: term }];
  }

  const characters = await Character.find(filter).sort({ name: 1 });
  res.json({ data: characters });
}

export async function getCharacter(req, res) {
  const character = await Character.findById(req.params.id);
  if (!character) throw new ApiError(404, 'Character not found.');
  res.json({ data: character });
}

export async function createCharacter(req, res) {
  const character = await Character.create(buildPayload(req.body));
  res.status(201).json({ data: character });
}

export async function updateCharacter(req, res) {
  const character = await Character.findById(req.params.id);
  if (!character) throw new ApiError(404, 'Character not found.');

  character.set(buildPayload(req.body));
  await character.save();
  res.json({ data: character });
}

export async function deleteCharacter(req, res) {
  const character = await Character.findById(req.params.id);
  if (!character) throw new ApiError(404, 'Character not found.');

  const [relationshipCount, loreCount] = await Promise.all([
    Relationship.countDocuments({
      $or: [{ fromCharacter: character._id }, { toCharacter: character._id }],
    }),
    LoreEntry.countDocuments({ characters: character._id }),
  ]);

  if (relationshipCount > 0 || loreCount > 0) {
    throw new ApiError(
      409,
      `"${character.name}" is still referenced by ${relationshipCount} relationship(s) and ${loreCount} lore entry/entries. Remove those references before deleting the character.`,
    );
  }

  await character.deleteOne();
  res.json({ data: { id: character.id, deleted: true } });
}
