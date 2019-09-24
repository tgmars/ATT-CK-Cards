import Vue from 'vue'
import Component from 'vue-class-component'
import {GameBoard} from '../model/gameBoard';

//TODO: Contextual per player and the message types(command vs normal message)

const gameStatusViewProp = Vue.extend({
    props : {gameboard:Object as () => GameBoard}
})

@Component({
    template:
    `
    <div>
        {{gameboard.gameStateMessage}} - GameID: {{gameboard.gameID}} 
        <p v-if='gameboard.isAttackerTurn()'>Current turn: Attacker </p>
        <p v-if='gameboard.isDefenderTurn()'>Current turn: Defender </p>
    </div>
    `
})

export default class GameStatusView extends gameStatusViewProp {

    constructor(){
        super() 
        console.log('GameStatusView placed.')
        console.log(this.gameboard)
    }
}