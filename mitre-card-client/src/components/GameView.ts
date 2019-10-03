// Gameview
//     Player progress
//     Hand
//     Gameboard
//     opposition hand
//     Opposition progress


import Vue from 'vue';
import Component from 'vue-class-component';

import {GameBoard} from '../model/gameBoard';
import AttackCardView from './AttackCardView';
import DefenceCardView from './DefenceCardView';
import AttackerProgressView from './AttackerProgressView';
import GameStatusView from './GameStatusView';
import { AttackCard, DefenceCard } from '../model/card';
import Player from '../model/player';
import { Socket } from 'vue-socket.io-extended';
import GamesApi from '@/services/GamesApi';
import { state } from '@/main';
import PlayersApi from '@/services/PlayersApi';

// @Component must preceed the class. We can pass some basic construction to our component here if needed.
@Component({
    // drop a modal over the view on gameboard.valid == false
    template:
    `
    <div>
    {{$route.params.gameID}}
        <game-status-view :gameboard='gameboard'></game-status-view>
        <div v-if='!gameboard.valid'>
            <b-container style='margin:3px'>
            <b-row v-if='gameboard.opponent.role'>
                <div style='width:100%;padding:10px'>
                    <attacker-progress-view :attacker='gameboard.opponent'></attacker-progress-view>
                    <b-card-group deck>
                        <attack-card-view  v-for='(attackCard,index) in gameboard.opponent.hand' :attackCard='attackCard' :key='attackCard.technique + index'></attack-card-view>
                    </b-card-group>
                </div>
            </b-row>

            <b-row v-if='!gameboard.opponent.role'>
                <div style='width:100%;padding:5px'>
                    <div style='width:100%;font-size:12px;'>Attacker resources: {{gameboard.opponent.resources}}</div>
                    <b-card-group deck>
                        <defence-card-view  v-for='(defenceCard,index) in gameboard.opponent.hand' :key='defenceCard.dataSource + index' :defenceCard='defenceCard' ></defence-card-view>
                    </b-card-group>
                </div>
            </b-row>

            <b-row id='playspace'>
                <div style='height:450px;width:100%;' >
                    <b-card-group deck style='margin:0px'>
                        <attack-card-view  v-for='(attackCard,index) in playSpaceAttackCards' :attackCard='attackCard' :key='attackCard.technique + index'></attack-card-view>
                    </b-card-group>
                    <div style='width:100%;height:4px;background-color:black'></div>
                    <b-card-group deck style='margin:0px'>
                        <defence-card-view  v-for='(defenceCard,index) in playSpaceDefenceCards' :defenceCard='defenceCard' :key='defenceCard.dataSource + index'></defence-card-view>
                    </b-card-group>
                </div>
            </b-row>

            <b-row v-if='!gameboard.player.role'>
                <div style='width:100%;padding:5px'>
                    <div style='width:100%;font-size:12px;'>Attacker resources: {{gameboard.opponent.resources}}</div>
                    <b-card-group deck>
                        <defence-card-view  v-for='(defenceCard,index) in gameboard.player.hand' :defenceCard='defenceCard' :key='defenceCard.dataSource + index'></defence-card-view>
                    </b-card-group>
                </div>
            </b-row>

            <b-row v-if='gameboard.player.role'>
                <div style='width:100%;padding:5px'>
                    <attacker-progress-view :attacker='gameboard.player'></attacker-progress-view>
                    <b-card-group deck>
                        <attack-card-view  v-for='(attackCard,index) in gameboard.player.hand' :attackCard='attackCard'  :key='attackCard.technique + index'></attack-card-view>
                    </b-card-group>
                </div>
            </b-row>
            </b-container>
        </div>


        <div v-else-if='gameboard.valid'>
            <b-container style='margin:3px'>
            <b-row v-if='gameboard.opponent.role'>
                <div style='width:100%;padding:10px'>
                    <attacker-progress-view :attacker='gameboard.opponent'></attacker-progress-view>
                    <b-card-group deck>
                        <attack-card-view  v-for='(attackCard,index) in gameboard.opponent.hand' :attackCard='attackCard' :key='attackCard.technique + index' @card-click='attackerPlay(index)'></attack-card-view>
                    </b-card-group>
                </div>
            </b-row>

            <b-row v-if='!gameboard.opponent.role'>
                <div style='width:100%;padding:5px'>
                    <div style='width:100%;font-size:12px;'>Attacker resources: {{gameboard.opponent.resources}}</div>
                    <b-card-group deck>
                        <defence-card-view  v-for='(defenceCard,index) in gameboard.opponent.hand' :key='defenceCard.dataSource + index' :defenceCard='defenceCard' @card-click='defenderPlay(index)'></defence-card-view>
                    </b-card-group>
                </div>
            </b-row>

            <b-row id='playspace'>
                <div style='height:450px;width:100%;' >
                    <b-card-group deck style='margin:0px'>
                        <attack-card-view  v-for='(attackCard,index) in playSpaceAttackCards' :attackCard='attackCard' :key='attackCard.technique + index'></attack-card-view>
                    </b-card-group>
                    <div style='width:100%;height:4px;background-color:black'></div>
                    <b-card-group deck style='margin:0px'>
                        <defence-card-view  v-for='(defenceCard,index) in playSpaceDefenceCards' :defenceCard='defenceCard' :key='defenceCard.dataSource + index'></defence-card-view>
                    </b-card-group>
                </div>
            </b-row>

            <b-row v-if='!gameboard.player.role'>
                <div style='width:100%;padding:5px'>
                    <div style='width:100%;font-size:12px;'>Attacker resources: {{gameboard.opponent.resources}}</div>
                    <b-card-group deck>
                        <defence-card-view  v-for='(defenceCard,index) in gameboard.player.hand' :defenceCard='defenceCard' :key='defenceCard.dataSource + index' @card-click='defenderPlay(index)'></defence-card-view>
                    </b-card-group>
                </div>
            </b-row>

            <b-row v-if='gameboard.player.role'>
                <div style='width:100%;padding:5px'>
                    <attacker-progress-view :attacker='gameboard.player'></attacker-progress-view>
                    <b-card-group deck>
                        <attack-card-view  v-for='(attackCard,index) in gameboard.player.hand' :attackCard='attackCard'  :key='attackCard.technique + index' @card-click='attackerPlay(index)'></attack-card-view>
                    </b-card-group>
                </div>
            </b-row>
            </b-container>
        </div>
    </div>

    `,
    components: {
        AttackCardView,
        DefenceCardView,
        AttackerProgressView,
        GameStatusView,
    },
})
export default class GameView extends Vue {

    public player!: Player;
    public opponent!: Player;

    public gameboard!: GameBoard;

    public input: string = '';
    public attackVisible: boolean = true;
    public defenceVisible: boolean = true;

    public gameID!: string;

    constructor() {
        super();
        console.log('GameView was placed');
        
        if (document.cookie){
            const cookieID = document.cookie.split(';')[0].split('=')[1];
            console.log('cookieid: ' + cookieID)
            PlayersApi.fetchPlayerByID(cookieID).then((response) => {
                state.player = response.data.players;
                console.log('response data players')
                console.log(response.data.players)
                console.log('state')
                console.log(state);
            });
        }

        this.player = new Player(false,false,'player-player',false);
        this.opponent = new Player(false,false,'player-opponent',false);
        this.gameboard = new GameBoard(this.player,this.opponent);
    }

    mounted(){
        this.gameID = this.$route.params.gameID;
        console.log('gameview mount this.gameID: ' + this.gameID)
        //  Make a GET to the API and request the game for our given id.
        GamesApi.fetchGamesByID(this.gameID).then((response) => {
            this.gameboard.setBoard(response);
            // console.log('attacker response' + response.data.gameData.attacker)
            // console.log('state player: ' + state.player._id)

            // console.log('defender response' + response.data.gameData.defender)
            // console.log('state player: ' + state.player._id)

            // gameboard = new GameBoard()
        });

    }

 

    get playSpaceAttackCards() {
        const ac: any = [];
        this.gameboard.playSpace.forEach((element) => {
            if (element instanceof AttackCard) {
                ac.splice(ac.length, 0, element);
            }
        });
        return ac;
    }

    get playSpaceDefenceCards() {
        const dc: any = [];
        this.gameboard.playSpace.forEach((element) => {
            if (element instanceof DefenceCard) {
                dc.splice(dc.length, 0, element);
            }
        });
        return dc;
    }

    /** Take an index to a card in the attackers hand, and play the game. */
    public attackerPlay(i: number) {
        this.gameboard.attackerPlay(i);
    }

    /** Take an index to a card in the defenders hand, and play the game. */
    public defenderPlay(i: number) {
        this.gameboard.defenderPlay(i);
    }

    // async send(){
    //     console.log('got textarea: ' + this.input);
    //     const msg = new Message(state.player,this.input).toObject();
    //     // MessagesApi.addMessage(msg)
    //     let response = await this.$socket.client.emit('chat',msg);
    //     this.input=''
    // }

    @Socket() // --> listens to the event connect
    public connect() {
      console.log('socket connection established inside gameview');
    }

    // @Socket('chat')  // --> listens to the event labelled chat
    // public onChat(msg: MessageInterface) {
    //   this.messages.splice(this.messages.length, 0, msg);
    // }



}
