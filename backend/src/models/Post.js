import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video'], required: true }
});

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String, default: '' },
    hashtags: [{ type: String }],
    location: { type: String, default: '' },
    media: [mediaSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema]
  },
  { timestamps: true }
);

postSchema.index({ hashtags: 1 });
postSchema.index({ createdAt: -1 });

export default mongoose.model('Post', postSchema);
