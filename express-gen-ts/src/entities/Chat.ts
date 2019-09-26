import mongoose, { Schema } from 'mongoose';

const ChatSchema = new mongoose.Schema({
    players : [{type: Schema.Types.ObjectId}],
});

export const ChatModel = mongoose.model('Chat', ChatSchema);
