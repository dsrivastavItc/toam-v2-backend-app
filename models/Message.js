const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  from: String,
  body: String,
  timestamp: Date,
  status: String,
  obstacleId: String,
  userId: String
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
