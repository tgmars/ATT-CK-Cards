import Vue from 'vue';
import Component from 'vue-class-component';
import {AttackCard} from '../model/card';

import validate from 'vue-template-validator';


// TODO: Contextual per player and the message types(command vs normal message)

const attackCardProp = Vue.extend({
    props : {attackCard: Object as () => AttackCard},
});

const acstring =     `
<div style='padding:2px'>
    <b-card v-if='attackCard.faceup'
        v-bind:header=attackCard.tactic
        v-on:click="$emit('card-click')"
        v-bind:sub-title=attackCard.technique
        border-variant='danger'
        header-border-variant='danger'
        style='width:220px;height:270px;font-size:12px;
            margin:0'
        ref='attackCardDiv'>
        <b-card-text>
                <div class='overflow-auto'
                style='height:160px;font-size:12px;
                position:relative;top:0px'>
                {{attackCard.description}}
                </div>
        </b-card-text>
    </b-card>

    <b-card v-else
    header='Attack'
    v-on:click="$emit('card-click')"
    bg-variant='danger'
    header-variant='danger'
    text-variant='white'
    style='width:220px;height:110px;margin:0;font-size:12px'
    >
    <b-card-text></b-card-text>
    </b-card>
</div>
`;

const warnings = validate(acstring);


@Component({
    template: acstring
,
})

export default class AttackCardView extends attackCardProp {

    constructor() {
        super();

        warnings.forEach(function(msg: any) {
        console.log(msg);
    });

        // console.log('Attack card view placed.');
    }
}
