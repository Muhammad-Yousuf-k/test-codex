import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: String, index: true, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, default: '' },
    media: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      mediaType: { type: String, enum: ['', 'image', 'video'], default: '' }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
