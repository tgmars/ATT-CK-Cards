import mongoose, { Schema } from 'mongoose';
import { ProgressSchema } from './Progress';

const PlayerSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true,
    },
    role : {
        type: Boolean,
        required: true,
    },
    isBot : {
        type: Boolean,
        required: true,
    },
    resources : {
        type: Number,
        required: true,
    },
    hand : {
        type: Array,
        required: false,
    },
    progress :  ProgressSchema,
    persistentProgress : ProgressSchema,
    opponent : {
        type: Boolean,
        required: false,
    },
});

export const PlayerModel = mongoose.model('Player', PlayerSchema);
