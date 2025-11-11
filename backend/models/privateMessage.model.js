import mongoose from 'mongoose';

const PrivateMessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

const PrivateMessage = mongoose.model('PrivateMessage', PrivateMessageSchema);
export default PrivateMessage;
