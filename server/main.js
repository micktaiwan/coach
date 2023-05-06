import { Meteor } from 'meteor/meteor';

// tasks
import '../imports/api/tasks/methods.js';
import '../imports/api/tasks/publish.js';
import '../imports/api/tasks/collections.js';

// primary contexts
import '../imports/api/primary-contexts/methods.js';
import '../imports/api/primary-contexts/publish.js';
import '../imports/api/primary-contexts/collections.js';

// contexts
import '../imports/api/contexts/methods.js';
import '../imports/api/contexts/publish.js';
import '../imports/api/contexts/collections.js';

// chats
import '../imports/api/chats/methods.js';
import '../imports/api/chats/publish.js';
import '../imports/api/chats/collections.js';

// settings
import '../imports/api/settings/methods.js';

// OpenAI
import '../imports/api/open-ai/methods.js';

Meteor.startup(() => {
  // code to run on server at startup

});

