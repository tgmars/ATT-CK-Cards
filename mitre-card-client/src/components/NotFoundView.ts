import Vue from 'vue';
import Component from 'vue-class-component';
import ChatView from './ChatView';
import GameView from './GameView';
import Navbar from './Navbar';
import {Chat} from '../model/chat';
import { state } from '@/main';

const NotFoundViewProp = Vue.extend({
    props : {chat: Object as () => Chat},
});

@Component({
    template:
    `
    <div>
    <navbar></navbar>
    <h2>Route does not exist. If you were looking for a game, did you copy it correctly?</h2>
    </div>
    `,
    components : {ChatView, Navbar},
})

export default class NotFoundView extends NotFoundViewProp {

    chatShown = state.chatShown;

    constructor() {
        super();
    }

        // fetch player by name and return an _id
        // create a local player object/player reference defined by that id
        // do message creation and everything referencing the player id.
}

