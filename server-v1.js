const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const connectDB = require('./db');
const Message = require('./models/Message');
const cors = require("cors");

const app = express();


app.use(bodyParser.json());


app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

// Webhook to receive WhatsApp messages
app.post('/webhook', async (req, res) => {
  const { from, body } = req.body.messages[0];
  const timestamp = new Date();

  const newMessage = new Message({
    from,
    body,
    timestamp,
  });

  try {
    await newMessage.save();
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Send WhatsApp message
app.post('/send-message', async (req, res) => {
  const { to, message } = req.body;
  console.log(process.env.WHATSAPP_TOKEN);
  console.log(to);
  console.log(message);
  try {
    const response = await axios.post('https://graph.facebook.com/v20.0/305571099317351/messages', {
      messaging_product: "whatsapp",
      to,
      text: { body: message },
      type: "template", 
      template: { "name": "hello_world", "language": { "code": "en_US"}}
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending message');
  }
});

// Get all messages
app.get('/messages', async (req, res) => {
   const db = await connectDB();
   const Message = require('./models/Message.js');
   try{
    const messages =  await Message.find().sort({timestamp: 1});
     res.status(200).json(messages);
  }
  catch (error)
  {
      res.status(500).json({message: error.message});
  }
  
  // try { 
  //   console.log("api called");


  //   console.log(db.messages);
  //   const messages = await db.messages.find(); //.sort({ timestamp: -1 });
  //   res.json(messages);
  // } catch (err) {
  //   console.error(err);
  //   res.sendStatus(500);
  // }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
