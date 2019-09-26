import Player from './player';

export default class Message{
    
    /** Time in epoch that message was sent by the client. */
    time:number

    /** Name of the player/entity that sent the message. */
    sender:Player

    /** Message data.*/
    message:string

    /** Flags whether this message should be visible to all (true) or just the sender(false). */
    isVisibleToAll:boolean

    /** Flags if this message was sent by the current player, used to determine how the message is displayed */
    // isSentByPlayer:boolean

    
    constructor(sender:Player,message:string){
        this.sender=sender
        this.message=message
        this.time=Date.now()
        this.isCommand()
        this.isVisibleToAll = (this.isCommand() ? false : true)
        // this.isSentByPlayer = (this.sender==currentPlayer ? true : false)
    } 

    /**
     * Return true if the message is a comment by checking if it starts with a forward slash '/'
     */
    isCommand():boolean{
        return(this.message.charAt(0)=='/' ? true : false)
    }    

    setIsVisibileToAll(isVisibleToAll:boolean):void{
        this.isVisibleToAll = isVisibleToAll
    }

    getPlayerByMessage():Player{
        return this.sender
    }
    display():void{
        console.log(this.time +': '+this.sender.name+': '+this.message+' : isCommand:'+this.isCommand()+' : isVisibleToAll:'+this.isVisibleToAll)
    }

    toObject():Object{
        return {'time':this.time,'player':this.sender,'message':this.message,'isCommand':this.isCommand()};
    }
}

