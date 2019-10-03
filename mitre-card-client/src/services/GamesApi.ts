import Api from './Api';

export default {
  fetchGames() {
    return Api().get('api/games/all');
  },

  fetchGamesByID(id: String){
    return Api().get('api/games/' + id);
  },

};
