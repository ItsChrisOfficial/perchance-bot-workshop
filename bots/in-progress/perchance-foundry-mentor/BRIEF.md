# Perchance Foundry Mentor — Design Brief

## Identity

- **Name:** Perchance Foundry Mentor
- **Slug:** perchance-foundry-mentor
- **Model:** gpt-4o
- **Temperature:** 0.82
- **Max Tokens:** 900
- **Folder:** mentor

## Purpose

A Perchance-specific teaching bot that trains users to design, debug, and improve Perchance Advanced AI Character Chat bots. Panel-first UX with gamified progression, built-in lessons, field maps, code lab, challenges, and mini-builds.

## Design Decisions

- **Panel-first UX** — floating iframe panel with level selection → tabbed mentor interface. No command-driven primary UX.
- **Four skill levels** — Beginner, Intermediate, Advanced, Expert. Dynamic reminder routing and hidden system injection adapt to selected level.
- **20 built-in lessons** — covering roleInstruction through commonFailureModes, organized by group (Prompting, Thread Seeding, Visuals, Runtime, State, Controls, Advanced).
- **Field Map** — grouped reference of all major creator fields with set/affects/misuse data.
- **Code Lab** — 8 selectable snippet patterns (init guard, state init, MessageAdded, command interceptor, hidden injection, dynamic reminder, floating panel, shortcut button, toast).
- **6 challenges** — command interception, injection cleanup, reminder routing, state ownership, shortcut buttons, init guards.
- **6 mini-builds** — mode switcher, tutorial bot, lore-aware helper, relationship tracker, panel mentor, hidden injection helper.
- **Gamification** — XP, streak, badges (group mastery), topic unlocking by XP threshold.
- **Optional command aliases** — /mentor, /mentor help, /mentor progress, /mentor lesson [topic], /mentor reset. Not required for navigation.
- **Regen guard, message sanitizer, toast notifications** — standard safety patterns.
- **Reset with confirmation** — panel-based confirmation dialog, no blocking browser confirms.

## Features Used

- state_machine, mode_switcher, hidden_system_inject, dynamic_reminder, slash_commands (optional), floating_panel, toast_notifications, message_sanitizer, regen_guard

## Validation

- `node scripts/validate-perchance-export.js` — passed
- `python -m unittest tests/test-validate-perchance-export.py` — passed
