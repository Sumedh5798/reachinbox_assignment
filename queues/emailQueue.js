const { Queue, Worker } = require('bullmq');
require('dotenv').config();
const { getEmailContext, getAutomatedReply } = require('../services/openAiService');
const { readGmailMessages, sendGmailReply } = require('../services/gmailService');
const { readOutlookMessages, sendOutlookReply } = require('../services/outlookService');

const emailQueue = new Queue('emailQueue', { connection: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT } });

const emailWorker = new Worker('emailQueue', async job => {
  const { service, tokens } = job.data;

  if (service === 'google') {
    const messages = await readGmailMessages(tokens);
    for (const message of messages) {
      const context = await getEmailContext(message);
      const reply = await getAutomatedReply(message, context);
      await sendGmailReply(tokens, reply, message.threadId);
    }
  } else if (service === 'outlook') {
    const messages = await readOutlookMessages(tokens.accessToken);
    for (const message of messages) {
      const context = await getEmailContext(message.body.content);
      const reply = await getAutomatedReply(message.body.content, context);
      await sendOutlookReply(tokens.accessToken, reply, message.id);
    }
  }
});

module.exports = { emailQueue, emailWorker };
