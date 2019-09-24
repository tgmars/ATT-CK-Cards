import Message from './message';
import Player from './player';
import Command from './commands';

class Chat{
    players:Array<Player>
    messages:Array<Message>

    constructor(){
        this.players = []
        this.messages = []
    }
    
    /**Handles adding all messages to the chat.
     * Passes commands off to the code responsible for executing commands
     * and returns the result of the commands as new messages for the user.
     */
    addMessage(message:Message){
        this.messages.push(message)

        if(message.isCommand()){
            let cmd = new Command(message,this.players)
            if(cmd.isValid()){
                // TODO: Execute that maps the command to a method.
                this.messages.push(cmd.execute())
            }else{
                this.messages.push(cmd.commandInvalid())
            }
        }
    }

    /** Add a player to the chat players list */
    addPlayer(player:Player){
        this.players.push(player)
    }
}


export {Chat as Chat}