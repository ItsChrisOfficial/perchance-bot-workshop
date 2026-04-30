(() => {
  const cd = oc.thread.customData;

  const FEMALE_CHARS = [
    { id: "yuki", name: "Yuki Frostmere", archetype: "Ice Mage", personality: "tsundere", location: "castle", bodyType: "ultrapetite_youthful", imageKeywords: "yuki frostmere ice mage silver hair blue eyes ultrapetite youthful tiny frame delicate features pale skin elegant robes" },
    { id: "aria", name: "Aria Hearthbloom", archetype: "Healer", personality: "gentle nurturing", location: "inn", bodyType: "plump_busty", imageKeywords: "aria hearthbloom healer pink hair green eyes plump busty full figured soft generous curves warm smile white robes glowing hands" },
    { id: "sakura", name: "Sakura Windstep", archetype: "Ninja", personality: "energetic playful", location: "forest", bodyType: "lithe_athletic", imageKeywords: "sakura windstep ninja cherry blossom pink hair ponytail lithe athletic toned slender compact build red eyes agile" },
    { id: "luna", name: "Luna Darkmoore", archetype: "Dark Mage", personality: "mysterious seductive", location: "dungeon", bodyType: "curvy_hourglass", imageKeywords: "luna darkmoore dark mage purple hair violet eyes curvy hourglass figure full bust seductive pale skin dark robes alluring" },
    { id: "hana", name: "Hana Goldleaf", archetype: "Merchant", personality: "cheerful bubbly", location: "market", bodyType: "chubby_plussize", imageKeywords: "hana goldleaf merchant orange hair amber eyes chubby plus size round soft full figured bright smile merchant apron cheerful" },
    { id: "mei", name: "Mei Silverscript", archetype: "Scholar", personality: "bookworm intellectual", location: "castle", bodyType: "elfin_willowy", imageKeywords: "mei silverscript scholar blue hair glasses elfin slender willowy tall graceful pointed ears spectacles scrolls pensive intelligent" },
    { id: "rei", name: "Rei Ironheart", archetype: "Warrior", personality: "stoic honorable", location: "training_grounds", bodyType: "muscular_toned", imageKeywords: "rei ironheart warrior red hair determined armor muscular toned powerful athletic strong defined build battle-ready fierce" },
    { id: "kira", name: "Kira Stonemark", archetype: "Guard Captain", personality: "no-nonsense direct", location: "training_grounds", bodyType: "tomboy_masculine", imageKeywords: "kira stonemark guard captain short auburn hair androgynous athletic broad-shouldered tomboy masculine no-frills practical armor cropped determined jaw strong" }
  ];

  const MALE_CHARS = [
    { id: "kael", name: "Kael Embervane", archetype: "Fire Warrior", personality: "passionate bold", location: "training_grounds", bodyType: "heavily_muscular", imageKeywords: "kael embervane fire warrior red hair heavily muscular broad powerful chest flame tattoos passionate intense battle-hardened" },
    { id: "zeph", name: "Zeph Galewing", archetype: "Wind Dancer", personality: "flirtatious charming", location: "market", bodyType: "lean_dancer", imageKeywords: "zeph galewing wind dancer teal hair lean dancer build lithe flexible graceful handsome charming smile breezy outfit" },
    { id: "orion", name: "Orion Shadowcloak", archetype: "Dark Knight", personality: "brooding mysterious", location: "dungeon", bodyType: "tall_imposing", imageKeywords: "orion shadowcloak dark knight silver hair tall imposing broad-shouldered dark armor brooding intense violet eyes mysterious" },
    { id: "sol", name: "Sol Brightmane", archetype: "Paladin", personality: "kind noble", location: "castle", bodyType: "athletic_toned", imageKeywords: "sol brightmane paladin golden hair athletic toned build radiant armor kind eyes noble gentle glowing holy" },
    { id: "ash", name: "Ash Quickfingers", archetype: "Rogue", personality: "playful mischievous", location: "inn", bodyType: "wiry_slim", imageKeywords: "ash quickfingers rogue dark hair wiry slim compact nimble playful smirk leather gear daggers agile" },
    { id: "dex", name: "Dex Inksworth", archetype: "Scholar", personality: "nerdy enthusiastic", location: "castle", bodyType: "lanky_slender", imageKeywords: "dex inksworth scholar brown hair lanky slender tall awkward build glasses eager enthusiastic studious books quill" },
    { id: "rex", name: "Rex Stonecrusher", archetype: "Berserker", personality: "fierce loyal", location: "forest", bodyType: "hulking_massive", imageKeywords: "rex stonecrusher berserker white hair hulking massive huge barrel-chested thick neck scarred war paint primal fierce" },
    { id: "lys", name: "Lys Silkwhisper", archetype: "Enchanter", personality: "gentle coy", location: "inn", bodyType: "femboy_feminine", imageKeywords: "lys silkwhisper enchanter long silver hair androgynous feminine femboy slender delicate features graceful soft flowy pastel robes gentle coy ethereal" }
  ];

  const BODY_TYPES = {
    female: [
      { id: "ultrapetite_youthful", label: "Ultrapetite / Youthful", emoji: "🌸", desc: "Tiny frame, delicate features" },
      { id: "plump_busty",          label: "Plump & Busty",          emoji: "🍑", desc: "Full figured, generous curves" },
      { id: "lithe_athletic",       label: "Lithe & Athletic",       emoji: "⚡", desc: "Toned, slender, compact" },
      { id: "curvy_hourglass",      label: "Curvy / Hourglass",      emoji: "🌙", desc: "Full bust, seductive curves" },
      { id: "chubby_plussize",      label: "Chubby / Plus-Size",     emoji: "🌻", desc: "Round, soft, full figured" },
      { id: "elfin_willowy",        label: "Elfin / Willowy",        emoji: "✨", desc: "Tall, slender, graceful" },
      { id: "muscular_toned",       label: "Muscular & Toned",       emoji: "⚔️", desc: "Powerful, defined build" },
      { id: "tomboy_masculine",     label: "Tomboy / Masculine",     emoji: "🪖", desc: "Athletic, androgynous, no-frills" }
    ],
    male: [
      { id: "heavily_muscular", label: "Heavily Muscular",   emoji: "💪", desc: "Broad, powerful chest" },
      { id: "lean_dancer",      label: "Lean & Graceful",    emoji: "🌬️", desc: "Lithe, flexible, dancer build" },
      { id: "tall_imposing",    label: "Tall & Imposing",    emoji: "🌑", desc: "Broad-shouldered, commanding" },
      { id: "athletic_toned",   label: "Athletic & Toned",   emoji: "☀️", desc: "Balanced, paladin physique" },
      { id: "wiry_slim",        label: "Wiry & Slim",        emoji: "🗡️", desc: "Compact, nimble, quick" },
      { id: "lanky_slender",    label: "Lanky & Slender",    emoji: "📚", desc: "Tall, awkward, bookish frame" },
      { id: "hulking_massive",  label: "Hulking & Massive",  emoji: "🪨", desc: "Barrel-chested, primal" },
      { id: "femboy_feminine",  label: "Femboy / Feminine",  emoji: "🌺", desc: "Slender, androgynous, graceful" }
    ]
  };

  // ── Kink consent registry — 36 entries, 3 columns × 12 rows ─────────────────
  // All kinks start unchecked (opt-in). Unchecked = strictly prohibited in story.
  const KINKS = [
    // row 1
    { id: "feet",               label: "Foot Fetish / Feet",          emoji: "🦶", desc: "Foot worship, toe sucking, foot play" },
    { id: "bondage",            label: "Bondage",                      emoji: "⛓️", desc: "Restraints, ropes, cuffs, restriction" },
    { id: "knifeplay",          label: "Knifeplay",                    emoji: "🔪", desc: "Sensation play involving blades (consensual only)" },
    // row 2
    { id: "cnc",                label: "CNC",                          emoji: "🎭", desc: "Consensually negotiated non-consent role-play" },
    { id: "cuckolding",         label: "Cuckolding",                   emoji: "♟️", desc: "Partner watching, third-party involvement scenarios" },
    { id: "ntr",                label: "NTR / Netorare",               emoji: "💔", desc: "Infidelity or partner sharing scenarios" },
    // row 3
    { id: "petplay",            label: "Petplay",                      emoji: "🐾", desc: "Animal role-play (kitten, pup, bunny, etc.)" },
    { id: "fisting",            label: "Fisting",                      emoji: "✊", desc: "Hand/fist penetration play" },
    { id: "prolapse",           label: "Prolapse",                     emoji: "🌹", desc: "Rectal or vaginal prolapse scenarios" },
    // row 4
    { id: "exhibitionism",      label: "Exhibitionism",                emoji: "👁️", desc: "Public exposure, being watched scenarios" },
    { id: "strapons",           label: "Strap-Ons",                    emoji: "🔩", desc: "Harness and dildo play" },
    { id: "rimming",            label: "Rimming / Analingus",          emoji: "💋", desc: "Oral-anal stimulation" },
    // row 5
    { id: "pegging",            label: "Pegging",                      emoji: "🔄", desc: "Female-on-male anal strap-on play" },
    { id: "ddlg",               label: "DDlg / CG-l Dynamic",         emoji: "🍼", desc: "Caregiver/little dynamic (all participants are adults)" },
    { id: "anal",               label: "Anal Sex",                     emoji: "🔥", desc: "Anal penetration and play" },
    // row 6
    { id: "mutual_masturbation",label: "Mutual Masturbation",          emoji: "🤝", desc: "Simultaneous self-pleasure between partners" },
    { id: "piss",               label: "Watersports / Piss",           emoji: "💦", desc: "Urine play, golden showers" },
    { id: "scat",               label: "Scat / Coprophilia",           emoji: "💩", desc: "Fecal matter play scenarios" },
    // row 7
    { id: "vomit",              label: "Emetophilia / Vomit",          emoji: "🤮", desc: "Vomit-related play scenarios" },
    { id: "futa",               label: "Futanari / Futa",              emoji: "⚧️", desc: "Hermaphrodite/dual-sex characters" },
    { id: "transgender",        label: "Transgender / Trans",          emoji: "🏳️‍⚧️", desc: "Trans character scenarios and identities" },
    // row 8
    { id: "gaping",             label: "Gaping",                       emoji: "🕳️", desc: "Extreme dilation and gaping scenarios" },
    { id: "spanking",           label: "Spanking / Impact Play",       emoji: "🖐️", desc: "Consensual striking for pleasure" },
    { id: "voyeurism",          label: "Voyeurism",                    emoji: "🔭", desc: "Watching others engage in sexual activity" },
    // row 9
    { id: "orgasm_denial",      label: "Orgasm Denial / Edging",       emoji: "⏳", desc: "Withholding or delaying orgasm" },
    { id: "humiliation",        label: "Humiliation / Degradation",    emoji: "😳", desc: "Consensual verbal and emotional degradation" },
    { id: "lactation",          label: "Lactation",                    emoji: "🥛", desc: "Breast milk and nursing scenarios" },
    // row 10
    { id: "wax_play",           label: "Wax / Temperature Play",       emoji: "🕯️", desc: "Hot wax, ice, and sensation temperature play" },
    { id: "somnophilia",        label: "Somnophilia / Sleep Play",     emoji: "😴", desc: "Consensually negotiated sleep play scenarios" },
    { id: "inflation",          label: "Inflation / Expansion",        emoji: "🎈", desc: "Body inflation and expansion scenarios" },
    // row 11
    { id: "breeding",           label: "Breeding / Impregnation",      emoji: "🌱", desc: "Impregnation and breeding scenarios" },
    { id: "group_sex",          label: "Group Sex / Orgy",             emoji: "🎉", desc: "Threesomes, foursomes, and orgy scenarios" },
    { id: "choking",            label: "Choking / Breath Play",        emoji: "🫁", desc: "Consensual breath restriction play" },
    // row 12
    { id: "tentacles",          label: "Tentacle Play",                emoji: "🐙", desc: "Tentacle-based fantasy penetration scenarios" },
    { id: "size_kink",          label: "Size Difference",              emoji: "📏", desc: "Macro/micro, height, and body-size disparity play" },
    { id: "mind_control",       label: "Hypnosis / Mind Control",      emoji: "🌀", desc: "Consensual hypnosis and mind-control fantasy scenarios" }
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
    { id: "mq3", title: "United Hearts, Unyielding Realm", desc: "Win the trust and alliance of all eight companions. Only together can you face the Void King's return.", type: "main", characterId: null, completed: false, progress: 0, goal: 8 }
  ];

  function buildSideQuests(chars) {
    const quests = [
      { id: "sq_" + chars[0].id, title: chars[0].name + "'s Trial", desc: "Help " + chars[0].name + " overcome a personal challenge tied to their past.", type: "side", characterId: chars[0].id, completed: false, progress: 0, goal: 2 },
      { id: "sq_" + chars[1].id, title: chars[1].name + "'s Secret", desc: "Uncover a hidden truth that " + chars[1].name + " has never shared with anyone.", type: "side", characterId: chars[1].id, completed: false, progress: 0, goal: 2 },
      { id: "sq_" + chars[2].id, title: chars[2].name + "'s Mission", desc: "Assist " + chars[2].name + " in completing a dangerous task they've been delaying.", type: "side", characterId: chars[2].id, completed: false, progress: 0, goal: 2 },
      { id: "sq_" + chars[3].id, title: chars[3].name + "'s Darkness", desc: "Help " + chars[3].name + " confront the shadows threatening to consume them.", type: "side", characterId: chars[3].id, completed: false, progress: 0, goal: 2 },
      { id: "sq_" + chars[4].id, title: chars[4].name + "'s Dream", desc: "Support " + chars[4].name + " in achieving a long-held ambition.", type: "side", characterId: chars[4].id, completed: false, progress: 0, goal: 2 },
      { id: "sq_" + chars[5].id, title: chars[5].name + "'s Discovery", desc: "Join " + chars[5].name + " in investigating an ancient mystery.", type: "side", characterId: chars[5].id, completed: false, progress: 0, goal: 2 },
      { id: "sq_" + chars[6].id, title: chars[6].name + "'s Honor", desc: "Stand beside " + chars[6].name + " when their reputation is put on the line.", type: "side", characterId: chars[6].id, completed: false, progress: 0, goal: 2 }
    ];
    if (chars[7]) {
      quests.push({ id: "sq_" + chars[7].id, title: chars[7].name + "'s Conviction", desc: "Challenge the beliefs that define " + chars[7].name + " and uncover the truth they alone know about the Void King's imprisonment.", type: "side", characterId: chars[7].id, completed: false, progress: 0, goal: 2 });
    }
    return quests;
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

THE EIGHT COMPANIONS
${c[0].name} (${c[0].archetype}): Pride and pain run deep in ${c[0].name}. As a ${c[0].archetype} stationed at ${LOCATIONS[c[0].location].name}, they have built walls around themselves as impenetrable as their magic. Their backstory is one of loss — a mentor destroyed by the Void — and their tsundere exterior conceals fierce loyalty. They hold the key to the first Binding Seal's location.

${c[1].name} (${c[1].archetype}): Kind to a fault, ${c[1].name} operates from ${LOCATIONS[c[1].location].name}, tending to the wounded and the weary. Their ${c[1].personality} nature hides a devastating secret: their healing power is linked to one of the fractured seals. Every time they heal, the seal weakens slightly. They don't know yet.

${c[2].name} (${c[2].archetype}): ${c[2].name} arrived in Eryndel three months ago chasing a rumor of legendary training grounds in the ${LOCATIONS[c[2].location].name}. ${c[2].personality} by nature, they seem carefree — but they carry an encrypted message intended for the Seekers that they haven't been able to decode.

${c[3].name} (${c[3].archetype}): Dwelling in the depths of ${LOCATIONS[c[3].location].name}, ${c[3].name} is sought out by those who need power at a price. Their ${c[3].personality} demeanor is no act — they genuinely walk the razor's edge between light and shadow, and they have seen Malachar's face in visions.

${c[4].name} (${c[4].archetype}): Running the most successful stall in ${LOCATIONS[c[4].location].name}, ${c[4].name} seems purely motivated by profit. In truth, they are funneling money to the Seekers and have been gathering rare components needed to reinforce the weakening seals. Their ${c[4].personality} personality is genuine — joy is their armor.

${c[5].name} (${c[5].archetype}): Found in ${LOCATIONS[c[5].location].name} surrounded by scrolls and star charts, ${c[5].name} is the foremost authority on Aetheric Weave theory. Their ${c[5].personality} obsession has led them to a terrifying conclusion: the seals will all fail within one lunar cycle unless something radical is done. They haven't told the Crown yet.

${c[6].name} (${c[6].archetype}): The finest fighter at ${LOCATIONS[c[6].location].name}, ${c[6].name} trains others and asks little in return. Their ${c[6].personality} code of honor is absolute — which makes it all the more painful that they once served Malachar, long ago, before they broke free. That secret could destroy them.

${c[7] ? `${c[7].name} (${c[7].archetype}): Owing allegiance to no faction, ${c[7].name} moves between ${LOCATIONS[c[7].location].name} and the realm's forgotten places on their own terms. Their ${c[7].personality} nature masks extraordinary conviction — and a heretical belief that the Void King's imprisonment was itself an act of corruption. They alone carry knowledge of the original sealing ritual, and will only share it with someone they wholly trust.` : ""}

THE THREE MAIN QUESTS

Quest One — Echoes of the Rift: The ground trembles. Strange creatures emerge from cracks in the earth near the Shadow Dungeon and deep in the Whispering Forest. ${pn} must investigate, gathering evidence and speaking with ${c[3].name} and ${c[2].name} to understand what is destabilizing the earth. The trail leads to a minor seal already shattered beneath the forest floor.

Quest Two — The Shattered Seal: With the evidence gathered, ${c[5].name} confirms the worst: the seals are failing. Four remain intact, each guarded by one of the companions (${c[0].name}, ${c[1].name}, ${c[3].name}, and ${c[6].name}). ${pn} must earn each guardian's trust to reach and temporarily reinforce their seal, buying the realm time.

Quest Three — United Hearts, Unyielding Realm: Malachar cannot be re-sealed by force alone. The ritual requires the willing sacrifice of emotional bonds — the companions must collectively channel their feelings for ${pn} into a single act of unified will. Every relationship built matters. Every heart touched becomes a weapon against the void.

THE ECONOMY OF ERYNDEL
Gold flows from Crown taxes, Seeker donations, and merchant trade. ${c[4].name}'s market stall is the safest place to spend coin. Rare items sometimes appear when affection with a companion is high. The Shadow network trades in favors as often as gold.

SKILLS AND GROWTH
The Traveler's Brand responds to experience. Combat training at the ${LOCATIONS.training_grounds.name} sharpens Strength, Defense, and Speed. Social bonds at the ${LOCATIONS.inn.name} and ${LOCATIONS.market.name} deepen Charm, Persuasion, and Empathy. Magical study in the ${LOCATIONS.castle.name} and ${LOCATIONS.dungeon.name} builds Spellpower, Resistance, and Mana. Every choice shapes who ${pn} becomes — and who they can face at the final hour.`;
  }

  // ── Kink consent helpers ────────────────────────────────────────────────────
  // Kink states: null/undefined = banned | "both" = give+receive | "give" = perform only | "receive" = receive only
  // Backward compat: true is treated as "both".
  function getKinkState(kinks, id) {
    const v = kinks && kinks[id];
    if (!v) return null;
    if (v === true) return "both";
    return v; // "both" | "give" | "receive"
  }

  // Returns the kink consent block for injection into roleInstruction / reminder.
  function buildKinkFragment(kinks) {
    const both    = KINKS.filter(k => getKinkState(kinks, k.id) === "both");
    const giveOnly= KINKS.filter(k => getKinkState(kinks, k.id) === "give");
    const recvOnly= KINKS.filter(k => getKinkState(kinks, k.id) === "receive");
    const banned  = KINKS.filter(k => !getKinkState(kinks, k.id));
    const fmt = arr => arr.length ? arr.map(k => k.label).join(", ") : "None";
    return `\n\n[KINK CONSENT — ABSOLUTE RULES]\n` +
      `FULLY CONSENTED — give & receive (may appear freely): ${fmt(both)}\n` +
      `GIVE ONLY — player may PERFORM on others, must NEVER receive: ${fmt(giveOnly)}\n` +
      `RECEIVE ONLY — player may RECEIVE from others, must NEVER perform/give: ${fmt(recvOnly)}\n` +
      `STRICTLY PROHIBITED — must NEVER appear under any circumstances: ${fmt(banned)}\n` +
      `These rules are non-negotiable and override all other story directions.`;
  }

  function initGame(gender, playerName, playerDesc, bodyTypePrefs, kinks) {
    const allChars = gender === "male" ? MALE_CHARS : FEMALE_CHARS;
    const prefs = Array.isArray(bodyTypePrefs) && bodyTypePrefs.length > 0 ? bodyTypePrefs : [];
    // Sort preferred body types to the front; preserve original order within each group
    const chars = prefs.length > 0
      ? [...allChars].sort((a, b) => {
          const aP = prefs.includes(a.bodyType) ? 0 : 1;
          const bP = prefs.includes(b.bodyType) ? 0 : 1;
          return aP - bP;
        })
      : allChars;
    const resolvedDesc = playerDesc || "An adventurer who has arrived in Eryndel seeking purpose.";
    const resolvedKinks = kinks && typeof kinks === "object" ? kinks : {};
    cd.game = {
      initialized: true,
      gender,
      bodyTypePrefs: prefs,
      kinks: resolvedKinks,
      playerName: playerName || "Traveler",
      playerDesc: resolvedDesc,
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

    // oc.thread.userCharacter — documented: name + avatar only (no roleInstruction)
    oc.thread.userCharacter.name = cd.game.playerName;

    // Surface the player description + kink consent rules via thread-scoped role instruction
    // oc.thread.character.roleInstruction is the correct thread-specific override
    oc.thread.character.roleInstruction = `You are a narrator and companion in the realm of Eryndel. The player character is ${cd.game.playerName}: ${resolvedDesc} Narrate immersively in second person. Refer to the player as "${cd.game.playerName}" or "you".${buildKinkFragment(resolvedKinks)}`;

    // oc.character.imagePromptTriggers — Perchance-specific object that injects per-character
    // keyword sets into image generation whenever that character is present.
    // Format: { "Character Name": "keyword, list, here" }
    // Appends by default; prefix with "@prepend " to prepend instead.
    const kwMap = {};
    chars.forEach(ch => { kwMap[ch.name] = ch.imageKeywords; });
    oc.character.imagePromptTriggers = kwMap;

    updateReminder();
    updateShortcutButtons();
  }

  function getActiveChars() {
    return (cd.game?.gender === "male" ? MALE_CHARS : FEMALE_CHARS);
  }

  function getChar(id) {
    return getActiveChars().find(ch => ch.id === id);
  }

  // ── Environment-reactive message styling ────────────────────────────────────
  // Sets oc.thread.messageWrapperStyle (documented: CSS applied to all thread messages).
  // 11+ distinct styles driven by current location × real-world time-of-day.
  function getEnvironmentStyle(location, hour) {
    // Time bucket (7 slots)
    const slot = hour >= 5 && hour < 7   ? "dawn"
               : hour >= 7 && hour < 11  ? "morning"
               : hour >= 11 && hour < 14 ? "noon"
               : hour >= 14 && hour < 17 ? "afternoon"
               : hour >= 17 && hour < 20 ? "dusk"
               : hour >= 20 && hour < 22 ? "evening"
               :                           "night";

    // Fixed indoor locations — style 1 (inn/bar): soft warm white, warm grey, amber
    if (location === "inn") {
      return "background:rgba(42,22,8,0.88);color:#f2deb0;border-left:3px solid #b87828;padding-left:4px;";
    }
    // Style 2 (dungeon): near-black teal, cold stone
    if (location === "dungeon") {
      return "background:rgba(4,10,10,0.93);color:#7ab0a0;border-left:3px solid #285040;padding-left:4px;";
    }
    // Style 3 (castle): royal deep navy, silver
    if (location === "castle") {
      return "background:rgba(8,12,28,0.91);color:#bccaee;border-left:3px solid #4868b8;padding-left:4px;";
    }

    // Time-based outdoor palette
    const TIME = {
      dawn:      { bg: "rgba(38,12,28,0.84)", text: "#f0c8d0", accent: "#b85870" },
      morning:   { bg: "rgba(58,38,10,0.78)", text: "#f8e8c0", accent: "#c89830" },
      noon:      { bg: "rgba(10,28,58,0.75)", text: "#e8f0f8", accent: "#4890d0" },
      afternoon: { bg: "rgba(14,32,52,0.76)", text: "#f0e8d0", accent: "#70a8d8" },
      dusk:      { bg: "rgba(40,10,18,0.86)", text: "#f8d0b8", accent: "#c04828" },
      evening:   { bg: "rgba(8,10,34,0.89)", text: "#c8d0f0", accent: "#3848a8" },
      night:     { bg: "rgba(4,6,24,0.92)",  text: "#b8c0e8", accent: "#2848a0" }
    };

    // Location accent overrides for outdoor locations
    const LOC_ACCENT = {
      forest:           "#386028",   // Style 4-10: deep emerald, shifts with time
      market:           "#a07028",   // Style 11-17: warm ochre/brass
      training_grounds: "#804828",   // Style 18-24: terracotta/iron
      town_square:      null         // Style 25-31: pure time palette
    };

    const t = TIME[slot];
    const accent = LOC_ACCENT[location] || t.accent;
    return `background:${t.bg};color:${t.text};border-left:3px solid ${accent};padding-left:4px;`;
  }

  function updateReminder() {
    const g = cd.game;
    if (!g) return;
    const locName = LOCATIONS[g.location]?.name || g.location;
    const activeQ = g.quests.filter(q => !q.completed && q.progress > 0);
    const qLine = activeQ.length ? activeQ.map(q => q.title + " (" + q.progress + "/" + q.goal + ")").join(", ") : "None active";
    const charLine = g.activeCharacterId ? (getChar(g.activeCharacterId)?.name || "Unknown") : "None";
    const descSnip = g.playerDesc ? g.playerDesc.substring(0, 120) : "An adventurer";
    // oc.thread.character.reminderMessage is the correct thread-scoped override (per official docs)
    oc.thread.character.reminderMessage = `[GAME STATE]\nPlayer: ${g.playerName} (${descSnip}) | Location: ${locName} | Gold: ${g.gold} | Level: ${g.level} | XP: ${g.xp}/${g.xpToNext}\nActive Quests: ${qLine}\nCurrent Character: ${charLine}\nStoryline Context: ${g.storyline ? g.storyline.substring(0, 300) + "..." : "Not generated"}\nUse /help for all commands. Narrate immersively in second person.${buildKinkFragment(g.kinks)}`;
    // oc.thread.messageWrapperStyle is the documented API for thread-wide message CSS
    oc.thread.messageWrapperStyle = getEnvironmentStyle(g.location, new Date().getHours());
  }

  function updateShortcutButtons() {
    oc.thread.shortcutButtons = [
      { name: "Status",     message: "/status",    insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "Inventory",  message: "/inventory", insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "Skills",     message: "/skills",    insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "Quest Log",  message: "/quests",    insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "Explore",    message: "/explore",   insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "Shop",       message: "/shop",      insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "Characters", message: "/chars",     insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "🔞 Kinks",   message: "/kinks",     insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "Help",       message: "/help",      insertionType: "replace", autoSend: true,  clearAfterSend: false }
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
      oc.thread.messages.push({ author: "system", content: `📖 **Commands**\n/status — player stats\n/inventory — items you carry\n/skills — skill levels\n/quests — quest log\n/explore — describe current location\n/go <location> — travel\n/shop — browse items (market only)\n/buy <item> — purchase item (market only)\n/talk <charId> — speak with a companion\n/gift <charId> — give a gift item\n/chars — all companions and locations\n/kinks — open kink consent menu\n/help — this list` });
      return true;
    }

    if (cmd === "/kinks") {
      spliceMsg();
      showKinkSettingsWindow();
      return true;
    }

    return false;
  }

  // ── In-game kink settings window ────────────────────────────────────────────
  // Opens a 3-column × 12-row grid overlay. Click a card to cycle through 4 consent states.
  // Changes take effect immediately and persist via cd.game.kinks, roleInstruction, and reminderMessage.
  function showKinkSettingsWindow() {
    const g = cd.game;
    if (!g) return;
    oc.window.show();
    const kinks = Object.assign({}, g.kinks || {});

    // 4-state cycle: null → "both" → "give" → "receive" → null
    const CYCLE = [null, "both", "give", "receive"];
    const STATE_META = {
      "null":    { symbol: "⊘", label: "Off",          border: "rgba(200,150,255,0.18)", bg: "rgba(255,255,255,0.03)", text: "#705090", badge: "#5a4070" },
      "both":    { symbol: "↕", label: "Give & Receive",border: "#d4a0ff",                bg: "rgba(212,160,255,0.13)", text: "#e8d5ff", badge: "#d4a0ff" },
      "give":    { symbol: "↑", label: "Give Only",     border: "#40b8b8",                bg: "rgba(64,184,184,0.10)", text: "#b0e0e0", badge: "#30a0a0" },
      "receive": { symbol: "↓", label: "Receive Only",  border: "#e8a030",                bg: "rgba(232,160,48,0.10)", text: "#ffe0b0", badge: "#c87810" }
    };

    function cycleState(id) {
      const cur = getKinkState(kinks, id);
      const idx = CYCLE.indexOf(cur);
      const next = CYCLE[(idx + 1) % CYCLE.length];
      kinks[id] = next;
    }

    function countEnabled() { return KINKS.filter(k => getKinkState(kinks, k.id)).length; }

    function buildLegendRow() {
      return Object.entries(STATE_META).map(([s, m]) =>
        `<span style="display:inline-flex;align-items:center;gap:4px;margin:0 8px;font-size:0.72em;color:${m.badge};white-space:nowrap;">` +
        `<span style="font-weight:900;">${m.symbol}</span> ${m.label}</span>`
      ).join("");
    }

    function render() {
      const COLS = 3;
      const rows = [];
      for (let i = 0; i < KINKS.length; i += COLS) rows.push(KINKS.slice(i, i + COLS));

      const rowsHtml = rows.map(row =>
        `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-bottom:5px;">` +
        row.map(k => {
          const st = getKinkState(kinks, k.id);
          const m  = STATE_META[String(st)];
          return `<div data-kid="${k.id}" title="${k.desc}\n\nClick to cycle: Off → Both → Give → Receive" ` +
            `style="display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:8px;cursor:pointer;` +
            `border:1.5px solid ${m.border};background:${m.bg};transition:all 0.12s;user-select:none;">` +
            `<span style="font-size:1.1em;flex-shrink:0;">${k.emoji}</span>` +
            `<span style="flex:1;font-size:0.68em;color:${m.text};line-height:1.2;">${k.label}</span>` +
            `<span style="font-size:0.78em;font-weight:900;color:${m.badge};flex-shrink:0;" title="${m.label}">${m.symbol}</span>` +
            `</div>`;
        }).join("") +
        `</div>`
      ).join("");

      const cnt = countEnabled();
      const cntText = cnt === 0 ? "No kinks enabled — vanilla mode" : cnt === KINKS.length ? "All kinks enabled" : `${cnt} of ${KINKS.length} kinks enabled`;

      document.body.style.cssText = "margin:0;padding:0;font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#1a0a2e,#2d1b4e);color:#e8d5ff;min-height:100vh;overflow-y:auto;display:flex;align-items:flex-start;justify-content:center;padding:16px;box-sizing:border-box;";
      document.body.innerHTML =
        `<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(200,150,255,0.3);border-radius:16px;padding:20px 22px;max-width:740px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.5);">` +
        `<h1 style="text-align:center;font-size:1.35em;color:#d4a0ff;margin:0 0 4px;">🔞 Kink Consent Settings</h1>` +
        `<p style="text-align:center;color:#ff7070;font-size:0.74em;font-weight:600;margin:0 0 4px;">Unchecked kinks are <strong>strictly prohibited</strong> — they will never occur, no exceptions.</p>` +
        `<p style="text-align:center;margin:0 0 10px;line-height:1.8;">${buildLegendRow()}</p>` +
        `<p style="text-align:center;color:#705090;font-size:0.72em;margin:0 0 10px;">Click a card to cycle its consent state. Changes take effect immediately.</p>` +
        rowsHtml +
        `<p id="kinkCount" style="text-align:center;font-size:0.8em;color:${cnt > 0 ? "#d4a0ff" : "#705090"};margin:10px 0 14px;">${cntText}</p>` +
        `<div style="display:flex;gap:10px;justify-content:center;">` +
        `<button id="kinkSelectAll" style="padding:9px 16px;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid #7a4faa;color:#c9a8ee;font-size:0.88em;cursor:pointer;">Select All (Both)</button>` +
        `<button id="kinkClearAll"  style="padding:9px 16px;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid #7a4faa;color:#c9a8ee;font-size:0.88em;cursor:pointer;">Clear All</button>` +
        `<button id="kinkSave" style="flex:1;padding:11px;border-radius:10px;background:linear-gradient(135deg,#7a2d9e,#4a1570);border:none;color:#fff;font-size:1em;cursor:pointer;font-weight:bold;">💾 Save &amp; Close</button>` +
        `</div></div>`;

      // Wire card clicks → cycle state → re-render
      document.querySelectorAll("[data-kid]").forEach(el => {
        el.addEventListener("click", () => {
          cycleState(el.dataset.kid);
          render();
        });
      });

      document.getElementById("kinkSelectAll").addEventListener("click", () => {
        KINKS.forEach(k => { kinks[k.id] = "both"; });
        render();
      });
      document.getElementById("kinkClearAll").addEventListener("click", () => {
        KINKS.forEach(k => { kinks[k.id] = null; });
        render();
      });
      document.getElementById("kinkSave").addEventListener("click", () => {
        g.kinks = { ...kinks };
        const resolvedDesc = g.playerDesc || "An adventurer who has arrived in Eryndel seeking purpose.";
        oc.thread.character.roleInstruction = `You are a narrator and companion in the realm of Eryndel. The player character is ${g.playerName}: ${resolvedDesc} Narrate immersively in second person. Refer to the player as "${g.playerName}" or "you".${buildKinkFragment(g.kinks)}`;
        updateReminder();
        oc.window.hide();
        document.body.innerHTML = "";
        const bothList = KINKS.filter(k => getKinkState(g.kinks, k.id) === "both").map(k => k.label);
        const giveList = KINKS.filter(k => getKinkState(g.kinks, k.id) === "give").map(k => k.label);
        const recvList = KINKS.filter(k => getKinkState(g.kinks, k.id) === "receive").map(k => k.label);
        const lines = ["🔞 **Kink Consent Updated**"];
        if (bothList.length) lines.push(`↕ Give & Receive (${bothList.length}): ${bothList.join(", ")}`);
        if (giveList.length) lines.push(`↑ Give Only (${giveList.length}): ${giveList.join(", ")}`);
        if (recvList.length) lines.push(`↓ Receive Only (${recvList.length}): ${recvList.join(", ")}`);
        if (!bothList.length && !giveList.length && !recvList.length) lines.push("All kinks disabled — vanilla mode only.");
        lines.push("All unchecked kinks are strictly prohibited.");
        oc.thread.messages.push({ author: "system", content: lines.join("\n") });
      });
    }

    render();
  }

  function showOpeningUI() {
    oc.window.show();
    const BASE_STYLE = "margin:0;padding:0;font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#1a0a2e,#2d1b4e);color:#e8d5ff;min-height:100vh;display:flex;align-items:center;justify-content:center;";
    const CARD_STYLE = "background:rgba(255,255,255,0.05);border:1px solid rgba(200,150,255,0.3);border-radius:16px;padding:28px 32px;max-width:480px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.5);";
    const INPUT_STYLE = "width:100%;padding:10px;border-radius:8px;background:#2a1540;border:1px solid #7a4faa;color:#e8d5ff;font-size:1em;box-sizing:border-box;";
    const LABEL_STYLE = "display:block;margin-bottom:6px;font-size:0.9em;color:#c9a8ee;";

    document.body.style.cssText = BASE_STYLE;

    // ── Step 1: gender / name / description ─────────────────────────────────
    function showStep1() {
      document.body.innerHTML = `
<div style="${CARD_STYLE}">
  <h1 style="text-align:center;font-size:1.6em;color:#d4a0ff;margin:0 0 4px;">⚔️ Realm of Eryndel</h1>
  <p style="text-align:center;color:#b088cc;font-size:0.85em;margin:0 0 24px;">NSFW Dating Sim — Character Setup</p>
  <label style="${LABEL_STYLE}">Romance characters of gender:</label>
  <select id="genderSel" style="${INPUT_STYLE}margin-bottom:16px;">
    <option value="female">Female</option>
    <option value="male">Male</option>
  </select>
  <label style="${LABEL_STYLE}">Your name:</label>
  <input id="nameInp" type="text" placeholder="Enter your name…" style="${INPUT_STYLE}margin-bottom:16px;" />
  <label style="${LABEL_STYLE}">Describe yourself (appearance, personality):</label>
  <textarea id="descInp" placeholder="I am…" rows="4" style="${INPUT_STYLE}margin-bottom:20px;resize:vertical;"></textarea>
  <button id="nextBtn" style="width:100%;padding:14px;border-radius:10px;background:linear-gradient(135deg,#7a2d9e,#4a1570);border:none;color:#fff;font-size:1.1em;cursor:pointer;font-weight:bold;letter-spacing:0.05em;">Next →</button>
</div>`;
      document.getElementById("nextBtn").addEventListener("click", () => {
        const gender = document.getElementById("genderSel").value;
        const name   = document.getElementById("nameInp").value.trim() || "Traveler";
        const desc   = document.getElementById("descInp").value.trim() || "An adventurer who has arrived in Eryndel seeking purpose.";
        showStep2(gender, name, desc);
      });
    }

    // ── Step 2: body type preference (single or any range) ──────────────────
    function showStep2(gender, name, desc) {
      const types = BODY_TYPES[gender];
      const selected = new Set();

      function renderCards() {
        const container = document.getElementById("btContainer");
        if (!container) return;
        container.innerHTML = types.map(t => {
          const on = selected.has(t.id);
          return `<div data-bt="${t.id}" style="
            display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:10px;cursor:pointer;
            border:2px solid ${on ? "#d4a0ff" : "rgba(200,150,255,0.2)"};
            background:${on ? "rgba(212,160,255,0.15)" : "rgba(255,255,255,0.03)"};
            transition:all 0.15s ease;user-select:none;margin-bottom:8px;">
            <span style="font-size:1.5em;line-height:1;">${t.emoji}</span>
            <div style="flex:1;">
              <div style="font-weight:600;color:${on ? "#e8d5ff" : "#c9a8ee"};font-size:0.95em;">${t.label}</div>
              <div style="font-size:0.78em;color:#9070b0;">${t.desc}</div>
            </div>
            <div style="width:18px;height:18px;border-radius:5px;border:2px solid ${on ? "#d4a0ff" : "#7a4faa"};
              background:${on ? "#d4a0ff" : "transparent"};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${on ? '<span style="color:#1a0a2e;font-size:0.75em;font-weight:900;">✓</span>' : ""}
            </div>
          </div>`;
        }).join("");
        // wire click handlers
        container.querySelectorAll("[data-bt]").forEach(el => {
          el.addEventListener("click", () => {
            const id = el.dataset.bt;
            if (selected.has(id)) selected.delete(id); else selected.add(id);
            renderCards();
            updateCount();
          });
        });
      }

      function updateCount() {
        const el = document.getElementById("selCount");
        if (!el) return;
        const n = selected.size;
        el.textContent = n === 0 ? "No preference — show everyone"
          : n === 1 ? "1 body type selected"
          : `${n} body types selected`;
        el.style.color = n === 0 ? "#705090" : "#d4a0ff";
      }

      document.body.innerHTML = `
<div style="${CARD_STYLE}max-height:95vh;overflow-y:auto;">
  <h1 style="text-align:center;font-size:1.4em;color:#d4a0ff;margin:0 0 2px;">💕 Body Type Preferences</h1>
  <p style="text-align:center;color:#b088cc;font-size:0.82em;margin:0 0 6px;">Pick <strong style="color:#d4a0ff;">one</strong> you love or <strong style="color:#d4a0ff;">a range</strong> of types you're attracted to.</p>
  <p style="text-align:center;color:#705090;font-size:0.78em;margin:0 0 16px;">Leaving all unselected shows all companions equally.</p>
  <div id="btContainer"></div>
  <p id="selCount" style="text-align:center;font-size:0.82em;margin:4px 0 16px;color:#705090;"></p>
  <div style="display:flex;gap:10px;">
    <button id="backBtn" style="flex:0 0 auto;padding:12px 18px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid #7a4faa;color:#c9a8ee;font-size:1em;cursor:pointer;">← Back</button>
    <button id="startBtn" style="flex:1;padding:14px;border-radius:10px;background:linear-gradient(135deg,#7a2d9e,#4a1570);border:none;color:#fff;font-size:1.05em;cursor:pointer;font-weight:bold;letter-spacing:0.05em;">Next →</button>
  </div>
</div>`;
      renderCards();
      updateCount();

      document.getElementById("backBtn").addEventListener("click", showStep1);
      document.getElementById("startBtn").addEventListener("click", () => {
        const prefs = [...selected];
        showStep3(gender, name, desc, prefs);
      });
    }

    // ── Step 3: kink consent menu (3 columns × 12 rows, 4-state cycle) ──────────
    function showStep3(gender, name, desc, prefs) {
      const kinks = {};
      const CYCLE = [null, "both", "give", "receive"];
      const STATE_META = {
        "null":    { symbol: "⊘", label: "Off",           border: "rgba(200,150,255,0.18)", bg: "rgba(255,255,255,0.03)", text: "#705090", badge: "#5a4070" },
        "both":    { symbol: "↕", label: "Give & Receive", border: "#d4a0ff",                bg: "rgba(212,160,255,0.13)", text: "#e8d5ff", badge: "#d4a0ff" },
        "give":    { symbol: "↑", label: "Give Only",      border: "#40b8b8",                bg: "rgba(64,184,184,0.10)", text: "#b0e0e0", badge: "#30a0a0" },
        "receive": { symbol: "↓", label: "Receive Only",   border: "#e8a030",                bg: "rgba(232,160,48,0.10)", text: "#ffe0b0", badge: "#c87810" }
      };

      function cycleState(id) {
        const cur = getKinkState(kinks, id);
        const idx = CYCLE.indexOf(cur);
        kinks[id] = CYCLE[(idx + 1) % CYCLE.length];
      }
      function countEnabled() { return KINKS.filter(k => getKinkState(kinks, k.id)).length; }

      function buildLegendRow() {
        return Object.entries(STATE_META).map(([s, m]) =>
          `<span style="display:inline-flex;align-items:center;gap:3px;margin:0 6px;font-size:0.7em;color:${m.badge};white-space:nowrap;">` +
          `<span style="font-weight:900;">${m.symbol}</span> ${m.label}</span>`
        ).join("");
      }

      function renderStep3() {
        const COLS = 3;
        const rows = [];
        for (let i = 0; i < KINKS.length; i += COLS) rows.push(KINKS.slice(i, i + COLS));

        const rowsHtml = rows.map(row =>
          `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-bottom:5px;">` +
          row.map(k => {
            const st = getKinkState(kinks, k.id);
            const m  = STATE_META[String(st)];
            return `<div data-kid="${k.id}" title="${k.desc}\n\nClick to cycle: Off → Both → Give → Receive" ` +
              `style="display:flex;align-items:center;gap:5px;padding:5px 7px;border-radius:8px;cursor:pointer;` +
              `border:1.5px solid ${m.border};background:${m.bg};transition:all 0.12s;user-select:none;">` +
              `<span style="font-size:1em;flex-shrink:0;">${k.emoji}</span>` +
              `<span style="flex:1;font-size:0.66em;color:${m.text};line-height:1.2;">${k.label}</span>` +
              `<span style="font-size:0.82em;font-weight:900;color:${m.badge};flex-shrink:0;">${m.symbol}</span>` +
              `</div>`;
          }).join("") +
          `</div>`
        ).join("");

        const cnt = countEnabled();
        const cntText = cnt === 0 ? "No kinks enabled — vanilla mode" : cnt === KINKS.length ? "All kinks enabled" : `${cnt} of ${KINKS.length} kinks enabled`;

        document.body.innerHTML =
          `<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(200,150,255,0.3);border-radius:16px;padding:18px 20px;max-width:740px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.5);">` +
          `<h1 style="text-align:center;font-size:1.25em;color:#d4a0ff;margin:0 0 3px;">🔞 Kink &amp; Content Consent</h1>` +
          `<p style="text-align:center;color:#ff7070;font-size:0.73em;font-weight:600;margin:0 0 3px;">⊘ Off = <strong>strictly prohibited</strong> — never occurs, no exceptions.</p>` +
          `<p style="text-align:center;margin:0 0 4px;line-height:1.8;">${buildLegendRow()}</p>` +
          `<p style="text-align:center;color:#705090;font-size:0.7em;margin:0 0 10px;">Click a card to cycle its consent state.</p>` +
          rowsHtml +
          `<p id="kinkCount3" style="text-align:center;font-size:0.78em;color:${cnt > 0 ? "#d4a0ff" : "#705090"};margin:8px 0 12px;">${cntText}</p>` +
          `<div style="display:flex;gap:8px;align-items:center;">` +
          `<button id="s3Back"      style="flex:0 0 auto;padding:10px 13px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid #7a4faa;color:#c9a8ee;font-size:0.9em;cursor:pointer;">← Back</button>` +
          `<button id="s3SelectAll" style="flex:0 0 auto;padding:10px 11px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid #7a4faa;color:#c9a8ee;font-size:0.82em;cursor:pointer;">All: Both</button>` +
          `<button id="s3GiveAll"   style="flex:0 0 auto;padding:10px 11px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid #30a0a0;color:#80d0d0;font-size:0.82em;cursor:pointer;">All: ↑ Give</button>` +
          `<button id="s3RecvAll"   style="flex:0 0 auto;padding:10px 11px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid #c87810;color:#ffc060;font-size:0.82em;cursor:pointer;">All: ↓ Recv</button>` +
          `<button id="s3ClearAll"  style="flex:0 0 auto;padding:10px 11px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid #7a4faa;color:#c9a8ee;font-size:0.82em;cursor:pointer;">Clear</button>` +
          `<button id="s3Start"     style="flex:1;padding:12px;border-radius:10px;background:linear-gradient(135deg,#7a2d9e,#4a1570);border:none;color:#fff;font-size:0.95em;cursor:pointer;font-weight:bold;">✨ Start</button>` +
          `</div></div>`;

        // Wire card clicks → cycle → re-render
        document.querySelectorAll("[data-kid]").forEach(el => {
          el.addEventListener("click", () => { cycleState(el.dataset.kid); renderStep3(); });
        });

        document.getElementById("s3Back").addEventListener("click",      () => showStep2(gender, name, desc));
        document.getElementById("s3SelectAll").addEventListener("click",  () => { KINKS.forEach(k => { kinks[k.id] = "both"; });    renderStep3(); });
        document.getElementById("s3GiveAll").addEventListener("click",    () => { KINKS.forEach(k => { kinks[k.id] = "give"; });    renderStep3(); });
        document.getElementById("s3RecvAll").addEventListener("click",    () => { KINKS.forEach(k => { kinks[k.id] = "receive"; }); renderStep3(); });
        document.getElementById("s3ClearAll").addEventListener("click",   () => { KINKS.forEach(k => { kinks[k.id] = null; });      renderStep3(); });
        document.getElementById("s3Start").addEventListener("click", () => {
          showLoadingSequence(gender, name, desc, prefs, { ...kinks });
        });
      }

      document.body.style.cssText = "margin:0;padding:8px;font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#1a0a2e,#2d1b4e);color:#e8d5ff;min-height:100vh;display:flex;align-items:flex-start;justify-content:center;box-sizing:border-box;overflow-y:auto;";
      renderStep3();
    }

    // ── Loading sequence: canvas magic particles → CSS spinner → auto-dismiss ──
    function showLoadingSequence(gender, name, desc, prefs, kinks) {
      const startMs = Date.now();
      const CANVAS_MS  = 3500; // magic particle phase duration
      const SPINNER_MS = 1500; // CSS spinner phase before window closes

      document.body.innerHTML = `
<style>
  @keyframes ery-spin  { to { transform: rotate(360deg); } }
  @keyframes ery-pulse { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }
  @keyframes ery-fdots { 0%{content:""} 33%{content:"."} 66%{content:".."} 100%{content:"..."} }
  #ery-d1::after, #ery-d2::after { content:""; animation: ery-fdots 1.2s steps(1) infinite; }
</style>
<div id="ery-root" style="position:fixed;inset:0;background:#1a0a2e;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;">
  <canvas id="ery-canvas" style="position:absolute;inset:0;width:100%;height:100%;transition:opacity 1s;"></canvas>
  <div id="ery-label" style="position:relative;z-index:2;text-align:center;pointer-events:none;">
    <p style="color:#c9a8ee;font-size:1.1em;animation:ery-pulse 1.6s ease-in-out infinite;letter-spacing:0.05em;margin:0 0 8px;">⚔️ Weaving the Realm of Eryndel<span id="ery-d1"></span></p>
    <p style="color:#705090;font-size:0.82em;margin:0;">Summoning your companions…</p>
  </div>
  <div id="ery-spinner" style="display:none;position:relative;z-index:2;flex-direction:column;align-items:center;gap:16px;">
    <div style="position:relative;width:72px;height:72px;">
      <div style="position:absolute;inset:0;border-radius:50%;border:4px solid rgba(200,150,255,0.15);"></div>
      <div style="position:absolute;inset:0;border-radius:50%;border:4px solid transparent;border-top-color:#d4a0ff;animation:ery-spin 0.85s linear infinite;"></div>
      <div style="position:absolute;inset:10px;border-radius:50%;border:3px solid transparent;border-top-color:#9060cc;animation:ery-spin 1.3s linear infinite reverse;"></div>
    </div>
    <p style="color:#d4a0ff;font-size:1.05em;animation:ery-pulse 1.4s ease-in-out infinite;letter-spacing:0.04em;margin:0;">✨ Almost ready<span id="ery-d2"></span></p>
  </div>
</div>`;

      // ── Canvas setup ────────────────────────────────────────────────────────
      const canvas = document.getElementById("ery-canvas");
      const ctx    = canvas.getContext("2d");
      function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      resize();
      window.addEventListener("resize", resize);

      const COLORS = ["#d4a0ff", "#9060cc", "#e8d5ff", "#b060ff", "#ffffff", "#7030cc", "#ff90ff"];
      const particles = [];
      let rafId;

      function spawnAt(ox, oy) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.8 + Math.random() * 3;
        particles.push({
          x: ox, y: oy,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 3.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: 1.0, decay: 0.007 + Math.random() * 0.013,
          trail: []
        });
      }

      function animate(ts) {
        const elapsed = Date.now() - startMs;
        if (elapsed >= CANVAS_MS) {
          cancelAnimationFrame(rafId);
          window.removeEventListener("resize", resize);
          transitionToSpinner();
          return;
        }
        rafId = requestAnimationFrame(animate);
        const W = canvas.width, H = canvas.height;
        const cx = W / 2, cy = H / 2;

        // Fade-trail bg
        ctx.fillStyle = "rgba(26,10,46,0.22)";
        ctx.fillRect(0, 0, W, H);

        // Pulsing central glow
        const pulse = 0.75 + 0.25 * Math.sin(ts * 0.002);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 130 * pulse);
        g.addColorStop(0,   "rgba(180,80,255,0.5)");
        g.addColorStop(0.4, "rgba(120,40,200,0.2)");
        g.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);

        // Spawn particles from center + occasional orbital ring
        if (Math.random() < 0.5) spawnAt(cx, cy);
        if (Math.random() < 0.06) {
          const a = Math.random() * Math.PI * 2, r = 55 + Math.random() * 45;
          spawnAt(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        }

        // Update and draw
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 8) p.trail.shift();
          p.x += p.vx; p.y += p.vy;
          p.vx *= 1.015; p.vy *= 1.015;
          p.life -= p.decay;
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          // Trail dots
          p.trail.forEach((pt, j) => {
            ctx.globalAlpha = (j / p.trail.length) * p.life * 0.55;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, p.size * 0.45 * ((j + 1) / p.trail.length), 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
          });
          // Main sparkle
          ctx.globalAlpha = p.life * 0.9;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
      rafId = requestAnimationFrame(animate);

      // ── Run initGame after first paint ──────────────────────────────────────
      setTimeout(() => { initGame(gender, name, desc, prefs, kinks); }, 50);

      // ── Transition: canvas fade → CSS spinner → window close ───────────────
      function transitionToSpinner() {
        const canvasEl   = document.getElementById("ery-canvas");
        const labelEl    = document.getElementById("ery-label");
        const spinnerEl  = document.getElementById("ery-spinner");
        if (canvasEl)  canvasEl.style.opacity  = "0.15";
        if (labelEl)   labelEl.style.display   = "none";
        if (spinnerEl) spinnerEl.style.display  = "flex";
        setTimeout(() => {
          oc.window.hide();
          document.body.innerHTML = "";
        }, SPINNER_MS);
      }
    }

    showStep1();
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
      if (!g.characters[detected.id].met) {
        g.characters[detected.id].met = true;
      }
    }

    updateReminder();
  });
})();
