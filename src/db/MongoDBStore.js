const mongoose    = require('mongoose');
const MemCache    = require('./MemCache');
const ChatMessage = require('../models/ChatMessage');

const {limitMessage,url} = require('../config/index.js');

module.exports = class MongoDBStore extends MemCache {
  constructor(uri = url) {
    super();
    
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }).then(() => console.log('Connected DB!'));
  }

  getElements(props, key, count) {

    return ChatMessage.find({
      station: key,
      $and: [{
        $or: [{
          is_blocked: 0
        }, {
          user_id: props.user_id
        }]
      }]
    }, {
      __v: 0
    }).sort({
      _id: -1
    }).limit(limitMessage);
  }

  add(props, key, value) {
    ChatMessage.create({
      station: key,
      ...value
    })
  }

  incr(props, key) {
    return super.incr(...arguments)
  }

  expire(props, key, seconds) {
    return super.expire(...arguments)
  }

  put(props, key, value) {
    return super.put(...arguments)
  }

  del(props, key) {
    return super.del(...arguments)
  }

}