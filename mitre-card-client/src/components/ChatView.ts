import Vue from 'vue'
import Component from 'vue-class-component'

import MessagesView from './MessagesView'
import {Chat} from '../model/chat'
import Message from '../model/message';
import MessagesApi from '../services/MessagesApi';

// This is the way to do it. Pass that prop down to your class by extending this const.
const chatProp = Vue.extend({
    props : {chat:Object as () => Chat}
})

// @Component must preceed the class. We can pass some basic construction to our component here if needed.
@Component({
    template:
    `
    <div style='width:400px;background-color:ghostwhite'>
        <messages-view :chat='chat'></messages-view>
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
export default class ChatView extends chatProp {

    input:string = ''

    constructor () {
        super()
        console.log('ChatView was placed')
    }
  

    /* Methods (newline and send to hanle the text area portion of the component.
    This could be moved out to its own component (and probably should be) */
    newline(){
        console.log('Added line to message.')
        this.input = this.input
    }

    send(){
        console.log('got textarea: '+this.input);
        
        // MessagesApi.addMessage()
        this.chat.addMessage(new Message(this.chat.players[0],this.input))
        this.input=''
    }

    
    //make a post to api/messages/add 
}


