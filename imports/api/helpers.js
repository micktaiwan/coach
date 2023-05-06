export function exportCollection(coll) {
	const collectionData = coll.find().fetch();
	const json = JSON.stringify(collectionData);
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const filename = `${coll._name}.json`;

	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.click();

	URL.revokeObjectURL(url);
}
