import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator';
import {MessageInterface} from '../model/message';
import moment from 'moment'
import { state } from '@/main';

//TODO: Contextual per player and the message types(command vs normal message)

@Component({
    template:
    `
    <div>
        <div style='padding-left:4px;'>
            <b-badge variant='secondary'>{{message.time | localDateTime}}</b-badge>
            <b-badge v-if='message.player.name == playername' variant='primary'>{{message.player.name}}</b-badge>
            <b-badge v-else variant='info'>{{message.player.name}}</b-badge>
            <span style='font-size:0.8em'>{{message.message}}</span>
        <hr style='margin-top:0.3rem;margin-bottom:0.3rem'>
    </div>
    `,
    filters : {
        localDateTime : function(epoch:number){
            if(!epoch){ return ''};
            return moment(epoch).format('DD/MM/YYYY hh:mm:ss');
        }
    }
})

export default class MessageView extends Vue {
    @Prop({ default: [] })
    message!: MessageInterface;

    playername = state.player.name;

    constructor(){
        super();
    }
}
