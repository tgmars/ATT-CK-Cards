import Player from './player';
import { Card, AttackCard, DefenceCard } from './card';
import { state } from '@/main';

class GameBoard {
    
    gameID?:string
    player:Player
    opponent:Player

    /** True for player turn, false for opponents turn */
    currentTurn:boolean

    valid:boolean
    gameStateMessage:string
    playSpace:Array<Card>

    
    /** GameBoard with a randomly generated ID, the current player, their opponent.
     * Maintains the state of the game and the relevant components (players, gameboard, etc)
     * State of the game includes whether the game is still valid; ie has a player won?
     */
    constructor(player:Player, opponent:Player){
        this.gameID = player.name.substring(0,4)+opponent.name.substring(0,4)+Math.floor(Math.random()*100)
        this.player=player
        this.opponent=opponent
        this.playSpace = []

        //Establish who goes first in this game.
        this.currentTurn = false
        if(player.isDefender()){
            this.currentTurn = true
        }

        this.valid=true
        this.gameStateMessage='Gamestate: Playing'
        console.log('Currentturn: '+this.currentTurn)
    }

    setBoard(gameData:any){
        console.log('updating board details with received gameData...')
        console.log('gamedata id: ' + gameData._id)
        this.gameID = gameData._id;
        this.gameStateMessage = gameData.gameState;
        this.currentTurn = gameData.turn;
        if(gameData.attacker == state.player._id) {
            this.player = gameData.attacker;
            this.opponent = gameData.defender;
        } else if (gameData.defender == state.player._id) {
            this.player = gameData.defender;
            this.opponent = gameData.attacker;
        }
        this.playSpace = [];
        
    }

    getPlayer():Player{ return this.player }

    getOpponent():Player{ return this.opponent }

    setPlayer(player:Player){ this.player = player }

    setOpponent(opponent:Player){ this.opponent = opponent }

    isPlayerTurn(){ return (this.currentTurn?true:false) }

    isOpponentTurn(){ return (!this.currentTurn?true:false) }

    isValid(){ return(this.valid?true:false) }


    /**
     * Return true if it is the attackers turn for this game.
     */
    isAttackerTurn(){
        return (((this.isPlayerTurn() && this.getPlayer().isAttacker())||(this.isOpponentTurn() && this.getOpponent().isAttacker()))?true:false)
    }

    /**
     * Return true if it is the defenders for for this game.
     */
    isDefenderTurn(){
        return (((this.isPlayerTurn() && this.getPlayer().isDefender())||(this.isOpponentTurn() && this.getOpponent().isDefender()))?true:false)
    }

    /**
     * Insert the specific card into the end of the gameboard's playspace.
     * @param card Card to be moved to the playspace (typically from a players hand)
     */
    moveToPlaySpace(card:Card){
        this.playSpace.splice(this.playSpace.length,0,card)
    }

    /**
     * Return the attack cards in the gameboard's playspace
     */
    getAttackCards(){
        let ac:any = []
        this.playSpace.forEach(element => {
               if( element instanceof AttackCard){
                    ac.splice(ac.length,0,element)
               }         
        });
        return ac
    }

    /**
     * Return the defence cards in the gameboard's playspace
     */
    getDefenceCards(){
        let dc:any = []
        this.playSpace.forEach(element => {
               if( element instanceof DefenceCard){
                    dc.splice(dc.length,0,element)
               }         
        });
        return dc
    }

    /**
     * Remove a card from the playspace by specifing an index.
     * @param i Index of the card in the playspace to remove.
     */
    removeCard(i:number){
        this.playSpace.splice(i,1)
    }

    /**
     * Remove a card from the playspace by specifying a the card.
     * @param card Specific card to remove from the playspace
     */
    removeCardByCard(card:Card){
        this.playSpace.forEach((c,i) => {
            if(card==c){
                this.playSpace.splice(i,1)
            }
        })
    }

    /**
     * Logic to affect the gameboard given the attacker plays an attack card.
     * @param i Card index in the attackers hand to play.
     */
    attackerPlay(i:number){
        if(this.isAttackerTurn()){
            let attacker = (this.player.isAttacker()?this.player:this.opponent)
            let playercard = attacker.hand[i] as AttackCard
            playercard.faceup=true

            attacker.removeCard(i)
            this.moveToPlaySpace(playercard)

            /** Indicates whether a corresponding data source was found for the card being played.
             *  This value is used further on in this routine to determine whether or not to subtract
             * resources from the attacker.
             */
            let attackCardRemoved=false
            let dc:Array<DefenceCard> = this.getDefenceCards()
            dc.forEach(defencecard => {
                if(playercard.mitigatingSources.includes(defencecard.dataSource)){
                    console.log('removing card, should not modify progress')
                    this.removeCardByCard(playercard)
                    //Remove the player card, but only take one hit to resources
                    attackCardRemoved=true                    
                    //. move the deleted card to the discard pile
                }else{
                    // Bug here, progress will advance anyway.
                    attacker.setProgress(playercard.tactic)
                }
            });

            /** Remove resources from the attacker. */
            if(attackCardRemoved){
                attacker.resources=attacker.resources-10
            }
            

            if(dc.length==0){
                console.log('I think length of defence cards is 0')
                attacker.setProgress(playercard.tactic)
                // move the deleted card to the discard pile
            }

            //Check for a win/loss condition
            if(attacker.resources<=0){
                this.gameStateMessage = 'Gamestate: Defender won! The attacker has run out of resources (go blueteams).'
                this.valid=false
            }else if(attacker.progress.impact){
                this.gameStateMessage = 'Gamestate: Attacker won! The attacker has progressed through all avaiable tactics.'
                this.valid=false
            }else{            
                attacker.draw(1)
                //Flip the turn back to the defender
                this.currentTurn = !this.currentTurn
                console.log(playercard)
            }
        }
    }

    /**
     * Logic to affect the gameboard given the defender plays a defence card.
     * @param i Card index in the defenders hand to play.
     */
    defenderPlay(i:number){
        if(this.isDefenderTurn()){
            let defender = (this.player.isDefender()?this.player:this.opponent)
            let attacker = (this.player.isAttacker()?this.player:this.opponent)

            let playercard = defender.hand[i]
            defender.removeCard(i)
            playercard.faceup=true
            this.moveToPlaySpace(playercard)

            //Check for a win/loss condition
            if(attacker.resources<=0){
                this.gameStateMessage = 'Gamestate: Defender won! The attacker has run out of resources (go blueteams).'
                this.valid=false
            }else if(attacker.progress.impact){
                this.gameStateMessage = 'Gamestate: Attacker won! The attacker has progressed through all avaiable tactics.'
                this.valid=false
            }else{  
                defender.draw(1)
                //Flip the turn back to the attacker.
                this.currentTurn = !this.currentTurn
                console.log(playercard)
            }
        }
    }

    /**
     * Auto play the game for demonstration purposes!?
     */
    playGame(){
            if(this.isOpponentTurn()){
                if(this.getOpponent().isAttacker()){
                    let rand = Math.floor(Math.random()*4)
                    this.attackerPlay(rand)
                    this.currentTurn=true
                }
                if(this.getOpponent().isDefender()){
                    let rand = Math.floor(Math.random()*4)
                    this.defenderPlay(rand)
                    this.currentTurn=true
                }
            }
        
    }
}

export {GameBoard as GameBoard}