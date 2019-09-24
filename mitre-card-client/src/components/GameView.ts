// Gameview
//     Player progress
//     Hand
//     Gameboard
//     opposition hand
//     Opposition progress


import Vue from 'vue'
import Component from 'vue-class-component'

import {GameBoard} from '../model/gameBoard'
import AttackCardView from './AttackCardView'
import DefenceCardView from './DefenceCardView'
import AttackerProgressView from './AttackerProgressView'
import GameStatusView from './GameStatusView'
import { AttackCard, DefenceCard } from '../model/card';
import Player from '../model/player';


// This is the way to do it. Pass that prop down to your class by extending this const.
const gameProp = Vue.extend({
    props : {gameboard:Object as () => GameBoard}
})

// @Component must preceed the class. We can pass some basic construction to our component here if needed.
@Component({
    //drop a modal over the view on gameboard.valid == false
    template:
    `
    <div>
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
    components:{
        AttackCardView,
        DefenceCardView,
        AttackerProgressView,
        GameStatusView
    }
})
export default class GameView extends gameProp {

    input:string = ''
    attackVisible:boolean = true
    defenceVisible:boolean = true


    constructor () {
        super()
        console.log('GameView was placed')        
    } 

    get playSpaceAttackCards(){
        let ac:any = []
        this.gameboard.playSpace.forEach(element => {
            if(element instanceof AttackCard){
                ac.splice(ac.length,0,element)
            }         
        });
        return ac
    }

    get playSpaceDefenceCards(){
        let dc:any = []
        this.gameboard.playSpace.forEach(element => {
            if(element instanceof DefenceCard){
                dc.splice(dc.length,0,element)
            }         
        });
        return dc
    }

    /** Take an index to a card in the attackers hand, and play the game. */
    attackerPlay(i:number){
        this.gameboard.attackerPlay(i)
    }
    
    /** Take an index to a card in the defenders hand, and play the game. */
    defenderPlay(i:number){
        this.gameboard.defenderPlay(i)
    }




    
}
