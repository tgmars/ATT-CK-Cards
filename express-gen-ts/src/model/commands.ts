import { Message, MessageInterface } from './message';
import IPlayer from './playerInterface';
import Player from './player';
import { GameBoard } from './gameBoard';
import { PlayerModel } from '@entities';
import { GameModel } from '@entities';
import { logger } from '@shared';
import { Document } from 'mongoose';
import { Router } from 'express';
import { state } from '@server';

const router = Router();

export default class Command {
    public recipient: string;
    public command: string;
    public commandArgs: string;
    public commands: string[] = ['/help', '/setname', '/newgame', '/listplayers', '/reply'];

    // Initialise a new commandbot player as the sender of the message.
    public commandBot: IPlayer = {name: 'Command Bot', _id: '', hand: [], isBot: true, resources: 0, role: false};

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
                    return this.commandSetname(this.recipient, this.commandArgs);
                } catch (err) {
                    return this.commandError('Error occured updating your name,  it\'s likely database related.');
                }
            }
            case '/reply': {
                return this.commandReply();
            }
            case '/newgame': {
                try {
                    // Fetch players, modify the players, add entries for the game in the database
                    // Just get the IDs of the current player and the opponent (all that's used for GameModel)
                    const currentPlayer = await PlayerModel.findById(this.recipient, 'name');
                    // find the opponent plaer by querying for their name.
                    const opponentPlayer = await PlayerModel.findOne({name: this.commandArgs}, 'name');

                    if (opponentPlayer && currentPlayer) {
                        const opponent = opponentPlayer.toObject();
                        const current = currentPlayer.toObject();

                        const opponentName = opponent.name;
                        const currentName = current.name;

                        let attacker!: Document | null;
                        let defender!: Document | null;
                        let cpIsAttacker: boolean = false;
                        let opIsAttacker: boolean = false;

                        if (Math.random() > 0.5) {
                            attacker = currentPlayer;
                            defender = opponentPlayer;
                            await currentPlayer.update( {role: true} );
                            await opponentPlayer.update( {role: false} );
                            cpIsAttacker = true;
                            opIsAttacker = false;

                        } else {
                            attacker = opponentPlayer;
                            defender = currentPlayer;
                            await currentPlayer.update( {role: false} );
                            await opponentPlayer.update( {role: true} );
                            cpIsAttacker = false;
                            opIsAttacker = true;
                        }
                        const game = new GameModel(
                            {attacker: attacker._id, defender: defender._id, turn: false, playSpace: [], gameState: 'Defenders turn.'});
                        await game.save();
                        // Get the game id to use as a route and provide it to the user in the response.
                        const currentGame = await GameModel.find({attacker: attacker._id, defender: defender._id},
                             '_id');
                        const currentGameObject = currentGame[0].toObject();
                        const currentGameID = currentGameObject._id;

                        // Update the players with their roles as attackers or defenders.
                        // Good lord this is getting messy

                        const playerObject = new Player(cpIsAttacker, false, 'tempplay', false);
                        const opponentObject = new Player(opIsAttacker, false, 'tempop', true);
                        playerObject.draw(5);
                        opponentObject.draw(5);
                        // Setup hand and the players progress
                        await currentPlayer.update( {hand: playerObject.hand, progress: playerObject.progress});
                        await opponentPlayer.update( {hand: opponentObject.hand, progress: opponentObject.progress});

                        // populate local players for gameboard.
                        playerObject._id = current._id;
                        playerObject.name = current.name;

                        opponentObject._id = opponent._id;
                        opponentObject.name = opponent.name;

                        // populate gameboard using those players and add them to state.
                        let gb: GameBoard = new GameBoard(playerObject, opponentObject);
                        gb.gameID = currentGameID;
                        state.games.push(gb);

                        return this.commandNewGame(currentName, opponentName , currentGameID);
                    } else {
                        return this.commandError('Could not find the specified opponents name, try again.');
                    }

                } catch (err) {
                    return this.commandError('Error occured creating game, it\'s likely database related.');
                }
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

    public commandSetname(oldname: string, name: string): MessageInterface {
        return this.createCommandResponse('Name change: ' + oldname + ' changed name to : ' + name);
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
    public commandNewGame(opponentName: string, playerName: string, gameID: string): MessageInterface {
            // Stub for hooking the gameboard up to a page.
            // game.linkToRoute()
            return this.createCommandResponse('Game created between ' + playerName + ' and ' + opponentName + '. The game is available at /games/' + gameID);
    }

    public commandInvalid(): MessageInterface {
        return this.createCommandResponse(`Invalid command. Send a command by using a forward slash
        (/) prior to the command. Available options are: ` + this.commands);
    }

    public commandError(message: string): MessageInterface {
        return this.createCommandResponse('COMMAND ERROR: ' + message);
    }
}
