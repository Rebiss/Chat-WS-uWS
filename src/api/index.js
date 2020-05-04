const Events   = require('events');
const MemCache = require('../db/MemCache');
const StoreInterface = require('../db/interface/StoreInterface');

const { obsceneWords, maxLength, initalConfig, containsUrl, containsGiphy, required } = require('../config/chat');

module.exports = class Chat extends Events {
	constructor(config = {}) {
		super();

		this.config = {...config,...initalConfig };
		this._initStore();
	}


    _initStore() {
        const store = this.store = this.config.store || new MemCache();
  
        Object.keys(StoreInterface)
          .forEach(method => {
  
            if (!store[method]) {
              throw new Error(`Provided store incopatibly with chat module. You need to implement ${method} method`)
            };
  
            if (store[method].length !== StoreInterface[method].length) {
              throw new Error(
                `Provided store incopatibly with chat module. Wrong argument count in method ${method}, Given ${store[method].length} expecting ${StoreInterface[method].length} arguments.`
                );
            }
          });
    }
  
    async getLastMessages({room,props}) {
      return this.store.getElements(props, room)
    };

    // async toRespond({message = required('message')}){
    //   if (message.length) return true;
      
    // };

    async addMessage({
        room = required('room'),
        identifier = required('identifier'),
        message = required('message'),
        props = {}
      }) {
        const maxMsgLength = message.length;
        const messagesCount = this.store.incr(props, `chat:${room}:identity:${identifier}`);
        const state = {
          validGif: false,
          validURL: false,
          valid:    false
        };
  
        if (messagesCount === 1) {
          this.store.expire(props, `chat:${room}:identity:${identifier}`, 3)
        };
  
        if (messagesCount > 10)   return;

        if (message.trim() == '') return;
  
        if (containsGiphy(message)) { state.validGif = true };

        if (containsUrl(message)) { state.validURL = true };

        const expression   = new RegExp(obsceneWords, 'gi');
        const obscenceWord = message.replace(this.config.regExpObscenceWord, '');
  
        state.valid = obscenceWord.match(expression) !== null;
        
        const isBlock = ( state.valid || state.validURL ) ? true : false;
  
        if (maxMsgLength < maxLength) {
          const msg = {
            identifier,
            text: message,
            is_blocked: isBlock,
            message_type: state.validGif,
            ...props
          }
  
          this.store.add(props, room, msg);

          return { room, data: msg }
        }

        return null;
    }

}
