import { pinecone } from '../pinecone/pinecone';
import { Chats } from '../chats/collections';

Meteor.methods({
  sendSlackMessage(message) {
    check(message, String);
    const webhook = 'https://hooks.slack.com/services/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';
    const data = {
      text: message,
      channel: '#georges',
    };

    HTTP.post(webhook, {
      data,
    });
  },

  async processSlackMessage(postData) {
    const { user, text } = postData.event;
    const receivedMessage = `${user}: ${text}`;
    // console.log('postData:', postData);
    console.log('received slack message:', receivedMessage);
    if (postData.subtype === 'huddle_thread') return console.log('message announcing a huddle thread, ignoring...');
    if (user === 'USLACKBOT') return console.log('message from USLACKBOT, ignoring...');

    const context = await pinecone.getContext('slack', text);
    const pineconeContext = context.map(c => c.text).join('\n');

    // console.log(context.map(c => `${c.score}: ${c.text}`).join('\n'));

    const todayString = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    const system = `You are an AI assistant in a Slack channel with several people. Your name is Georges.\n` +
    `Very important: if the last chat message is not directly addressed to you, then you will only respond 'ok'.\n` +
    `Today is ${todayString}.\n` +
    `Never prefix your message by your name.\n` +
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

