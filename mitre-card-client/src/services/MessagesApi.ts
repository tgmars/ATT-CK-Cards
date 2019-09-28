import Api from './Api';
import { MessageInterface } from '@/model/message';

export default {
    fetchMessages() {
      return Api().get('api/messages/all');
    },

    /** Do not call this with data straight from the user, ensure validation first! */
    addMessage(message: MessageInterface) {
      return Api().post('api/messages/add', message );
    },
  };
