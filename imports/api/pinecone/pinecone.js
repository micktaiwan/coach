import { PineconeClient } from '@pinecone-database/pinecone';

const client = new PineconeClient();

const { settings } = Meteor;

if (!settings?.pinecone) console.warn('Pinecone settings not found');
else {
  const init = async () => {
    await client.init({
      apiKey: settings.pinecone.key,
      environment: settings.pinecone.environment,
    });
    const indexesList = await client.listIndexes();
    console.log('Pinecone indexes:', indexesList);
  };
  init();
}

export const toto = 1;

export const pinecone = {
  client,
  async addChat(contextId, role, message) {
    check(contextId, String);
    check(role, String); // 'user', 'assistant', 'meta'
    check(message, String);

    if (!contextId) throw new Meteor.Error('no-context-id');

    message = message.replace(/\n/g, '<br>');

    const chat = {
      userId: this.userId,
      contextId,
      role,
      content: message,
      createdAt: new Date(),
    };

    // create an embeddable document, calling openai api



    const { id } = await client.createDocument(chat);
    return id;
  },
};
