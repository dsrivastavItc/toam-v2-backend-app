/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express";
import axios from "axios";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

const MessageSchema = new mongoose.Schema({
  from: String,
  body: String,
  timestamp: Date,
});

const UserSchema = new mongoose.Schema({
  firstName: String,
  LastName: String,
  gender: String,
  email: String,
  mobile: String,
  password: String,
  timestamp: Date,
});

const ComplaintSchema = new mongoose.Schema({
  TradeDirection: String,  
	Description: String,  
	Date: Date,  
	IsRecurringProblem: String,
	LocationName: String,
	ProductDetails: String,
	TradeRegulationType: String, 
	OtherRegulation: String,  
	Remarks: String,  
	Status: String,  
	SubmitDate: String,  
	LocationCountryCode: String,
	LocationCode: String,
	TradeRegulationCode: String,  
	TradeOriginCountryCode: String,  
	TradeDestinationCountryCode: String,  
	SubmitUserUserId: String,  
	Version: String,
	WebsiteCode: String,  
	Code: String,  
	PublishedDate: Date,
	CovidRelated: String, 
	SectorSectorId: String, 
	ProductServiceType: String,
	MessageId: String
});


const connectDB = async () => {
  try {
   const conn= await mongoose.connect(
        //process.env.MONGO_URI
        //"mongodb://127.0.0.1:27017/user"
        "mongodb+srv://deepak_sri:oEr5Qq9EvW8bI9sM@cluster-mongo-db.fnl4vzi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-mongo-db"
        ,{
            'dbName': 'obstacles'
           }
       );
       console.log('MongoDB connected');
    

      
     return conn; 
  } catch (err) {
    console.error(err);
    //process.exit(1);
  }
  return null;
};

connectDB();

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT } = process.env;

app.post("/webhook", async (req, res) => {
  // log incoming messages
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
  
  // check if the webhook request contains a message
  // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  // check if the incoming message contains text
  if (message?.type === "text") {
    // extract the business number to send the reply from it
    const business_phone_number_id =
      req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

    const conn = await connectDB();
  
  //console.log(await conn.model('messages',MessageSchema).findById('66cf0ee486f96d109e08f3da'));
  const saveMsg = await conn.model('messages', MessageSchema).create({ from: message.from,
  body: message.text.body,
  timestamp: new Date(), });
    
    console.log(saveMsg);
    
  //const getUser = await conn.model('users',UserSchema).find({ mobile: message.from });
  //console.log(getUser);
  //if(!getUser)
   // {
    console.log("saveUser called");
    const saveUser = await conn.model('users',UserSchema).create({ mobile: message.from, timestamp: new Date()});
    console.log(saveUser);
   /* }
  else
    {
      //update product
      const updateUser = await conn.model('users', UserSchema).updateOne( 
      
        { mobile: message.from },
      {
        $set: {
          timestamp: new Date()
        }
      }
      );
      console.log(updateUser);
    }
    */
    
    console.log("saveComplaint called");
    const saveComplaint = await conn.model('complaints',ComplaintSchema).create({ 
      TradeDirection: 'Import',
      Description: message.text.body, 
      Date: new Date(),
      IsRecurringProblem: 'No',
      LocationName: 'Border',
      ProductDetails: 'Cacao en feve',
      TradeRegulationType: 'NationalRegulation', 
      OtherRegulation: 'N/A',  
      Remarks: 'N/A',  
      Status: 'New',  
      SubmitDate: new Date(),  
      LocationCountryCode: '012',
      TradeOriginCountryCode: '504',  
      TradeDestinationCountryCode: '504',  
      SubmitUserUserId: '66ec306069453f1fe31b9382',  
      Version: '1',
      WebsiteCode: 'cotedivoire',  
      Code: '2',  
      PublishedDate: new Date(),
      SectorSectorId: 'N/A', 
      ProductServiceType: 'N/A',
      MessageId: '66cf0ee486f96d109e08f3da'
    });
    console.log(saveComplaint);
    
    // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v20.0/305571099317351/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: message.from,
        text: { body: "We acknowledge your message, please reply to this message with your {firstname: '', lastName: '', email: ''} format " + message.text.body },
        context: {
          message_id: message.id, // shows the message as a reply to the original user message
        },
      },
    });

    // mark incoming message as read
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v20.0/305571099317351/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        status: "read",
        message_id: message.id,
      },
    });
  }
  //save into mongo db
  
  res.sendStatus(200);
});

// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
