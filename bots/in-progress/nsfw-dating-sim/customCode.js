(() => {
  const cd = oc.thread.customData;

  const FEMALE_CHARS = [
    { id: "yuki", name: "Yuki Frostmere", archetype: "Ice Mage", personality: "tsundere", location: "castle", bodyType: "ultrapetite_youthful", imageKeywords: "yuki frostmere ice mage silver hair blue eyes ultrapetite youthful tiny frame delicate features pale skin elegant robes" },
    { id: "aria", name: "Aria Hearthbloom", archetype: "Healer", personality: "gentle nurturing", location: "inn", bodyType: "plump_busty", imageKeywords: "aria hearthbloom healer pink hair green eyes plump busty full figured soft generous curves warm smile white robes glowing hands" },
    { id: "sakura", name: "Sakura Windstep", archetype: "Ninja", personality: "energetic playful", location: "forest", bodyType: "lithe_athletic", imageKeywords: "sakura windstep ninja cherry blossom pink hair ponytail lithe athletic toned slender compact build red eyes agile" },
    { id: "luna", name: "Luna Darkmoore", archetype: "Dark Mage", personality: "mysterious seductive", location: "dungeon", bodyType: "curvy_hourglass", imageKeywords: "luna darkmoore dark mage purple hair violet eyes curvy hourglass figure full bust seductive pale skin dark robes alluring" },
    { id: "hana", name: "Hana Goldleaf", archetype: "Merchant", personality: "cheerful bubbly", location: "market", bodyType: "chubby_plussize", imageKeywords: "hana goldleaf merchant orange hair amber eyes chubby plus size round soft full figured bright smile merchant apron cheerful" },
    { id: "mei", name: "Mei Silverscript", archetype: "Scholar", personality: "bookworm intellectual", location: "castle", bodyType: "elfin_willowy", imageKeywords: "mei silverscript scholar blue hair glasses elfin slender willowy tall graceful pointed ears spectacles scrolls pensive intelligent" },
    { id: "rei", name: "Rei Ironheart", archetype: "Warrior", personality: "stoic honorable", location: "training_grounds", bodyType: "muscular_toned", imageKeywords: "rei ironheart warrior red hair determined armor muscular toned powerful athletic strong defined build battle-ready fierce" }
  ];

  const MALE_CHARS = [
    { id: "kael", name: "Kael Embervane", archetype: "Fire Warrior", personality: "passionate bold", location: "training_grounds", imageKeywords: "kael embervane fire warrior red hair heavily muscular broad powerful chest flame tattoos passionate intense battle-hardened" },
    { id: "zeph", name: "Zeph Galewing", archetype: "Wind Dancer", personality: "flirtatious charming", location: "market", imageKeywords: "zeph galewing wind dancer teal hair lean dancer build lithe flexible graceful handsome charming smile breezy outfit" },
    { id: "orion", name: "Orion Shadowcloak", archetype: "Dark Knight", personality: "brooding mysterious", location: "dungeon", imageKeywords: "orion shadowcloak dark knight silver hair tall imposing broad-shouldered dark armor brooding intense violet eyes mysterious" },
    { id: "sol", name: "Sol Brightmane", archetype: "Paladin", personality: "kind noble", location: "castle", imageKeywords: "sol brightmane paladin golden hair athletic toned build radiant armor kind eyes noble gentle glowing holy" },
    { id: "ash", name: "Ash Quickfingers", archetype: "Rogue", personality: "playful mischievous", location: "inn", imageKeywords: "ash quickfingers rogue dark hair wiry slim compact nimble playful smirk leather gear daggers agile" },
    { id: "dex", name: "Dex Inksworth", archetype: "Scholar", personality: "nerdy enthusiastic", location: "castle", imageKeywords: "dex inksworth scholar brown hair lanky slender tall awkward build glasses eager enthusiastic studious books quill" },
    { id: "rex", name: "Rex Stonecrusher", archetype: "Berserker", personality: "fierce loyal", location: "forest", imageKeywords: "rex stonecrusher berserker white hair hulking massive huge barrel-chested thick neck scarred war paint primal fierce" }
  ];

  const LOCATIONS = {
    town_square: { name: "Town Square", desc: "The bustling heart of Eryndel, where all roads meet beneath the ancient Moonveil Spire. Merchants call, children laugh, and adventurers plot their next move." },
    market: { name: "Market District", desc: "A labyrinth of stalls and canopies heavy with exotic goods. The air smells of spices, leather, and distant magic. The shop is open here." },
    inn: { name: "The Cozy Inn", desc: "Warm firelight and the scent of roasting meat. Travelers share tables and stories here. A lute player fills the air with melancholy ballads." },
    forest: { name: "Whispering Forest", desc: "Ancient trees whose roots remember old wars. Strange lights drift between trunks at dusk. Danger and wonder lurk in equal measure." },
    castle: { name: "Moonveil Castle", desc: "A grand fortress of pale stone and silver banners. Scholars fill its libraries, guards patrol its halls, and secrets hide in its lower vaults." },
    dungeon: { name: "Shadow Dungeon", desc: "A subterranean labyrinth of damp stone and flickering torchlight. Creatures of the dark hold dominion here. Only the brave descend willingly." },
    training_grounds: { name: "Training Grounds", desc: "An open yard of packed earth and wooden dummies. The clash of steel rings out from dawn to dusk. Warriors of every discipline hone their craft." }
  };

  const SHOP_ITEMS = {
    health_potion: { name: "Health Potion", cost: 20, desc: "Restores vitality." },
    mana_potion: { name: "Mana Potion", cost: 25, desc: "Restores magical energy." },
    rose: { name: "Rose", cost: 10, desc: "A romantic gift (+5 affection).", affectionBonus: 5 },
    enchanted_gem: { name: "Enchanted Gem", cost: 50, desc: "Rare gift (+15 affection).", affectionBonus: 15 },
    leather_armor: { name: "Leather Armor", cost: 80, desc: "+2 defense.", stat: { path: "combat.defense", val: 2 } },
    iron_sword: { name: "Iron Sword", cost: 100, desc: "+3 strength.", stat: { path: "combat.strength", val: 3 } },
    spellbook: { name: "Spellbook", cost: 120, desc: "+3 spellpower.", stat: { path: "magic.spellpower", val: 3 } }
  };

  const MAIN_QUESTS = [
    { id: "mq1", title: "Echoes of the Rift", desc: "Investigate the strange tremors shaking Eryndel. Seek clues in the Shadow Dungeon and Whispering Forest.", type: "main", characterId: null, completed: false, progress: 0, goal: 3 },
    { id: "mq2", title: "The Shattered Seal", desc: "Seven ancient seals once imprisoned the Void King. Three have already broken. Find the remaining four keepers.", type: "main", characterId: null, completed: false, progress: 0, goal: 4 },
    { id: "mq3", title: "United Hearts, Unyielding Realm", desc: "Win the trust and alliance of all seven companions. Only together can you face the Void King's return.", type: "main", characterId: null, completed: false, progress: 0, goal: 7 }
  ];

  function buildSideQuests(chars) {
    return [
      { id: "sq_" + chars[0].id, title: chars[0].name + "'s Trial", desc: "Help " + chars[0].name + " overcome a personal challenge tied to their past.", type: "side", characterId: chars[0].id, completed: false, progress: 0, goal: 2 },
      { id: "sq_" + chars[1].id, title: chars[1].name + "'s Secret", desc: "Uncover a hidden truth that " + chars[1].name + " has never shared with anyone.", type: "side", characterId: chars[1].id, completed: false, progress: 0, goal: 2 },
      { id: "sq_" + chars[2].id, title: chars[2].name + "'s Mission", desc: "Assist " + chars[2].name + " in completing a dangerous task they've been delaying.", type: "side", characterId: chars[2].id, completed: false, progress: 0, goal: 2 },
      { id: "sq_" + chars[3].id, title: chars[3].name + "'s Darkness", desc: "Help " + chars[3].name + " confront the shadows threatening to consume them.", type: "side", characterId: chars[3].id, completed: false, progress: 0, goal: 2 },
      { id: "sq_" + chars[4].id, title: chars[4].name + "'s Dream", desc: "Support " + chars[4].name + " in achieving a long-held ambition.", type: "side", characterId: chars[4].id, completed: false, progress: 0, goal: 2 },
      { id: "sq_" + chars[5].id, title: chars[5].name + "'s Discovery", desc: "Join " + chars[5].name + " in investigating an ancient mystery.", type: "side", characterId: chars[5].id, completed: false, progress: 0, goal: 2 },
      { id: "sq_" + chars[6].id, title: chars[6].name + "'s Honor", desc: "Stand beside " + chars[6].name + " when their reputation is put on the line.", type: "side", characterId: chars[6].id, completed: false, progress: 0, goal: 2 }
    ];
  }

  function buildStoryline(chars, playerName) {
    const c = chars;
    const pn = playerName || "the Traveler";
    return `THE REALM OF ERYNDEL — CHRONICLES OF THE VOID KING'S RETURN

WORLD OVERVIEW
Eryndel is a land of ancient magic and turbulent politics, where the scars of the First Void War still mark both landscape and soul. Three thousand years ago, the Void King Malachar tore open a rift between worlds, unleashing creatures of pure entropy upon the realm. Seven legendary heroes sacrificed everything to seal him away — each embedding a fragment of their soul into a Binding Seal hidden across the land. Now those seals are crumbling, and Malachar stirs once more.

${pn} arrives in Eryndel as a stranger with no memory of how they came to be there, only a strange mark on their hand — the Traveler's Brand — which glows faintly near the Binding Seals. Fate, it seems, has chosen them.

THE MAGIC SYSTEM
Magic in Eryndel flows from the Aetheric Weave — an invisible lattice of energy that permeates all living things. Practitioners draw from three disciplines: Arcane (raw spellpower for offensive and utility magic), Sacred (healing and protective light), and Shadow (manipulation, illusion, and entropy magic). Combat veterans channel a fourth discipline, Battle Resonance, which amplifies physical strikes with raw will. Skills grow through experience, practice, and emotional bonds.

THE THREE FACTIONS
The Crown — guardians of order under Queen Elara IV, they patrol Moonveil Castle and the realm's roads. They fear what the returning rift means for stability and would rather contain the problem than solve it. ${c[5].name} serves as a Crown Scholar, documenting anomalies.

The Shadows — a secretive network operating from the Shadow Dungeon and the city's underworld. They have studied the Void for generations and possess dangerous knowledge. ${c[3].name} walks the line between their agenda and personal freedom.

The Seekers — an ancient order of wandering truth-hunters, bound by no crown. They believe the only way to defeat Malachar is to reunite the seven soul-fragments. ${c[0].name} is the last known Seeker elder.

THE SEVEN COMPANIONS
${c[0].name} (${c[0].archetype}): Pride and pain run deep in ${c[0].name}. As a ${c[0].archetype} stationed at ${LOCATIONS[c[0].location].name}, they have built walls around themselves as impenetrable as their magic. Their backstory is one of loss — a mentor destroyed by the Void — and their tsundere exterior conceals fierce loyalty. They hold the key to the first Binding Seal's location.

${c[1].name} (${c[1].archetype}): Kind to a fault, ${c[1].name} operates from ${LOCATIONS[c[1].location].name}, tending to the wounded and the weary. Their ${c[1].personality} nature hides a devastating secret: their healing power is linked to one of the fractured seals. Every time they heal, the seal weakens slightly. They don't know yet.

${c[2].name} (${c[2].archetype}): ${c[2].name} arrived in Eryndel three months ago chasing a rumor of legendary training grounds in the ${LOCATIONS[c[2].location].name}. ${c[2].personality} by nature, they seem carefree — but they carry an encrypted message intended for the Seekers that they haven't been able to decode.

${c[3].name} (${c[3].archetype}): Dwelling in the depths of ${LOCATIONS[c[3].location].name}, ${c[3].name} is sought out by those who need power at a price. Their ${c[3].personality} demeanor is no act — they genuinely walk the razor's edge between light and shadow, and they have seen Malachar's face in visions.

${c[4].name} (${c[4].archetype}): Running the most successful stall in ${LOCATIONS[c[4].location].name}, ${c[4].name} seems purely motivated by profit. In truth, they are funneling money to the Seekers and have been gathering rare components needed to reinforce the weakening seals. Their ${c[4].personality} personality is genuine — joy is their armor.

${c[5].name} (${c[5].archetype}): Found in ${LOCATIONS[c[5].location].name} surrounded by scrolls and star charts, ${c[5].name} is the foremost authority on Aetheric Weave theory. Their ${c[5].personality} obsession has led them to a terrifying conclusion: the seals will all fail within one lunar cycle unless something radical is done. They haven't told the Crown yet.

${c[6].name} (${c[6].archetype}): The finest fighter at ${LOCATIONS[c[6].location].name}, ${c[6].name} trains others and asks little in return. Their ${c[6].personality} code of honor is absolute — which makes it all the more painful that they once served Malachar, long ago, before they broke free. That secret could destroy them.

THE THREE MAIN QUESTS

Quest One — Echoes of the Rift: The ground trembles. Strange creatures emerge from cracks in the earth near the Shadow Dungeon and deep in the Whispering Forest. ${pn} must investigate, gathering evidence and speaking with ${c[3].name} and ${c[2].name} to understand what is destabilizing the earth. The trail leads to a minor seal already shattered beneath the forest floor.

Quest Two — The Shattered Seal: With the evidence gathered, ${c[5].name} confirms the worst: the seals are failing. Four remain intact, each guarded by one of the companions (${c[0].name}, ${c[1].name}, ${c[3].name}, and ${c[6].name}). ${pn} must earn each guardian's trust to reach and temporarily reinforce their seal, buying the realm time.

Quest Three — United Hearts, Unyielding Realm: Malachar cannot be re-sealed by force alone. The ritual requires the willing sacrifice of emotional bonds — the companions must collectively channel their feelings for ${pn} into a single act of unified will. Every relationship built matters. Every heart touched becomes a weapon against the void.

THE ECONOMY OF ERYNDEL
Gold flows from Crown taxes, Seeker donations, and merchant trade. ${c[4].name}'s market stall is the safest place to spend coin. Rare items sometimes appear when affection with a companion is high. The Shadow network trades in favors as often as gold.

SKILLS AND GROWTH
The Traveler's Brand responds to experience. Combat training at the ${LOCATIONS.training_grounds.name} sharpens Strength, Defense, and Speed. Social bonds at the ${LOCATIONS.inn.name} and ${LOCATIONS.market.name} deepen Charm, Persuasion, and Empathy. Magical study in the ${LOCATIONS.castle.name} and ${LOCATIONS.dungeon.name} builds Spellpower, Resistance, and Mana. Every choice shapes who ${pn} becomes — and who they can face at the final hour.`;
  }

  function initGame(gender, playerName, playerDesc) {
    const chars = gender === "male" ? MALE_CHARS : FEMALE_CHARS;
    cd.game = {
      initialized: true,
      gender,
      playerName: playerName || "Traveler",
      location: "town_square",
      gold: 100,
      xp: 0,
      level: 1,
      xpToNext: 100,
      inventory: [],
      activeCharacterId: null,
      skills: {
        combat: { strength: 1, defense: 1, speed: 1 },
        social: { charm: 1, persuasion: 1, empathy: 1 },
        magic: { spellpower: 1, resistance: 1, mana: 1 }
      },
      quests: [...MAIN_QUESTS.map(q => ({ ...q })), ...buildSideQuests(chars)],
      characters: Object.fromEntries(chars.map(ch => [ch.id, { affection: 0, met: false, currentLocation: ch.location, dialogueStage: 0, questProgress: 0 }])),
      storyline: buildStoryline(chars, playerName).substring(0, 12500)
    };

    oc.userCharacter.name = cd.game.playerName;
    oc.userCharacter.roleInstruction = playerDesc || "An adventurer who has arrived in Eryndel seeking purpose.";

    const kws = chars.map(ch => ch.imageKeywords);
    kws.push("adventurer traveler human portrait fantasy outfit determined eyes");
    oc.character.imagePromptKeywords = kws;

    updateReminder();
    updateShortcutButtons();
  }

  function getActiveChars() {
    return (cd.game?.gender === "male" ? MALE_CHARS : FEMALE_CHARS);
  }

  function getChar(id) {
    return getActiveChars().find(ch => ch.id === id);
  }

  function updateReminder() {
    const g = cd.game;
    if (!g) return;
    const locName = LOCATIONS[g.location]?.name || g.location;
    const activeQ = g.quests.filter(q => !q.completed && q.progress > 0);
    const qLine = activeQ.length ? activeQ.map(q => q.title + " (" + q.progress + "/" + q.goal + ")").join(", ") : "None active";
    const charLine = g.activeCharacterId ? (getChar(g.activeCharacterId)?.name || "Unknown") : "None";
    oc.character.reminderMessage = `[GAME STATE]\nPlayer: ${g.playerName} | Location: ${locName} | Gold: ${g.gold} | Level: ${g.level} | XP: ${g.xp}/${g.xpToNext}\nActive Quests: ${qLine}\nCurrent Character: ${charLine}\nStoryline Context: ${g.storyline ? g.storyline.substring(0, 300) + "..." : "Not generated"}\nUse /help for all commands. Narrate immersively in second person.`;
  }

  function updateShortcutButtons() {
    oc.thread.shortcutButtons = [
      { name: "Status", message: "/status", insertionType: "replace", autoSend: true, clearAfterSend: false },
      { name: "Inventory", message: "/inventory", insertionType: "replace", autoSend: true, clearAfterSend: false },
      { name: "Skills", message: "/skills", insertionType: "replace", autoSend: true, clearAfterSend: false },
      { name: "Quest Log", message: "/quests", insertionType: "replace", autoSend: true, clearAfterSend: false },
      { name: "Explore", message: "/explore", insertionType: "replace", autoSend: true, clearAfterSend: false },
      { name: "Shop", message: "/shop", insertionType: "replace", autoSend: true, clearAfterSend: false },
      { name: "Characters", message: "/chars", insertionType: "replace", autoSend: true, clearAfterSend: false },
      { name: "Help", message: "/help", insertionType: "replace", autoSend: true, clearAfterSend: false }
    ];
  }

  function awardXP(amount) {
    const g = cd.game;
    g.xp += amount;
    while (g.xp >= g.xpToNext) {
      g.xp -= g.xpToNext;
      g.level++;
      g.xpToNext = Math.floor(g.xpToNext * 1.5);
    }
  }

  function detectActiveChar(text) {
    const chars = getActiveChars();
    const lower = text.toLowerCase();
    for (const ch of chars) {
      const parts = ch.name.toLowerCase().split(" ");
      if (parts.some(p => lower.includes(p)) || lower.includes(ch.id)) {
        return ch;
      }
    }
    return null;
  }

  function handleCommand(msg) {
    const g = cd.game;
    const text = msg.content.trim();
    const parts = text.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const spliceMsg = () => {
      const idx = oc.thread.messages.indexOf(msg);
      if (idx !== -1) oc.thread.messages.splice(idx, 1);
    };

    if (cmd === "/status") {
      spliceMsg();
      const locName = LOCATIONS[g.location]?.name || g.location;
      oc.thread.messages.push({ author: "system", content: `📊 **Status — ${g.playerName}**\nLevel: ${g.level} | XP: ${g.xp}/${g.xpToNext}\nGold: ${g.gold} | Location: ${locName}\nQuests completed: ${g.quests.filter(q => q.completed).length}/${g.quests.length}` });
      return true;
    }

    if (cmd === "/inventory") {
      spliceMsg();
      const inv = g.inventory;
      const txt = inv.length ? inv.map(i => "• " + i).join("\n") : "Your pack is empty.";
      oc.thread.messages.push({ author: "system", content: `🎒 **Inventory**\n${txt}` });
      return true;
    }

    if (cmd === "/skills") {
      spliceMsg();
      const sk = g.skills;
      oc.thread.messages.push({ author: "system", content: `⚔️ **Skills**\n**Combat:** Strength ${sk.combat.strength} | Defense ${sk.combat.defense} | Speed ${sk.combat.speed}\n**Social:** Charm ${sk.social.charm} | Persuasion ${sk.social.persuasion} | Empathy ${sk.social.empathy}\n**Magic:** Spellpower ${sk.magic.spellpower} | Resistance ${sk.magic.resistance} | Mana ${sk.magic.mana}` });
      return true;
    }

    if (cmd === "/quests") {
      spliceMsg();
      const lines = g.quests.map(q => `${q.completed ? "✅" : "🔲"} [${q.type === "main" ? "MAIN" : "SIDE"}] **${q.title}** (${q.progress}/${q.goal})\n   ${q.desc}`);
      oc.thread.messages.push({ author: "system", content: `📜 **Quest Log**\n${lines.join("\n")}` });
      return true;
    }

    if (cmd === "/explore") {
      spliceMsg();
      const loc = LOCATIONS[g.location];
      const chars = getActiveChars().filter(ch => g.characters[ch.id]?.currentLocation === g.location);
      const charList = chars.length ? chars.map(c => `• ${c.name} (${c.archetype})`).join("\n") : "No companions here right now.";
      oc.thread.messages.push({ author: "system", content: `🗺️ **${loc.name}**\n${loc.desc}\n\n**Present:**\n${charList}` });
      return true;
    }

    if (cmd === "/go") {
      spliceMsg();
      const dest = args[0]?.toLowerCase();
      if (!dest || !LOCATIONS[dest]) {
        const locs = Object.entries(LOCATIONS).map(([k, v]) => `• ${k} — ${v.name}`).join("\n");
        oc.thread.messages.push({ author: "system", content: `🧭 **Locations:**\n${locs}\nUsage: /go <location_id>` });
      } else {
        g.location = dest;
        updateReminder();
        oc.thread.messages.push({ author: "system", content: `🚶 You travel to **${LOCATIONS[dest].name}**.` });
      }
      return true;
    }

    if (cmd === "/shop") {
      spliceMsg();
      if (g.location !== "market") {
        oc.thread.messages.push({ author: "system", content: "🏪 The shop is only available in the **Market District**. Use `/go market` to travel there." });
        return true;
      }
      const lines = Object.entries(SHOP_ITEMS).map(([k, v]) => `• **${v.name}** — ${v.cost}g — ${v.desc} (id: \`${k}\`)`);
      oc.thread.messages.push({ author: "system", content: `🏪 **Shop** (Your gold: ${g.gold}g)\n${lines.join("\n")}\nUse /buy <item_id> to purchase.` });
      return true;
    }

    if (cmd === "/buy") {
      spliceMsg();
      if (g.location !== "market") {
        oc.thread.messages.push({ author: "system", content: "🏪 You must be in the **Market District** to buy items." });
        return true;
      }
      const itemId = args[0]?.toLowerCase();
      const item = SHOP_ITEMS[itemId];
      if (!item) {
        oc.thread.messages.push({ author: "system", content: "❌ Unknown item. Use /shop to see available items." });
        return true;
      }
      if (g.gold < item.cost) {
        oc.thread.messages.push({ author: "system", content: `❌ Not enough gold. You have ${g.gold}g but **${item.name}** costs ${item.cost}g.` });
        return true;
      }
      g.gold -= item.cost;
      g.inventory.push(item.name);
      if (item.stat) {
        const [cat, stat] = item.stat.path.split(".");
        g.skills[cat][stat] += item.stat.val;
      }
      updateReminder();
      oc.thread.messages.push({ author: "system", content: `✅ Purchased **${item.name}** for ${item.cost}g. Remaining gold: ${g.gold}g.` });
      return true;
    }

    if (cmd === "/talk") {
      spliceMsg();
      const charId = args[0]?.toLowerCase();
      const ch = getChar(charId);
      if (!ch) {
        oc.thread.messages.push({ author: "system", content: "❓ Unknown character. Use /chars to see the roster." });
        return true;
      }
      const charState = g.characters[charId];
      if (charState.currentLocation !== g.location) {
        oc.thread.messages.push({ author: "system", content: `${ch.name} is not here. They are at **${LOCATIONS[charState.currentLocation]?.name || charState.currentLocation}**. Use /go to travel there.` });
        return true;
      }
      charState.met = true;
      g.activeCharacterId = charId;
      const kwIdx = getActiveChars().findIndex(c => c.id === charId);
      if (kwIdx !== -1 && oc.character.imagePromptKeywords?.length > 0) {
        oc.character.imagePromptKeywords[0] = ch.imageKeywords;
      }
      updateReminder();
      oc.thread.messages.push({ author: "system", content: `💬 You approach **${ch.name}** (${ch.archetype}). Affection: ${charState.affection} | Dialogue stage: ${charState.dialogueStage}.` });
      return true;
    }

    if (cmd === "/gift") {
      spliceMsg();
      const charId = args[0]?.toLowerCase();
      const ch = getChar(charId);
      if (!ch) {
        oc.thread.messages.push({ author: "system", content: "❓ Unknown character. Use /chars to see the roster." });
        return true;
      }
      const giftItems = g.inventory.filter(i => {
        const key = Object.keys(SHOP_ITEMS).find(k => SHOP_ITEMS[k].name === i);
        return key && SHOP_ITEMS[key].affectionBonus;
      });
      if (giftItems.length === 0) {
        oc.thread.messages.push({ author: "system", content: "🎁 You have no gift items. Buy a Rose or Enchanted Gem from the shop." });
        return true;
      }
      const giftName = giftItems[0];
      const giftKey = Object.keys(SHOP_ITEMS).find(k => SHOP_ITEMS[k].name === giftName);
      const bonus = SHOP_ITEMS[giftKey].affectionBonus;
      const idxInv = g.inventory.indexOf(giftName);
      g.inventory.splice(idxInv, 1);
      g.characters[charId].affection += bonus;
      updateReminder();
      oc.thread.messages.push({ author: "system", content: `🎁 You give **${giftName}** to **${ch.name}**. Affection +${bonus} → ${g.characters[charId].affection}.` });
      return true;
    }

    if (cmd === "/chars") {
      spliceMsg();
      const chars = getActiveChars();
      const lines = chars.map(ch => {
        const st = g.characters[ch.id];
        const locName = LOCATIONS[st.currentLocation]?.name || st.currentLocation;
        return `• **${ch.name}** (${ch.archetype}) — ${locName} | Affection: ${st.affection} | Met: ${st.met ? "Yes" : "No"}`;
      });
      oc.thread.messages.push({ author: "system", content: `👥 **Characters**\n${lines.join("\n")}` });
      return true;
    }

    if (cmd === "/help") {
      spliceMsg();
      oc.thread.messages.push({ author: "system", content: `📖 **Commands**\n/status — player stats\n/inventory — items you carry\n/skills — skill levels\n/quests — quest log\n/explore — describe current location\n/go <location> — travel\n/shop — browse items (market only)\n/buy <item> — purchase item (market only)\n/talk <charId> — speak with a companion\n/gift <charId> — give a gift item\n/chars — all companions and locations\n/help — this list` });
      return true;
    }

    return false;
  }

  function showOpeningUI() {
    oc.window.show();
    document.body.style.cssText = "margin:0;padding:0;font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#1a0a2e,#2d1b4e);color:#e8d5ff;min-height:100vh;display:flex;align-items:center;justify-content:center;";
    document.body.innerHTML = `<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(200,150,255,0.3);border-radius:16px;padding:32px;max-width:480px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.5);">
<h1 style="text-align:center;font-size:1.6em;color:#d4a0ff;margin-bottom:4px;">⚔️ Realm of Eryndel</h1>
<p style="text-align:center;color:#b088cc;font-size:0.85em;margin-bottom:24px;">NSFW Dating Sim — Character Setup</p>
<label style="display:block;margin-bottom:6px;font-size:0.9em;color:#c9a8ee;">Romance characters of gender:</label>
<select id="genderSel" style="width:100%;padding:10px;border-radius:8px;background:#2a1540;border:1px solid #7a4faa;color:#e8d5ff;font-size:1em;margin-bottom:16px;">
  <option value="female">Female</option>
  <option value="male">Male</option>
</select>
<label style="display:block;margin-bottom:6px;font-size:0.9em;color:#c9a8ee;">Your name:</label>
<input id="nameInp" type="text" placeholder="Enter your name..." style="width:100%;padding:10px;border-radius:8px;background:#2a1540;border:1px solid #7a4faa;color:#e8d5ff;font-size:1em;margin-bottom:16px;box-sizing:border-box;" />
<label style="display:block;margin-bottom:6px;font-size:0.9em;color:#c9a8ee;">Describe yourself (appearance, personality):</label>
<textarea id="descInp" placeholder="I am..." rows="4" style="width:100%;padding:10px;border-radius:8px;background:#2a1540;border:1px solid #7a4faa;color:#e8d5ff;font-size:1em;margin-bottom:20px;box-sizing:border-box;resize:vertical;"></textarea>
<button id="startBtn" style="width:100%;padding:14px;border-radius:10px;background:linear-gradient(135deg,#7a2d9e,#4a1570);border:none;color:#fff;font-size:1.1em;cursor:pointer;font-weight:bold;letter-spacing:0.05em;">✨ Start Adventure</button>
</div>`;
    document.getElementById("startBtn").addEventListener("click", () => {
      const gender = document.getElementById("genderSel").value;
      const name = document.getElementById("nameInp").value.trim() || "Traveler";
      const desc = document.getElementById("descInp").value.trim() || "An adventurer who has arrived in Eryndel seeking purpose.";
      initGame(gender, name, desc);
      oc.window.hide();
      document.body.innerHTML = "";
    });
  }

  if (!cd.game?.initialized) {
    showOpeningUI();
  } else {
    updateReminder();
    updateShortcutButtons();
  }

  oc.thread.on("MessageAdded", async ({ message }) => {
    if (!cd.game?.initialized) return;
    const g = cd.game;
    const text = message.content?.trim() || "";

    if (text.startsWith("/")) {
      handleCommand(message);
      return;
    }

    awardXP(10);

    const detected = detectActiveChar(text);
    if (detected) {
      g.activeCharacterId = detected.id;
      const kws = getActiveChars();
      const idx = kws.findIndex(c => c.id === detected.id);
      if (idx !== -1 && oc.character.imagePromptKeywords?.length > 0) {
        oc.character.imagePromptKeywords[0] = detected.imageKeywords;
      }
      if (!g.characters[detected.id].met) {
        g.characters[detected.id].met = true;
      }
    }

    updateReminder();
  });
})();
