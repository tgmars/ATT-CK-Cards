import Vue from 'vue'
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import MessageView from './MessageView'
import {Chat} from '../model/chat'
import MessagesApi from '@/services/MessagesApi';
import { MessageInterface } from '@/model/message';

// This is the way to do it. Pass that prop down to your class by extending this const.


// @Component must preceed the class. We can pass some basic construction to our component here if needed.
@Component({
    template:
    `
    <div class='overflow-auto' ref='messagesdiv' style='height: calc(100% - 134px)'>  
        <div v-for='message in messages'>
            <message-view :message='message'></message-view>
        </div>
    </div>`,
    components:{
        MessageView,
    }
})
export default class MessagesView extends Vue{

    @Prop({ default: [] })
    chat!: Array<MessageInterface>;

    private messages = this.chat;

    constructor () {
        super();
        console.log('MessagesView was placed');
    }

    // Hooking updated so that we scroll to the bottom whenever a
    // new message is added
    updated(){
        let obj = this.$refs.messagesdiv as HTMLElement
        obj.scrollTop = obj.scrollHeight
    }


}


