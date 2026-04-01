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

function validateExport(raw, sourceLabel) {
  const errors = [];
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    errors.push(`JSON parse failed in "${sourceLabel}": ${error.message}`);
    return errors;
  }

  if (parsed?.formatName !== "dexie") {
    errors.push(`root.formatName must be "dexie" (got ${JSON.stringify(parsed?.formatName)})`);
  }
  if (parsed?.formatVersion !== 1) {
    errors.push(`root.formatVersion must be 1 (got ${JSON.stringify(parsed?.formatVersion)})`);
  }
  if (parsed?.data?.databaseName !== "chatbot-ui-v1") {
    errors.push(`root.data.databaseName must be "chatbot-ui-v1" (got ${JSON.stringify(parsed?.data?.databaseName)})`);
  }
  if (parsed?.data?.databaseVersion !== 90) {
    errors.push(`root.data.databaseVersion must be 90 (got ${JSON.stringify(parsed?.data?.databaseVersion)})`);
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

  for (const [tableName, table] of tableByName.entries()) {
    const entry = entryByName.get(tableName);
    if (!entry) {
      errors.push(`Table "${tableName}" has no matching root.data.data entry`);
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

  for (let i = 0; i < charactersEntry.rows.length; i += 1) {
    const character = charactersEntry.rows[i];

    if (!Array.isArray(character?.initialMessages)) {
      errors.push(`characters.rows[${i}].initialMessages must be an array`);
    } else {
      for (let j = 0; j < character.initialMessages.length; j += 1) {
        const msg = character.initialMessages[j];
        if (!VALID_AUTHORS.has(msg?.author)) {
          errors.push(
            `characters.rows[${i}].initialMessages[${j}].author must be one of user|ai|system (got ${JSON.stringify(
              msg?.author
            )})`
          );
        }
      }
    }

    if (!Array.isArray(character?.shortcutButtons)) {
      errors.push(`characters.rows[${i}].shortcutButtons must be an array`);
    } else {
      for (let j = 0; j < character.shortcutButtons.length; j += 1) {
        const button = character.shortcutButtons[j];
        if (!VALID_INSERTION_TYPES.has(button?.insertionType)) {
          errors.push(
            `characters.rows[${i}].shortcutButtons[${j}].insertionType must be replace|prepend|append (got ${JSON.stringify(
              button?.insertionType
            )})`
          );
        }
      }
    }

    if (typeof character?.customCode !== "string") {
      errors.push(`characters.rows[${i}].customCode must be a string`);
    } else {
      try {
        // Parse-only syntax check without execution.
        // eslint-disable-next-line no-new-func
        new Function(character.customCode);
      } catch (error) {
        errors.push(`characters.rows[${i}].customCode has invalid JavaScript syntax: ${error.message}`);
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
