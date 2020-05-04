const natsURL = "nats://localhost:4222"

const emit = function (topic, data) { 
    this.send(JSON.stringify({ topic,data }))
};

const useOn = function () {
    topics = {};
    return [topics, function setOn(topic, callback) {
      topics[topic] = callback
    }];
  };

module.exports = {
    emit: emit,
    useOn: useOn,
    natsURL: natsURL
}