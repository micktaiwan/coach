# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.
``

Repository overview
- Stack: Meteor (client/server, Blaze templates), JavaScript, MongoDB (via Meteor collections).
- App domains: tasks, primary contexts, dynamic contexts, chats, OpenAI usage stats.
- Integrations:
  - OpenAI (chat completions, embeddings) via server methods in imports/api/open-ai/methods.js
  - Pinecone vector store (imports/api/pinecone/pinecone.js) for semantic context retrieval by contextId namespace
  - Slack webhook + event ingestion via server/routes.js and imports/api/slack/methods.js
- Routing/UI: FlowRouter + BlazeLayout (client/routes.js) renders templates inside client/layout/layout.html. Session('contextId') selects the active “environment.”
- Publications/Methods: Each domain under imports/api/<domain> defines collections.js, publish.js and methods.js, imported by server/main.js. Client subscribes per-view and interacts via Meteor.call.

Common commands
- Install dependencies
  - npm install
- Start the app (development)
  - npm start
  - This runs: meteor run --settings settings.json
- Run tests once (headless)
  - npm test
  - This runs: meteor test --once --driver-package meteortesting:mocha
- Run full-app tests in watch mode
  - npm run test-app
  - This runs: TEST_WATCH=1 meteor test --full-app --driver-package meteortesting:mocha
- Run a single test by pattern (Mocha grep)
  - MOCHA_GREP="server is not client" meteor test --once --driver-package meteortesting:mocha
- Lint (ESLint with Airbnb base + Meteor plugin)
  - npx eslint . --ext .js
- Bundle analysis (production bundle visualizer)
  - npm run visualize

Required settings (settings.json)
The app expects a settings file for server-side integrations. Create settings.json at the repo root before npm start if you want OpenAI/Pinecone/Slack features enabled. Minimal structure derived from code:

```json path=null start=null
{
  "openAI": {
    "apiKey": "{{OPENAI_API_KEY}}"
  },
  "pinecone": {
    "key": "{{PINECONE_API_KEY}}",
    "environment": "{{PINECONE_ENV}}"
  },
  "slack": {
    "webhook": "{{SLACK_WEBHOOK_URL}}",
    "botToken": "{{SLACK_BOT_TOKEN}}"
  }
}
```

Notes
- Users can set their own OpenAI API key and model via the Settings UI; server methods will fall back to Meteor.settings.openAI.apiKey if a user key is not present.
- Pinecone index name is hardcoded to "coach-index" and each user/environment uses a namespace equal to the contextId. Methods automatically upsert/update vectors as tasks and primary contexts change.
- Slack integration exposes an HTTP handler at /slack (server/routes.js). Incoming events are filtered and processed in imports/api/slack/methods.js.

High-level architecture
- Entry points
  - Client: client/main.js imports UI components, registers helpers, wires subscriptions for the active context, and composes the layout and routes.
  - Server: server/main.js imports all domain collections/pubs/methods, registers HTTP handlers, and starts the app.
  - Tests: tests/main.js (Mocha via meteortesting:mocha).
- Data model and flows
  - Collections: tasks, primary_contexts, dyn_contexts, contexts, chats, usage_stats. Each has publish.js to expose only the current user’s data and methods.js for mutations.
  - Context selection: Session('contextId') drives which data the UI subscribes to and scopes Pinecone namespaces for retrieval.
  - Chat flow: Client inserts a user chat and calls openaiGenerateText. The server builds a system prompt optionally enriched by Pinecone matches for the current context, calls OpenAI Chat Completions, persists usage stats, and the client inserts the assistant reply.
  - Task/context management: SortableJS enables drag-reordering with priority persisted via methods. Edits propagate to Pinecone via pinecone.update.
  - OpenAI embeddings: openaiEmbed produces vectors stored/upserted into Pinecone under the active contextId namespace; used to build retrieval-augmented prompts.
  - Slack: /slack endpoint ingests channel messages that mention the bot, uses Pinecone for context, generates a reply via OpenAI, and posts back via webhook; chats are mirrored to the local Chats collection under contextId "slack".
- UI structure (Blaze)
  - client/layout contains the shell and navigation. Views live under imports/ui/<domain> with paired .html/.js. Key screens: home (chat + usage stats), tasks, contexts (primary), dynamic contexts, settings, login.

Repository conventions
- ESLint config is in .eslintrc.js using @babel/eslint-parser, airbnb-base, and meteor plugin; import/no-unresolved and several stylistic rules are relaxed to fit Meteor and template usage.
- The Meteor main modules are configured in package.json under the "meteor" key (client/main.js, server/main.js, and tests/main.js).

