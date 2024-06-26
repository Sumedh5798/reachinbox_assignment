const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const getEmailContext = async (emailText) => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Classify the email: ${emailText}`,
    max_tokens: 50,
  });
  return response.data.choices[0].text?.trim() || '';
};

const getAutomatedReply = async (emailText, context) => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Generate an appropriate reply for the email based on the context "${context}": ${emailText}`,
    max_tokens: 100,
  });
  return response.data.choices[0].text?.trim() || '';
};

module.exports = { getEmailContext, getAutomatedReply };
