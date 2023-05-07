export function exportCollection(collName, query) {
	
	if(!query.contextId) throw new Error('query must include contextId');

  Meteor.call('fetchCollection', collName, query, (err, collectionData) => {
    const json = JSON.stringify(collectionData);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const filename = `${collName}.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  });
}
