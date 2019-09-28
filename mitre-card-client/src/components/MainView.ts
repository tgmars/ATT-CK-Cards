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

const MainViewProp = Vue.extend({
    props : {chat: Object as () => Chat,
        gameboard: Object as () => GameBoard},
});

@Component({
    template:
    `
    <div>
    <navbar @show-hide-clicked='toggleChatShown()'></navbar>
    <b-container fluid style='padding-right:0px;padding-left:0px;'>
        <b-row no-gutters>
            <b-col cols='3' v-if='chatShown' class='chat'>
                <chat-view :chat='chat' style='height: calc(100vh - 56px)'></chat-view>
            </b-col>
            <b-col cols='9' class='game' style='padding-left:10px'>
                <game-view :gameboard='gameboard' style='height: calc(100vh - 56px)'></game-view>
            </b-col>
        </b-row>
    </b-container>
    </div>
    `,
    components : {ChatView, GameView, Navbar},
})

export default class MainView extends MainViewProp {

    private chatShown: boolean;

    constructor() {
        super();
        this.chatShown = true;
        this.addPlayer();
    }

    public toggleChatShown() {
        return this.chatShown = !this.chatShown;
    }

    /**
     * Create a new random  player in the database and save them in the global state variable.
     */
    public addPlayer() {
        const id = Math.floor(Math.random() * 1_000_000_000_000);
        // console.log(PlayersApi.fetchPlayers());
        const playerName = 'Player' + id;
        PlayersApi.addPlayer(playerName, false);

        PlayersApi.fetchPlayerByName(playerName).then((response) => {
            console.log(response.data.players[0])
            state.player = response.data.players[0];
        });

        // fetch player by name and return an _id
        // create a local player object/player reference defined by that id
        // do message creation and everything referencing the player id.
    }
}
