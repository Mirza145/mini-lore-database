export const RELATIONSHIP_TYPES = [
  { value: 'family', label: 'Family', phrase: 'is family to', color: '#7c5cbf' },
  { value: 'ally', label: 'Ally', phrase: 'is allied with', color: '#2f7d5d' },
  { value: 'rival', label: 'Rival', phrase: 'is a rival of', color: '#b8770f' },
  { value: 'enemy', label: 'Enemy', phrase: 'is an enemy of', color: '#b3202a' },
  { value: 'mentor', label: 'Mentor', phrase: 'is a mentor to', color: '#2c6b9e' },
  { value: 'captain', label: 'Captain', phrase: 'is the captain of', color: '#16233f' },
  { value: 'crewmate', label: 'Crewmate', phrase: 'is a crewmate of', color: '#2a8a8a' },
  { value: 'friend', label: 'Friend', phrase: 'is a friend of', color: '#b3568f' },
];

export const RELATIONSHIP_TYPE_MAP = Object.fromEntries(
  RELATIONSHIP_TYPES.map((type) => [type.value, type]),
);

export const LORE_CATEGORIES = [
  {
    value: 'canon',
    label: 'Canon',
    description: 'Confirmed by the source material.',
    badge: 'bg-emerald-100 text-emerald-900 ring-emerald-700/15',
    dot: 'bg-emerald-600',
  },
  {
    value: 'theory',
    label: 'Theory',
    description: 'A fan interpretation, not confirmed.',
    badge: 'bg-indigo-100 text-indigo-900 ring-indigo-700/15',
    dot: 'bg-indigo-600',
  },
  {
    value: 'question',
    label: 'Question',
    description: 'An open question still to be answered.',
    badge: 'bg-amber-100 text-amber-900 ring-amber-700/20',
    dot: 'bg-amber-500',
  },
  {
    value: 'disputed',
    label: 'Disputed',
    description: 'Sources or fans disagree.',
    badge: 'bg-rose-100 text-rose-900 ring-rose-700/15',
    dot: 'bg-rose-600',
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  LORE_CATEGORIES.map((category) => [category.value, category]),
);
