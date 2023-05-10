import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { DynContexts } from '../imports/api/dynamicContexts/collections';

const route = name => FlowRouter.route(`/${name}`, {
  name,
  action () {
    BlazeLayout.render('layout', { main: name });
  },
});

FlowRouter.route('/', {
  name: 'home',
  action () {
    BlazeLayout.render('layout', { main: 'home' });
  },
});


FlowRouter.route('/dyn-contexts/:_id', {
  name: 'dynContexts',
  action (params) {
    const data = DynContexts.findOne(params._id);
    BlazeLayout.render('layout', { main: 'dynContext', data });
  },
});


route('contexts');
route('tasks');
route('settings');
