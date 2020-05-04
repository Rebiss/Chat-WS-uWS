const mAuth = [process.env.MONGODB_USER, process.env.MONGODB_PASS].join(':');
const mHost = process.env.MONGODB_HOST || '127.0.0.1';
const mPort = process.env.MONGODB_PORT || '27017';
const mDB = process.env.MONGODB_DATABASE || 'ChatDB';
const auth = mAuth.length > 3 ? `${mAuth}@` : '';
const limitMessage = 50;

module.exports = {
    url: `mongodb://${auth}${mHost}:${mPort}/${mDB}`,
    limitMessage: limitMessage,
}