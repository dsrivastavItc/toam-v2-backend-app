import axios from "axios";

const { OPENAI_API_KEY } = process.env;

const summarizeMessage = async (message) => {
      try {
        console.log("summarize method called");
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-4',  // You can use 'gpt-3.5-turbo' or any other suitable model
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes messages.'
            },
            {
              role: 'user',
              content: `Please summarize the following message: "${message}"`
            }
          ],
          max_tokens: 100, // Limit the length of the summary
          temperature: 0.7,
        }, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`, // Your OpenAI API key
            'Content-Type': 'application/json',
          },
        });
    
        const summary = response.data.choices[0].message.content;
        console.log("summary: ", summary);
        return summary;
      } catch (error) {
        console.error('Error summarizing the message:', error);
        throw new Error('Failed to summarize message');
      }
    };

export default summarizeMessage;