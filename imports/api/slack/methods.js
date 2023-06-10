import axios from 'axios';
import { pinecone } from '../pinecone/pinecone';
import { Chats } from '../chats/collections';

const slackUserNames = {};

async function getUserName(userId) {
  if (slackUserNames[userId]) console.log('cached slack user name:', slackUserNames[userId]);
  else console.log('getting slack user name for:', userId);
  if (slackUserNames[userId]) return slackUserNames[userId];

  try {
    const response = await axios.get(`https://slack.com/api/users.info?user=${userId}`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${Meteor.settings.slack.botToken}`,
      },
    });

    if (!response.data.ok) return userId;

    slackUserNames[userId] = response.data.user.name;
    return response.data.user.name;
  } catch (error) {
    console.error('error getting slack user name:', error);
    return userId;
  }
}

Meteor.methods({
  sendSlackMessage(message) {
    check(message, String);
    const { webhook } = Meteor.settings.slack;
    const data = {
      text: message,
      channel: '#georges',
    };

    HTTP.post(webhook, { data });
  },

  async processSlackMessage(postData) {
    const { user, text } = postData.event;
    const userName = await getUserName(user);
    const receivedMessage = `${userName}: ${text}`;
    console.log('postData:', postData);
    if (!postData.event?.text.includes('<@U058K74EF2S>')) return console.log('not summoned, ignoring...');
    if (postData.event?.thread_ts) return console.log('msg in thread, ignoring...');
    if (postData.subtype === 'huddle_thread') return console.log('huddle_thread, ignoring...');
    if (postData.subtype === 'bot_add') return console.log('bot_add, ignoring...');
    if (user === 'USLACKBOT') return console.log('message from USLACKBOT, ignoring...');

    const context = await pinecone.getContext('slack', text);
    const pineconeContext = context.map(c => c.text).join('\n');

    // console.log(context.map(c => `${c.score}: ${c.text}`).join('\n'));

    const todayString = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    const system = `You are an AI assistant in a Slack channel with several people. Your name is Georges.\n` +
    `Messages are prefixed by the name of the user who is speaking, ex: "Mickael: this is my message".\n` +
    `Never prefix your message by your name.\n` +
    `Always prefix your message by the name of the user you are responding to.\n` +
    `If the last chat message is not directly addressed to you, then you will only respond 'ok'.\n` +
    `Today is ${todayString}.\n` +
    `Here are some past conversation bits related to the last user prompt:\n${pineconeContext}`;

    // console.log('system:', system);

    Meteor.call('openaiGenerateText', 'slack', system, receivedMessage, (error, response) => {
      Chats.insert({
        contextId: 'slack',
        role: 'user',
        content: receivedMessage,
        createdAt: new Date(),
      });

      if (error) {
        console.error('error:', error);
        Meteor.call('sendSlackMessage', error.message || 'An error occurred');
      } else {
        const message = `${response.response}`;
        if (message.toLowerCase().substring(0, 2) === 'ok' && message.length <= 3) return;
        Chats.insert({
          contextId: 'slack',
          role: 'assistant',
          content: message,
          createdAt: new Date(),
        });
        Meteor.call('sendSlackMessage', message); // , `\nOpenAI usage: ${JSON.stringify(response.usage)}`
      }
    });

    pinecone.addContext({
      _id: postData.event_id,
      contextId: 'slack',
      text: receivedMessage,
      type: 'message',
    });
  },

});

