import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A character name is required.'],
      trim: true,
      maxlength: [80, 'A character name cannot be longer than 80 characters.'],
    },
    aliases: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'A description cannot be longer than 1000 characters.'],
    },
    universe: {
      type: String,
      trim: true,
      default: 'One Piece',
    },
    firstAppearance: {
      type: String,
      trim: true,
      default: '',
      maxlength: [120, 'A first appearance cannot be longer than 120 characters.'],
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

characterSchema.index({ name: 1 });

export default mongoose.model('Character', characterSchema);
