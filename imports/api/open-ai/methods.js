import { Tasks } from '../tasks/collections.js';
import { PrimaryContexts } from '../primary-contexts/collections.js';
import { Chats } from '../chats/collections.js';
import { UsageStats } from './collections.js';
import _ from 'underscore';


const getSystem = contextId => {
	const list = Tasks.find({contextId}, { sort: { priority: 1 }}).map((task) => '[' + (task.priority + 1) + '] ' +
	task.text +
	' [status: ' + task.status + ']' +
	' [createdAt: ' + task.createdAt.toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' }) + ']' +
	(task.startedAt ? ' [startedAt: ' +  task.startedAt.toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' }) + ']' : '') +
	(task.doneAt ? ' [doneAt: ' + task.doneAt.toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' }) + ']' : '') 
	).join(', ');
	
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
	const today = new Date();
	const todayAsString = today.toLocaleDateString(undefined, options);

	const context = '"' + PrimaryContexts.find({contextId}, { sort: { priority: 1 }}).map((task) => '[' + (task.priority) + '] ' +
	task.text).join(", ") + '"';

	const system = 'Act as a coach. You have 30+ years of experience.\n' +
	'Today is ' + todayAsString + '.\n' +
	'Assume that the user is your client.\n' +
	'Any first person pronoun is your client speaking about himself.\n' +
	'This is all the context your client gave you:\n' +
	context + '[end of context]\n' +
	'This context is very important and must be taken into account for each reply you provide to your client.\n' +
	'This is the list of your client current tasks:"' + list + '"';
	return system;
}

Meteor.methods({

	openaiGenerateText(contextId, system, prompt) {
		check(system, String);
		check(prompt, String);

		const apiUrl = 'https://api.openai.com/v1/chat/completions';
		const apiKey = Meteor.user()?.openAI?.apiKey;
		const model = Meteor.user()?.openAI?.model || 'gpt-3.5-turbo';
		if(!apiKey) throw new Meteor.Error('no-api-key', 'No OpenAI API key found');

		if(system === '' && contextId) system = getSystem(contextId);

		const pastChats = Chats.find({contextId, role: {$ne: 'meta'}}, { sort: { createdAt: 1 }, projection: { _id: 0, role: 1, content: 1 } }).fetch();
		const messages = [
			{'role': 'system', 'content': system },
			...pastChats,
		];

		if(prompt) messages.push({'role': 'user', 'content': prompt});

		console.log('prompt:', prompt);
		console.log('messages:', messages);

		const data = {
			model,
			messages,
			temperature: 0.5,
		};
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + apiKey
		};

		let response;
		try {
			response = HTTP.post(apiUrl, {
				headers,
				data,
			});
		} catch (error) {
			throw new Meteor.Error('openai-error', error);
		}

		console.log(response.data);
		console.log(response.data.choices[0].message);

		UsageStats.insert({
			contextId,
			userId: this.userId,
			id: response.data.id,
			object: response.data.object,
			model: response.data.model,
			usage: response.data.usage,
			createdAt: new Date(),
		});

		return response.data.choices[0].message.content.trim();
	},
});
