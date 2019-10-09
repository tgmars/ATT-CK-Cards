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
        <span><game-status-view :gameboard='gameboard'></game-status-view> -- {{player.name}} {{gameboard.player.name}} {{gameboard.playSpace}}</span>
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
                        <attack-card-view  v-for='(attackCard,index) in gameboard.opponent.hand' :attackCard='attackCard' :key='attackCard.technique + index'></attack-card-view>
                    </b-card-group>
                </div>
            </b-row>

            <b-row v-if='!gameboard.opponent.role'>
                <div style='width:100%;padding:5px'>
                    <div style='width:100%;font-size:12px;'>Attacker resources: {{gameboard.opponent.resources}}</div>
                    <b-card-group deck>
                        <defence-card-view  v-for='(defenceCard,index) in gameboard.opponent.hand' :key='defenceCard.dataSource + index' :defenceCard='defenceCard'></defence-card-view>
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

    public player: Player;
    public opponent: Player;

    public gameboard: GameBoard;

    public input: string = '';
    public attackVisible: boolean = true;
    public defenceVisible: boolean = true;

    public gameID!: string;

    // On placement of the gameview, check if we have a saved player
    // if we do, request that playerdata from the api.
    constructor() {
        super();
        console.log('GameView was placed');
        this.player = new Player(false,false,'player-player',false);
        this.opponent = new Player(false,false,'player-opponent',false);
        this.gameboard = new GameBoard(this.player,this.opponent);
    }

    mounted(){
        this.reInit();        
    }

    get playSpaceAttackCards() {
        const ac: any = [];
        this.gameboard.playSpace.forEach((element) => {
            if (element.tactic != undefined) {
                ac.splice(ac.length, 0, element);
            }else{
                console.log('We did not return any card because theyre not prooper attack cards.');

            }
        });
        return ac;
    }

    get playSpaceDefenceCards() {
        const dc: any = [];
        this.gameboard.playSpace.forEach((element) => {
            if (element.dataSource != undefined) {
                dc.splice(dc.length, 0, element);
            }else{
                console.log('We did not return any cards because theyre not prooper defence cards.');
            }
        });
        return dc;
    }

    public async attackerPlay(i: number){
        const index = {'attackerindex' : i, 'gameID': this.gameID};
        try{
            await this.$socket.client.emit('gameplay',index);
            console.log('emitted gameplay event over websocket.')

        } catch (err) {
            console.log('attack player error transmitting over websocket.');
        }
    }

    public async defenderPlay(i: number){
        const index = {'defenderindex' : i, 'gameID': this.gameID};
        try{
            await this.$socket.client.emit('gameplay',index);
            console.log('emitted gameplay event over websocket.')
        } catch (err) {
            console.log('attack player error transmitting over websocket.');
        }
    }

    @Socket() // --> listens to the event connect
    public connect() {
      console.log('socket connection established inside gameview');
    }

    @Socket('gameplay')  // --> listens to the event labelled chat
    public onGameplay(gameboard: GameBoard) {
        console.log('received gameboard update over websocket: ' + JSON.stringify(gameboard));
        this.opponent.setPlayer(gameboard.player);
        this.opponent.setHandFaceup(false);
        this.player.setPlayer(gameboard.opponent);
        this.player.setHandFaceup(false);
        this.gameboard.setBoard(gameboard);
        // pass gameboard and players as parameters to onGameplay
        // Set player for opponent and player
        // Set the facuep values of the cards. 
        // Set gameboard
    }

    reInit(){
        // On component mount create a new gameboard with data fetched from the API
        // Fetch player and opponent using the ID specified in the game object we return.
        this.gameID = this.$route.params.gameID;
        console.log('gameview mount this.gameID: ' + this.gameID)
        //  Make a GET to the API and request the game for our given id.

        // Initialisation
        if (document.cookie){
            const cookieID = document.cookie.split(';')[0].split('=')[1];
            console.log('cookieid: ' + cookieID)
            PlayersApi.fetchPlayerByID(cookieID).then((re) => {
                state.player = re.data.players;
                console.log('response data players')
                console.log(re.data.players)
                console.log('state')
                console.log(state);

                GamesApi.fetchGamesByID(this.gameID).then((response) => {
                    this.gameboard.setBoard(response.data.gameData);
        
                    console.log('response gamedata' + JSON.stringify(response.data.gameData));
                    console.log('response gameboard' + JSON.stringify(this.gameboard));
                    console.log('gameboard opponent name: ' + this.gameboard.opponent._id)
                    console.log('gmaeboard player name: ' + this.gameboard.player._id)
        
                    PlayersApi.fetchPlayerByID(this.gameboard.player._id).then((resp) => {
                        const res = resp.data;
                        console.log('got player: ' + JSON.stringify(res))
        
                        this.player.setPlayer(res.players)
                        this.player.setHandFaceup(true);
                        // Map player data from server to a local object.
                        console.log('converted to local player: ' + JSON.stringify(this.player))
        
                    });
                    PlayersApi.fetchPlayerByID(this.gameboard.opponent._id).then((resp) => {
                        const res = resp.data;
                        console.log('got opponent: ' + JSON.stringify(res));
        
                        this.opponent.setPlayer(res.players);
                        this.opponent.setHandFaceup(false);
                        // Map player data from server to a local object.
                        console.log('converted to local opponent ' + JSON.stringify(this.opponent))
                    });
                });
                
            });
        }
    }
}
