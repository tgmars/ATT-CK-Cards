import Vue from 'vue'
import Component from 'vue-class-component'


@Component({
    template:
    `
    <div>
    <b-navbar toggleable='lg' type='dark' variant='primary'>
      <b-navbar-brand href='#'>MITRE ATT&CK Cards</b-navbar-brand>
  
      <b-navbar-toggle target='nav-collapse'></b-navbar-toggle>
  
      <b-collapse id='nav-collapse' is-nav>
        <b-navbar-nav>
          <b-nav-item>Show/Hide Chat</b-nav-item>
          <b-nav-item>
            <router-link to="/stats">Statistics</router-link></b-nav-item>
        </b-navbar-nav>
  
       
      </b-collapse>
    </b-navbar>
  </div>
    `
})

export default class Navbar extends Vue {

  constructor(){
    super()
  }




}