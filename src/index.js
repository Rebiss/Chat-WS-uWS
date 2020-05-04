
const uMiddleware = require('./service/uMiddleware');
const uWebSockets = require('Hermes/uWebSockets/static-builds/dist/uws');
const NATS        = require('nats');
const { natsUrl } = require('./config/nats');
const { PORT }	  = require('./config/chat');
const Chat        = require('./Chat');
const Casino      = require('./Casino');

const nats = NATS.connect(natsUrl);

const middleware = new uMiddleware({
	open: onOpen,
	message: onMessage,
	close: onClose,
	drain: onDrain,
	ping: onPing
});

/* Non-SSL is simply App() */
const uws = uWebSockets.App().ws('/*', middleware.getConfiguration());

/**
 * Configuration for 
 */
uws.globalPublish = function(subscription, message) {
	if ( typeof message !== "string" ) {
		throw new Error('Message must be string');
	}

	nats.publish('uws-broadcast', subscription + ':::' + message);
}

nats.subscribe('uws-broadcast', function(package) {
	const [ subscription, message ] = package.split(':::');

	uws.publish(subscription, message);
});


uws
	.any('/*', (res, req) => {
		res.end('Nothing to see here!'); 
    })
    
	.listen( parseInt(PORT), (listenSocket) => {
		if (listenSocket) {
			console.log(`Listening to port ${PORT}`);
		}
	});

async function onOpen(socket, request) {
	const token = socket.handshake.query.token;
	const user = await Casino.authenticate(token);

	// console.log('*******QUery***********', socket.handshake)

	// /?token=d001f2caa4d358c54c961bbcaf201&language=hy&partnerid=1&gameId=5000000&exitUrl=https://games.vivarobet.am/GoToHome?Id=gaming.vivarobet.am/#/casino

	if ( user && user.partner_id ) {
		const room = `chat-room-${user.partner_id}`;
		// console.log(`Joining user to room: ${room}`);

		socket.user = user;
		socket.subscribe(room);

		socket.send(JSON.stringify({
			topic: 'chat:init',
			data: user
		}));

		const lastMessages = await Chat.getLastMessages({ 
			room, 
			props: {
				user_id: user.id
			} 
		});

		const package = {
			topic: 'chat:history',
			data: lastMessages
		};

		socket.send(JSON.stringify(package));
	} else {
		socket.close();
	}
}

async function onMessage(socket, message) {
	const user = socket.user;
	const { topic, data } = message;
	
	const nikeName = `${user.username[0]}***${user.username.slice(-1)}`;

	console.log('****MESSAGE*****',message.data.room) 

	switch ( topic ) {
		case 'chat:message': {
			const chatMessage = await Chat.addMessage({
				room: `chat-room-${user.partner_id}`,
				identifier: 1,
				message: data.text,
				props: {
					user_id: user.id,
					user_name: nikeName,
					user_gender: user.gender,
					avatar: message.data.avatar,
					partnerId: user.partner_id
				}
			});

			if ( chatMessage ) {
				const package = {
					topic: 'chat:message',
					data:  chatMessage.data
				};

				uws.globalPublish(chatMessage.room, JSON.stringify(package));
			}
			break;
		}
	}
}

async function onPing(socket) {

	console.log('PING*****',)
}

async function onClose(socket) {}

async function onDrain(socket) {}
	