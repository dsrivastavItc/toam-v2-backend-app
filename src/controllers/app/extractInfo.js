import axios from "axios";
// OpenAI API call to extract specific information
const extractInformationFromMessage = async (message) => {
  console.log("extractInformationFromMessage method called");
  //const openAiApiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your actual API key
  const { EI_OPENAI_API_KEY } = process.env;

  const prompt = `
  Extract the following information from the message:
  - Importing Country
  - Exporting Country
  - Product
  - Type of Obstacles

  Message: "${message}"

  Provide the output in the following JSON format:
  {
    "importing_country": "",
    "exporting_country": "",
    "product": "",
    "obstacle_type": ""
  }
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', //'gpt-4',
        messages: [
          { role: 'system', content: 'You are an assistant that extracts information from trade-related complaints.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${EI_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract structured response from GPT
    const extractedData = response.data.choices[0].message.content;
    return JSON.parse(extractedData);
  } catch (error) {
    console.error('Error with OpenAI API:', error.response ? error.response.data : error.message);
    throw new Error('Failed to extract information from the message');
  }
};

export default extractInformationFromMessage;