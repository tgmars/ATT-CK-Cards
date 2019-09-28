import Vue from 'vue'
import Component from 'vue-class-component'

import MessagesView from './MessagesView'
import {Chat} from '../model/chat'
import { Message, MessageInterface } from '../model/message';
import MessagesApi from '../services/MessagesApi';
import { state } from '@/main';
import { Socket } from 'vue-socket.io-extended';


// @Component must preceed the class. We can pass some basic construction to our component here if needed.
@Component({
    template:
    `
    <div style='width:400px;background-color:ghostwhite'>
        <messages-view :chat='messages'></messages-view>
        <b-form-textarea 
            rows='5' max-rows='5' placeholder='Press Enter to submit a message' 
            v-model='input' autofocus
            @keydown.enter.exact.prevent
            @keyup.enter.exact='send'
            @keydown.enter.shift.exact='newline'>
        </b-form-textarea>
    </div>

    `,
    components:{
        MessagesView
    }
})
export default class ChatView extends Vue {

    // Contents of the textarea.
    input:string = ''

    // Messages from the server.
    messages : Array<MessageInterface> = []

    constructor () {
        super()
        console.log('ChatView was placed');
    }
    /* Methods (newline and send to hanle the text area portion of the component.
    This could be moved out to its own component (and probably should be) */
    newline(){
        console.log('Added line to message.');
        this.input = this.input
    }

    async send(){
        console.log('got textarea: ' + this.input);
        const msg = new Message(state.player,this.input).toObject();
        // MessagesApi.addMessage(msg)
        let response = await this.$socket.client.emit('chat',msg);
        this.input=''
    }    

    @Socket() // --> listens to the event connect
    connect () {
      console.log('connection established inside chatview');
    }
    
    @Socket('chat')  // --> listens to the event labelled chat
    onChat (msg: MessageInterface) {
      this.messages.splice(this.messages.length,0,msg);
    }
}


