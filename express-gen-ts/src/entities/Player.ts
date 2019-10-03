import mongoose, { Schema } from 'mongoose';

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
    progress : {
        type: Array,
    },
    persistentProgress : {
        type: Array,
    },
});

export const PlayerModel = mongoose.model('Player', PlayerSchema);


    // /**Initialises as player1 and player2. Use /setname in chat to overwrite.*/
    // name:string

    // /** False for defender, True for attacker */
    // role:boolean
    // /** Additional role for bot player */
    // isBot:boolean
    // resources:number
    // opponent:boolean

    // hand:Array<Card>
    // handMaxLength:number = 5
    // deck?:Array<Card>