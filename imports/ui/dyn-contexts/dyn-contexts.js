import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { DynContexts } from '../../api/dynamicContexts/collections';
import { PrimaryContexts } from '../../api/primary-contexts/collections';

import './dyn-contexts.html';

Template.dynContexts.onCreated(function () {
  this.subscribe('dynContexts');
});

Template.dynContexts.helpers({
  dynContexts() {
    return DynContexts.find({ userId: Meteor.userId() }, { sort: { createdAt: 1 } });
  },
});

Template.dynContextMenu.helpers({
  activeRoute(_id) {
    return FlowRouter.getParam('_id') === _id ? 'active' : '';
  },
});

Template.dynContext.onCreated(function () {
  this.autorun(() => {
    this.subscribe('primary_contexts', Session.get('contextId'), this.data.data?._id);
  });
});

Template.dynContext.helpers({
  primaryContexts() {
    // console.log('primaryContexts', this.data._id);
    return PrimaryContexts.find({ dynContextId: this.data._id }, { sort: { priority: 1 } });
  },
});
