const express = require('express')
const mongoose = require('mongoose');
const body_parser = require('body-parser');

const app = express()

const productRoute = require('./routes/product.route.js');

//middleware
app.use(express.json());
app.use(express).use(body_parser.json());
app.use(express.urlencoded({extended: false}));

//routes
app.use("/api/products", productRoute);

app.get('/webhook', (req,res)=> {
  let mode=req.query["hub.mode"];
  let challange = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  const myToken="";

  if(mode && token){
    if(mode === "subscribe" && token === myToken)
      res.status(200).send(challange);
  }
  else
  {
      res.status(403);
  }
});

app.post("/webhook",(req,res)=>{ //i want some 

  let body_param=req.body;

  console.log(JSON.stringify(body_param,null,2));

  if(body_param.object){
      console.log("inside body param");
      if(body_param.entry && 
          body_param.entry[0].changes && 
          body_param.entry[0].changes[0].value.messages && 
          body_param.entry[0].changes[0].value.messages[0]  
          ){
             let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
             let from = body_param.entry[0].changes[0].value.messages[0].from; 
             let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

             console.log("phone number "+phon_no_id);
             console.log("from "+from);
             console.log("boady param "+msg_body);

             axios({
                 method:"POST",
                 url:"https://graph.facebook.com/v20.0/"+phon_no_id+"/messages?access_token="+token,
                 data:{
                     messaging_product:"whatsapp",
                     to:from,
                     text:{
                         body:"Hi.. I'm Prasath, your message is "+msg_body
                     }
                 },
                 headers:{
                     "Content-Type":"application/json"
                 }

             });

             res.sendStatus(200);
          }else{
              res.sendStatus(404);
          }

  }

});

// mongoose.connect('mongodb://atlas-sql-66950f357c838a24f7a33b1b-g4odf.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin')
//   .then(() => {
//     console.log('Connected to database!');
//     app.listen(3000, () =>{
//         console.log("server runing port 3000");
//     });
//   })
//   .catch(() => {
//         console.log("Connecton failed!!!");

//   });
//mongoose.connect('mongodb+srv://deepak_sri:LNYjQlSWT8JymAk2@cluster-mongo-db.fnl4vzi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-mongo-db')
  mongoose.connect('mongodb://127.0.0.1:27017/user')
  .then(() => {
    console.log('Connected to database!');
    app.listen(3000, () =>{
        console.log("server runing port 3000");
    });
  })
  .catch((err) => {
        console.log("Connecton failed!!!");
        console.error(err);
       // process.exit(1);
  });