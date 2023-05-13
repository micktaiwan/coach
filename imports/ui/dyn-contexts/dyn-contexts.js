import { FlowRouter } from 'meteor/kadira:flow-router';
import { DynContexts } from '../../api/dynamicContexts/collections';
import { PrimaryContexts } from '../../api/primary-contexts/collections';

import './dyn-contexts.html';

Template.dynContexts.onCreated(function () {
  this.subscribe('dynContexts');
});

Template.dynContexts.helpers({
  dynContexts() {
    return DynContexts.find({ userId: Meteor.userId(), contextId: Session.get('contextId') }, { sort: { createdAt: 1 } });
  },
});

Template.dynContextMenu.helpers({
  activeRoute(_id) {
    return FlowRouter.getParam('_id') === _id ? 'active' : '';
  },
});

Template.dynContext.onCreated(function () {
  this.autorun(() => {
    this.subscribe('primary_contexts', Session.get('contextId'), FlowRouter.getParam('_id'));
  });
});

Template.dynContext.helpers({
  dynContext() {
    return DynContexts.findOne({ _id: FlowRouter.getParam('_id') });
  },
  primaryContexts() {
    return PrimaryContexts.find({ dynContextId: this._id }, { sort: { priority: 1 } });
  },
});
