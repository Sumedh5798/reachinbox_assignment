const express = require('express');
const { getGoogleAuthUrl, getGoogleTokens } = require('./services/googleAuthService');
const { getOutlookAuthUrl, getOutlookTokens } = require('./services/outlookAuthService');
const { emailQueue } = require('./queues/emailQueue');
require('dotenv').config();

const app = express();

app.get('/auth/google', (req, res) => {
  res.redirect(getGoogleAuthUrl());
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  const tokens = await getGoogleTokens(code);
  emailQueue.add('checkGmail', { service: 'google', tokens });
  res.send('Google authentication successful');
});

app.get('/auth/outlook', (req, res) => {
  res.redirect(getOutlookAuthUrl());
});

app.get('/auth/outlook/callback', async (req, res) => {
  const { code } = req.query;
  const tokens = await getOutlookTokens(code);
  emailQueue.add('checkOutlook', { service: 'outlook', tokens });
  res.send('Outlook authentication successful');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
