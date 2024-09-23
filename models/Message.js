import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  from: String,
  body: String,
  timestamp: Date,
  status: String,
  obstacleId: String,
  userId: String
});

const Message = mongoose.model('Message', MessageSchema);

//module.exports = Message;

export default  Message;