import Api from './Api';

export default {
  fetchPlayers() {
    return Api().get('api/users/all');
  },

  fetchPlayerByName(name: String){
    return Api().get('api/users/' + name);
  },

  addPlayer(name: String, isBot: Boolean) {
    return Api().post('api/users/add', {'name': name, 'role': false, 'isBot': isBot, 'resources': 100});
  },
};
