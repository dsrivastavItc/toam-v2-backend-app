const dotenv = require('dotenv');
const OpenAIApi = require('openai');

dotenv.config();

const openai = new OpenAIApi({ apiKey: process.env.API_KEY });


async function main() {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful gym trainer, please provide me 2 day gym exercise" }],
      model: "gpt-3.5-turbo",
    });
  
    console.log(completion.choices[0]);
  }
  
  main();