import { Meteor } from 'meteor/meteor';

// head

import './head';

// tasks
import '../imports/api/tasks/methods';
import '../imports/api/tasks/publish';
import { Tasks } from '../imports/api/tasks/collections';

// primary contexts
import '../imports/api/primary-contexts/methods';
import '../imports/api/primary-contexts/publish';
import '../imports/api/primary-contexts/collections';

// contexts
import '../imports/api/contexts/methods';
import '../imports/api/contexts/publish';
import '../imports/api/contexts/collections';

// chats
import '../imports/api/chats/methods';
import '../imports/api/chats/publish';
import '../imports/api/chats/collections';

// dynamic contexts
import '../imports/api/dynamicContexts/methods';
import '../imports/api/dynamicContexts/publish';
import '../imports/api/dynamicContexts/collections';

// settings
import '../imports/api/settings/methods';

// users
import '../imports/api/users/server/main';

// OpenAI
import '../imports/api/open-ai/methods';
import '../imports/api/open-ai/publish';
import '../imports/api/open-ai/collections';

// pinecone
import '../imports/api/pinecone/pinecone';

Meteor.startup(() => {
  // code to run on server at startup
  Tasks.update({ userId: { $exists: false } }, { $set: { userId: 'roipiTkx5MQqnbQo7' } }, { multi: true });
});

