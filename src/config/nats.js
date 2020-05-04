const nats =  process.env.NATS_SERVER_URL || "nats://127.0.0.1:4222";

module.exports = {
    natsUrl: nats
}