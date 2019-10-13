import Vue from 'vue';
import Component from 'vue-class-component';
import ChatView from './ChatView';
import GameView from './GameView';
import Navbar from './Navbar';
import {Chat} from '../model/chat';
import {GameBoard} from '../model/gameBoard';
import PlayersApi from '@/services/PlayersApi';
import Player from '@/model/player';
import { State } from '@/model/state';
import { state } from '@/main';
import { Watch, Prop } from 'vue-property-decorator';



@Component({
    template:
    `
    <div>
    <navbar></navbar>
    <b-container fluid style='padding-right:0px;padding-left:0px;'>
        <b-row no-gutters>
            <b-col cols='3' class='chat'>
                <chat-view style='height: calc(100vh - 56px)'></chat-view>
            </b-col>
            <b-col cols='9' class='game' style='padding-left:10px'>
                <game-view v-if='gameShown' :key='gameID' style='height: calc(100vh - 56px)'></game-view>
            </b-col>
        </b-row>
    </b-container>
    </div>
    `,
    components : {ChatView, GameView, Navbar},
})

export default class MainView extends Vue {

    @Prop()
    public chatShown = state.chatShown;
    public gameID!: string;

    public gameShown: boolean = false;


    constructor() {
        super();
        this.gameID = window.location.href;
        if(this.gameID.split('/',4)[3]=='games'){
            this.gameShown = true;
        }
    }

    /**
     * Create a new random  player in the database and save them in the global state variable.
     */

    mounted(){
        this.addPlayer()
    }


    @Watch('$route', { immediate: true, deep: true })
    onUrlChange(newVal: any) {
        console.log(newVal);
        if(newVal.path.split('/')[1]=='games'){
            this.gameShown = true;
        }
        console.log('gameshow' + this.gameShown)
    }

    update(){
        this.gameID = window.location.href;
        if(this.gameID.split('/',4)[3]=='games'){
            this.gameShown = true;
        }
    }

    public async addPlayer() {

        if (!document.cookie) {
            const id = Math.floor(Math.random() * 1_000_000_000_000);
            const playerName = 'Player' + id;
            await PlayersApi.addPlayer(playerName, false);

            PlayersApi.fetchPlayerByName(playerName).then((response) => {
                console.log(response.data.players[0]);
                state.player = response.data.players[0];
                // This makes it super easy to impersonate someone else. Don't really care though
                // It's not good practice at all, I'm sorry
                console.log(state.player._id)
                document.cookie = 'player=' + state.player._id+';path=/';
            });
        } else {
            console.log('cookiecontents: ' + document.cookie)
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



        // fetch player by name and return an _id
        // create a local player object/player reference defined by that id
        // do message creation and everything referencing the player id.
    }
}
