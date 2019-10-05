import Vue from 'vue'
import Component from 'vue-class-component'
import {DefenceCard} from '../model/card'

//TODO: Contextual per player and the message types(command vs normal message)

const defenceCardProp = Vue.extend({
    props : {defenceCard:Object as () => DefenceCard}
})

@Component({
    template:
    `
    <div style='padding:2px'>  
        <b-card v-if='defenceCard.faceup'
            header='data source'
            border-variant='primary'
            header-border-variant='primary'
            v-bind:sub-title=defenceCard.dataSource
            v-on:click='$emit(card-click)'
            style='width: 220px;height:110px;font-size:12px;margin:0'
            ref='defenceCardDiv' 
        >   
            <b-card-text>
                    <div class='overflow-auto' 
                    style='height:90px;width:200px;font-size:12px;
                    position:relative;top:0px'
                    >
                    
                    </div>
            </b-card-text>
        </b-card>

        <b-card v-else
        header='Defence'
        v-on:click='$emit(card-click)' 
        border-variant='info'
        header-border-variant='info'
        style='width:220px;height:110px;margin:0;font-size:12px'
        >   
        <b-card-text></b-card-text>
        </b-card>
    </div>
    `
})

export default class defenceCardView extends defenceCardProp {

    constructor(){
        super()
        console.log('Defence card view placed.')
    }
}