const MongoDBStore = require('./db/MongoDBStore');
const ChatAPI = require('./api/index');

const Chat = new ChatAPI({ 
	store: new MongoDBStore() 
});

module.exports = Chat;