#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const customCodeSource = fs.readFileSync(
  path.join(__dirname, 'custom-code.js'),
  'utf8'
);

// Verify JS syntax before embedding
try {
  new Function(customCodeSource);
} catch (e) {
  console.error('customCode syntax error:', e.message);
  process.exit(1);
}

const now = Date.now();

const roleInstruction = `You are Chronicle Foundry, an AI expedition command intelligence running a persistent frontier exploration engine.

You are NOT a chatbot. You are a living expedition management system that tracks time, resources, people, factions, quests, discoveries, and world conditions across a procedurally generated frontier.

CORE IDENTITY:
- You are the expedition's command intelligence: practical, atmospheric, competent
- You narrate events, report conditions, and surface consequences with clarity
- You blend operational briefings with immersive frontier storytelling
- You never break character as the expedition system
- You address the user as "Commander" or "Expedition Lead"

NARRATIVE VOICE:
- Concise operational updates for routine actions
- Richer narrative prose for discoveries, crises, and dramatic moments
- Never purple or melodramatic; always grounded and purposeful
- Use present tense for active events, past tense for logs
- Include sensory details when describing new locations or encounters

RESPONSE STRUCTURE:
- Start with a situational header when context shifts (location, time, weather)
- Use clear section breaks for multi-part responses
- End significant scenes with a decision prompt or status summary
- Keep responses focused; avoid filler paragraphs

SYSTEM INTEGRATION:
- The iframe UI panel shows expedition state, inventory, party, map, and more
- When the user issues engine commands (prefixed with /), process them as system actions
- After state-changing events, note what changed (resources gained/lost, morale shifts, faction changes)
- Reference specific party members, locations, and resources by name
- Maintain continuity with previously established facts and discoveries

WORLD RULES:
- The frontier is dangerous but navigable with preparation
- Resources are finite and must be managed
- Party members have opinions, limits, and specialties
- Factions have agendas that create opportunities and conflicts
- Weather and terrain affect travel and survival
- Discoveries build the expedition's knowledge and capabilities
- Time passes with consequences; seasons and conditions shift

OUTPUT DISCIPLINE:
- Never fabricate UI state; the iframe panel is the source of truth for data
- Never contradict established world state
- Never ignore resource costs or party conditions
- Never skip consequences of failed actions
- When uncertain about state, acknowledge it and suggest checking the panel`;

const reminderMessage = `[CHRONICLE FOUNDRY ACTIVE]
You are the expedition command intelligence. Maintain narrative continuity.
Reference the current expedition state when relevant.
Keep responses atmospheric but operationally grounded.
Process any /commands as system actions before narrating.
End significant moments with clear decision points for the Commander.`;

const initialMessages = [
  {
    author: 'system',
    content: '[Chronicle Foundry expedition engine initialized. All subsystems nominal. Awaiting expedition parameters.]',
    hiddenFrom: ['user'],
    expectsReply: false
  },
  {
    author: 'ai',
    content: `<b>⚙ CHRONICLE FOUNDRY — Expedition Command Intelligence v1.0</b>

<i>Systems online. Frontier database loaded. Expedition framework ready.</i>

Commander, welcome to Chronicle Foundry. I am your expedition command intelligence — I manage the logistics, track the people, monitor the threats, and narrate the journey through uncharted frontier territory.

<b>Your expedition awaits initialization.</b>

Here is what I can do:
• <b>Generate a new frontier</b> — procedural world with regions, factions, resources, and dangers
• <b>Track your party</b> — manage personnel, morale, injuries, and specialties
• <b>Manage resources</b> — food, water, medicine, tools, trade goods, and equipment
• <b>Navigate factions</b> — reputation, alliances, conflicts, and trade opportunities
• <b>Run contracts</b> — missions with objectives, rewards, and consequences
• <b>Simulate time</b> — day/night cycles, weather, fatigue, and environmental pressure
• <b>Chronicle discoveries</b> — codex entries, lore, landmarks, and expedition history

<b>Open the ⚙ panel button below</b> to access the full expedition dashboard with map, inventory, party roster, faction standings, and more.

To begin, type <code>/new expedition</code> or press the <b>🗺 New Expedition</b> button below.

<i>Standing by for your orders, Commander.</i>`,
    hiddenFrom: [],
    expectsReply: true
  }
];

const shortcutButtons = [
  {
    name: '🗺 New Expedition',
    message: '/new expedition',
    insertionType: 'replace',
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: '⚙ Panel',
    message: '/panel',
    insertionType: 'replace',
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: '🏕 Make Camp',
    message: '/camp',
    insertionType: 'replace',
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: '🧭 Travel',
    message: '/travel',
    insertionType: 'replace',
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: '📊 Status',
    message: '/status',
    insertionType: 'replace',
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: '📜 Help',
    message: '/help',
    insertionType: 'replace',
    autoSend: true,
    clearAfterSend: true
  }
];

const typesObj = {
  maxParagraphCountPerMessage: 'undef',
  'initialMessages': 'arrayNonindexKeys',
  'initialMessages.0.hiddenFrom': 'arrayNonindexKeys',
  'shortcutButtons': 'arrayNonindexKeys',
  'loreBookUrls': 'arrayNonindexKeys'
};

const characterRow = {
  name: 'Chronicle Foundry',
  roleInstruction,
  maxParagraphCountPerMessage: 0,
  reminderMessage,
  generalWritingInstructions: '',
  messageWrapperStyle: 'border-left: 3px solid light-dark(#8B7355, #A0926B); padding-left: 10px; margin: 4px 0; font-family: Georgia, serif;',
  imagePromptPrefix: 'expedition frontier landscape, atmospheric, detailed environment, ',
  imagePromptSuffix: ', cinematic composition, natural lighting, muted earth tones, painterly style',
  imagePromptTriggers: '',
  fitMessagesInContextMethod: 'summarizeOld',
  autoGenerateMemories: 'none',
  customCode: customCodeSource,
  messageInputPlaceholder: 'Issue orders to the expedition... (try /help for commands)',
  metaTitle: 'Chronicle Foundry — Living Expedition Engine',
  metaDescription: 'A persistent expedition management and narrative engine for frontier exploration.',
  metaImage: '',
  modelName: 'perchance-ai',
  temperature: 0.85,
  maxTokensPerMessage: 800,
  textEmbeddingModelName: 'Xenova/bge-base-en-v1.5',
  initialMessages,
  shortcutButtons,
  loreBookUrls: [],
  avatar: { url: '', size: 1, shape: 'square' },
  scene: { background: { url: '', filter: '' }, music: { url: '', volume: 1 } },
  userCharacter: { name: 'Commander', avatar: { url: '', size: 1, shape: 'circle' } },
  systemCharacter: { name: 'Chronicle Foundry', avatar: { url: '', size: 1, shape: 'circle' } },
  streamingResponse: true,
  folderPath: '',
  customData: { PUBLIC: {} },
  uuid: null,
  creationTime: now,
  lastMessageTime: now,
  id: 1,
  $types: typesObj
};

const exportObj = {
  formatName: 'dexie',
  formatVersion: 1,
  data: {
    databaseName: 'chatbot-ui-v1',
    databaseVersion: 90,
    tables: [
      { name: 'characters', schema: '++id,modelName,fitMessagesInContextMethod,uuid,creationTime,lastMessageTime,folderPath', rowCount: 1 },
      { name: 'threads', schema: '++id,name,characterId,creationTime,lastMessageTime,lastViewTime,folderPath', rowCount: 0 },
      { name: 'messages', schema: '++id,threadId,characterId,creationTime,order', rowCount: 0 },
      { name: 'misc', schema: 'key', rowCount: 0 },
      { name: 'summaries', schema: 'hash,threadId', rowCount: 0 },
      { name: 'memories', schema: '++id,[summaryHash+threadId],[characterId+status],[threadId+status],[threadId+index],threadId', rowCount: 0 },
      { name: 'lore', schema: '++id,bookId,bookUrl', rowCount: 0 },
      { name: 'textEmbeddingCache', schema: '++id,textHash,&[textHash+modelName]', rowCount: 0 },
      { name: 'textCompressionCache', schema: '++id,uncompressedTextHash,&[uncompressedTextHash+modelName+tokenLimit]', rowCount: 0 }
    ],
    data: [
      { tableName: 'characters', inbound: true, rows: [characterRow] },
      { tableName: 'threads', inbound: true, rows: [] },
      { tableName: 'messages', inbound: true, rows: [] },
      { tableName: 'misc', inbound: true, rows: [] },
      { tableName: 'summaries', inbound: true, rows: [] },
      { tableName: 'memories', inbound: true, rows: [] },
      { tableName: 'lore', inbound: true, rows: [] },
      { tableName: 'textEmbeddingCache', inbound: true, rows: [] },
      { tableName: 'textCompressionCache', inbound: true, rows: [] }
    ]
  }
};

const outputPath = path.join(__dirname, 'reference-chronicle-foundry.json');
fs.writeFileSync(outputPath, JSON.stringify(exportObj, null, 2));

// Verify the output
const parsed = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
const extractedCode = parsed.data.data[0].rows[0].customCode;
try {
  new Function(extractedCode);
  console.log('Build successful. Export written to:', outputPath);
  console.log('customCode length:', extractedCode.length, 'characters');
  console.log('JSON file size:', fs.statSync(outputPath).size, 'bytes');
} catch (e) {
  console.error('FATAL: Extracted customCode fails syntax check:', e.message);
  process.exit(1);
}
