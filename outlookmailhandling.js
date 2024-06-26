const axios = require('axios');
require('dotenv').config();

const { OUTLOOK_CLIENT_ID, OUTLOOK_CLIENT_SECRET, OUTLOOK_REDIRECT_URI } = process.env;

const getOutlookAuthUrl = () => {
  const scopes = ['https://graph.microsoft.com/Mail.Read', 'https://graph.microsoft.com/Mail.Send'];
  return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${OUTLOOK_CLIENT_ID}&response_type=code&redirect_uri=${OUTLOOK_REDIRECT_URI}&response_mode=query&scope=${scopes.join(' ')}`;
};

const getOutlookTokens = async (code) => {
  const response = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', null, {
    params: {
      client_id: OUTLOOK_CLIENT_ID,
      client_secret: OUTLOOK_CLIENT_SECRET,
      code,
      redirect_uri: OUTLOOK_REDIRECT_URI,
      grant_type: 'authorization_code',
    },
  });
  return response.data;
};

module.exports = { getOutlookAuthUrl, getOutlookTokens };
