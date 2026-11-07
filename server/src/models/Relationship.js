import mongoose from 'mongoose';

export const RELATIONSHIP_TYPES = [
  'family',
  'ally',
  'rival',
  'enemy',
  'mentor',
  'captain',
  'crewmate',
  'friend',
];

const relationshipSchema = new mongoose.Schema(
  {
    fromCharacter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Character',
      required: [true, 'A relationship needs a starting character.'],
    },
    toCharacter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Character',
      required: [true, 'A relationship needs an ending character.'],
    },
    type: {
      type: String,
      required: [true, 'A relationship type is required.'],
      enum: {
        values: RELATIONSHIP_TYPES,
        message: `Relationship type must be one of: ${RELATIONSHIP_TYPES.join(', ')}.`,
      },
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'A relationship description cannot be longer than 500 characters.'],
    },
    sourceReference: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'A source reference cannot be longer than 300 characters.'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// The same directed relationship should only exist once.
relationshipSchema.index({ fromCharacter: 1, toCharacter: 1, type: 1 }, { unique: true });

export default mongoose.model('Relationship', relationshipSchema);
