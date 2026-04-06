#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const CANONICAL_TABLES = [
  "characters",
  "threads",
  "messages",
  "misc",
  "summaries",
  "memories",
  "lore",
  "textEmbeddingCache",
  "textCompressionCache",
];

const VALID_AUTHORS = new Set(["user", "ai", "system"]);
const VALID_INSERTION_TYPES = new Set(["replace", "prepend", "append"]);

// ---------------------------------------------------------------------------
// Type-safety helpers
// ---------------------------------------------------------------------------

/**
 * Assert a field is a finite number primitive.
 * Rejects: strings, booleans, null, undefined, NaN, Infinity, Number objects.
 */
function assertFiniteNumber(value, fieldPath, errors) {
  if (typeof value !== "number" || !isFinite(value)) {
    errors.push(
      `FAIL [${fieldPath}]: expected finite number, got ${typeof value} — value: ${JSON.stringify(value)}`
    );
  }
}

/**
 * Assert a field is a string primitive (not null, not a number).
 */
function assertString(value, fieldPath, errors) {
  if (typeof value !== "string") {
    errors.push(
      `FAIL [${fieldPath}]: expected string, got ${typeof value} — value: ${JSON.stringify(value)}`
    );
  }
}

/**
 * Assert a field is a boolean primitive (not 0/1, not "true"/"false").
 */
function assertBoolean(value, fieldPath, errors) {
  if (typeof value !== "boolean") {
    errors.push(
      `FAIL [${fieldPath}]: expected boolean, got ${typeof value} — value: ${JSON.stringify(value)}`
    );
  }
}

/**
 * Assert a field is a plain object (not null, not an array).
 */
function assertPlainObject(value, fieldPath, errors) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    errors.push(
      `FAIL [${fieldPath}]: expected plain object, got ${value === null ? "null" : Array.isArray(value) ? "array" : typeof value} — value: ${JSON.stringify(value)}`
    );
  }
}

/**
 * Assert a field is an array (not null, not omitted).
 */
function assertArray(value, fieldPath, errors) {
  if (!Array.isArray(value)) {
    errors.push(
      `FAIL [${fieldPath}]: expected array, got ${value === null ? "null" : typeof value} — value: ${JSON.stringify(value)}`
    );
  }
}

function validateExport(raw, sourceLabel) {
  const errors = [];
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    errors.push(`JSON parse failed in "${sourceLabel}": ${error.message}`);
    return errors;
  }

  // ── Root envelope ─────────────────────────────────────────────────────
  if (parsed?.formatName !== "dexie") {
    errors.push(`root.formatName must be "dexie" (got ${JSON.stringify(parsed?.formatName)})`);
  }
  if (parsed?.formatVersion !== 1) {
    errors.push(`root.formatVersion must be 1 (got ${JSON.stringify(parsed?.formatVersion)})`);
  }
  // Type-safety: formatVersion must be a number, not a string "1"
  if (parsed != null && "formatVersion" in parsed) {
    assertFiniteNumber(parsed.formatVersion, "root.formatVersion", errors);
  }
  if (parsed?.data?.databaseName !== "chatbot-ui-v1") {
    errors.push(`root.data.databaseName must be "chatbot-ui-v1" (got ${JSON.stringify(parsed?.data?.databaseName)})`);
  }
  if (parsed?.data?.databaseVersion !== 90) {
    errors.push(`root.data.databaseVersion must be 90 (got ${JSON.stringify(parsed?.data?.databaseVersion)})`);
  }
  // Type-safety: databaseVersion must be a number
  if (parsed?.data != null && "databaseVersion" in parsed.data) {
    assertFiniteNumber(parsed.data.databaseVersion, "root.data.databaseVersion", errors);
  }
  if (!Array.isArray(parsed?.data?.tables)) {
    errors.push("root.data.tables must be an array");
  }
  if (!Array.isArray(parsed?.data?.data)) {
    errors.push("root.data.data must be an array");
  }

  if (errors.length > 0) {
    return errors;
  }

  const tables = parsed.data.tables;
  const dataEntries = parsed.data.data;
  const tableByName = new Map();
  const entryByName = new Map();

  for (let i = 0; i < tables.length; i += 1) {
    const table = tables[i];
    if (!table || typeof table.name !== "string") {
      errors.push(`root.data.tables[${i}] must include string name`);
      continue;
    }
    if (tableByName.has(table.name)) {
      errors.push(`Duplicate table definition for "${table.name}" in root.data.tables`);
    } else {
      tableByName.set(table.name, table);
    }
  }

  for (let i = 0; i < dataEntries.length; i += 1) {
    const entry = dataEntries[i];
    if (!entry || typeof entry.tableName !== "string") {
      errors.push(`root.data.data[${i}] must include string tableName`);
      continue;
    }
    if (!Array.isArray(entry.rows)) {
      errors.push(`root.data.data[${i}].rows for table "${entry.tableName}" must be an array`);
      continue;
    }
    if (entryByName.has(entry.tableName)) {
      errors.push(`Duplicate data entry for table "${entry.tableName}" in root.data.data`);
    } else {
      entryByName.set(entry.tableName, entry);
    }
  }

  for (const tableName of CANONICAL_TABLES) {
    if (!tableByName.has(tableName)) {
      errors.push(`Missing canonical table "${tableName}" in root.data.tables`);
    }
    if (!entryByName.has(tableName)) {
      errors.push(`Missing data entry for canonical table "${tableName}" in root.data.data`);
    }
  }

  // ── Table / row-count consistency (with type check) ───────────────────
  for (const [tableName, table] of tableByName.entries()) {
    const entry = entryByName.get(tableName);
    if (!entry) {
      errors.push(`Table "${tableName}" has no matching root.data.data entry`);
      continue;
    }
    // rowCount must be a finite number (not a string, not NaN)
    if (typeof table.rowCount !== "number" || !isFinite(table.rowCount)) {
      errors.push(
        `FAIL [data.tables["${tableName}"].rowCount]: expected finite number, got ${typeof table.rowCount} — value: ${JSON.stringify(table.rowCount)}`
      );
      continue;
    }
    if (!Number.isInteger(table.rowCount)) {
      errors.push(`Table "${tableName}" has non-integer rowCount: ${JSON.stringify(table.rowCount)}`);
      continue;
    }
    if (table.rowCount !== entry.rows.length) {
      errors.push(
        `Table "${tableName}" rowCount mismatch: tables.rowCount=${table.rowCount}, data.rows.length=${entry.rows.length}`
      );
    }
  }

  // ── data.data entry: inbound must be boolean ──────────────────────────
  for (let i = 0; i < dataEntries.length; i += 1) {
    const entry = dataEntries[i];
    if (entry && "inbound" in entry) {
      assertBoolean(entry.inbound, `data.data[${i}].inbound`, errors);
    }
  }

  const charactersTable = tableByName.get("characters");
  const charactersEntry = entryByName.get("characters");
  if (!charactersTable || !charactersEntry) {
    errors.push("Characters table/data entry is required");
    return errors;
  }

  if (charactersTable.rowCount !== 1) {
    errors.push(`characters table rowCount must be 1 for single-bot exports (got ${charactersTable.rowCount})`);
  }
  if (charactersEntry.rows.length !== 1) {
    errors.push(
      `characters data rows length must be 1 for single-bot exports (got ${charactersEntry.rows.length})`
    );
  }

  // ── Character row type-safety checks ──────────────────────────────────
  for (let i = 0; i < charactersEntry.rows.length; i += 1) {
    const character = charactersEntry.rows[i];
    const pfx = `characters.rows[${i}]`;

    // --- String fields (checked when present) ---
    // name and roleInstruction are required
    if (character) {
      assertString(character.name, `${pfx}.name`, errors);
      assertString(character.roleInstruction, `${pfx}.roleInstruction`, errors);
    }
    // The rest are checked only when present to allow minimal fixtures
    const stringFieldsWhenPresent = [
      "reminderMessage", "modelName", "fitMessagesInContextMethod",
      "autoGenerateMemories", "folderPath",
      "generalWritingInstructions", "messageWrapperStyle",
      "imagePromptPrefix", "imagePromptSuffix", "imagePromptTriggers",
      "messageInputPlaceholder", "metaTitle", "metaDescription", "metaImage",
      "textEmbeddingModelName"
    ];
    for (const field of stringFieldsWhenPresent) {
      if (character && field in character) {
        assertString(character[field], `${pfx}.${field}`, errors);
      }
    }

    // --- Number fields (must be finite primitives) ---
    if (character && "temperature" in character) {
      assertFiniteNumber(character.temperature, `${pfx}.temperature`, errors);
    }
    if (character && "maxTokensPerMessage" in character) {
      assertFiniteNumber(character.maxTokensPerMessage, `${pfx}.maxTokensPerMessage`, errors);
    }
    if (character && "creationTime" in character) {
      assertFiniteNumber(character.creationTime, `${pfx}.creationTime`, errors);
    }
    if (character && "lastMessageTime" in character) {
      assertFiniteNumber(character.lastMessageTime, `${pfx}.lastMessageTime`, errors);
    }

    // --- Boolean fields ---
    if (character && "streamingResponse" in character) {
      assertBoolean(character.streamingResponse, `${pfx}.streamingResponse`, errors);
    }

    // --- Array fields ---
    if (character) {
      assertArray(character.initialMessages, `${pfx}.initialMessages`, errors);
      assertArray(character.shortcutButtons, `${pfx}.shortcutButtons`, errors);
    }
    if (character && "loreBookUrls" in character) {
      assertArray(character.loreBookUrls, `${pfx}.loreBookUrls`, errors);
    }

    // --- Object fields (must be plain objects, not null/array) ---
    if (character && "avatar" in character) {
      assertPlainObject(character.avatar, `${pfx}.avatar`, errors);
    }
    if (character && "scene" in character) {
      assertPlainObject(character.scene, `${pfx}.scene`, errors);
    }
    if (character && "userCharacter" in character) {
      assertPlainObject(character.userCharacter, `${pfx}.userCharacter`, errors);
    }
    if (character && "systemCharacter" in character) {
      assertPlainObject(character.systemCharacter, `${pfx}.systemCharacter`, errors);
    }
    if (character && "customData" in character) {
      assertPlainObject(character.customData, `${pfx}.customData`, errors);
    }

    // --- initialMessages deep checks ---
    if (Array.isArray(character?.initialMessages)) {
      for (let j = 0; j < character.initialMessages.length; j += 1) {
        const msg = character.initialMessages[j];
        const msgPfx = `${pfx}.initialMessages[${j}]`;
        if (!VALID_AUTHORS.has(msg?.author)) {
          errors.push(
            `${msgPfx}.author must be one of user|ai|system (got ${JSON.stringify(msg?.author)})`
          );
        }
        if (msg && typeof msg.content !== "string") {
          errors.push(
            `FAIL [${msgPfx}.content]: expected string, got ${typeof msg.content} — value: ${JSON.stringify(msg.content)}`
          );
        }
        // hiddenFrom must be an array if present
        if (msg && "hiddenFrom" in msg && !Array.isArray(msg.hiddenFrom)) {
          errors.push(
            `FAIL [${msgPfx}.hiddenFrom]: expected array, got ${typeof msg.hiddenFrom} — value: ${JSON.stringify(msg.hiddenFrom)}`
          );
        }
        // expectsReply must be boolean if present
        if (msg && "expectsReply" in msg) {
          assertBoolean(msg.expectsReply, `${msgPfx}.expectsReply`, errors);
        }
      }
    }

    // --- shortcutButtons deep checks ---
    if (Array.isArray(character?.shortcutButtons)) {
      for (let j = 0; j < character.shortcutButtons.length; j += 1) {
        const button = character.shortcutButtons[j];
        const btnPfx = `${pfx}.shortcutButtons[${j}]`;
        if (!VALID_INSERTION_TYPES.has(button?.insertionType)) {
          errors.push(
            `${btnPfx}.insertionType must be replace|prepend|append (got ${JSON.stringify(button?.insertionType)})`
          );
        }
        if (button && typeof button.name !== "string") {
          errors.push(
            `FAIL [${btnPfx}.name]: expected string, got ${typeof button.name} — value: ${JSON.stringify(button.name)}`
          );
        }
        if (button && typeof button.message !== "string") {
          errors.push(
            `FAIL [${btnPfx}.message]: expected string, got ${typeof button.message} — value: ${JSON.stringify(button.message)}`
          );
        }
        if (button && "autoSend" in button) {
          assertBoolean(button.autoSend, `${btnPfx}.autoSend`, errors);
        }
        if (button && "clearAfterSend" in button) {
          assertBoolean(button.clearAfterSend, `${btnPfx}.clearAfterSend`, errors);
        }
      }
    }

    // --- customCode ---
    if (typeof character?.customCode !== "string") {
      errors.push(`${pfx}.customCode must be a string`);
    } else {
      try {
        // Parse-only syntax check without execution.
        // eslint-disable-next-line no-new-func
        new Function(character.customCode);
      } catch (error) {
        errors.push(`${pfx}.customCode has invalid JavaScript syntax: ${error.message}`);
      }
    }
  }

  return errors;
}

function main() {
  const targetPath = process.argv[2];
  if (!targetPath) {
    console.error("Usage: node scripts/validate-perchance-export.js <path-to-export.json>");
    process.exit(2);
  }

  const absolutePath = path.resolve(targetPath);
  let raw;
  try {
    raw = fs.readFileSync(absolutePath, "utf8");
  } catch (error) {
    console.error(`ERROR: failed to read file "${absolutePath}": ${error.message}`);
    process.exit(2);
  }

  const errors = validateExport(raw, absolutePath);
  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`ERROR: ${error}`);
    }
    process.exit(1);
  }

  console.log(`OK: ${absolutePath}`);
}

if (require.main === module) {
  main();
}

module.exports = { validateExport };
