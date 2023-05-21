import { PineconeClient } from '@pinecone-database/pinecone';
import _ from 'underscore';
import { PrimaryContexts } from '../primary-contexts/collections';
import { Tasks } from '../tasks/collections';

const client = new PineconeClient();

const { settings } = Meteor;

if (!settings?.pinecone) console.warn('Pinecone settings not found');
else {
  client.init({
    apiKey: settings.pinecone.key,
    environment: settings.pinecone.environment,
  });
}

export const indexName = 'coach';
export const pinecone = {
  client,
  // input: context with
  // - _id (vector id)
  // - text
  // - contextId (namespace)
  // - type (so we can associate an id with a collection later if needed)
  addContext(context) {
    console.log('pinecone.addContext:', context);
    Meteor.call('openaiEmbed', context.text, (error, data) => {
      if (error) console.error(error);
      else {
        // console.log('data:', data);
        const vectors = [{
          id: context._id,
          values: data.data[0].embedding,
          metadata: context,
        }];
        // console.log('vectors:', vectors);

        const upsertRequest = {
          vectors,
          namespace: context.contextId,
        };
        const index = client.Index(indexName); // eslint-disable-line new-cap
        index.upsert({ upsertRequest }).catch(console.error);
      }
    });
  },

  async getContext(namespace, message) {
    // console.log('getContext namespace:', namespace);
    // console.log('getContext message:', message);
    const data = await Meteor.callAsync('openaiEmbed', message);
    // console.log('data:', data);
    const queryRequest = {
      topK: 50,
      vector: data.data[0].embedding,
      namespace,
      includeMetadata: true,
    };
    const index = client.Index(indexName); // eslint-disable-line new-cap
    const response = await index.query({ queryRequest }).catch(console.error);
    if (!response?.matches) return [];
    return response.matches.map(r => ({ text: r.metadata.text, score: Math.round(r.score * 100) / 100 }));
  },

  remove(id, namespace) {
    const index = client.Index(indexName); // eslint-disable-line new-cap
    index.delete1({ ids: [id], namespace }).catch(console.error);
  },

  update(_id, namespace, text, type) {
    pinecone.remove(_id, namespace);
    pinecone.addContext({ _id, contextId: namespace, text, type });
  },

};

Meteor.methods({
  pineconePopulate() {
    PrimaryContexts.find().forEach(context => {
      context = _.omit(context, 'priority');
      context.type = 'primary';
      // console.log('populating context:', context);
      pinecone.addContext(context);
    });
    Tasks.find().forEach(task => {
      task = _.omit(task, 'status', 'priority');
      task.text = `Task: ${task.text}`;
      task.type = 'task';
      // console.log('populating tasks:', task);
      pinecone.addContext(task);
    });
  },
});
