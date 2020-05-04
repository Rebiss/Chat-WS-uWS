const mongoose = require('mongoose');

module.exports =  mongoose.model('ChatMessage', new mongoose.Schema({
    user_name:    { type: String },
    user_id:      { type: Number },
    text:         { type: String },
    station:      { type: String },
    message_type: { type: Boolean },
    user_gender:  { type: Number },
    avatar:       { type: Number },
    is_blocked:   { type: Boolean },
    gameID:       { type: Boolean },
    partnerId:    { type: String }
}));


