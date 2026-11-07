import Character from '../models/Character.js';
import Relationship from '../models/Relationship.js';
import LoreEntry from '../models/LoreEntry.js';
import { universe } from '../config/universe.js';

export async function getStats(req, res) {
  const [characterCount, relationshipCount, loreCount, recentLore] = await Promise.all([
    Character.countDocuments(),
    Relationship.countDocuments(),
    LoreEntry.countDocuments(),
    LoreEntry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('characters', 'name aliases'),
  ]);

  res.json({
    data: {
      universe,
      counts: {
        characters: characterCount,
        relationships: relationshipCount,
        loreEntries: loreCount,
      },
      recentLore,
    },
  });
}
