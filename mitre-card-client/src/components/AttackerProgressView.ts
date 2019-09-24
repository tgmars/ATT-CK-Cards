import Vue from 'vue'
import Component from 'vue-class-component'
import Player from '../model/player';

//TODO: Contextual per player and the message types(command vs normal message)

const attackerProp = Vue.extend({
    props : {attacker:Object as () => Player}
})

@Component({
    template:
    `
    <div style='width:100%;background-color:grey'>
        <b-progress>
            Attacker_Progress
            <b-progress-bar variant='warning' v-for='technique in validProgress' :key='technique' :value='100'>{{technique}}</b-progress-bar>        
        </b-progress>
    </div>
    `
})

export default class AttackerProgressView extends attackerProp {

    constructor(){
        super();
        console.log('Attacker progress view placed.');
    }

    get validProgress(){
        return Object.keys(this.$props.attacker.persistentProgress)
            .filter(k => this.$props.attacker.persistentProgress[k]);
    }
}
