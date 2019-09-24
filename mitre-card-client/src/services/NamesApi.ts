import Api from './Api';

export default {
  fetchNames() {
    return Api().get('api/users/all');
  },
};
