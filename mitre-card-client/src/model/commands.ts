import Message from './message';
import Player from './player';
import { GameBoard } from './gameBoard';
import { Chat } from './chat';


export default class Command{
    message:Message
    recipient:Player
    command:string
    commandArgs:string
    commands:Array<string> = ['/help','/setname','/newgame','/listplayers','/reply']
    players:Array<Player>

    //Initialise a new commandbot player as the sender of the message.
    commandBot:Player = new Player(false,true,false,'Command Bot',false)
    
    constructor(message:Message,players:Array<Player>){
        this.message = message
        this.recipient = message.sender
        this.command = message.message.split(' ')[0]
        this.commandArgs = message.message.split(' ')[1]
        this.players = players
    }

    /**
     * Check if a command is valid by confirming its existence in the commands array.
     */
    isValid():boolean{
        return(this.commands.indexOf(this.command)===-1 ? false : true)
    }

    /**
     * Maps user /command to a function
     * I'm certain that there's a nicer & less verbose way to do this, would love to hear how!
     */
    execute():Message{
        switch(this.command){
            case '/help':{
                return this.commandHelp()
            }
            case '/setname':{
                return this.commandSetname(this.commandArgs)
            }
            case '/reply':{
                return this.commandReply()
            }
            case '/newgame':{
                return this.commandNewGame(this.commandArgs,this.players)
            }
            case '/listplayers':{
                return this.commandListPlayers(this.players)
            }
            default:{
                return this.commandInvalid()
            }
        }
    }

    /**
     * Internal method only, used to generate messages from the command bot.
     * Overrides the visible parameter after construction. Similar to commands,
     * the command responses should not be visible to all either.
     * @param messagecontent Message sent by the command bot
     */
    createCommandResponse(messagecontent:string):Message{
        let msg = new Message(this.commandBot,messagecontent)
        msg.setIsVisibileToAll(false)
        return msg
    }

    // Chat commands implemented here

    commandHelp():Message{
        return this.createCommandResponse(`Send a command by using a forward slash
        (/) prior to the command. Available options are: `+this.commands)
    }

    commandSetname(name:string):Message{
        this.message.sender.setName(name)
        return this.createCommandResponse('Name changed to : '+name)
    }

    commandReply():Message{
        return this.createCommandResponse('Thanks for your message '+this.recipient.name+
        '. This is a reply to demonstrate a different chat user AND command usage!')
    }

    /**
     * Create a new gameboard object from the sender and a provided username. The command returns
     * a message with the route to the unique game instance created for the two players.
     * A temporary player is generated for the opponent, there is potential that this will cause heartache
     * in the future, keep an eye out for it.
     * @param opponentName Name of the opponent to initiate a game with
     * @param players List of plays in the chat. Used to determine if the providedOpponent name is valid.
     */
    commandNewGame(opponentName:string,players:Array<Player>):Message{
        //Generate a new game sitting at a new route. Players go to the route to play that game instance
        let opponentPlayer = new Player(false,false,false,'newgame-creation-failed',true)
        let invalidOpponentName:boolean = false
        players.forEach(function(player:Player){
            if(player.name==opponentName){
                opponentPlayer = player
            }
        })
        //Rely on the case that if no valid opponent was found, the default name of opponentPlayer wouldn't
        // have changed, thus we can check for it as a fail condition and return the oppropriate message.
        if(opponentPlayer.name=='newgame-creation-failed'){
            return this.createCommandResponse('No opponent identified with name '+opponentName)
        }else{
            opponentPlayer.opponent=true        
            let game = new GameBoard(this.message.sender,opponentPlayer)
            // Stub for hooking the gameboard up to a page.
            // game.linkToRoute()
            return this.createCommandResponse('Game created with '+opponentName+'. The game is at: url/'+game.gameID)
        }
    }

    commandListPlayers(players:Array<Player>):Message{
        let names = ''
        players.forEach(function(player:Player){
            names=names+player.name + ' '
        })
        return this.createCommandResponse('Current players: '+names)
    }

    commandInvalid():Message{
        return this.createCommandResponse(`Invalid command. Send a command by using a forward slash
        (/) prior to the command. Available options are: `+this.commands)

    }

    
}