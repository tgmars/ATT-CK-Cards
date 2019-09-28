import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator';
import {MessageInterface} from '../model/message';
import moment from 'moment'

//TODO: Contextual per player and the message types(command vs normal message)

@Component({
    template:
    `
    <div>
        <div style='padding-left:4px;font-size:0.8'>
            <b-badge variant='secondary'>{{message.time | localDateTime}}</b-badge>
            <b-badge variant='primary'>{{message.player.name}}</b-badge>
            {{message.message}}
        </div>
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

    constructor(){
        super();
    }
}
