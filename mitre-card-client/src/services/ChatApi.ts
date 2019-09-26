import Api from './Api';

export default {
    fetchMessages() {
      return Api().get('api/messages/all');
    },

    /** Do not call this with data straight from the user, ensure validation first! */
    addMessage(message: Object) {
      return Api().post('api/messages/add', message);
    },
  };
  