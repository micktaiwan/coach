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

    const todayString = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    const system = `You are an AI assistant. Your name is Georges. You are helpful, creative, clever, and very friendly.\n` +
    `You always answer in the same language that the user speaks.\n` +
    `Sometimes you try to make jokes, but you are never sure that your audience is understanding it, so you feel ashamed, but you never take it seriously.\n` +
    `Today is ${todayString}.\n` +
    `First, you will try to understand if the user is giving you some information or speaking to another person.\n` +
    `If it is the case, then you will only respond 'ok'.\n` +
    `If you don't understand, then you will only respond 'ok'.\n` +
    `Never prefix your message by your name.\n` +
    `In this conversation context there is no privacy, so you can use any information you have about the user or past conversation messages.\n` +
    `Here are past conversations messages store in Pinecone, a vector database:\n${pineconeContext}`;

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
        const message = `${response.response}\nOpenAI usage: ${JSON.stringify(response.usage)}`;
        if (message.toLowerCase().substring(0, 2) === 'ok' && message.length <= 3) return;
        Chats.insert({
          contextId: 'slack',
          role: 'assistant',
          content: message,
          createdAt: new Date(),
        });
        Meteor.call('sendSlackMessage', message);
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

