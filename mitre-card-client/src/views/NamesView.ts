import Vue from 'vue';
import Component from 'vue-class-component';
import NamesApi from '@/services/NamesApi';


// @Component must preceed the class. We can pass some basic construction to our component here if needed.
@Component({
    template:
    `
    <div class='namesview'>
        {{names}}
        <div v-for='name in names.players'>
            <p>
                <span><b>{{ name.name }}</b></span><br/>
                <span>{{ name.hand }}</span><br/>
                <span>{{ name._id }}</span><br/>
                <span>{{ name.resources }}</span>
            </p>
        </div>
    </div>`,
})
export default class NamesView extends Vue{
    private names = [];

    constructor() {
        super();
        this.getNames();
    }

    private async getNames(){
        const response = await NamesApi.fetchNames();
        this.names = response.data;
    }

    // public render(){
    //     return `
    //     <div class='namesview'>
    //         Hi there
    //         <div v-for='name in names'>
    //             <p>
    //                 <span><b>{{ name.name }}</b></span><br/>
    //                 <span>{{ name.email }}</span><br/>
    //                 <span>{{ name.id }}</span>
    //             </p>
    //         </div>
    //     </div>`  
    // }
}


