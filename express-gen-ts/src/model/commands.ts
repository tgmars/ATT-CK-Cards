import { Message, MessageInterface } from './message';
import Player from './playerInterface';
import { GameBoard } from './gameBoard';
import { PlayerModel } from '@entities';
import { logger } from '@shared';

export default class Command {
    public recipient: string;
    public command: string;
    public commandArgs: string;
    public commands: string[] = ['/help', '/setname', '/newgame', '/listplayers', '/reply'];

    // Initialise a new commandbot player as the sender of the message.
    public commandBot: Player = {name: 'Command Bot', _id: '', hand: [], isBot: true, resources: 0, role: false};

    constructor(message: string, sender: string) {
        this.recipient = sender;
        this.command = message.split(' ')[0];
        this.commandArgs = message.split(' ')[1];
    }

    /**
     * Check if a command is valid by confirming its existence in the commands array.
     */
    public isValid(): boolean {
        return(this.commands.indexOf(this.command) === -1 ? false : true);
    }

    /**
     * Maps user /command to a function
     * I'm certain that there's a nicer & less verbose way to do this, would love to hear how!
     */
    public async execute(): Promise<MessageInterface> {
        switch (this.command) {
            case '/help': {
                return this.commandHelp();
            }
            case '/setname': {
                try {
                    await PlayerModel.findByIdAndUpdate(this.recipient, {name: this.commandArgs});
                    return this.commandSetname(this.commandArgs);
                } catch (err) {
                    return this.commandError('Error occured updating your name.');
                }
            }
            case '/reply': {
                return this.commandReply();
            }
            case '/newgame': {
                // return this.commandNewGame(this.commandArgs);
            }
            case '/listplayers': {
                // Get users from the database
                const playersDocument = await PlayerModel.find({}, 'name -_id');
                // const players = playersDocument.map((elements) => elements.toObject());
                // logger.info(players);
                // const playerString = players.values.toString();
                // logger.info(playerString);
                // Return just player names
                return this.createCommandResponse('Current players: ' + JSON.stringify(playersDocument));
            }
            default: {
                return this.commandInvalid();
            }
        }
    }

    /**
     * Internal method only, used to generate messages from the command bot.
     * Overrides the visible parameter after construction. Similar to commands,
     * the command responses should not be visible to all either.
     * @param messagecontent Message sent by the command bot
     */
    public createCommandResponse(messagecontent: string): MessageInterface {
        const msg = {player: this.commandBot, message: messagecontent, time: Date.now(), isCommand: true};
        return msg;
    }

    // Chat commands implemented here

    public commandHelp(): MessageInterface {
        return this.createCommandResponse(`Send a command by using a forward slash
        (/) prior to the command. Available options are: ` + this.commands);
    }

    public commandSetname(name: string): MessageInterface {
        return this.createCommandResponse('Name changed to : ' + name);
    }

    public commandReply(): MessageInterface {
        return this.createCommandResponse('Thanks for your message ' + this.recipient +
        '. This is a reply to demonstrate a different chat user AND command usage!');
    }

    /**
     * Create a new gameboard object from the sender and a provided username. The command returns
     * a message with the route to the unique game instance created for the two players.
     * A temporary player is generated for the opponent, there is potential that this will cause heartache
     * in the future, keep an eye out for it.
     * @param opponentName Name of the opponent to initiate a game with
     * @param players List of plays in the chat. Used to determine if the providedOpponent name is valid.
     */
    // public commandNewGame(opponentName: string, players: Array<Player>): MessageInterface {
    //     // Generate a new game sitting at a new route. Players go to the route to play that game instance
    //     let opponentPlayer = new Player(false, false, false, 'newgame-creation-failed', true);
    //     const invalidOpponentName: boolean = false;
    //     players.forEach(function(player: Player) {
    //         if (player.name == opponentName) {
    //             opponentPlayer = player;
    //         }
    //     });
    //     // Rely on the case that if no valid opponent was found, the default name of opponentPlayer wouldn't
    //     // have changed, thus we can check for it as a fail condition and return the oppropriate message.
    //     if (opponentPlayer.name == 'newgame-creation-failed') {
    //         return this.createCommandResponse('No opponent identified with name ' + opponentName);
    //     } else {
    //         opponentPlayer.opponent = true
    //         const game = new GameBoard(this.message.sender, opponentPlayer);
    //         // Stub for hooking the gameboard up to a page.
    //         // game.linkToRoute()
    //         return this.createCommandResponse('Game created with ' + opponentName + '. The game is at: url/' + game.gameID);
    //     }
    // }

    public commandInvalid(): MessageInterface {
        return this.createCommandResponse(`Invalid command. Send a command by using a forward slash
        (/) prior to the command. Available options are: ` + this.commands);
    }


    public commandError(message: string): MessageInterface {
        return this.createCommandResponse('COMMAND ERROR: ' + message);
    }
}
