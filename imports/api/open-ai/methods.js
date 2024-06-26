import _ from 'underscore';
import { Tasks } from '../tasks/collections';
import { PrimaryContexts } from '../primary-contexts/collections';
import { Chats } from '../chats/collections';
import { UsageStats } from './collections';
import { pinecone } from '../pinecone/pinecone';

const todayAsString = () => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  const today = new Date();
  return today.toLocaleDateString(undefined, options);
};

const { settings } = Meteor;

const getPineconeSystem = async (contextId, prompt) => {
  const context = await pinecone.getContext(contextId, prompt);
  const system = `Act as a coach. You have 30+ years of experience.\n` +
  `Today is ${todayAsString()}.\n` +
  `Assume that the user is your client.\n` +
  `Any first person pronoun is your client speaking about himself.\n` +
  `This is all the context your client gave you:\n${
    context.map(c => c.text).join('\n')
  }\n[end of context]\n` +
  `This context is very important and must be taken into account for each reply you provide to your client.\n` +
  `Always reply in the same language as the last chat\n`;

  return { system, context };
};


Meteor.methods({

  async openaiGenerateText(contextId, system, prompt) {
    check(contextId, String);
    check(system, String);
    check(prompt, String);

    const user = Meteor.user();
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = user?.openAI?.apiKey || settings.openAI?.apiKey;
    const model = user?.openAI?.model || 'gpt-3.5-turbo';
    if (!apiKey) throw new Meteor.Error('no-api-key', 'No OpenAI API key found');

    const pastChats = Chats.find({ contextId, role: { $ne: 'meta' } }, { limit: 20, sort: { createdAt: -1 }, projection: { _id: 0, role: 1, content: 1 } }).fetch().reverse();
    const lastPrompt = prompt || pastChats[pastChats.length - 1].content;
    let context;
    if (system === '' && contextId) ({ system, context } = await getPineconeSystem(contextId, lastPrompt));

    const messages = [
      { role: 'system', content: system },
      ...pastChats,
    ];

    if (prompt) messages.push({ role: 'user', content: prompt });

    console.log('prompt:', lastPrompt);
    // console.log('messages:', messages);
    // console.log('context:', context);

    const data = {
      model,
      messages,
      temperature: 0.9,
    };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    let response;
    try {
      response = HTTP.post(apiUrl, {
        headers,
        data,
      });
    } catch (error) {
      console.error('openai-error:', error);
      throw new Meteor.Error('openai-error', error);
    }

    console.log(response.data);
    console.log(response.data.choices[0].message);

    UsageStats.insert({
      contextId,
      userId: this.userId,
      id: response.data.id,
      object: response.data.object,
      model: response.data.model,
      usage: response.data.usage,
      createdAt: new Date(),
    });

    return { response: response.data.choices[0].message.content.trim(), context, usage: response.data.usage };
  },

  openaiEmbed(input) {
    check(input, String);

    const url = 'https://api.openai.com/v1/embeddings';
    const apiKey = Meteor.user()?.openAI?.apiKey || settings.openAI.apiKey;
    if (!apiKey) throw new Meteor.Error('no-api-key', 'No OpenAI API key found');

    const data = {
      model: 'text-embedding-3-small',
      input,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    let response;
    try {
      // console.log('openaiEmbed call:', { headers, data });
      response = HTTP.post(url, {
        headers,
        data,
      });
    } catch (error) {
      console.error('openaiEmbed Error:', error);
      throw new Meteor.Error('openai-error', error);
    }

    return response.data;
  },

});
