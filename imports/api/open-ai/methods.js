import { Tasks } from '../tasks/collections.js';
import { Contexts } from '../contexts/collections.js';
import { Chats } from '../chats/collections.js';
import _ from 'underscore';

export const UsageStats = new Mongo.Collection('usage_stats');

function getSystem() {
	const list = Tasks.find({}, { sort: { priority: 1 }}).map((task) => '[' + (task.priority + 1) + '] ' +
	task.text +
	' [status: ' + task.status + ']' +
	' [createdAt: ' + task.createdAt.toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' }) + ']' +
	(task.startedAt ? ' [startedAt: ' +  task.startedAt.toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' }) + ']' : '') +
	(task.doneAt ? ' [doneAt: ' + task.doneAt.toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' }) + ']' : '') 
	).join(', ');
	
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
	const today = new Date();
	const todayAsString = today.toLocaleDateString(undefined, options);

	const context = '"' + Contexts.find({}, { sort: { priority: 1 }}).map((task) => '[' + (task.priority + 1) + '] ' +
	task.text).join(", ") + '"';

	const system = 'Act as a coach. You have 30+ years of experience.\n' +
	'Today is ' + todayAsString + '.\n' +
	'When asked something, assume that it is your client speaking.\n' +
	'So any first person pronoun is your client speaking about himself.\n' +
	'This is all the context your client gave you:\n' +
	context + '[end of context]\n' +
	'This context is very important and must be taken into account for each reply you provide to your client.\n' +
	'When replying, you can be verbose and justify your answer based on your experience and your client given context.\n' +
	'This is the list of your client current tasks:"' + list + '"\n';

	return system;
}


Meteor.methods({

	openaiGenerateText(system, prompt) {
		check(system, String);
		check(prompt, String);

		if(system === '') system = getSystem();

		console.log('system:', system);
		console.log('prompt:', prompt);

		const apiUrl = 'https://api.openai.com/v1/chat/completions';
		const apiKey = Meteor.user()?.openAI.apiKey;		

		const pastChats = Chats.find({}, { sort: { createdAt: 1 }, projection: { _id: 0, role: 1, content: 1 } }).fetch();
		const messages = [
			{'role': 'system', 'content': system },
			...pastChats,
			{'role': 'user', 'content': prompt },
		];

		const requestBody = {
			model: 'gpt-3.5-turbo',
			messages,
			temperature: 0,
		};
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + apiKey
		};

		const response = HTTP.post(apiUrl, {
			headers: headers,
			data: requestBody
		});

		console.log(response.data);
		console.log(response.data.choices[0].message);

		UsageStats.insert({
			id: response.data.id,
			object: response.data.object,
			model: response.data.model,
			usage: response.data.usage,
			createdAt: new Date(),
		});

		return response.data.choices[0].message.content.trim();
	},

	getUsageStats() {
		console.log(UsageStats.findOne({}, { sort: { createdAt: -1 } }));
		return UsageStats.findOne({}, { sort: { createdAt: -1 } });
	}
});
