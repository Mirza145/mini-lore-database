import mongoose from 'mongoose';
import Character from '../models/Character.js';
import Relationship from '../models/Relationship.js';
import { ApiError } from '../utils/ApiError.js';

const populatedFields = 'name aliases';

function populateCharacters(query) {
  return query.populate('fromCharacter', populatedFields).populate('toCharacter', populatedFields);
}

const asTrimmedString = (value) => (value === null || value === undefined ? '' : String(value).trim());

function buildPayload(body) {
  const payload = {};
  if (body.fromCharacter !== undefined) payload.fromCharacter = body.fromCharacter;
  if (body.toCharacter !== undefined) payload.toCharacter = body.toCharacter;
  if (body.type !== undefined) payload.type = asTrimmedString(body.type).toLowerCase();
  if (body.description !== undefined) payload.description = asTrimmedString(body.description);
  if (body.sourceReference !== undefined) payload.sourceReference = asTrimmedString(body.sourceReference);
  return payload;
}

async function assertValidRelationship({ fromCharacter, toCharacter, type }, excludeId) {
  if (!mongoose.isValidObjectId(fromCharacter) || !mongoose.isValidObjectId(toCharacter)) {
    throw new ApiError(400, 'Both characters must have valid MongoDB ids.');
  }

  if (String(fromCharacter) === String(toCharacter)) {
    throw new ApiError(400, 'A character cannot have a relationship with itself.');
  }

  const [fromExists, toExists] = await Promise.all([
    Character.exists({ _id: fromCharacter }),
    Character.exists({ _id: toCharacter }),
  ]);

  if (!fromExists || !toExists) {
    throw new ApiError(400, 'One or both characters do not exist.');
  }

  const duplicateFilter = { fromCharacter, toCharacter, type };
  if (excludeId) duplicateFilter._id = { $ne: excludeId };

  const duplicate = await Relationship.findOne(duplicateFilter);
  if (duplicate) {
    throw new ApiError(409, 'This exact relationship already exists.');
  }
}

export async function listRelationships(req, res) {
  const filter = {};
  const { characterId } = req.query;

  if (characterId !== undefined) {
    if (typeof characterId !== 'string' || !mongoose.isValidObjectId(characterId)) {
      throw new ApiError(400, 'characterId must be a valid MongoDB id.');
    }
    filter.$or = [{ fromCharacter: characterId }, { toCharacter: characterId }];
  }

  const relationships = await populateCharacters(Relationship.find(filter).sort({ createdAt: 1 }));
  res.json({ data: relationships });
}

export async function createRelationship(req, res) {
  const payload = buildPayload(req.body);

  if (payload.type) payload.type = payload.type.toLowerCase();
  await assertValidRelationship(payload);

  const relationship = await Relationship.create(payload);
  await relationship.populate([
    { path: 'fromCharacter', select: populatedFields },
    { path: 'toCharacter', select: populatedFields },
  ]);

  res.status(201).json({ data: relationship });
}

export async function updateRelationship(req, res) {
  const relationship = await Relationship.findById(req.params.id);
  if (!relationship) throw new ApiError(404, 'Relationship not found.');

  const payload = buildPayload(req.body);
  const candidate = {
    fromCharacter: payload.fromCharacter ?? relationship.fromCharacter,
    toCharacter: payload.toCharacter ?? relationship.toCharacter,
    type: payload.type ?? relationship.type,
  };

  await assertValidRelationship(candidate, relationship._id);

  relationship.set(payload);
  await relationship.save();
  await relationship.populate([
    { path: 'fromCharacter', select: populatedFields },
    { path: 'toCharacter', select: populatedFields },
  ]);

  res.json({ data: relationship });
}

export async function deleteRelationship(req, res) {
  const relationship = await Relationship.findByIdAndDelete(req.params.id);
  if (!relationship) throw new ApiError(404, 'Relationship not found.');
  res.json({ data: { id: relationship.id, deleted: true } });
}
