// Frontier Foundry Final - Compiled Artifact Builder
// Compiles the Phase 3 final release into a properly structured,
// validated export artifact with all known field-type corrections.
//
// Run: node build-final.js
//
// Input:  ../frontier_foundry_1.3/frontier_foundry_1.3.json  (Phase 3 Final)
// Output: frontier-foundry-final-v2.0.0.json

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// 1. Load Phase 3 as the canonical source
// ---------------------------------------------------------------------------

const phase3Path = path.join(
  __dirname,
  '../frontier_foundry_1.3/frontier_foundry_1.3.json'
);
const phase3 = JSON.parse(fs.readFileSync(phase3Path, 'utf8'));

// Deep-clone so the source file is never mutated
const final = JSON.parse(JSON.stringify(phase3));

// ---------------------------------------------------------------------------
// 2. Patch metadata for the compiled release
// ---------------------------------------------------------------------------

const characterRow = final.data.data[0].rows[0];

characterRow.name = 'Chronicle Foundry v2.0 Final';
characterRow.uuid = `frontier-foundry-final-v2-${Date.now()}`;
characterRow.creationTime = Date.now();
characterRow.lastMessageTime = Date.now();

// Update customData to reflect compiled status
characterRow.customData = {
  PUBLIC: {
    schema_version: '2.0.0-final',
    bot_phase: 'compiled_final_release',
    source_phases: ['1.1', '1.2', '1.3'],
    capabilities: [
      'full_ui_application',
      'advanced_party_npc_system',
      'relationship_dynamics',
      'faction_consequences',
      'contract_branching',
      'event_cooldown_system',
      'scene_orchestration',
      'ai_response_shaping',
      'image_prompt_workflow',
      'debug_inspection',
      'state_rollback',
      'action_gating',
      'save_restore'
    ]
  }
};

// ---------------------------------------------------------------------------
// 3. Fix known field-type issues
// ---------------------------------------------------------------------------

// imagePromptTriggers must be a string per EXPORT_FIELD_REFERENCE.md §6,
// not an array (the Phase 3 build set it as an array).
if (Array.isArray(characterRow.imagePromptTriggers)) {
  characterRow.imagePromptTriggers = characterRow.imagePromptTriggers.join(', ');
}

// Ensure imagePromptTriggers is always a string
if (typeof characterRow.imagePromptTriggers !== 'string') {
  characterRow.imagePromptTriggers = '';
}

// ---------------------------------------------------------------------------
// 4. Validate structural invariants before writing
// ---------------------------------------------------------------------------

function assert(condition, msg) {
  if (!condition) {
    console.error('ASSERTION FAILED:', msg);
    process.exit(1);
  }
}

// Export envelope
assert(final.formatName === 'dexie', 'formatName must be "dexie"');
assert(final.formatVersion === 1, 'formatVersion must be 1');
assert(final.data.databaseName === 'chatbot-ui-v1', 'databaseName mismatch');

// Tables
const tableNames = final.data.tables.map(t => t.name);
const requiredTables = [
  'characters', 'threads', 'messages', 'misc',
  'summaries', 'memories', 'lore',
  'textEmbeddingCache', 'textCompressionCache'
];
requiredTables.forEach(name => {
  assert(tableNames.includes(name), `Missing required table: ${name}`);
});

// rowCount consistency
final.data.tables.forEach(table => {
  const dataEntry = final.data.data.find(d => d.tableName === table.name);
  assert(dataEntry, `Missing data entry for table: ${table.name}`);
  assert(
    dataEntry.rows.length === table.rowCount,
    `rowCount mismatch for ${table.name}: schema says ${table.rowCount}, data has ${dataEntry.rows.length}`
  );
});

// Character row field types
assert(typeof characterRow.name === 'string', 'name must be string');
assert(typeof characterRow.roleInstruction === 'string', 'roleInstruction must be string');
assert(typeof characterRow.customCode === 'string', 'customCode must be string');
assert(typeof characterRow.reminderMessage === 'string', 'reminderMessage must be string');
assert(typeof characterRow.imagePromptTriggers === 'string', 'imagePromptTriggers must be string');
assert(Array.isArray(characterRow.initialMessages), 'initialMessages must be array');
assert(Array.isArray(characterRow.shortcutButtons), 'shortcutButtons must be array');

// Initial message validation
characterRow.initialMessages.forEach((msg, i) => {
  assert(typeof msg.content === 'string', `initialMessages[${i}].content must be string`);
  assert(
    ['user', 'ai', 'system'].includes(msg.author),
    `initialMessages[${i}].author must be user/ai/system`
  );
  if (msg.hiddenFrom !== undefined) {
    assert(Array.isArray(msg.hiddenFrom), `initialMessages[${i}].hiddenFrom must be array`);
  }
  if (msg.expectsReply !== undefined) {
    assert(typeof msg.expectsReply === 'boolean', `initialMessages[${i}].expectsReply must be boolean`);
  }
});

// Shortcut button validation
characterRow.shortcutButtons.forEach((btn, i) => {
  assert(typeof btn.name === 'string', `shortcutButtons[${i}].name must be string`);
  assert(typeof btn.message === 'string', `shortcutButtons[${i}].message must be string`);
  assert(
    ['replace', 'prepend', 'append'].includes(btn.insertionType),
    `shortcutButtons[${i}].insertionType must be replace/prepend/append`
  );
  assert(typeof btn.autoSend === 'boolean', `shortcutButtons[${i}].autoSend must be boolean`);
  assert(typeof btn.clearAfterSend === 'boolean', `shortcutButtons[${i}].clearAfterSend must be boolean`);
});

// customCode JS parse check
try {
  new Function(characterRow.customCode);
} catch (e) {
  console.error('customCode is not valid JavaScript:', e.message);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 5. Write the compiled artifact
// ---------------------------------------------------------------------------

const outputPath = path.join(__dirname, 'frontier-foundry-final-v2.0.0.json');
fs.writeFileSync(outputPath, JSON.stringify(final, null, 2), 'utf8');

const stats = {
  output: outputPath,
  schema: '2.0.0-final',
  customCodeLength: characterRow.customCode.length,
  shortcutButtons: characterRow.shortcutButtons.length,
  initialMessages: characterRow.initialMessages.length,
  capabilities: characterRow.customData.PUBLIC.capabilities.length,
  fileSizeKB: Math.round(fs.statSync(outputPath).size / 1024)
};

console.log('✓ Frontier Foundry Final compiled successfully');
console.log(`  Output: ${stats.output}`);
console.log(`  Schema: ${stats.schema}`);
console.log(`  CustomCode: ${stats.customCodeLength} chars`);
console.log(`  Buttons: ${stats.shortcutButtons}`);
console.log(`  Messages: ${stats.initialMessages}`);
console.log(`  Capabilities: ${stats.capabilities}`);
console.log(`  File size: ${stats.fileSizeKB} KB`);
console.log('\nAll structural assertions passed.');
console.log('Source phases: 1.1 → 1.2 → 1.3 → Final v2.0.0');
