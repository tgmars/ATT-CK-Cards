import Vue from 'vue';
import Component from 'vue-class-component';
import ChatView from './ChatView';
import GameView from './GameView';
import Navbar from './Navbar';
import {Chat} from '../model/chat';
import { state } from '@/main';
import { Prop } from 'vue-property-decorator';
import MessagesApi from '@/services/MessagesApi';
import {Plotly} from 'vue-plotly';
import moment from 'moment';

@Component({
    template:
    `
    <div style='height:1000px'>
        <navbar></navbar>
        <Plotly style='height:800px' :data="data" :layout="layout" :display-mode-bar="false"></Plotly>
    </div>
    `,
    components : {Plotly, Navbar},
})

export default class StatusView extends Vue {

    layout = {
        title: "Messages sent by 5 minute blocks"
    }

    data = [{
        x: ['a','b'],
        y: [3,5],
        type:"bar"
      }]

    constructor() {
        super();
        this.messages()
    }

    messages() {
        MessagesApi.fetchMessages().then((response) => {
            const msgResp = response.data.messages;
            let startTime: number = msgResp[0].time;
            const window: number = 300000 // 5 minute of millis
            let x: string[] = []
            let y: number[] = []
            let windowIndex = 0;
            // console.log(msgResp)
            // console.log('starttime:' + startTime)
            y[0] = 0;

            msgResp.forEach((msg) => {
                const time: number = msg.time
                // console.log(time)
                if(time < (startTime + window)){
                    y[windowIndex]++;
                    // console.log('wi: ' + windowIndex)
                    // console.log('y' + y)
                    // console.log('y[wi]: ' + y[windowIndex])
                }else {
                    const startFormat: string = moment(startTime).format('DD/MM/YYYY hh:mm:ss')
                    // console.log(startFormat)
                    x[windowIndex] = startFormat + ' - ' + moment(startTime + window).format('DD/MM/YYYY hh:mm:ss');
                    startTime = time;
                    // console.log(x[windowIndex])
                    windowIndex++;
                    y[windowIndex] = 0;
                }
            });

            this.data[0].x = x;
            this.data[0].y = y;
        });
            
    }


    

}

