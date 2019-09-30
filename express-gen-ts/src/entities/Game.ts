import mongoose, { Schema } from 'mongoose';

const GameSchema = new mongoose.Schema({
    attacker : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Player',
    },
    defender : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Player',
    },
    turn: {
        type: Boolean,
        required: true,
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
