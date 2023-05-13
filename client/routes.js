import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { DynContexts } from '../imports/api/dynamicContexts/collections';

import '/imports/api/users/client/login.js';

const route = name => FlowRouter.route(`/${name}`, {
  name,
  action() {
    BlazeLayout.render('layout', { main: name });
  },
});

FlowRouter.route('/', {
  name: 'home',
  action() {
    if (!Meteor.userId()) return FlowRouter.go('/login');
    BlazeLayout.render('layout', { main: 'home' });
  },
});

let dynContextHandle;
FlowRouter.route('/dyn-contexts/:_id', {
  name: 'dynContexts',
  action(params) {
    if (dynContextHandle) dynContextHandle.stop();
    dynContextHandle = Meteor.subscribe('dynContexts', params._id, () => {
      const data = DynContexts.findOne(params._id);
      BlazeLayout.render('layout', { main: 'dynContext', data });
    });
  },
});

FlowRouter.route('/login', {
  name: 'login',
  // waitOn() {
  //   // Wait for index.js load over the wire
  //   return import('/imports/api/users/client/login.js');
  // },
  action() {
    BlazeLayout.render('layout', { main: 'login' });
  },
});

route('contexts');
route('tasks');
route('settings');
