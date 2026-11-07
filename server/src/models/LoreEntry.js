import mongoose from 'mongoose';

export const LORE_CATEGORIES = ['canon', 'theory', 'question', 'disputed'];

const isValidUrl = (value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const loreEntrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A lore entry title is required.'],
      trim: true,
      maxlength: [160, 'A title cannot be longer than 160 characters.'],
    },
    content: {
      type: String,
      required: [true, 'Lore entry content is required.'],
      trim: true,
      maxlength: [4000, 'Lore entry content cannot be longer than 4000 characters.'],
    },
    category: {
      type: String,
      required: [true, 'A category is required.'],
      enum: {
        values: LORE_CATEGORIES,
        message: `Category must be one of: ${LORE_CATEGORIES.join(', ')}.`,
      },
    },
    characters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character',
      },
    ],
    sourceTitle: {
      type: String,
      required: [true, 'A source title is required.'],
      trim: true,
      maxlength: [200, 'A source title cannot be longer than 200 characters.'],
    },
    sourceUrl: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: isValidUrl,
        message: 'Source URL must be a valid http or https address.',
      },
    },
    episodeOrChapter: {
      type: String,
      trim: true,
      default: '',
      maxlength: [120, 'An episode or chapter reference cannot be longer than 120 characters.'],
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

loreEntrySchema.index({ category: 1 });
loreEntrySchema.index({ title: 1 });

export default mongoose.model('LoreEntry', loreEntrySchema);
