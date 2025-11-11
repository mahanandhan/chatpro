import mongoose from 'mongoose';

const PrivateSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PrivateMessage',
    }
  ]
}, { timestamps: true });

const Private = mongoose.model('PrivateChats', PrivateSchema);
export default Private;
