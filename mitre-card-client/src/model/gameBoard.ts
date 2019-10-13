import Player from './player';
import { Card, AttackCard, DefenceCard } from './card';
import { state } from '@/main';

class GameBoard {

    public gameID?: string;
    public player: Player;
    public opponent: Player;

    /** True for player turn, false for opponents turn */
    public currentTurn: boolean;

    public valid: boolean;
    public gameStateMessage: string;
    public playSpace: Array<any>;


    /** GameBoard with a randomly generated ID, the current player, their opponent.
     * Maintains the state of the game and the relevant components (players, gameboard, etc)
     * State of the game includes whether the game is still valid; ie has a player won?
     */
    constructor(player: Player, opponent: Player) {
        this.gameID = player.name.substring(0, 4) + opponent.name.substring(0, 4) + Math.floor(Math.random() * 100);
        this.player = player;
        this.opponent = opponent;
        this.playSpace = [];

        // Establish who goes first in this game.
        this.currentTurn = false;
        if (player.isDefender()) {
            this.currentTurn = true;
        }

        this.valid = true;
        this.gameStateMessage = 'Gamestate: Playing';
        console.log('Currentturn: ' + this.currentTurn);
    }

    public setSocketBoard(gameboard: GameBoard){
        this.gameID = gameboard.gameID;
        this.gameStateMessage = gameboard.gameStateMessage;
        this.currentTurn = gameboard.currentTurn;


        if (gameboard.playSpace) {
            gameboard.playSpace.forEach(( card: any ) => {
                if(card.tactic != undefined){
                    console.log('converting recvd gamedata card to an attackcard')
                    const ac = new AttackCard(card.tactic, card.technique, card.description, card.mitigatingSources);
                    this.playSpace.push(ac)
                } else if (card.dataSource != undefined) {
                    console.log('converting recvd gamedata card to an defencecard')
                    const dc = new DefenceCard(card.dataSource)
                    this.playSpace.push(dc)
                }
            })
            this.playSpace = gameboard.playSpace;
            
        } else {
        this.playSpace = [];
        }

        console.log('may need to increase fidelity in assigning player info.')

        if (gameboard.player._id == state.player._id) {
            console.log('player matches state')
            if (gameboard.player.role && state.player.role){
                console.log('set current board player as player in gameboard')
                // setplayer is robust enough for the incoming data to work.
                this.player.setPlayer(gameboard.player);
                this.opponent.setPlayer(gameboard.opponent);
            }
        } else if (gameboard.opponent._id == state.player._id) { // the other id will be the other player
            console.log('opponent matched state')
            if ( gameboard.opponent.role && state.player.role){
                console.log('set current player as gameboard opp and vice versa.')
                this.player.setPlayer(gameboard.opponent);
                this.opponent.setPlayer(gameboard.player);
            }
        }
    }

    public setBoard(gameData: any) {
        console.log('updating board details with received gameData...');
        console.log('gamedata id: ' + gameData._id);

        this.gameID = gameData._id;
        this.gameStateMessage = gameData.gameState;
        this.currentTurn = gameData.turn;
        console.log('state.player.id: ' + state.player._id);
        console.log('attacker.id: ' + gameData.attacker);
        console.log('defender.id: ' + gameData.defender);
        if (gameData.attacker == state.player._id) {
            this.player._id = gameData.attacker;
            this.opponent._id = gameData.defender;
        } else if (gameData.defender == state.player._id) {
            this.player._id = gameData.defender;
            this.opponent._id = gameData.attacker;
        }
        if (gameData.playSpace) {
            gameData.playSpace.forEach(( card: any ) => {
                if(card.tactic != undefined){
                    console.log('converting recvd gamedata card to an attackcard')
                    const ac = new AttackCard(card.tactic, card.technique, card.description, card.mitigatingSources);
                    this.playSpace.push(ac)
                } else if (card.dataSource != undefined) {
                    console.log('converting recvd gamedata card to an defencecard')
                    const dc = new DefenceCard(card.dataSource)
                    this.playSpace.push(dc)
                }
            })
            this.playSpace = gameData.playSpace;
            
        } else {
        this.playSpace = [];
        }
    }

    public getPlayer(): Player { return this.player; }

    public getOpponent(): Player { return this.opponent; }

    public setPlayer(player: Player) { this.player = player; }

    public setOpponent(opponent: Player) { this.opponent = opponent; }

    public isPlayerTurn() { return (this.currentTurn ? true : false); }

    public isOpponentTurn() { return (!this.currentTurn ? true : false); }

    public isValid() { return(this.valid ? true : false); }


    /**
     * Return true if it is the attackers turn for this game.
     */
    public isAttackerTurn() {
        return (this.currentTurn ? true : false);
        // return (((this.isPlayerTurn() && this.getPlayer().isAttacker())||(this.isOpponentTurn() && this.getOpponent().isAttacker()))?true:false)
    }

    /**
     * Return true if it is the defenders for for this game.
     */
    public isDefenderTurn() {
        return (this.currentTurn ? false : true);
        // return (((this.isPlayerTurn() && this.getPlayer().isDefender())||(this.isOpponentTurn() && this.getOpponent().isDefender()))?true:false)
    }

    /**
     * Insert the specific card into the end of the gameboard's playspace.
     * @param card Card to be moved to the playspace (typically from a players hand)
     */
    public moveToPlaySpace(card: Card) {
        this.playSpace.splice(this.playSpace.length, 0, card);
    }

    /**
     * Return the attack cards in the gameboard's playspace
     */
    public getAttackCards() {
        const ac: any = [];
        this.playSpace.forEach((element) => {
               if ( element instanceof AttackCard) {
                    ac.splice(ac.length, 0, element);
               }
        });
        return ac;
    }

    /**
     * Return the defence cards in the gameboard's playspace
     */
    public getDefenceCards() {
        const dc: any = [];
        this.playSpace.forEach((element) => {
               if ( element instanceof DefenceCard) {
                    dc.splice(dc.length, 0, element);
               }
        });
        return dc;
    }

    /**
     * Remove a card from the playspace by specifing an index.
     * @param i Index of the card in the playspace to remove.
     */
    public removeCard(i: number) {
        this.playSpace.splice(i, 1);
    }

    /**
     * Remove a card from the playspace by specifying a the card.
     * @param card Specific card to remove from the playspace
     */
    public removeCardByCard(card: Card) {
        this.playSpace.forEach((c, i) => {
            if (card == c) {
                this.playSpace.splice(i, 1);
            }
        });
    }

    /**
     * Logic to affect the gameboard given the attacker plays an attack card.
     * @param i Card index in the attackers hand to play.
     */
    public attackerPlay(i: number) {
        if (this.isAttackerTurn()) {
            const attacker = (this.player.isAttacker() ? this.player : this.opponent);
            const playercard = attacker.hand[i] as AttackCard;
            playercard.faceup = true;

            attacker.removeCard(i);
            this.moveToPlaySpace(playercard);

            /** Indicates whether a corresponding data source was found for the card being played.
             *  This value is used further on in this routine to determine whether or not to subtract
             * resources from the attacker.
             */
            let attackCardRemoved = false;
            const dc: Array<DefenceCard> = this.getDefenceCards();
            dc.forEach((defencecard) => {
                if (playercard.mitigatingSources.includes(defencecard.dataSource)) {
                    console.log('removing card, should not modify progress');
                    this.removeCardByCard(playercard);
                    // Remove the player card, but only take one hit to resources
                    attackCardRemoved = true;                    
                    // . move the deleted card to the discard pile
                } else {
                    // Bug here, progress will advance anyway.
                    attacker.setProgress(playercard.tactic);
                }
            });

            /** Remove resources from the attacker. */
            if (attackCardRemoved) {
                attacker.resources = attacker.resources - 10;
            }


            if (dc.length == 0) {
                console.log('I think length of defence cards is 0');
                attacker.setProgress(playercard.tactic);
                // move the deleted card to the discard pile
            }

            // Check for a win/loss condition
            if (attacker.resources <= 0) {
                this.gameStateMessage = 'Gamestate: Defender won! The attacker has run out of resources (go blueteams).';
                this.valid = false;
                this.playSpace = []
            } else if (attacker.progress.impact) {
                this.gameStateMessage = 'Gamestate: Attacker won! The attacker has progressed through all avaiable tactics.';
                this.valid = false;
                this.playSpace = []
            } else {
                attacker.draw(1);
                // Flip the turn back to the defender
                this.currentTurn = !this.currentTurn;
                console.log(playercard);
            }
        }
    }

    /**
     * Logic to affect the gameboard given the defender plays a defence card.
     * @param i Card index in the defenders hand to play.
     */
    public defenderPlay(i: number) {
        if (this.isDefenderTurn()) {
            const defender = (this.player.isDefender() ? this.player : this.opponent);
            const attacker = (this.player.isAttacker() ? this.player : this.opponent);

            const playercard = defender.hand[i];
            defender.removeCard(i);
            playercard.faceup = true;
            this.moveToPlaySpace(playercard);

            // Check for a win/loss condition
            if (attacker.resources <= 0) {
                this.gameStateMessage = 'Gamestate: Defender won! The attacker has run out of resources (go blueteams).';
                this.valid = false;
            } else if (attacker.progress.impact) {
                this.gameStateMessage = 'Gamestate: Attacker won! The attacker has progressed through all avaiable tactics.';
                this.valid = false;
            } else {
                defender.draw(1);
                // Flip the turn back to the attacker.
                this.currentTurn = !this.currentTurn;
                console.log(playercard);
            }
        }
    }

    /**
     * Auto play the game for demonstration purposes!?
     */
    public playGame() {
            if (this.isOpponentTurn()) {
                if (this.getOpponent().isAttacker()) {
                    const rand = Math.floor(Math.random() * 4);
                    this.attackerPlay(rand);
                    this.currentTurn = true;
                }
                if (this.getOpponent().isDefender()) {
                    const rand = Math.floor(Math.random() * 4);
                    this.defenderPlay(rand);
                    this.currentTurn = true;
                }
            }

    }
}

export {GameBoard as GameBoard};