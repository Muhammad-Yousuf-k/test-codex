import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    media: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      mediaType: { type: String, enum: ['image', 'video'], required: true }
    },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), index: { expires: 0 } }
  },
  { timestamps: true }
);

export default mongoose.model('Story', storySchema);
