/**
 * ! When Connection Established with client
 * @param {uWebSockets.js/src/WebSocketWrapper.h} socket 
 * @param {uWebSockets.js/src/HttpRequestWrapper} request 
 */
async function onWebsocketConnection(socket, request) {
	console.log("Socket Connected");
	const headers = Object.fromEntries(new URLSearchParams(request.getHeader()));
	const query   = Object.fromEntries(new URLSearchParams(request.getQuery()));
	
	socket.handshake = {
      query:   query,
      headers: headers,
      cookie:  headers.cookie
    };

    this.open(socket, request);
}

/**
 * ! When Connection Interuppted with client
 * @param {uWebSockets.js/src/WebSocketWrapper.h} socket 
 * @param {uWebSockets.js/src/HttpRequestWrapper} request 
 */
async function onWebsocketDisconnect(socket) {
    console.log("Socket Disconnected");
    this.close(socket);
}

async function onWebsocketMessage(socket, package, isBinary) {
	// console.log("message", socket, package, isBinary);
    let data;
	let message = Buffer.from(package).toString('utf8');

    try {
		data = JSON.parse(message);
	} catch(error) {
		console.error('Unable to parse json', error);
    }
    
    this.message(socket, data, isBinary);
}

async function onWebsocketBackpressure(socket) {
    console.log("Socket Backpressure", socket);
    this.drain(socket);
}

async function onWebsocketPing(socket) {
  socket.send('PONG');
}

const wrapper = {
    open()    { throw new Error('Please specify uMiddleware.open method') },
    close()   { throw new Error('Please specify uMiddleware.close method') },
    message() { throw new Error('Please specify uMiddleware.message method') },
    drain()   { throw new Error('Please specify uMiddleware.drain method') },
    ping()    { throw new Error('Please specify uMiddleware.ping method') }

}

/**
 * @uMiddleware
 */
class uMiddleware {
    constructor(props) {
        Object.assign(this, wrapper, props);
    }

    getConfiguration() {
        return {
            open:    onWebsocketConnection.bind(this),
            close:   onWebsocketDisconnect.bind(this),
            message: onWebsocketMessage.bind(this),
            drain:   onWebsocketBackpressure.bind(this),
            ping:    onWebsocketPing.bind(this)
        }
    }
}

module.exports = uMiddleware;
