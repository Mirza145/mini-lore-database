import mongoose from 'mongoose';
import Character from '../models/Character.js';
import LoreEntry, { LORE_CATEGORIES } from '../models/LoreEntry.js';
import { ApiError } from '../utils/ApiError.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function normaliseCharacterIds(value) {
  if (value === undefined) return undefined;
  const list = Array.isArray(value) ? value : [value];
  return [...new Set(list.filter(Boolean).map(String))];
}

const asTrimmedString = (value) => (value === null || value === undefined ? '' : String(value).trim());

function buildPayload(body) {
  const payload = {};
  if (body.title !== undefined) payload.title = asTrimmedString(body.title);
  if (body.content !== undefined) payload.content = asTrimmedString(body.content);
  if (body.category !== undefined) payload.category = asTrimmedString(body.category).toLowerCase();
  if (body.sourceTitle !== undefined) payload.sourceTitle = asTrimmedString(body.sourceTitle);
  if (body.sourceUrl !== undefined) payload.sourceUrl = asTrimmedString(body.sourceUrl);
  if (body.episodeOrChapter !== undefined) payload.episodeOrChapter = asTrimmedString(body.episodeOrChapter);
  if (body.characters !== undefined) payload.characters = normaliseCharacterIds(body.characters);
  return payload;
}

async function assertCharactersExist(characterIds) {
  if (!characterIds?.length) return;

  if (characterIds.some((id) => !mongoose.isValidObjectId(id))) {
    throw new ApiError(400, 'One or more related characters have invalid ids.');
  }

  const count = await Character.countDocuments({ _id: { $in: characterIds } });
  if (count !== characterIds.length) {
    throw new ApiError(400, 'One or more selected characters do not exist.');
  }
}

export async function listLoreEntries(req, res) {
  const filter = {};
  const { category, characterId } = req.query;
  const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';

  if (category !== undefined) {
    const value = String(category).toLowerCase();
    if (!LORE_CATEGORIES.includes(value)) {
      throw new ApiError(400, `Category must be one of: ${LORE_CATEGORIES.join(', ')}.`);
    }
    filter.category = value;
  }

  if (characterId !== undefined) {
    if (typeof characterId !== 'string' || !mongoose.isValidObjectId(characterId)) {
      throw new ApiError(400, 'characterId must be a valid MongoDB id.');
    }
    filter.characters = characterId;
  }

  if (query) {
    filter.title = new RegExp(escapeRegex(query), 'i');
  }

  const entries = await LoreEntry.find(filter)
    .sort({ createdAt: -1 })
    .populate('characters', 'name aliases');

  res.json({ data: entries });
}

export async function getLoreEntry(req, res) {
  const entry = await LoreEntry.findById(req.params.id).populate('characters', 'name aliases');
  if (!entry) throw new ApiError(404, 'Lore entry not found.');
  res.json({ data: entry });
}

export async function createLoreEntry(req, res) {
  const payload = buildPayload(req.body);
  await assertCharactersExist(payload.characters);

  const entry = await LoreEntry.create(payload);
  await entry.populate('characters', 'name aliases');
  res.status(201).json({ data: entry });
}

export async function updateLoreEntry(req, res) {
  const entry = await LoreEntry.findById(req.params.id);
  if (!entry) throw new ApiError(404, 'Lore entry not found.');

  const payload = buildPayload(req.body);
  await assertCharactersExist(payload.characters);

  entry.set(payload);
  await entry.save();
  await entry.populate('characters', 'name aliases');
  res.json({ data: entry });
}

export async function deleteLoreEntry(req, res) {
  const entry = await LoreEntry.findByIdAndDelete(req.params.id);
  if (!entry) throw new ApiError(404, 'Lore entry not found.');
  res.json({ data: { id: entry.id, deleted: true } });
}
