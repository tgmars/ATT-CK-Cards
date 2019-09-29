import Player from './playerInterface';
import { state } from '@/main';

export interface MessageInterface {
        /** Time in epoch that message was sent by the client. */
        time: number;

        // ID of the player object in the database.
        player: Player;

        /** Message data.*/
        message: string;

        isCommand: boolean;
}

export class Message {

    /** Time in epoch that message was sent by the client. */
    public time: number;

    /** Name of the player/entity that sent the message. */
    public sender: Player;

    /** Message data.*/
    public message: string;

    /** Flags whether this message should be visible to all (true) or just the sender(false). */
    public isVisibleToAll: boolean;

    /** Flags if this message was sent by the current player, used to determine how the message is displayed */
    // isSentByPlayer:boolean

    constructor(sender: Player, message: string) {
        this.sender = sender;
        this.message = message;
        this.time = Date.now();
        this.isCommand();
        this.isVisibleToAll = (this.isCommand() ? false : true);
        // this.isSentByPlayer = (this.sender==currentPlayer ? true : false)
    }

    /**
     * Return true if the message is a comment by checking if it starts with a forward slash '/'
     */
    public isCommand(): boolean {
        return(this.message.charAt(0) == '/' ? true : false);
    }

    public setIsVisibileToAll(isVisibleToAll: boolean): void {
        this.isVisibleToAll = isVisibleToAll;
    }

    public getPlayerByMessage(): Player {
        return this.sender;
    }
    public display(): void {
        console.log(this.time + ': ' + this.sender.name + ': ' + this.message + ' : isCommand:' + this.isCommand() + ' : isVisibleToAll:' + this.isVisibleToAll);
    }

    public toObject(): MessageInterface {
        return {time: this.time,player: state.player._id,message: this.message,isCommand: this.isCommand()};
    }
}

