import { DynContexts } from '../../api/dynamicContexts/collections';
import './dyn-contexts.html';

Template.dynContexts.onCreated(function () {
  this.subscribe('dynContexts');
});

Template.dynContexts.helpers({
  dynContexts () {
    return DynContexts.find();
  },

});


Template.dynContextMenu.helpers({
  activeRoute(route) {
    return FlowRouter.getRouteName() === route;
  },
});
