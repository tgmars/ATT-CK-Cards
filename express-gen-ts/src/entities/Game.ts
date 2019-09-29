import mongoose, { Schema } from 'mongoose';
import { PlayerModel } from './Player';

const GameSchema = new mongoose.Schema({
    attacker : {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true,
    },
    defender : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Player',
    },
    gameState : {
        type: String,
        required: true,
        trim: true,
    },
    playSpace : {
        type: Array,
        required: true,
    },
});

export const GameModel = mongoose.model('Game', GameSchema);
