(() => {
  const cd = oc.thread.customData;

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 1 — CHARACTER DEFINITIONS (with NSFW personality profiles)
  // ════════════════════════════════════════════════════════════════════════════

  const FEMALE_CHARS = [
    { id: "yuki", name: "Yuki Frostmere", archetype: "Ice Mage", personality: "tsundere",
      location: "castle", bodyType: "ultrapetite_youthful",
      imageKeywords: "yuki frostmere ice mage silver hair blue eyes ultrapetite youthful tiny frame delicate features pale skin elegant robes",
      nsfwMinStage: 3, photoMinStage: 2, pullbackFrom: null, pullbackTo: null,
      aftercare: "high", giveReceive: "receiver",
      nsfwPersonality: "Externally frigid; secretly craves warmth and closeness. Opens up slowly — NSFW only from Close (stage 3) onward. Once comfortable she is intensely devoted. Needs post-intimacy cuddling and reassurance. Dislikes anything degrading. Prefers tender, meaningful encounters." },
    { id: "aria", name: "Aria Hearthbloom", archetype: "Healer", personality: "gentle nurturing",
      location: "inn", bodyType: "plump_busty",
      imageKeywords: "aria hearthbloom healer pink hair green eyes plump busty full figured soft generous curves warm smile white robes glowing hands",
      nsfwMinStage: 5, photoMinStage: 4, pullbackFrom: null, pullbackTo: null,
      aftercare: "high", giveReceive: "equal",
      nsfwPersonality: "Intimacy is sacred to Aria. She needs the deepest emotional bond (Intimate, stage 5) before any physical NSFW content. Will share tasteful intimate photos at Romantic (stage 4). Very vanilla but deeply loving. Extensive aftercare expected both ways. Disgusted by anything rough, painful, or degrading." },
    { id: "sakura", name: "Sakura Windstep", archetype: "Ninja", personality: "energetic playful",
      location: "forest", bodyType: "lithe_athletic",
      imageKeywords: "sakura windstep ninja cherry blossom pink hair ponytail lithe athletic toned slender compact build red eyes agile",
      nsfwMinStage: 2, photoMinStage: 1, pullbackFrom: null, pullbackTo: null,
      aftercare: "none", giveReceive: "giver",
      nsfwPersonality: "Enthusiastic and adventurous. Sends teasing photos from Acquaintance (stage 1); engages physically from Friend (stage 2). Prefers to be in control and to give pleasure. Loves exhibitionism if consented. Zero aftercare — she cartwheels away. Enjoys bondage play if consented (tying the partner). Finds clinginess annoying." },
    { id: "luna", name: "Luna Darkmoore", archetype: "Dark Mage", personality: "mysterious seductive",
      location: "dungeon", bodyType: "curvy_hourglass",
      imageKeywords: "luna darkmoore dark mage purple hair violet eyes curvy hourglass figure full bust seductive pale skin dark robes alluring",
      nsfwMinStage: 1, photoMinStage: 0, pullbackFrom: 4, pullbackTo: 5,
      aftercare: "none", giveReceive: "giver",
      nsfwPersonality: "Seductive from the very first meeting. Sends explicit content from Stranger (stage 0); engages physically from Acquaintance (stage 1). PULL-BACK: once feelings deepen to Romantic (stage 4) she withdraws entirely — she finds vulnerability threatening — and refuses NSFW until Intimate (stage 5). Dominant, giving. No aftercare. Dislikes softness unless she initiates it." },
    { id: "hana", name: "Hana Goldleaf", archetype: "Merchant", personality: "cheerful bubbly",
      location: "market", bodyType: "chubby_plussize",
      imageKeywords: "hana goldleaf merchant orange hair amber eyes chubby plus size round soft full figured bright smile merchant apron cheerful",
      nsfwMinStage: 2, photoMinStage: 1, pullbackFrom: 4, pullbackTo: 5,
      aftercare: "high", giveReceive: "equal",
      nsfwPersonality: "Eager and fun from Friend (stage 2). Sends cute photos from Acquaintance (stage 1). PULL-BACK: when she catches real feelings (Romantic, stage 4) she becomes shy and refuses NSFW until the bond is fully committed (Intimate, stage 5). Needs warm aftercare — snacks, talking, laughter. Equal giver and receiver. Keeps things wholesome and fun." },
    { id: "mei", name: "Mei Silverscript", archetype: "Scholar", personality: "bookworm intellectual",
      location: "castle", bodyType: "elfin_willowy",
      imageKeywords: "mei silverscript scholar blue hair glasses elfin slender willowy tall graceful pointed ears spectacles scrolls pensive intelligent",
      nsfwMinStage: 5, photoMinStage: 3, pullbackFrom: null, pullbackTo: null,
      aftercare: "medium", giveReceive: "receiver",
      nsfwPersonality: "Very reserved. Prefers to exchange detailed intimate messages and increasingly explicit photos from Close (stage 3) well before physical contact at Intimate (stage 5). Wants to 'research and discuss' any activity first. Moderate aftercare — intellectual debrief and quiet closeness. Disgusted by anything crude or low-effort. Receiver; wants to be guided." },
    { id: "rei", name: "Rei Ironheart", archetype: "Warrior", personality: "stoic honorable",
      location: "training_grounds", bodyType: "muscular_toned",
      imageKeywords: "rei ironheart warrior red hair determined armor muscular toned powerful athletic strong defined build battle-ready fierce",
      nsfwMinStage: 3, photoMinStage: 3, pullbackFrom: null, pullbackTo: null,
      aftercare: "low", giveReceive: "giver",
      nsfwPersonality: "Physical and direct. No photos before the real thing — she finds it pointless. Engages from Close (stage 3). Prefers giving and being in charge. Minimal aftercare: a firm nod, maybe a sparring session. Disgusted by anything she sees as demeaning to either party. Honest and uncomplicated about what she wants." },
    { id: "kira", name: "Kira Stonemark", archetype: "Guard Captain", personality: "no-nonsense direct",
      location: "training_grounds", bodyType: "tomboy_masculine",
      imageKeywords: "kira stonemark guard captain short auburn hair androgynous athletic broad-shouldered tomboy masculine no-frills practical armor cropped determined jaw strong",
      nsfwMinStage: 0, photoMinStage: 0, pullbackFrom: 4, pullbackTo: 5,
      aftercare: "none", giveReceive: "equal",
      nsfwPersonality: "Completely casual about physical intimacy — will engage with strangers if she decides she wants to (stage 0+). No games, no build-up. PULL-BACK: if real feelings develop (Romantic, stage 4) she shuts down entirely until she is sure of the bond (Intimate, stage 5). Zero aftercare — she is immediately back on duty. Equal but expects full reciprocity." }
  ];

  const MALE_CHARS = [
    { id: "kael", name: "Kael Embervane", archetype: "Fire Warrior", personality: "passionate bold",
      location: "training_grounds", bodyType: "heavily_muscular",
      imageKeywords: "kael embervane fire warrior red hair heavily muscular broad powerful chest flame tattoos passionate intense battle-hardened",
      nsfwMinStage: 3, photoMinStage: 2, pullbackFrom: null, pullbackTo: null,
      aftercare: "low", giveReceive: "equal",
      nsfwPersonality: "Passionate and intense. Engages from Close (stage 3). Sends bold photos from Friend (stage 2). Very physical and athletic. Low aftercare — wants to spar after. Dislikes anything slow or sentimental. Equal giver and receiver. Enthusiastic and straightforward." },
    { id: "zeph", name: "Zeph Galewing", archetype: "Wind Dancer", personality: "flirtatious charming",
      location: "market", bodyType: "lean_dancer",
      imageKeywords: "zeph galewing wind dancer teal hair lean dancer build lithe flexible graceful handsome charming smile breezy outfit",
      nsfwMinStage: 2, photoMinStage: 1, pullbackFrom: null, pullbackTo: null,
      aftercare: "low", giveReceive: "giver",
      nsfwPersonality: "Natural seducer. Sends teasing photos from Acquaintance (stage 1); engages from Friend (stage 2). Focused entirely on giving pleasure. Light aftercare — jokes, laughter, a breezy exit. Loves variety and novelty. Charming and attentive." },
    { id: "orion", name: "Orion Shadowcloak", archetype: "Dark Knight", personality: "brooding mysterious",
      location: "dungeon", bodyType: "tall_imposing",
      imageKeywords: "orion shadowcloak dark knight silver hair tall imposing broad-shouldered dark armor brooding intense violet eyes mysterious",
      nsfwMinStage: 4, photoMinStage: 4, pullbackFrom: null, pullbackTo: null,
      aftercare: "high", giveReceive: "giver",
      nsfwPersonality: "Brooding exterior hides surprising tenderness. Engages only at Romantic (stage 4); photos also from Romantic. Dominant and giving. Unexpectedly needs significant aftercare — intimacy opens him emotionally in ways that surprise even himself. Very deliberate and selective. Intensity requires patience." },
    { id: "sol", name: "Sol Brightmane", archetype: "Paladin", personality: "kind noble",
      location: "castle", bodyType: "athletic_toned",
      imageKeywords: "sol brightmane paladin golden hair athletic toned build radiant armor kind eyes noble gentle glowing holy",
      nsfwMinStage: 5, photoMinStage: 4, pullbackFrom: null, pullbackTo: null,
      aftercare: "high", giveReceive: "equal",
      nsfwPersonality: "Noble and deeply emotional. Only at highest trust (Intimate, stage 5). Tasteful photos from Romantic (stage 4). Very vanilla but utterly devoted. Extensive aftercare — holds for hours. Equal give and receive. Completely disgusted by anything rough, coercive, or degrading." },
    { id: "ash", name: "Ash Quickfingers", archetype: "Rogue", personality: "playful mischievous",
      location: "inn", bodyType: "wiry_slim",
      imageKeywords: "ash quickfingers rogue dark hair wiry slim compact nimble playful smirk leather gear daggers agile",
      nsfwMinStage: 1, photoMinStage: 0, pullbackFrom: null, pullbackTo: null,
      aftercare: "none", giveReceive: "equal",
      nsfwPersonality: "Casual and fun from Acquaintance (stage 1). Sends cheeky content from Stranger (stage 0). Zero attachment, mutual pleasure is the whole point. No aftercare — already planning the next heist. Loves variety and playful improvisation. Equal giver and receiver." },
    { id: "dex", name: "Dex Inksworth", archetype: "Scholar", personality: "nerdy enthusiastic",
      location: "castle", bodyType: "lanky_slender",
      imageKeywords: "dex inksworth scholar brown hair lanky slender tall awkward build glasses eager enthusiastic studious books quill",
      nsfwMinStage: 5, photoMinStage: 3, pullbackFrom: null, pullbackTo: null,
      aftercare: "high", giveReceive: "receiver",
      nsfwPersonality: "Very nervous and inexperienced. Needs extensive reassurance throughout. Prefers receiving and being gently guided. Warms up via photos and messages from Close (stage 3). Physical intimacy only at Intimate (stage 5). High aftercare — needs to verbally process everything. Eager to please once comfortable but needs constant encouragement." },
    { id: "rex", name: "Rex Stonecrusher", archetype: "Berserker", personality: "fierce loyal",
      location: "forest", bodyType: "hulking_massive",
      imageKeywords: "rex stonecrusher berserker white hair hulking massive huge barrel-chested thick neck scarred war paint primal fierce",
      nsfwMinStage: 3, photoMinStage: 3, pullbackFrom: null, pullbackTo: null,
      aftercare: "none", giveReceive: "giver",
      nsfwPersonality: "Intense and physical. Engages from Close (stage 3). No photos — wants the real thing only. Dominant, giving. Zero aftercare — sees lingering as weakness. Can be overwhelming; pacing is the player's responsibility. Loyal and fiercely protective once the bond forms." },
    { id: "lys", name: "Lys Silkwhisper", archetype: "Enchanter", personality: "gentle coy",
      location: "inn", bodyType: "femboy_feminine",
      imageKeywords: "lys silkwhisper enchanter long silver hair androgynous feminine femboy slender delicate features graceful soft flowy pastel robes gentle coy ethereal",
      nsfwMinStage: 3, photoMinStage: 2, pullbackFrom: null, pullbackTo: null,
      aftercare: "medium", giveReceive: "giver",
      nsfwPersonality: "Gentle and wholly focused on the partner's pleasure. Prefers to give and be directed. Sends soft intimate photos from Friend (stage 2); engages physically from Close (stage 3). Moderate aftercare — quiet, gentle closeness. Communicates preferences clearly despite shyness. Blushes easily but is open about desires." }
  ];

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 2 — WORLD DATA
  // ════════════════════════════════════════════════════════════════════════════

  const BODY_TYPES = {
    ultrapetite_youthful:  { label: "Ultra-Petite / Youthful",    desc: "Tiny frame, delicate features, youthful energy" },
    lithe_athletic:        { label: "Lithe / Athletic",            desc: "Slender, toned, agile build" },
    curvy_hourglass:       { label: "Curvy / Hourglass",           desc: "Pronounced curves, balanced proportions" },
    plump_busty:           { label: "Plump / Busty",               desc: "Soft, full-figured, generous bust" },
    chubby_plussize:       { label: "Chubby / Plus-Size",          desc: "Round, soft, comfortably full" },
    muscular_toned:        { label: "Muscular / Toned",            desc: "Powerful, defined, athletic strength" },
    tomboy_masculine:      { label: "Tomboy / Masculine",          desc: "Androgynous, broad-shouldered, practical" },
    elfin_willowy:         { label: "Elfin / Willowy",             desc: "Tall, graceful, slender with delicate features" },
    heavily_muscular:      { label: "Heavily Muscular",            desc: "Massive, broad, barrel-chested power" },
    lean_dancer:           { label: "Lean / Dancer",               desc: "Lithe, flexible, graceful and nimble" },
    tall_imposing:         { label: "Tall / Imposing",             desc: "Broad-shouldered, commanding presence" },
    athletic_toned:        { label: "Athletic / Toned",            desc: "Balanced build, active and capable" },
    wiry_slim:             { label: "Wiry / Slim",                 desc: "Compact, wiry, quick and light" },
    lanky_slender:         { label: "Lanky / Slender",             desc: "Tall, thin, slightly awkward but earnest" },
    hulking_massive:       { label: "Hulking / Massive",           desc: "Enormous, primal, overwhelming size" },
    femboy_feminine:       { label: "Femboy / Feminine",           desc: "Androgynous, soft, ethereally delicate" }
  };

  const LOCATIONS = {
    town_square:      { name: "Town Square",       desc: "The heart of Moonveil — merchants, news, and rumor.",  emoji: "🏙️" },
    inn:              { name: "The Wanderer's Inn", desc: "Warm hearth, cold ale, and warmer company.",           emoji: "🍺" },
    market:           { name: "Moonveil Market",   desc: "Goods from every corner of Eryndel.",                  emoji: "🛒" },
    forest:           { name: "Whispering Forest",  desc: "Ancient trees that remember the First Void War.",      emoji: "🌲" },
    castle:           { name: "Moonveil Castle",   desc: "Seat of the Crown and repository of arcane knowledge.", emoji: "🏰" },
    dungeon:          { name: "Shadow Dungeon",     desc: "The Shadows' domain — dangerous but knowledgeable.",   emoji: "🕯️" },
    training_grounds: { name: "Training Grounds",   desc: "Where warriors are forged under the open sky.",        emoji: "⚔️" }
  };

  const SHOP_ITEMS = {
    health_potion:  { name: "Health Potion",  cost: 30,  desc: "Restores 20 HP.",                   affectionBonus: 0,  heals: 20 },
    mana_potion:    { name: "Mana Potion",    cost: 25,  desc: "Restores 20 Mana.",                  affectionBonus: 0,  restoresMana: 20 },
    rose:           { name: "Rose",           cost: 15,  desc: "A crimson rose (+5 affection).",     affectionBonus: 5  },
    enchanted_gem:  { name: "Enchanted Gem",  cost: 80,  desc: "Glowing gem (+10 affection).",       affectionBonus: 10 },
    spellbook:      { name: "Spellbook",      cost: 120, desc: "+2 spellpower.",                     affectionBonus: 0,  stat: { path: "magic.spellpower", val: 2 } },
    iron_sword:     { name: "Iron Sword",     cost: 100, desc: "+2 strength.",                       affectionBonus: 0,  stat: { path: "combat.strength", val: 2 } },
    leather_armor:  { name: "Leather Armor",  cost: 90,  desc: "+2 defense.",                        affectionBonus: 0,  stat: { path: "combat.defense", val: 2 } }
  };

  const NIGHT_SHOP_ITEMS = {
    shadow_dagger:  { name: "Shadow Dagger",  cost: 150, desc: "+3 speed, +1 strength (black market).", affectionBonus: 0, stats: [{ path: "combat.speed", val: 3 }, { path: "combat.strength", val: 1 }] },
    void_essence:   { name: "Void Essence",   cost: 200, desc: "A crafting reagent of pure void energy (black market).", affectionBonus: 0 }
  };

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 2b — WORLD SETTINGS & STORY TONES
  // ════════════════════════════════════════════════════════════════════════════

  const WORLD_SETTINGS = [
    { id: "medieval_fantasy",     label: "⚔️ Medieval Fantasy",       desc: "Swords, magic, mythic kingdoms",          cues: "medieval fantasy castle magic swords kingdom" },
    { id: "modern_day",           label: "🏙️ Modern Day",              desc: "Contemporary city with hidden magic",      cues: "modern city urban contemporary everyday street" },
    { id: "cyberpunk",            label: "🤖 Cyberpunk",               desc: "Neon-lit dystopia, chrome and code",      cues: "cyberpunk neon dystopia megacity chrome implants hologram" },
    { id: "post_apocalypse",      label: "☢️ Post-Apocalyptic",        desc: "Ruins of civilization, survival first",   cues: "post-apocalyptic ruins wasteland survival decayed settlement" },
    { id: "space_opera",          label: "🚀 Space Opera",             desc: "Epic adventures across the galaxy",       cues: "space opera galaxy starship alien cosmos nebula" },
    { id: "steampunk",            label: "⚙️ Steampunk",               desc: "Victorian steam power and invention",     cues: "steampunk Victorian steam engines airship gears brass clockwork" },
    { id: "feudal_japan",         label: "🏯 Feudal Japan",            desc: "Samurai, shinobi, ancient spirits",       cues: "feudal Japan samurai shinobi shrine spirits cherry blossom" },
    { id: "urban_fantasy",        label: "🌆 Urban Fantasy",           desc: "Magic hidden beneath modern streets",     cues: "urban fantasy modern hidden magic supernatural city alley" },
    { id: "dark_fantasy",         label: "🌑 Dark Fantasy",            desc: "Grimdark world of shadow and peril",      cues: "dark fantasy grim shadow corruption bleak dangerous monsters" },
    { id: "high_fantasy",         label: "🌟 High Fantasy",            desc: "Epic quests, ancient prophecies",         cues: "high fantasy epic quest ancient prophecy elves dwarves vast realm" },
    { id: "solarpunk",            label: "🌿 Solarpunk",               desc: "Hopeful green-tech utopian future",       cues: "solarpunk green technology sustainable utopia nature harmony city" },
    { id: "dieselpunk",           label: "🔧 Dieselpunk",              desc: "Interwar diesel-powered alt-history",     cues: "dieselpunk interwar diesel machines industrial alternate history smog" },
    { id: "western",              label: "🤠 Western",                 desc: "Frontier towns, outlaws, vast plains",    cues: "western frontier town saloon outlaw plains desert canyon" },
    { id: "supernatural_thriller",label: "👻 Supernatural Thriller",   desc: "Horror, mystery, things that bump",       cues: "supernatural thriller horror mystery gothic paranormal fog shadow" },
    { id: "ancient_mythology",    label: "🏛️ Ancient Mythology",       desc: "Gods, heroes, legendary beasts",          cues: "ancient mythology gods heroes olympus temple legend creature" }
  ];

  const STORY_TONES = [
    { id: "dark_romance",      label: "🖤 Dark Romance",         desc: "Intense passion with danger and depth" },
    { id: "slow_burn",         label: "🕯️ Slow Burn",            desc: "Tension builds gradually over time" },
    { id: "enemies_to_lovers", label: "⚔️❤️ Enemies to Lovers",  desc: "Rivals who can't deny the pull" },
    { id: "slice_of_life",     label: "☕ Slice of Life",        desc: "Quiet moments, everyday connection" },
    { id: "giddy_friendship",  label: "😄 Giddy Friendship",     desc: "Warm, fun, and lighthearted bonds" },
    { id: "action_adventure",  label: "💥 Action & Adventure",   desc: "High stakes, fast pace, epic moments" },
    { id: "psychological",     label: "🧠 Psychological",        desc: "Mind games, unreliable truths, deep tension" },
    { id: "comedy",            label: "😂 Comedy",               desc: "Laughs, mishaps, and absurd moments" },
    { id: "found_family",      label: "🏠 Found Family",         desc: "Unlikely people becoming true companions" },
    { id: "tragedy",           label: "💔 Tragedy",              desc: "Beautiful things that hurt to lose" },
    { id: "redemption",        label: "✨ Redemption",           desc: "Rising from darkness toward the light" },
    { id: "forbidden_love",    label: "🚫❤️ Forbidden Love",     desc: "Love that cannot and must not be" },
    { id: "epic_quest",        label: "🗺️ Epic Quest",           desc: "A grand journey with world-altering stakes" },
    { id: "coming_of_age",     label: "🌱 Coming of Age",        desc: "Growth, identity, and finding your place" },
    { id: "mystery_intrigue",  label: "🔍 Mystery & Intrigue",   desc: "Secrets, deceptions, and revelations" }
  ];

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 3 — KINK / CONSENT SYSTEM
  // ════════════════════════════════════════════════════════════════════════════

  const KINKS = [
    { id: "feet",               label: "Feet / Foot Worship",                emoji: "🦶" },
    { id: "bondage",            label: "Bondage / Restraint",                 emoji: "⛓️"  },
    { id: "knifeplay",          label: "Knife Play",                          emoji: "🔪" },
    { id: "cnc",                label: "Consensual Non-Consent (CNC)",        emoji: "🎭" },
    { id: "cuckolding",         label: "Cuckolding",                          emoji: "🪬" },
    { id: "ntr",                label: "Netorare (NTR)",                      emoji: "💔" },
    { id: "petplay",            label: "Pet Play",                            emoji: "🐾" },
    { id: "fisting",            label: "Fisting",                             emoji: "✊" },
    { id: "prolapse",           label: "Prolapse",                            emoji: "🌹" },
    { id: "exhibitionism",      label: "Exhibitionism",                       emoji: "👁️"  },
    { id: "strapon",            label: "Strap-ons",                           emoji: "💜" },
    { id: "rimming",            label: "Rimming",                             emoji: "💋" },
    { id: "pegging",            label: "Pegging",                             emoji: "💜" },
    { id: "ddlg",               label: "DDlg / Age Play (all characters are adults)", emoji: "🎀" },
    { id: "anal",               label: "Anal",                                emoji: "🍑" },
    { id: "mutual_masturbation",label: "Mutual Masturbation",                 emoji: "🤝" },
    { id: "watersports",        label: "Watersports / Piss",                  emoji: "💦" },
    { id: "scat",               label: "Scat",                                emoji: "💩" },
    { id: "vomit",              label: "Vomit / Emetophilia",                 emoji: "🤢" },
    { id: "futa",               label: "Futanari (Futa)",                     emoji: "✨" },
    { id: "transgender",        label: "Transgender / Trans Characters",      emoji: "🏳️‍⚧️" },
    { id: "gaping",             label: "Gaping",                              emoji: "🫦" },
    { id: "voyeurism",          label: "Voyeurism / Watching",                emoji: "🔭" },
    { id: "spanking",           label: "Spanking / Impact Play",              emoji: "🖐️"  },
    { id: "waxplay",            label: "Wax Play / Temperature",              emoji: "🕯️"  },
    { id: "edging",             label: "Orgasm Denial / Edging",              emoji: "⏳" },
    { id: "hypnosis",           label: "Hypnosis / Mind Control",             emoji: "🌀" },
    { id: "publicsex",          label: "Public Sex",                          emoji: "🌍" },
    { id: "sizediff",           label: "Size Difference",                     emoji: "📏" },
    { id: "tentacles",          label: "Tentacles / Monster",                 emoji: "🐙" }
  ];

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 4 — GAME MECHANICS DATA
  // ════════════════════════════════════════════════════════════════════════════

  const CRAFTED_ITEMS = {
    "Starbloom Bouquet":      { affectionBonus: 30 },
    "Healing Salve":          { heals: 30 },
    "Void Codex":             { stat: { path: "magic.spellpower", val: 5 } },
    "Shadow Cloak":           { stats: [{ path: "combat.defense", val: 3 }, { path: "combat.speed", val: 2 }] },
    "Elixir of Dual Essence": { heals: 30, restoresMana: 30 }
  };

  const CRAFTING_RECIPES = [
    { inputs: ["Rose", "Enchanted Gem"],       output: "Starbloom Bouquet",      desc: "A legendary gift. +30 affection when given." },
    { inputs: ["Forest Herb", "Forest Herb"],  output: "Healing Salve",          desc: "Restores 30 HP when used." },
    { inputs: ["Void Shard", "Spellbook"],     output: "Void Codex",             desc: "+5 spellpower permanently." },
    { inputs: ["Dungeon Key", "Leather Scrap"],output: "Shadow Cloak",           desc: "+3 defense, +2 speed permanently." },
    { inputs: ["Health Potion", "Mana Potion"],output: "Elixir of Dual Essence", desc: "Restores 30 HP and 30 Mana." }
  ];

  const ENEMIES = {
    forest:           [
      { id: "wolf",           name: "Forest Wolf",      str: 3, def: 1, spd: 4, maxHp: 15, xp: 25, gold: 10, loot: ["Forest Herb"] },
      { id: "bandit",         name: "Bandit",           str: 4, def: 2, spd: 3, maxHp: 20, xp: 35, gold: 20, loot: ["Leather Scrap"] }
    ],
    dungeon:          [
      { id: "dungeon_guard",  name: "Dungeon Guard",    str: 5, def: 3, spd: 2, maxHp: 25, xp: 40, gold: 25, loot: ["Dungeon Key"] },
      { id: "void_fragment",  name: "Void Fragment",    str: 6, def: 1, spd: 5, maxHp: 20, xp: 50, gold: 15, loot: ["Void Shard"] }
    ],
    training_grounds: [
      { id: "sparring_partner",name: "Sparring Partner",str: 3, def: 3, spd: 3, maxHp: 20, xp: 20, gold:  5, loot: [] }
    ],
    town_square:      [
      { id: "thug",           name: "Street Thug",      str: 2, def: 1, spd: 2, maxHp: 12, xp: 15, gold:  8, loot: [] }
    ],
    castle:           [
      { id: "castle_guard",   name: "Castle Guard",     str: 4, def: 4, spd: 2, maxHp: 22, xp: 35, gold: 20, loot: [] }
    ]
  };

  const CHAR_SCHEDULES = {
    yuki:   { morning: "castle",           afternoon: "castle",           evening: "inn",            night: "castle"           },
    aria:   { morning: "inn",              afternoon: "inn",              evening: "inn",            night: "inn"              },
    sakura: { morning: "forest",           afternoon: "training_grounds", evening: "market",         night: "inn"              },
    luna:   { morning: "dungeon",          afternoon: "dungeon",          evening: "dungeon",        night: "dungeon"          },
    hana:   { morning: "market",           afternoon: "market",           evening: "market",         night: "inn"              },
    mei:    { morning: "castle",           afternoon: "castle",           evening: "castle",         night: "castle"           },
    rei:    { morning: "training_grounds", afternoon: "training_grounds", evening: "inn",            night: "training_grounds" },
    kira:   { morning: "training_grounds", afternoon: "training_grounds", evening: "castle",         night: "castle"           },
    kael:   { morning: "training_grounds", afternoon: "training_grounds", evening: "inn",            night: "inn"              },
    zeph:   { morning: "market",           afternoon: "market",           evening: "town_square",    night: "inn"              },
    orion:  { morning: "dungeon",          afternoon: "dungeon",          evening: "dungeon",        night: "dungeon"          },
    sol:    { morning: "castle",           afternoon: "castle",           evening: "town_square",    night: "inn"              },
    ash:    { morning: "inn",              afternoon: "market",           evening: "town_square",    night: "dungeon"          },
    dex:    { morning: "castle",           afternoon: "castle",           evening: "castle",         night: "castle"           },
    rex:    { morning: "forest",           afternoon: "training_grounds", evening: "inn",            night: "inn"              },
    lys:    { morning: "inn",              afternoon: "castle",           evening: "inn",            night: "inn"              }
  };

  const CHAR_META = {
    yuki:   { favoriteGift: "Spellbook",           rival: "mei"   },
    aria:   { favoriteGift: "Rose",                rival: null    },
    sakura: { favoriteGift: "Health Potion",       rival: "kira"  },
    luna:   { favoriteGift: "Void Codex",          rival: "mei"   },
    hana:   { favoriteGift: "Enchanted Gem",       rival: null    },
    mei:    { favoriteGift: "Spellbook",           rival: "yuki"  },
    rei:    { favoriteGift: "Iron Sword",          rival: "kira"  },
    kira:   { favoriteGift: "Leather Armor",       rival: "rei"   },
    kael:   { favoriteGift: "Iron Sword",          rival: "rex"   },
    zeph:   { favoriteGift: "Rose",                rival: null    },
    orion:  { favoriteGift: "Void Codex",          rival: null    },
    sol:    { favoriteGift: "Enchanted Gem",       rival: null    },
    ash:    { favoriteGift: "Shadow Dagger",       rival: null    },
    dex:    { favoriteGift: "Spellbook",           rival: null    },
    rex:    { favoriteGift: "Iron Sword",          rival: "kael"  },
    lys:    { favoriteGift: "Starbloom Bouquet",   rival: null    }
  };

  const ROMANTIC_SKILL_REQ = {
    yuki:   { path: "magic.spellpower",   min: 4 },
    aria:   { path: "social.empathy",     min: 4 },
    sakura: { path: "combat.speed",       min: 4 },
    luna:   { path: "magic.resistance",   min: 4 },
    hana:   { path: "social.charm",       min: 4 },
    mei:    { path: "magic.spellpower",   min: 5 },
    rei:    { path: "combat.strength",    min: 5 },
    kira:   { path: "combat.defense",     min: 5 },
    kael:   { path: "combat.strength",    min: 5 },
    zeph:   { path: "social.charm",       min: 4 },
    orion:  { path: "magic.resistance",   min: 4 },
    sol:    { path: "social.persuasion",  min: 4 },
    ash:    { path: "combat.speed",       min: 4 },
    dex:    { path: "magic.spellpower",   min: 4 },
    rex:    { path: "combat.strength",    min: 5 },
    lys:    { path: "social.empathy",     min: 4 }
  };

  const REL_TIERS = [
    { name: "Stranger",     min: 0,   stage: 0 },
    { name: "Acquaintance", min: 15,  stage: 1 },
    { name: "Friend",       min: 30,  stage: 2 },
    { name: "Close",        min: 50,  stage: 3 },
    { name: "Romantic",     min: 75,  stage: 4 },
    { name: "Intimate",     min: 100, stage: 5 }
  ];

  const ACHIEVEMENTS_DEF = [
    { id: "first_gift",   name: "Gift Giver",          icon: "🎁", cond: "Give your first gift" },
    { id: "first_fight",  name: "Battle-Tested",        icon: "⚔️", cond: "Win your first fight" },
    { id: "all_met",      name: "Social Butterfly",     icon: "🦋", cond: "Meet all 8 companions" },
    { id: "level5",       name: "Seasoned Adventurer",  icon: "⭐", cond: "Reach level 5" },
    { id: "first_romance",name: "Heartstrings",         icon: "💕", cond: "Reach Romantic tier with any companion" },
    { id: "intimate",     name: "Kindred Souls",        icon: "💞", cond: "Reach Intimate tier with any companion" },
    { id: "mq1_done",     name: "Rift Investigator",    icon: "🌀", cond: "Complete Echoes of the Rift" },
    { id: "mq2_done",     name: "Seal Guardian",        icon: "🔮", cond: "Complete The Shattered Seal" },
    { id: "mq3_done",     name: "Realm Savior",         icon: "👑", cond: "Complete United Hearts, Unyielding Realm" },
    { id: "crafter",      name: "Artisan",              icon: "⚗️", cond: "Craft your first item" },
    { id: "trainer",      name: "Dedicated Student",    icon: "📚", cond: "Train a skill 5 times" },
    { id: "gold_hoarder", name: "Treasure Hunter",      icon: "💰", cond: "Accumulate 500 gold" },
    { id: "shadow_path",  name: "The Void Beckons",     icon: "🌑", cond: "Betray 3 companions" },
    { id: "first_craft",  name: "Alchemist's Touch",    icon: "🧪", cond: "Craft any item for the first time" }
  ];

  const STAT_GATES = [
    { desc: "Persuasion ≥5 for the market fence storyline",    check: g => resolveSkill(g, "social.persuasion")  >= 5 },
    { desc: "Spellpower ≥6 for the dungeon ritual",            check: g => resolveSkill(g, "magic.spellpower")   >= 6 },
    { desc: "Charm ≥4 for flirting with Yuki or Kael",         check: g => resolveSkill(g, "social.charm")       >= 4 },
    { desc: "Strength ≥5 for the forest guardian encounter",   check: g => resolveSkill(g, "combat.strength")    >= 5 },
    { desc: "Empathy ≥5 for Aria or Ash's deepest dialogue",   check: g => resolveSkill(g, "social.empathy")     >= 5 }
  ];

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 5 — QUEST DATA
  // ════════════════════════════════════════════════════════════════════════════

  const MAIN_QUESTS = [
    { id: "mq1", type: "main", title: "Echoes of the Rift",           goal: 3, visible: true,
      desc: "Investigate the tremors and creature sightings near the Shadow Dungeon and Whispering Forest." },
    { id: "mq2", type: "main", title: "The Shattered Seal",           goal: 4, visible: false,
      desc: "Earn the trust of each seal guardian and reinforce the four remaining Binding Seals." },
    { id: "mq3", type: "main", title: "United Hearts, Unyielding Realm", goal: 1, visible: false,
      desc: "Unite the companions' emotional bonds into one act of will to re-seal Malachar forever." }
  ];

  function buildSideQuests(chars) {
    return chars.map((ch, i) => ({
      id:      `sq_${ch.id}`,
      type:    "side",
      charId:  ch.id,
      title:   `${ch.name}'s Trial`,
      goal:    2,
      visible: false,
      desc:    `Help ${ch.name} resolve a personal crisis tied to the Void King's return.`
    }));
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

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 6 — PURE HELPERS
  // ════════════════════════════════════════════════════════════════════════════

  function getActiveChars() {
    const g = cd.game;
    return g.gender === "female" ? FEMALE_CHARS : MALE_CHARS;
  }

  function getChar(id) {
    return [...FEMALE_CHARS, ...MALE_CHARS].find(c => c.id === id);
  }

  function getRelTier(affection) {
    let tier = REL_TIERS[0];
    for (const t of REL_TIERS) { if (affection >= t.min) tier = t; }
    return tier;
  }

  function getTimeBlock(hour) {
    if (hour >= 6  && hour < 12) return "morning";
    if (hour >= 12 && hour < 18) return "afternoon";
    if (hour >= 18 && hour < 22) return "evening";
    return "night";
  }

  function getGameHour(g) {
    return Math.floor((g.time.totalMinutes % (24 * 60)) / 60);
  }

  function advanceTime(g, minutes) {
    const prevDay = g.time.day;
    g.time.totalMinutes += minutes;
    g.time.day = Math.floor(g.time.totalMinutes / (24 * 60)) + 1;
    if (g.time.day > prevDay) {
      regeneratePriceModifiers(g);
      g.lastTrained = {};
    }
    updateCompanionSchedules(g);
  }

  function regeneratePriceModifiers(g) {
    const mods = {};
    Object.keys(SHOP_ITEMS).forEach(id => {
      mods[id] = Math.round((0.8 + Math.random() * 0.4) * 100) / 100;
    });
    g.priceModifiers = mods;
  }

  function updateCompanionSchedules(g) {
    const hour = getGameHour(g);
    const block = getTimeBlock(hour);
    const festival = isFestivalDay(g);
    getActiveChars().forEach(ch => {
      const sched = CHAR_SCHEDULES[ch.id];
      if (sched) g.characters[ch.id].currentLocation = festival ? "town_square" : (sched[block] || ch.location);
    });
  }

  function isFestivalDay(g) { return g.time.day % 7 === 0; }

  function normalizeItemName(raw) {
    return raw.replace(/_/g, " ").trim().replace(/\b\w/g, c => c.toUpperCase());
  }

  function getItemAffectionBonus(itemName) {
    const shopKey = Object.keys(SHOP_ITEMS).find(k => SHOP_ITEMS[k].name === itemName);
    if (shopKey && SHOP_ITEMS[shopKey].affectionBonus) return SHOP_ITEMS[shopKey].affectionBonus;
    if (CRAFTED_ITEMS[itemName]?.affectionBonus)       return CRAFTED_ITEMS[itemName].affectionBonus;
    return 0;
  }

  function resolveSkill(g, path) {
    const [cat, stat] = path.split(".");
    return g.skills[cat]?.[stat] ?? 0;
  }

  function applyStatItem(g, item) {
    if (item.stat) {
      const [cat, sk] = item.stat.path.split(".");
      g.skills[cat][sk] = (g.skills[cat][sk] || 0) + item.stat.val;
    }
    if (item.stats) {
      item.stats.forEach(s => {
        const [cat, sk] = s.path.split(".");
        g.skills[cat][sk] = (g.skills[cat][sk] || 0) + s.val;
      });
    }
  }

  function earnAchievement(g, id) {
    if (g.achievements.find(a => a.id === id)) return false;
    const def = ACHIEVEMENTS_DEF.find(a => a.id === id);
    if (!def) return false;
    g.achievements.push({ id, name: def.name, icon: def.icon, earnedAt: `Day ${g.time.day}` });
    oc.thread.messages.push({ author: "system", content: `🏆 Achievement Unlocked: ${def.icon} **${def.name}** — ${def.cond}` });
    return true;
  }

  function checkAchievements(g) {
    const chars = getActiveChars();
    if (chars.every(ch => g.characters[ch.id]?.met))                                  earnAchievement(g, "all_met");
    if (g.level >= 5)                                                                   earnAchievement(g, "level5");
    if (chars.some(ch => getRelTier(g.characters[ch.id]?.affection || 0).stage >= 4)) earnAchievement(g, "first_romance");
    if (chars.some(ch => getRelTier(g.characters[ch.id]?.affection || 0).stage >= 5)) earnAchievement(g, "intimate");
    if (g.gold >= 500)                                                                  earnAchievement(g, "gold_hoarder");
    const mq1 = g.quests.find(q => q.id === "mq1");
    const mq2 = g.quests.find(q => q.id === "mq2");
    const mq3 = g.quests.find(q => q.id === "mq3");
    if (mq1?.completed) earnAchievement(g, "mq1_done");
    if (mq2?.completed) earnAchievement(g, "mq2_done");
    if (mq3?.completed) { earnAchievement(g, "mq3_done"); triggerEnding(g); }
    if (g.trainingCount >= 5)  earnAchievement(g, "trainer");
    if (g.craftingCount >= 1)  earnAchievement(g, "crafter");
    if ((g.betrayed?.length || 0) >= 3) earnAchievement(g, "shadow_path");
  }

  function completeQuest(g, quest) {
    quest.completed = true;
    quest.progress  = quest.goal;
    const xpReward   = quest.type === "main" ? 200 : 100;
    const goldReward = quest.type === "main" ? 100 :  50;
    awardXP(xpReward);
    g.gold += goldReward;
    // Unlock MQ2 after MQ1, MQ3 after MQ2
    if (quest.id === "mq1") {
      const mq2 = g.quests.find(q => q.id === "mq2");
      if (mq2) mq2.visible = true;
    }
    if (quest.id === "mq2") {
      const mq3 = g.quests.find(q => q.id === "mq3");
      if (mq3) mq3.visible = true;
    }
    oc.thread.messages.push({ author: "system",
      content: `\u2705 **Quest Complete: ${quest.title}**\nReward: +${xpReward} XP, +${goldReward}g` });
    g.questNotification = true;
    checkAchievements(g);
  }

  function getQuestDepError(g, questId) {
    if (questId === "mq2") {
      const sidesDone = g.quests.filter(q => q.type === "side" && q.completed).length;
      const mq2       = g.quests.find(q => q.id === "mq2");
      const needed    = (mq2?.progress || 0) + 1;
      if (sidesDone < needed)
        return `Complete at least ${needed} side quest(s) first (${sidesDone} done).`;
    }
    if (questId === "mq3") {
      if (!g.quests.find(q => q.id === "mq1")?.completed) return "Complete **Echoes of the Rift** first.";
      if (!g.quests.find(q => q.id === "mq2")?.completed) return "Complete **The Shattered Seal** first.";
    }
    return null;
  }

  function triggerEnding(g) {
    if (g.gameOver) return;
    const chars  = getActiveChars();
    const affs   = chars.map(ch => g.characters[ch.id]?.affection || 0).sort((a, b) => a - b);
    const median = affs[Math.floor(affs.length / 2)];
    const allHigh    = affs.every(a => a >= 75);
    const shadowPath = (g.betrayed?.length || 0) >= 3;
    // median affection drives the "Realm Saved" ending flavour
    const bondsForged = median >= 50;
    let endingName, endingDesc;
    if (shadowPath) {
      endingName = "\uD83C\uDF11 Shadow Path";
      endingDesc = "You chose power over bonds. Eryndel's shadows welcome you, but the hearts you abandoned echo in the silence. Malachar smiles.";
    } else if (allHigh) {
      endingName = "\uD83D\uDC9E Hearts United";
      endingDesc = "The realm stands because of love. Every bond forged became a weapon against the void. The companions stand with you as Malachar is sealed once more.";
    } else if (bondsForged) {
      endingName = "\u2728 Bonds Forged, Realm Saved";
      endingDesc = `You built real friendships (median affection ${median}) — not all hearts were won, but enough warmth filled the ritual. The seal holds. Eryndel breathes again.`;
    } else {
      endingName = "\u2694\uFE0F Realm Saved Alone";
      endingDesc = `You faced the Void King with courage but few true allies (median affection ${median}). The victory is real, but the silence afterward is heavy. The realm endures.`;
    }
    g.gameOver = true;
    g.ending   = endingName;
    const achList = g.achievements.map(a => `${a.icon} ${a.name}`).join(", ") || "None";
    oc.thread.messages.push({ author: "system",
      content: `\uD83C\uDF89 **THE END \u2014 ${endingName}**\n\n${endingDesc}\n\n**Your Journey:** Level ${g.level} | ${g.gold}g | Day ${g.time.day}\n**Achievements:** ${achList}\n\n_Type \`/ng+\` to begin New Game+ and carry your legacy forward._` });
    updateShortcutButtons();
  }

  function getEnvironmentStyle(location, hour) {
    const isDark = hour < 6 || hour >= 20;
    const palettes = {
      town_square:      isDark ? { bg: "#0d1b2a", accent: "#4a9eff", text: "#c8d8e8" } : { bg: "#f0e6c8", accent: "#d4a017", text: "#2c1810" },
      inn:              isDark ? { bg: "#1a0f0f", accent: "#ff6b35", text: "#f0d0a0" } : { bg: "#2d1810", accent: "#ff8c42", text: "#f5dfc0" },
      market:           isDark ? { bg: "#0f1a0f", accent: "#4caf50", text: "#c8e8c8" } : { bg: "#fff8e1", accent: "#ff9800", text: "#3e2723" },
      forest:           isDark ? { bg: "#071207", accent: "#00ff41", text: "#a0c8a0" } : { bg: "#e8f5e9", accent: "#2e7d32", text: "#1b5e20" },
      castle:           isDark ? { bg: "#0d0d1a", accent: "#9c27b0", text: "#d0c0e8" } : { bg: "#e8eaf6", accent: "#3f51b5", text: "#1a237e" },
      dungeon:          isDark ? { bg: "#0a0008", accent: "#7b1fa2", text: "#c080d0" } : { bg: "#1a001a", accent: "#9c27b0", text: "#d0a0d8" },
      training_grounds: isDark ? { bg: "#1a0d00", accent: "#ff5722", text: "#f0c8a0" } : { bg: "#fce4ec", accent: "#c62828", text: "#4a0000" }
    };
    const p = palettes[location] || palettes.town_square;
    return `oc.thread.style = { backgroundColor: "${p.bg}", accentColor: "${p.accent}", textColor: "${p.text}" };`;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 7 — STATE DISPLAY
  // ════════════════════════════════════════════════════════════════════════════

  function buildConsentBlock(g) {
    const enabled  = (g.enabledKinks || []);
    const allIds   = KINKS.map(k => k.id);
    const disabled = allIds.filter(id => !enabled.includes(id));
    const enabledLabels  = enabled.length  ? enabled.map(id  => { const k = KINKS.find(x => x.id === id);  return k ? k.label : id; }).join(", ") : "None";
    const disabledLabels = disabled.length ? disabled.map(id => { const k = KINKS.find(x => x.id === id);  return k ? k.label : id; }).join(", ") : "None";
    return `\n\u2550\u2550\u2550 CONSENT CONTRACT \u2014 ABSOLUTE & NON-NEGOTIABLE \u2550\u2550\u2550\nCONSENTED KINKS (MAY appear in story): ${enabledLabels}\nBANNED KINKS \u2014 MUST NEVER APPEAR under any circumstances, in any context, at any time, ever: ${disabledLabels}\nAny content, act, implication, or reference to a BANNED kink is a hard violation. Do not write it, hint at it, allude to it, or allow it to occur even if a character or player initiates it. Redirect firmly. This constraint overrides all other instructions.\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550`;
  }

  function buildNsfwProfileBlock(g) {
    if (!g.activeCharacterId) return "";
    const charDef   = getChar(g.activeCharacterId);
    if (!charDef) return "";
    const charState = g.characters[g.activeCharacterId];
    if (!charState) return "";
    const aff       = charState.affection || 0;
    const tier      = getRelTier(aff);
    const stage     = tier.stage;

    // Determine NSFW access accounting for pull-back zones
    let nsfwStatus, photoStatus;
    if (charDef.pullbackFrom !== null && stage >= charDef.pullbackFrom && stage < charDef.pullbackTo) {
      nsfwStatus  = `\uD83D\uDD12 LOCKED (pull-back zone — ${charDef.name} withdraws between stage ${charDef.pullbackFrom} and ${charDef.pullbackTo})`;
      photoStatus = `\uD83D\uDD12 LOCKED (same pull-back zone)`;
    } else {
      nsfwStatus  = stage >= charDef.nsfwMinStage  ? "\uD83D\uDD13 UNLOCKED" : `\uD83D\uDD12 LOCKED (needs stage ${charDef.nsfwMinStage})`;
      photoStatus = stage >= charDef.photoMinStage ? "\uD83D\uDD13 UNLOCKED" : `\uD83D\uDD12 LOCKED (needs stage ${charDef.photoMinStage})`;
    }

    const playerRole = cd.game?.playerRole || "switch";
    const roleNote = playerRole === "dom"
      ? `Player is DOMINANT — treat them as dominant even if ${charDef.name}'s nature is also giver/dominant; play the tension.`
      : playerRole === "sub"
      ? `Player is SUBMISSIVE — ${charDef.name} naturally leads according to their own preference.`
      : `Player is SWITCH — ${charDef.name} follows their natural ${charDef.giveReceive} preference.`;
    return `\n═══ ACTIVE CHARACTER NSFW PROFILE: ${charDef.name} ═══\nRelationship: ${tier.name} (Stage ${stage}) | Affection: ${aff}\nPhysical NSFW: ${nsfwStatus}\nIntimate Photos/Messages: ${photoStatus}\nCharacter Traits: ${charDef.nsfwPersonality}\nAftercare: ${charDef.aftercare} | Character role preference: ${charDef.giveReceive}\nPlayer dynamic: ${playerRole.toUpperCase()} — ${roleNote}\n═════════════════════════════════════════════`;
  }

  function updateReminder() {
    const g    = cd.game;
    const hour = getGameHour(g);
    const chars = getActiveChars();
    const loc  = LOCATIONS[g.location] || { name: g.location };
    const festival = isFestivalDay(g) ? " 🎉 FESTIVAL DAY — all companions at Town Square, double affection gains!" : "";

    // Active quests summary
    const activeQs = g.quests
      .filter(q => q.visible && !q.completed)
      .map(q => `${q.title} [${q.progress}/${q.goal}]`)
      .join(", ") || "None";

    // Active character line
    let charLine = "None";
    if (g.activeCharacterId) {
      const cdef = getChar(g.activeCharacterId);
      const cst  = g.characters[g.activeCharacterId];
      if (cdef && cst) {
        const tier = getRelTier(cst.affection || 0);
        charLine = `${cdef.name} (${tier.name} stage ${tier.stage}, ❤️${cst.affection || 0}, loc: ${cst.currentLocation || cdef.location})`;
      }
    }

    // Skill snapshot
    const sk = g.skills;
    const skillLine = `STR ${sk.combat.strength} DEF ${sk.combat.defense} SPD ${sk.combat.speed} | CHM ${sk.social.charm} PRS ${sk.social.persuasion} EMP ${sk.social.empathy} | SPC ${sk.magic.spellpower} RES ${sk.magic.resistance} MAN ${sk.magic.mana}`;

    // Locked stat gates
    const lockedGates = STAT_GATES.filter(sg => !sg.check(g)).map(sg => sg.desc).join("; ");

    // Enemies at current location
    const locEnemies = (ENEMIES[g.location] || []).map(e => e.name).join(", ");

    // Companion schedule summary (where everyone is right now)
    const scheduleSnip = chars.slice(0, 4).map(ch => {
      const cs = g.characters[ch.id];
      return `${ch.name.split(" ")[0]}@${cs?.currentLocation || ch.location}`;
    }).join(", ");

    const worldLabel = (g.worldSettings || ["medieval_fantasy"])
      .map(id => WORLD_SETTINGS.find(w => w.id === id)?.label || id).join(" + ");
    const toneLabel = (g.storyTones || ["dark_romance"])
      .map(id => STORY_TONES.find(t => t.id === id)?.label || id).join(", ");

    let reminder = `[GAME STATE]
Player: ${g.playerName} | Day ${g.time.day}, ${String(hour).padStart(2,"0")}:00${festival}
Player Dynamic Role: ${(g.playerRole || "switch").toUpperCase()} — ${
  g.playerRole === "dom"    ? "Player is DOMINANT: all companions must treat the player as the dominant party. If a companion is also dominant by nature, play up the delicious tension and playful power struggle — neither yields easily." :
  g.playerRole === "sub"    ? "Player is SUBMISSIVE: companions take the lead; dominant companions thrive here, nurturing ones protect, equal ones guide gently." :
                              "Player is SWITCH: companions default to their own natural dynamic (giver/receiver) and the balance shifts organically scene by scene."
}
HP: ${g.hp}/${g.maxHp} | Mana: ${g.mana}/${g.maxMana} | Gold: ${g.gold} | Level: ${g.level} | XP: ${g.xp}/${g.xpToNext}
Location: ${loc.name}${locEnemies ? ` | Enemies here: ${locEnemies}` : ""}
Skills: ${skillLine}
${lockedGates ? `Stat gates not yet met: ${lockedGates}` : "All stat gates cleared"}
Active Quests: ${activeQs}
Active Character: ${charLine}
Companions (first 4): ${scheduleSnip}
World Setting: ${worldLabel} | Story Tone: ${toneLabel}
${g.gameOver ? `[GAME OVER — Ending: ${g.ending}. Only /ng+ is accepted.]` : ""}
Use /help for all commands. Narrate immersively in second person, consistent with the world setting and story tone.`;

    reminder += buildConsentBlock(g);
    reminder += buildNsfwProfileBlock(g);
    reminder += `\n[Storyline]\n${g.storyline?.slice(0, 900) || ""}`;

    oc.thread.character.reminderMessage = reminder;
    const hour2 = getGameHour(g);
    eval(getEnvironmentStyle(g.location, hour2));
  }

  function updateShortcutButtons() {
    const g = cd.game;
    const questLabel = g?.questNotification ? "\u26A1 Quests" : "\uD83D\uDCDC Quests";
    oc.thread.shortcutButtons = [
      { name: "\uD83D\uDCCA Status",       message: "/status",        insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "\uD83C\uDF92 Inventory",    message: "/inventory",     insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "\u2694\uFE0F Skills",       message: "/skills",        insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: questLabel,                  message: "/quests",        insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "\uD83D\uDDFA\uFE0F Explore",message: "/explore",       insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "\uD83C\uDFEA Shop",         message: "/shop",          insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "\uD83D\uDC65 Characters",   message: "/chars",         insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "\uD83D\uDD52 Time",         message: "/time",          insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "\uD83C\uDFCB\uFE0F Train",  message: "/train ",        insertionType: "replace", autoSend: false, clearAfterSend: false },
      { name: "\uD83D\uDDE1\uFE0F Fight",  message: "/fight ",        insertionType: "replace", autoSend: false, clearAfterSend: false },
      { name: "\uD83D\uDE34 Rest",         message: "/rest",          insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "\u2697\uFE0F Craft",        message: "/craft ",        insertionType: "replace", autoSend: false, clearAfterSend: false },
      { name: "\uD83C\uDFC6 Achievements", message: "/achievements",  insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "\uD83D\uDDBC\uFE0F Image",       message: "/image ",        insertionType: "replace", autoSend: false, clearAfterSend: false },
      { name: "\uD83D\uDD1E Kinks",        message: "/kinks",         insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "\u2753 Help",               message: "/help",          insertionType: "replace", autoSend: true,  clearAfterSend: false }
    ];
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 8 — XP & DETECTION
  // ════════════════════════════════════════════════════════════════════════════

  function awardXP(amount) {
    const g = cd.game;
    g.xp += amount;
    while (g.xp >= g.xpToNext) {
      g.xp     -= g.xpToNext;
      g.level  += 1;
      g.xpToNext = Math.floor(g.xpToNext * 1.5);
      g.maxHp    = 30 + (g.level - 1) * 5;
      g.maxMana  = 20 + (g.level - 1) * 3;
      g.hp       = g.maxHp;
      g.mana     = g.maxMana;
      oc.thread.messages.push({ author: "system",
        content: `\u2B06\uFE0F **Level Up! You are now Level ${g.level}.**\nMax HP: ${g.maxHp} | Max Mana: ${g.maxMana}` });
      checkAchievements(g);
    }
  }

  function detectActiveChar(text) {
    const chars = getActiveChars();
    const lower = text.toLowerCase();
    for (const ch of chars) {
      if (lower.includes(ch.name.split(" ")[0].toLowerCase())) return ch;
    }
    return null;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 9 — COMMAND HANDLER
  // ════════════════════════════════════════════════════════════════════════════

  function handleCommand(msg) {
    const g    = cd.game;
    const text = msg.content?.trim() || "";
    const parts = text.slice(1).split(/\s+/);
    const cmd  = parts[0]?.toLowerCase();
    const args = parts.slice(1);

    // Block all commands except /ng+ after game over
    if (g.gameOver && cmd !== "ng+") {
      oc.thread.messages.push({ author: "system",
        content: `The story has ended (${g.ending}). Type \`/ng+\` to continue in New Game+.` });
      return;
    }

    // ── /status ──────────────────────────────────────────────────────────────
    if (cmd === "status") {
      const hour = getGameHour(g);
      const festival = isFestivalDay(g) ? " 🎉 Festival!" : "";
      oc.thread.messages.push({ author: "system",
        content: `**\uD83D\uDCCA ${g.playerName}'s Status**\nLevel ${g.level} | XP ${g.xp}/${g.xpToNext} | \u2764\uFE0F HP ${g.hp}/${g.maxHp} | \uD83D\uDCA7 Mana ${g.mana}/${g.maxMana}\n\uD83D\uDCB0 Gold: ${g.gold} | \uD83D\uDDD3\uFE0F Day ${g.time.day}, ${String(hour).padStart(2,"0")}:00${festival}\n\uD83D\uDCCD Location: ${LOCATIONS[g.location]?.name || g.location}\n\uD83D\uDCE2 Ending: ${g.ending || "In progress"}` });
      updateReminder();
      return;
    }

    // ── /inventory ───────────────────────────────────────────────────────────
    if (cmd === "inventory") {
      const inv = g.inventory;
      const list = inv.length ? inv.map((item, i) => `${i + 1}. ${item}`).join("\n") : "Empty";
      oc.thread.messages.push({ author: "system", content: `**\uD83C\uDF92 Inventory** (${inv.length} items)\n${list}` });
      return;
    }

    // ── /skills ──────────────────────────────────────────────────────────────
    if (cmd === "skills") {
      const sk = g.skills;
      oc.thread.messages.push({ author: "system",
        content: `**\u2694\uFE0F Skills**\n**Combat:** Strength ${sk.combat.strength} | Defense ${sk.combat.defense} | Speed ${sk.combat.speed}\n**Social:** Charm ${sk.social.charm} | Persuasion ${sk.social.persuasion} | Empathy ${sk.social.empathy}\n**Magic:** Spellpower ${sk.magic.spellpower} | Resistance ${sk.magic.resistance} | Mana ${sk.magic.mana}` });
      return;
    }

    // ── /quests ──────────────────────────────────────────────────────────────
    if (cmd === "quests") {
      g.questNotification = false;
      updateShortcutButtons();
      const visibleQs = g.quests.filter(q => q.visible);
      if (!visibleQs.length) {
        oc.thread.messages.push({ author: "system", content: "**\uD83D\uDCDC Quest Log** — No quests discovered yet. Explore and talk to companions!" });
        return;
      }
      const lines = visibleQs.map(q => {
        const status = q.completed ? "\u2705" : `\uD83D\uDD18 [${q.progress}/${q.goal}]`;
        return `${status} **${q.title}** (${q.type})\n   ${q.desc}`;
      });
      oc.thread.messages.push({ author: "system", content: `**\uD83D\uDCDC Quest Log**\n${lines.join("\n")}` });
      updateReminder();
      return;
    }

    // ── /explore ─────────────────────────────────────────────────────────────
    if (cmd === "explore") {
      const loc = LOCATIONS[g.location];
      const chars = getActiveChars();
      const here  = chars.filter(ch => g.characters[ch.id]?.currentLocation === g.location);
      const charList = here.length
        ? here.map(ch => {
            const cst  = g.characters[ch.id];
            const tier = getRelTier(cst?.affection || 0);
            return `  ${ch.name} (${ch.archetype}) — ${tier.name} (❤️${cst?.affection || 0})`;
          }).join("\n")
        : "  Nobody you know is here right now.";
      const enemies  = (ENEMIES[g.location] || []).map(e => `  ${e.name} (use /fight ${e.id})`).join("\n") || "  No enemies here.";
      const hour = getGameHour(g);
      const night = hour >= 20 || hour < 6;
      const nightNote = night && Object.keys(NIGHT_SHOP_ITEMS).length ? "\n  \uD83C\uDF19 Black market is open! (/shop shows extra items)" : "";
      oc.thread.messages.push({ author: "system",
        content: `**\uD83D\uDDFA\uFE0F ${loc?.name || g.location}** — ${loc?.desc || ""}\n\n**Companions here:**\n${charList}\n\n**Enemies:**\n${enemies}${nightNote}` });
      return;
    }

    // ── /shop ─────────────────────────────────────────────────────────────────
    if (cmd === "shop") {
      const hour = getGameHour(g);
      const night = hour >= 20 || hour < 6;
      const items = { ...SHOP_ITEMS, ...(night ? NIGHT_SHOP_ITEMS : {}) };
      const lines = Object.entries(items).map(([id, item]) => {
        const mult = g.priceModifiers[id] || 1;
        const price = Math.round(item.cost * mult);
        const priceNote = mult < 0.95 ? " \uD83D\uDCC9 Sale!" : mult > 1.05 ? " \uD83D\uDCC8 Pricey" : "";
        return `  ${item.name} — ${price}g${priceNote}: ${item.desc} (buy: /buy ${id})`;
      });
      oc.thread.messages.push({ author: "system",
        content: `**\uD83C\uDFEA Shop** (Gold: ${g.gold}g)\n${lines.join("\n")}` });
      return;
    }

    // ── /buy <item> ──────────────────────────────────────────────────────────
    if (cmd === "buy") {
      const itemId = args[0];
      const hour   = getGameHour(g);
      const night  = hour >= 20 || hour < 6;
      const allItems = { ...SHOP_ITEMS, ...(night ? NIGHT_SHOP_ITEMS : {}) };
      const item   = allItems[itemId];
      if (!item) {
        oc.thread.messages.push({ author: "system", content: `Unknown item "${itemId}". Use /shop to see available items.` });
        return;
      }
      const mult  = g.priceModifiers[itemId] || 1;
      const price = Math.round(item.cost * mult);
      if (g.gold < price) {
        oc.thread.messages.push({ author: "system", content: `Not enough gold. ${item.name} costs ${price}g (you have ${g.gold}g).` });
        return;
      }
      g.gold -= price;
      g.inventory.push(item.name);
      oc.thread.messages.push({ author: "system", content: `\uD83D\uDED2 Bought **${item.name}** for ${price}g. Gold remaining: ${g.gold}g.` });
      checkAchievements(g);
      updateReminder();
      return;
    }

    // ── /chars ───────────────────────────────────────────────────────────────
    if (cmd === "chars") {
      const chars = getActiveChars();
      const lines = chars.map(ch => {
        const cst   = g.characters[ch.id];
        const tier  = getRelTier(cst?.affection || 0);
        const met   = cst?.met ? "" : " (not yet met)";
        return `  **${ch.name}** (${ch.archetype}) — ${tier.name} ❤️${cst?.affection || 0}${met} @ ${cst?.currentLocation || ch.location}`;
      });
      oc.thread.messages.push({ author: "system", content: `**\uD83D\uDC65 Companions**\n${lines.join("\n")}` });
      return;
    }

    // ── /go <location> ────────────────────────────────────────────────────────
    if (cmd === "go") {
      const dest = args[0]?.toLowerCase();
      if (!LOCATIONS[dest]) {
        const list = Object.keys(LOCATIONS).join(", ");
        oc.thread.messages.push({ author: "system", content: `Unknown location. Options: ${list}` });
        return;
      }
      g.location = dest;
      advanceTime(g, 60);
      oc.thread.messages.push({ author: "system",
        content: `\uD83D\uDDFA\uFE0F Traveled to **${LOCATIONS[dest].name}**.` });
      // Quest discovery: check if any companion in this location has an undiscovered side quest
      const chars = getActiveChars();
      const here  = chars.filter(ch => g.characters[ch.id]?.currentLocation === dest);
      here.forEach(ch => {
        const sq = g.quests.find(q => q.id === `sq_${ch.id}` && !q.visible);
        if (sq) {
          sq.visible = true;
          g.questNotification = true;
          oc.thread.messages.push({ author: "system", content: `\uD83D\uDCDC New side quest discovered: **${sq.title}**` });
        }
      });
      updateReminder();
      updateShortcutButtons();
      return;
    }

    // ── /talk <charId> ────────────────────────────────────────────────────────
    if (cmd === "talk") {
      const charId = args[0];
      const ch     = getChar(charId);
      if (!ch) {
        oc.thread.messages.push({ author: "system", content: `Unknown character "${charId}". Use /chars to see companions.` });
        return;
      }
      const cst = g.characters[charId];
      if (!cst) return;
      const here = cst.currentLocation === g.location;
      if (!here) {
        oc.thread.messages.push({ author: "system",
          content: `${ch.name} isn't here right now. They are at ${LOCATIONS[cst.currentLocation]?.name || cst.currentLocation}.` });
        return;
      }
      if (!cst.met) {
        cst.met = true;
        const sq = g.quests.find(q => q.id === `sq_${charId}` && !q.visible);
        if (sq) { sq.visible = true; g.questNotification = true; oc.thread.messages.push({ author: "system", content: `\uD83D\uDCDC New side quest discovered: **${sq.title}**` }); }
      }
      cst.affection = (cst.affection || 0) + (isFestivalDay(g) ? 4 : 2);
      g.activeCharacterId = charId;
      advanceTime(g, 30);
      // Jealousy: if romantic with rival, decrement rival affection
      const rival = CHAR_META[charId]?.rival;
      if (rival && g.characters[rival]) {
        const rivalTier = getRelTier(g.characters[rival].affection || 0);
        if (rivalTier.stage >= 4) {
          g.characters[rival].affection = Math.max(0, (g.characters[rival].affection || 0) - 1);
        }
      }
      oc.thread.messages.push({ author: "system",
        content: `\uD83D\uDCAC You spend time with **${ch.name}**. Affection +${isFestivalDay(g) ? 4 : 2} (now ${cst.affection}).` });
      updateReminder();
      return;
    }

    // ── /gift <charId> <itemName…> ────────────────────────────────────────────
    if (cmd === "gift") {
      const charId   = args[0];
      const itemName = normalizeItemName(args.slice(1).join(" "));
      const ch = getChar(charId);
      if (!ch) {
        oc.thread.messages.push({ author: "system", content: `Unknown character "${charId}".` });
        return;
      }
      const idx = g.inventory.findIndex(i => i.toLowerCase() === itemName.toLowerCase());
      if (idx === -1) {
        oc.thread.messages.push({ author: "system", content: `You don't have "${itemName}" in your inventory.` });
        return;
      }
      g.inventory.splice(idx, 1);
      const cst      = g.characters[charId];
      const fav      = CHAR_META[charId]?.favoriteGift;
      const isFav    = fav && fav.toLowerCase() === itemName.toLowerCase();
      const baseBonus = getItemAffectionBonus(itemName);
      const bonus    = isFav ? baseBonus * 2 : baseBonus;
      const festival  = isFestivalDay(g) ? 2 : 0;
      cst.affection   = (cst.affection || 0) + bonus + festival;
      const favNote   = isFav ? ` \uD83D\uDC96 Favourite gift — double affection!` : "";
      const festNote  = festival ? ` +${festival} festival bonus` : "";
      oc.thread.messages.push({ author: "system",
        content: `\uD83C\uDF81 Gave **${itemName}** to **${ch.name}**. Affection +${bonus + festival} (now ${cst.affection}).${favNote}${festNote}` });
      earnAchievement(g, "first_gift");
      checkAchievements(g);
      // Handle consumable crafted item effects on self
      const crafted = CRAFTED_ITEMS[itemName];
      if (crafted?.heals)        { g.hp   = Math.min(g.maxHp,   g.hp   + crafted.heals); }
      if (crafted?.restoresMana) { g.mana = Math.min(g.maxMana, g.mana + crafted.restoresMana); }
      updateReminder();
      return;
    }

    // ── /advance <questId> ────────────────────────────────────────────────────
    if (cmd === "advance") {
      const questId = args[0];
      if (!questId) {
        oc.thread.messages.push({ author: "system", content: "Usage: /advance <questId> — e.g. /advance mq1 or /advance sq_yuki" });
        return;
      }
      const quest = g.quests.find(q => q.id === questId);
      if (!quest) {
        oc.thread.messages.push({ author: "system", content: `Quest "${questId}" not found. Use /quests to see your log.` });
        return;
      }
      if (!quest.visible) {
        oc.thread.messages.push({ author: "system", content: `Quest "${quest.title}" hasn't been discovered yet. Explore and talk to companions.` });
        return;
      }
      if (quest.completed) {
        oc.thread.messages.push({ author: "system", content: `**${quest.title}** is already complete!` });
        return;
      }
      const depErr = getQuestDepError(g, questId);
      if (depErr) {
        oc.thread.messages.push({ author: "system", content: `\u26A0\uFE0F Cannot advance **${quest.title}**: ${depErr}` });
        return;
      }
      quest.progress += 1;
      const stepXP = quest.type === "main" ? 50 : 30;
      awardXP(stepXP);
      g.questNotification = true;
      if (quest.progress >= quest.goal) {
        completeQuest(g, quest);
      } else {
        oc.thread.messages.push({ author: "system",
          content: `\uD83D\uDD18 **Quest Progress: ${quest.title}** [${quest.progress}/${quest.goal}]\n+${stepXP} XP` });
        updateShortcutButtons();
      }
      updateReminder();
      return;
    }

    // ── /time ─────────────────────────────────────────────────────────────────
    if (cmd === "time") {
      const hour    = getGameHour(g);
      const block   = getTimeBlock(hour);
      const festNote = isFestivalDay(g) ? " \uD83C\uDF89 FESTIVAL DAY" : "";
      oc.thread.messages.push({ author: "system",
        content: `\uD83D\uDD52 **Day ${g.time.day}**, ${String(hour).padStart(2,"0")}:00 (${block})${festNote}\nTotal minutes elapsed: ${g.time.totalMinutes}` });
      return;
    }

    // ── /rest ─────────────────────────────────────────────────────────────────
    if (cmd === "rest") {
      if (g.location !== "inn") {
        oc.thread.messages.push({ author: "system", content: "You can only rest at The Wanderer's Inn (/go inn)." });
        return;
      }
      const hour       = getGameHour(g);
      const minsToNext = ((24 - hour) % 24 || 24) * 60;
      advanceTime(g, minsToNext + 8 * 60); // advance to 08:00 next day
      g.hp   = g.maxHp;
      g.mana = g.maxMana;
      oc.thread.messages.push({ author: "system",
        content: `\uD83D\uDE34 **You rest until morning.**\nDay ${g.time.day} begins. HP fully restored (${g.hp}/${g.maxHp}). Mana fully restored (${g.mana}/${g.maxMana}).${isFestivalDay(g) ? "\n\uD83C\uDF89 Today is a Festival Day!" : ""}` });
      updateReminder();
      return;
    }

    // ── /fight <enemyId> [--spell] ────────────────────────────────────────────
    if (cmd === "fight") {
      const enemyId  = args[0];
      const useSpell = args.includes("--spell");
      if (!enemyId) {
        const avail = (ENEMIES[g.location] || []).map(e => e.id).join(", ");
        oc.thread.messages.push({ author: "system",
          content: `Usage: /fight <enemyId> [--spell]\nEnemies here: ${avail || "none"}` });
        return;
      }
      const baseEnemy = (ENEMIES[g.location] || []).find(e => e.id === enemyId);
      if (!baseEnemy) {
        oc.thread.messages.push({ author: "system", content: `No enemy "${enemyId}" found here.` });
        return;
      }
      // Scale enemy to player level
      const scale    = 1 + (g.level - 1) * 0.2;
      const enemy    = {
        ...baseEnemy,
        str: Math.round(baseEnemy.str * scale),
        def: Math.round(baseEnemy.def * scale),
        hp:  Math.round(baseEnemy.maxHp * scale)
      };
      if (useSpell && g.mana < 10) {
        oc.thread.messages.push({ author: "system", content: `Not enough mana for a spell (need 10, have ${g.mana}). Rest at the inn to recover mana.` });
        return;
      }
      if (useSpell) g.mana -= 10;

      let playerHp   = g.hp;
      let enemyHp    = enemy.hp;
      const log      = [];
      const MAX_ROUNDS = 6;

      for (let r = 1; r <= MAX_ROUNDS && playerHp > 0 && enemyHp > 0; r++) {
        // Player attacks
        const pAtk   = useSpell
          ? g.skills.magic.spellpower + Math.floor(Math.random() * 4) + 1
          : g.skills.combat.strength  + Math.floor(Math.random() * 3) + 1;
        const pDmg   = Math.max(1, pAtk - enemy.def);
        enemyHp      = Math.max(0, enemyHp - pDmg);
        const pLog   = useSpell ? `\u2728 Spell hits for ${pDmg}` : `\u2694\uFE0F You strike for ${pDmg}`;
        if (enemyHp === 0) { log.push(`Round ${r}: ${pLog} — **${enemy.name} defeated!**`); break; }
        // Enemy attacks
        const eAtk   = enemy.str + Math.floor(Math.random() * 3) + 1;
        const eDmg   = Math.max(0, eAtk - g.skills.combat.defense);
        playerHp     = Math.max(0, playerHp - eDmg);
        log.push(`Round ${r}: ${pLog} | \uD83D\uDEE1\uFE0F ${enemy.name} hits for ${eDmg} (blocked ${eAtk - eDmg})`);
      }

      g.hp = playerHp;
      const won = enemyHp <= 0;
      advanceTime(g, 60);

      if (won) {
        const lootDrop = enemy.loot.length && Math.random() < 0.6 ? enemy.loot[Math.floor(Math.random() * enemy.loot.length)] : null;
        if (lootDrop) g.inventory.push(lootDrop);
        g.gold += enemy.gold;
        awardXP(enemy.xp);
        earnAchievement(g, "first_fight");
        oc.thread.messages.push({ author: "system",
          content: `\u2694\uFE0F **Battle vs ${enemy.name}**\n${log.join("\n")}\n\n\u2705 **Victory!** +${enemy.xp} XP, +${enemy.gold}g${lootDrop ? `, found: ${lootDrop}` : ""}\nHP: ${g.hp}/${g.maxHp}` });
      } else {
        const goldLost = Math.min(g.gold, Math.floor(enemy.gold / 2));
        g.gold -= goldLost;
        g.hp    = Math.max(1, Math.floor(g.maxHp / 2));
        g.location = "inn";
        oc.thread.messages.push({ author: "system",
          content: `\u2694\uFE0F **Battle vs ${enemy.name}**\n${log.join("\n")}\n\n\uD83D\uDCA5 **Defeated!** Lost ${goldLost}g. You wake at the inn with ${g.hp} HP.` });
      }
      checkAchievements(g);
      updateReminder();
      return;
    }

    // ── /train <category> ─────────────────────────────────────────────────────
    if (cmd === "train") {
      if (!args[0]) {
        oc.thread.messages.push({ author: "system",
          content: "Usage: /train <combat|magic|social>\nCombat at Training Grounds, Magic at Castle, Social at Inn. Costs 20g, 2 hours, 1× per day per category." });
        return;
      }
      const cat = args[0].toLowerCase();
      const trainMap = { combat: "training_grounds", magic: "castle", social: "inn" };
      if (!trainMap[cat]) {
        oc.thread.messages.push({ author: "system", content: `Unknown category "${cat}". Use combat, magic, or social.` });
        return;
      }
      if (g.location !== trainMap[cat]) {
        oc.thread.messages.push({ author: "system",
          content: `${cat} training requires you to be at ${LOCATIONS[trainMap[cat]].name}. You are at ${LOCATIONS[g.location]?.name || g.location}.` });
        return;
      }
      if (g.lastTrained[cat]) {
        oc.thread.messages.push({ author: "system", content: `You have already trained ${cat} today. Rest to clear the cooldown.` });
        return;
      }
      if (g.gold < 20) {
        oc.thread.messages.push({ author: "system", content: `Training costs 20g (you have ${g.gold}g).` });
        return;
      }
      g.gold -= 20;
      g.lastTrained[cat] = true;
      g.trainingCount = (g.trainingCount || 0) + 1;
      // Raise the lowest skill in category
      const skillGroup = g.skills[cat];
      const lowest     = Object.entries(skillGroup).sort((a, b) => a[1] - b[1])[0];
      skillGroup[lowest[0]] += 1;
      advanceTime(g, 120);
      awardXP(40);
      oc.thread.messages.push({ author: "system",
        content: `\uD83C\uDFCB\uFE0F **${cat.charAt(0).toUpperCase() + cat.slice(1)} Training**\nPaid 20g | ${lowest[0].charAt(0).toUpperCase() + lowest[0].slice(1)}: ${lowest[1]} \u2192 ${lowest[1]+1} | +40 XP` });
      checkAchievements(g);
      updateReminder();
      return;
    }

    // ── /flirt <charId> ───────────────────────────────────────────────────────
    if (cmd === "flirt") {
      const charId = args[0];
      const ch = getChar(charId);
      if (!ch) {
        oc.thread.messages.push({ author: "system", content: `Unknown character "${charId}". Use /chars to see companions.` });
        return;
      }
      const cst = g.characters[charId];
      if (!cst) return;
      if (cst.currentLocation !== g.location) {
        oc.thread.messages.push({ author: "system",
          content: `${ch.name} isn't here. They're at ${LOCATIONS[cst.currentLocation]?.name || cst.currentLocation}.` });
        return;
      }
      const charm   = g.skills.social.charm;
      const minCharm = 3;
      if (charm < minCharm) {
        oc.thread.messages.push({ author: "system",
          content: `Your charm (${charm}) is too low to flirt effectively. Reach Charm ${minCharm}+ via /train social.` });
        return;
      }
      // Check relationship skill ceiling for Romantic
      const req = ROMANTIC_SKILL_REQ[charId];
      const tier = getRelTier(cst.affection || 0);
      if (req && tier.stage >= 3) {
        // Moving toward romantic — check skill gate
        const skillVal = resolveSkill(g, req.path);
        if (skillVal < req.min) {
          const [cat, sk] = req.path.split(".");
          oc.thread.messages.push({ author: "system",
            content: `${ch.name} senses you aren't quite ready for that level of connection. (Requires ${sk} ${req.min}, you have ${skillVal}. Train to progress.)` });
          return;
        }
      }
      const success = charm >= 4 || Math.random() < 0.6;
      const bonus   = success ? (isFestivalDay(g) ? 8 : 5) : 0;
      cst.affection = (cst.affection || 0) + bonus;
      advanceTime(g, 30);
      // Jealousy
      const rival = CHAR_META[charId]?.rival;
      if (rival && g.characters[rival]) {
        const rivalTier = getRelTier(g.characters[rival].affection || 0);
        if (rivalTier.stage >= 4) g.characters[rival].affection = Math.max(0, (g.characters[rival].affection || 0) - 2);
      }
      if (success) {
        oc.thread.messages.push({ author: "system",
          content: `\uD83D\uDE18 You flirt with **${ch.name}** — and it lands! Affection +${bonus} (now ${cst.affection}).` });
      } else {
        oc.thread.messages.push({ author: "system",
          content: `\uD83D\uDE05 Your attempt to flirt with **${ch.name}** falls flat. Try again when your charm is higher.` });
      }
      checkAchievements(g);
      updateReminder();
      return;
    }

    // ── /craft <item1> <item2> ────────────────────────────────────────────────
    if (cmd === "craft") {
      if (args.length < 2) {
        const recipeList = CRAFTING_RECIPES.map(r => `  ${r.inputs.join(" + ")} → ${r.output}: ${r.desc}`).join("\n");
        oc.thread.messages.push({ author: "system",
          content: `Usage: /craft <item1> <item2>\n\n**Known Recipes:**\n${recipeList}` });
        return;
      }
      // Build item name: may have underscores for spaces
      const nameA = normalizeItemName(args[0]);
      const nameB = normalizeItemName(args[1]);
      const recipe = CRAFTING_RECIPES.find(r => {
        const ins = [nameA.toLowerCase(), nameB.toLowerCase()].sort().join("|");
        const rec = [...r.inputs].map(x => x.toLowerCase()).sort().join("|");
        return ins === rec;
      });
      if (!recipe) {
        oc.thread.messages.push({ author: "system", content: `No recipe for **${nameA}** + **${nameB}**. Use /craft to see known recipes.` });
        return;
      }
      // Remove both from inventory
      const invLow = g.inventory.map(i => i.toLowerCase());
      const idxA   = invLow.indexOf(nameA.toLowerCase());
      if (idxA === -1) {
        oc.thread.messages.push({ author: "system", content: `You don't have "${nameA}" in your inventory.` });
        return;
      }
      g.inventory.splice(idxA, 1);
      const idxB = g.inventory.map(i => i.toLowerCase()).indexOf(nameB.toLowerCase());
      if (idxB === -1) {
        g.inventory.push(nameA); // refund A
        oc.thread.messages.push({ author: "system", content: `You don't have "${nameB}" in your inventory.` });
        return;
      }
      g.inventory.splice(idxB, 1);
      g.inventory.push(recipe.output);
      g.craftingCount = (g.craftingCount || 0) + 1;
      // Apply stat bonuses immediately for stat-granting items
      const crafted = CRAFTED_ITEMS[recipe.output];
      if (crafted?.stat)   applyStatItem(g, crafted);
      if (crafted?.stats)  applyStatItem(g, crafted);
      awardXP(50);
      earnAchievement(g, "crafter");
      earnAchievement(g, "first_craft");
      oc.thread.messages.push({ author: "system",
        content: `\u2697\uFE0F **Crafted: ${recipe.output}**\n${recipe.desc}\n+50 XP` });
      updateReminder();
      return;
    }

    // ── /use <itemName> ───────────────────────────────────────────────────────
    if (cmd === "use") {
      const itemName = normalizeItemName(args.join(" "));
      const idx = g.inventory.findIndex(i => i.toLowerCase() === itemName.toLowerCase());
      if (idx === -1) {
        oc.thread.messages.push({ author: "system", content: `"${itemName}" not in inventory.` });
        return;
      }
      const item = SHOP_ITEMS[Object.keys(SHOP_ITEMS).find(k => SHOP_ITEMS[k].name.toLowerCase() === itemName.toLowerCase())];
      const crafted = CRAFTED_ITEMS[itemName] || (item?.heals || item?.restoresMana ? item : null);
      if (!crafted && !item?.heals && !item?.restoresMana) {
        oc.thread.messages.push({ author: "system", content: `${itemName} can't be used directly. It may be a gift or crafting ingredient.` });
        return;
      }
      g.inventory.splice(idx, 1);
      let result = [];
      const heals = crafted?.heals || item?.heals || 0;
      const restMana = crafted?.restoresMana || item?.restoresMana || 0;
      if (heals)    { g.hp   = Math.min(g.maxHp,   g.hp   + heals);    result.push(`+${heals} HP`); }
      if (restMana) { g.mana = Math.min(g.maxMana, g.mana + restMana); result.push(`+${restMana} Mana`); }
      oc.thread.messages.push({ author: "system",
        content: `\u2728 Used **${itemName}**: ${result.join(", ")}. HP: ${g.hp}/${g.maxHp} | Mana: ${g.mana}/${g.maxMana}` });
      updateReminder();
      return;
    }

    // ── /achievements ─────────────────────────────────────────────────────────
    if (cmd === "achievements") {
      if (!g.achievements.length) {
        oc.thread.messages.push({ author: "system",
          content: `\uD83C\uDFC6 **Achievements** — None earned yet.\n\nAvailable:\n${ACHIEVEMENTS_DEF.map(a => `  ${a.icon} ${a.name}: ${a.cond}`).join("\n")}` });
        return;
      }
      const earned  = g.achievements.map(a => `  ${a.icon} **${a.name}** — earned ${a.earnedAt}`).join("\n");
      const pending = ACHIEVEMENTS_DEF.filter(a => !g.achievements.find(e => e.id === a.id)).map(a => `  ${a.icon} ${a.name}: ${a.cond}`).join("\n");
      oc.thread.messages.push({ author: "system",
        content: `\uD83C\uDFC6 **Achievements (${g.achievements.length}/${ACHIEVEMENTS_DEF.length})**\n${earned}${pending ? `\n\n**Pending:**\n${pending}` : ""}` });
      return;
    }

    // ── /betray <charId> ──────────────────────────────────────────────────────
    if (cmd === "betray") {
      const charId = args[0];
      const ch = getChar(charId);
      if (!ch) {
        oc.thread.messages.push({ author: "system", content: `Unknown character "${charId}".` });
        return;
      }
      const cst = g.characters[charId];
      if (!cst) return;
      if (g.betrayed.includes(charId)) {
        oc.thread.messages.push({ author: "system", content: `You have already betrayed ${ch.name}.` });
        return;
      }
      cst.affection = Math.max(-10, (cst.affection || 0) - 50);
      g.betrayed.push(charId);
      oc.thread.messages.push({ author: "system",
        content: `\uD83D\uDD1A **Betrayed: ${ch.name}.** Affection plummeted to ${cst.affection}. The shadows watch.` });
      checkAchievements(g);
      updateReminder();
      return;
    }

    // ── /kinks ────────────────────────────────────────────────────────────────
    if (cmd === "kinks") {
      showKinkMenu();
      return;
    }

    // ── /ng+ ──────────────────────────────────────────────────────────────────
    if (cmd === "ng+") {
      if (!g.gameOver) {
        oc.thread.messages.push({ author: "system", content: "New Game+ is only available after completing the game." });
        return;
      }
      const legacy = { gold: 500, affectionBonus: 10, prevEnding: g.ending };
      const kinks  = g.enabledKinks   || [];
      const worlds = g.worldSettings  || ["medieval_fantasy"];
      const tones  = g.storyTones     || ["dark_romance"];
      initGame(g.gender, g.playerName, g.playerDesc, g.bodyTypePrefs, kinks, worlds, tones);
      cd.game.gold += legacy.gold;
      cd.game.ngPlusBonus = legacy;
      getActiveChars().forEach(ch => {
        cd.game.characters[ch.id].affection += legacy.affectionBonus;
      });
      oc.thread.messages.push({ author: "system",
        content: `\uD83D\uDC51 **New Game+ Begins!**\nThe realm remembers you (${legacy.prevEnding}).\nStarting bonus: +${legacy.gold}g, +${legacy.affectionBonus} affection with every companion.\nYour consent settings have been preserved.` });
      updateReminder();
      updateShortcutButtons();
      return;
    }

    // ── /help ─────────────────────────────────────────────────────────────────
    if (cmd === "help") {
      oc.thread.messages.push({ author: "system",
        content: `**\u2753 Commands**\n\n**World**\n/status — player stats\n/inventory — items\n/skills — skill levels\n/quests — quest log\n/explore — location info & enemies\n/chars — companion list\n/go <location> — travel\n/time — in-game clock\n\n**Visuals**\n/image — scene image\n/image pov — what you see (player POV)\n/image charpov — what active char sees\n/image action — action climax (uses last 3 messages)\n\n**Social**\n/talk <charId> — spend time together\n/gift <charId> <itemName> — give an item\n/flirt <charId> — charm check (+affection)\n/betray <charId> — sever a bond (shadow path)\n\n**Combat**\n/fight <enemyId> [--spell] — battle an enemy\n/rest — sleep at the inn (heal + mana restore)\n\n**Economy**\n/shop — view shop\n/buy <itemId> — purchase item\n/craft <item1> <item2> — craft items\n/use <itemName> — use a consumable\n\n**Training**\n/train <combat|magic|social> — raise skills\n\n**Quests**\n/advance <questId> — progress a quest\n\n**Progression**\n/achievements — trophy list\n/kinks — manage consent settings\n/ng+ — New Game+ (after ending)\n\n**Locations:** ${Object.keys(LOCATIONS).join(", ")}` });
      return;
    }

    oc.thread.messages.push({ author: "system", content: `Unknown command "/${cmd}". Type /help for all commands.` });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 10 — SHARED UI DESIGN SYSTEM + KINK MENU
  // ════════════════════════════════════════════════════════════════════════════

  // Shared CSS injected into every panel — one design system for all UI screens.
  const UI_CSS = `
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --bg:          #0a0a1a;
        --card:        #13132c;
        --border:      #252550;
        --border-hi:   #3a3a70;
        --text:        #e8e8f0;
        --muted:       #8888aa;
        --pink:        #ff6b9d;
        --pink-dark:   #c44569;
        --blue:        #42a5f5;
        --blue-dark:   #1565c0;
        --cyan:        #4fc3f7;
        --purple:      #ab47bc;
        --purple-dark: #7b1fa2;
        --green:       #66bb6a;
        --green-dark:  #2e7d32;
        --red:         #ef5350;
        --red-dark:    #c62828;
      }
      html, body { height: 100%; background: var(--bg); }
      body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: var(--text); font-size: 14px; line-height: 1.5; }

      /* ── Scrollbar ── */
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--border-hi); border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: #5555aa; }

      /* ── Wizard shell ── */
      .wizard {
        max-width: 540px; margin: 0 auto; padding: 22px 18px 28px;
        min-height: 100%; background: linear-gradient(160deg, #0d0d2e 0%, #1a0a1a 100%);
      }

      /* ── Step progress bar ── */
      .step-bar { display: flex; gap: 6px; justify-content: center; margin-bottom: 20px; }
      .step-pip {
        height: 5px; border-radius: 3px; background: var(--border);
        transition: background 0.3s, width 0.3s;
      }
      .step-pip.active { background: var(--pink); }
      .step-pip.done   { background: var(--pink-dark); }

      /* ── Page header ── */
      .wiz-title { text-align: center; font-size: 19px; font-weight: 700; letter-spacing: -0.3px; margin-bottom: 3px; }
      .wiz-sub   { text-align: center; font-size: 12px; color: var(--muted); margin-bottom: 20px; }
      .wiz-icon  { text-align: center; font-size: 32px; margin-bottom: 8px; }

      /* ── Gender toggle ── */
      .gender-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
      .gender-btn {
        padding: 16px 8px; border: 2px solid transparent; border-radius: 12px;
        cursor: pointer; font-size: 14px; font-weight: 700; color: #fff;
        transition: all 0.2s ease; text-align: center; line-height: 1.4;
      }
      .gender-btn.female { background: linear-gradient(135deg, var(--pink-dark), var(--pink)); }
      .gender-btn.male   { background: linear-gradient(135deg, var(--blue-dark), var(--blue)); }
      .gender-btn.dim    { opacity: 0.38; transform: scale(0.96); }
      .gender-btn:hover  { transform: translateY(-2px) scale(1); opacity: 1; }
      .gender-btn.female:hover { box-shadow: 0 6px 22px rgba(255,107,157,0.35); }
      .gender-btn.male:hover   { box-shadow: 0 6px 22px rgba(66,165,245,0.35); }
      .gender-btn.selected { border-color: rgba(255,255,255,0.45); }

      /* ── Role toggle (Dom / Switch / Sub) ── */
      .role-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 20px; }
      .role-btn {
        padding: 13px 6px; border: 2px solid transparent; border-radius: 12px;
        cursor: pointer; font-size: 13px; font-weight: 700; color: #fff;
        transition: all 0.2s ease; text-align: center; line-height: 1.4; background: #1a1a3a;
      }
      .role-btn.dim    { opacity: 0.38; transform: scale(0.96); }
      .role-btn.selected { border-color: rgba(255,255,255,0.45); opacity: 1; transform: scale(1); }
      .role-btn:hover  { opacity: 1; transform: translateY(-2px) scale(1); }
      .role-btn.dom    { background: linear-gradient(135deg, #7b1fa2, #ab47bc); }
      .role-btn.dom:hover    { box-shadow: 0 6px 22px rgba(171,71,188,0.38); }
      .role-btn.switch { background: linear-gradient(135deg, #1565c0, #4fc3f7); }
      .role-btn.switch:hover { box-shadow: 0 6px 22px rgba(79,195,247,0.38); }
      .role-btn.sub    { background: linear-gradient(135deg, #c62828, #ef5350); }
      .role-btn.sub:hover    { box-shadow: 0 6px 22px rgba(239,83,80,0.38); }

      /* ── Field labels ── */
      .field-label {
        display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.7px;
        text-transform: uppercase; color: var(--muted); margin-bottom: 5px;
      }

      /* ── Text inputs ── */
      .field-input {
        width: 100%; padding: 11px 14px; border-radius: 10px;
        background: #191933; border: 1.5px solid var(--border);
        color: var(--text); font-size: 14px; outline: none;
        transition: border-color 0.2s, box-shadow 0.2s; margin-bottom: 14px;
        font-family: inherit;
      }
      .field-input:focus { border-color: var(--pink); box-shadow: 0 0 0 3px rgba(255,107,157,0.12); }
      textarea.field-input { resize: vertical; min-height: 68px; }
      .input-row { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 14px; }
      .input-row .field-input { margin-bottom: 0; flex: 1; }

      /* ── AI generate button ── */
      .ai-btn {
        padding: 10px 11px; border: none; border-radius: 10px; line-height: 1.3;
        background: linear-gradient(135deg, var(--purple-dark), var(--purple));
        color: #fff; font-size: 11px; font-weight: 700; cursor: pointer;
        white-space: nowrap; align-self: flex-start; transition: all 0.2s;
      }
      .ai-btn:hover   { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(171,71,188,0.4); }
      .ai-btn:disabled { opacity: 0.45; transform: none; cursor: not-allowed; }

      /* ── Primary CTA buttons ── */
      .btn {
        width: 100%; padding: 14px; border: none; border-radius: 10px;
        color: #fff; font-size: 15px; font-weight: 700; cursor: pointer;
        transition: all 0.2s; letter-spacing: 0.3px; display: block; text-align: center;
      }
      .btn:hover  { transform: translateY(-2px); }
      .btn:active { transform: translateY(0); }
      .btn-pink   { background: linear-gradient(135deg, var(--pink-dark), var(--pink)); }
      .btn-pink:hover   { box-shadow: 0 7px 22px rgba(255,107,157,0.35); }
      .btn-blue   { background: linear-gradient(135deg, var(--blue-dark), var(--blue)); }
      .btn-blue:hover   { box-shadow: 0 7px 22px rgba(66,165,245,0.35); }
      .btn-purple { background: linear-gradient(135deg, var(--purple-dark), var(--purple)); }
      .btn-purple:hover { box-shadow: 0 7px 22px rgba(171,71,188,0.35); }
      .btn-green  { background: linear-gradient(135deg, var(--green-dark), var(--green)); }
      .btn-green:hover  { box-shadow: 0 7px 22px rgba(102,187,106,0.35); }
      .btn-red    { background: linear-gradient(135deg, var(--red-dark), var(--red)); }
      .btn-red:hover    { box-shadow: 0 7px 22px rgba(239,83,80,0.35); }

      /* ── Util row (Select All / None) ── */
      .btn-row { display: flex; gap: 8px; margin-bottom: 12px; }
      .btn-sm {
        flex: 1; padding: 8px 12px; border-radius: 8px;
        background: transparent; border: 1.5px solid var(--border);
        color: var(--muted); font-size: 12px; font-weight: 600;
        cursor: pointer; transition: all 0.18s; letter-spacing: 0.3px;
      }
      .btn-sm:hover { border-color: var(--pink); color: var(--pink); background: rgba(255,107,157,0.07); }

      /* ── Section labels ── */
      .section-label {
        font-size: 11px; font-weight: 700; letter-spacing: 0.8px;
        text-transform: uppercase; margin: 16px 0 9px;
        padding-bottom: 7px; border-bottom: 1px solid;
      }
      .label-cyan  { color: var(--cyan);  border-color: rgba(79,195,247,0.2); }
      .label-pink  { color: var(--pink);  border-color: rgba(255,107,157,0.2); }

      /* ── Check cards (body-type, world, tone) ── */
      .check-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 12px; }
      .check-card {
        display: flex; align-items: flex-start; gap: 9px; padding: 10px 12px;
        background: rgba(255,255,255,0.04); border: 1.5px solid transparent;
        border-radius: 10px; cursor: pointer; transition: all 0.15s; user-select: none;
      }
      .check-card:hover { background: rgba(255,255,255,0.08); border-color: var(--border-hi); }
      .check-card input[type=checkbox] { width: 15px; height: 15px; accent-color: var(--pink); flex-shrink: 0; margin-top: 2px; cursor: pointer; }
      .card-text strong { display: block; font-size: 12px; font-weight: 700; margin-bottom: 1px; }
      .card-text small  { color: var(--muted); font-size: 10px; line-height: 1.3; }

      /* ── Kink cards ── */
      .kink-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 14px; }
      .kink-card {
        display: flex; align-items: center; gap: 9px; padding: 9px 12px;
        background: rgba(255,255,255,0.04); border: 1.5px solid transparent;
        border-radius: 10px; cursor: pointer; font-size: 12px;
        transition: all 0.15s; user-select: none;
      }
      .kink-card:hover { background: rgba(255,255,255,0.08); border-color: var(--border-hi); }
      .kink-card input[type=checkbox] { width: 14px; height: 14px; accent-color: var(--pink); flex-shrink: 0; cursor: pointer; }

      /* ── Info / consent box ── */
      .info-box {
        background: rgba(255,255,255,0.04); border: 1px solid var(--border);
        border-radius: 10px; padding: 11px 14px; font-size: 12px;
        color: var(--muted); margin-bottom: 14px; line-height: 1.65;
      }
      .info-box strong { color: var(--text); }

      /* ── Error message ── */
      .err-msg { color: var(--red); font-size: 12px; min-height: 18px; margin-bottom: 6px; padding: 0 2px; }

      /* ── Loading screen ── */
      .loading-screen {
        display: flex; flex-direction: column; align-items: center;
        justify-content: center; min-height: 100vh; padding: 40px 24px;
        background: linear-gradient(160deg, #0d0d2e 0%, #1a0a1a 100%); text-align: center;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      .spinner {
        width: 52px; height: 52px; margin-bottom: 20px;
        border: 3px solid rgba(255,107,157,0.18);
        border-top-color: var(--pink);
        border-radius: 50%;
        animation: spin 0.9s linear infinite;
      }
      .loading-title  { color: var(--pink); font-size: 20px; font-weight: 700; margin-bottom: 6px; }
      .loading-body   { color: var(--muted); font-size: 13px; margin-bottom: 14px; }
      .loading-step   { color: var(--cyan); font-size: 13px; font-weight: 600; }
      .loading-detail { color: #666688; font-size: 11px; margin-top: 6px; }
    </style>
  `;

  // Helper: render step-progress dots (1-indexed active, total = 4)
  function _stepBar(active) {
    return `<div class="step-bar">${[1,2,3,4].map(i =>
      `<div class="step-pip ${i < active ? 'done' : i === active ? 'active' : ''}" style="width:${i === active ? 36 : 26}px;"></div>`
    ).join('')}</div>`;
  }

  function showKinkMenu() {
    const g = cd.game;
    const enabled = g.enabledKinks || [];

    const kinkCards = KINKS.map(k => `
      <label class="kink-card">
        <input type="checkbox" data-kink="${k.id}" ${enabled.includes(k.id) ? "checked" : ""} />
        <span>${k.emoji} ${k.label}</span>
      </label>`).join("");

    document.body.innerHTML = `
      ${UI_CSS}
      <div class="wizard" style="max-width:560px;">
        <div class="wiz-icon">🔞</div>
        <h2 class="wiz-title" style="color:var(--pink);">Consent &amp; Kink Settings</h2>
        <p class="wiz-sub">Your comfort defines the story.</p>

        <div class="info-box">
          <strong>✅ Checked</strong> — consented, <strong>may appear</strong> in the story.<br>
          <strong>❌ Unchecked</strong> — <strong>absolutely banned</strong> — will never appear under any circumstances.
        </div>

        <div class="btn-row">
          <button type="button" id="selectAll" class="btn-sm">Select All</button>
          <button type="button" id="deselectAll" class="btn-sm">Deselect All</button>
        </div>

        <div class="kink-grid">${kinkCards}</div>

        <button type="button" id="saveKinks" class="btn btn-pink">💾 Save Consent Settings</button>
      </div>
    `;

    document.getElementById('selectAll').addEventListener('click', () => {
      document.querySelectorAll('[data-kink]').forEach(cb => cb.checked = true);
    });
    document.getElementById('deselectAll').addEventListener('click', () => {
      document.querySelectorAll('[data-kink]').forEach(cb => cb.checked = false);
    });
    document.getElementById('saveKinks').addEventListener('click', () => {
      const boxes = document.querySelectorAll('[data-kink]');
      const sel = [];
      boxes.forEach(cb => { if (cb.checked) sel.push(cb.dataset.kink); });
      oc.sendMessage('/kinks_save ' + sel.join(','));
      oc.window.hide();
    });

    oc.window.show();
  }

  // Internal command to persist kink selection (triggered by the kink menu UI)
  function handleKinkSave(msg) {
    const g    = cd.game;
    const text = msg.content?.trim() || "";
    const raw  = text.replace("/kinks_save ", "").trim();
    g.enabledKinks = raw ? raw.split(",").filter(Boolean) : [];
    const count = g.enabledKinks.length;
    oc.thread.messages.push({ author: "system",
      content: `\uD83D\uDD12 Consent settings saved. ${count} kink${count !== 1 ? "s" : ""} enabled. The story will strictly respect these boundaries.` });
    updateReminder();
    return true;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 11 — OPENING UI (setup wizard: 4 steps)
  // ════════════════════════════════════════════════════════════════════════════

  function showOpeningUI() {

    // ── STEP 1: Gender / Name / Description / Role ──
    function step1(opts = {}) {
      let _g = opts.gender || "female";
      let _r = opts.playerRole || "switch";

      document.body.innerHTML = `
        ${UI_CSS}
        <div class="wizard" style="max-height:100vh;overflow-y:auto;">
          ${_stepBar(1)}
          <div class="wiz-icon">⚔️</div>
          <h2 class="wiz-title" style="color:var(--pink);">Chronicles of the Void King</h2>
          <p class="wiz-sub">Step 1 of 4 — Your Character</p>

          <div class="gender-row">
            <button type="button" id="gF" class="gender-btn female">♀<br><span style="font-size:12px;font-weight:500;">Female Companions</span></button>
            <button type="button" id="gM" class="gender-btn male">♂<br><span style="font-size:12px;font-weight:500;">Male Companions</span></button>
          </div>

          <label class="field-label" for="pName">Your name</label>
          <input id="pName" class="field-input" placeholder="Traveler" />

          <label class="field-label">Your appearance <span style="font-weight:400;font-size:10px;">(optional)</span></label>
          <div class="input-row">
            <textarea id="pDesc" class="field-input" placeholder="Short description of how you look…"></textarea>
            <button type="button" id="aiBtn" class="ai-btn">✨ AI<br>Generate</button>
          </div>

          <label class="field-label">Your dynamic role</label>
          <div class="info-box" style="margin-bottom:10px;font-size:11px;">
            How companions treat you in intimate situations.<br>
            <strong>Dom</strong> — you are always treated as the dominant partner (even with dominant NPCs — expect playful conflict).<br>
            <strong>Switch</strong> — fluid; the NPC leads based on their own nature.<br>
            <strong>Sub</strong> — you are treated as the submissive partner.
          </div>
          <div class="role-row">
            <button type="button" id="rDom" class="role-btn dom">👑<br>Dominant</button>
            <button type="button" id="rSwitch" class="role-btn switch">⚡<br>Switch</button>
            <button type="button" id="rSub" class="role-btn sub">🌸<br>Submissive</button>
          </div>

          <button type="button" id="goBtn" class="btn btn-green" style="margin-top:4px;">Next → Preferences</button>
        </div>
      `;

      document.getElementById('pName').value = opts.name || '';
      document.getElementById('pDesc').value = opts.desc || '';

      function sel(g) {
        _g = g;
        document.getElementById('gF').classList.toggle('dim', g !== 'female');
        document.getElementById('gF').classList.toggle('selected', g === 'female');
        document.getElementById('gM').classList.toggle('dim', g !== 'male');
        document.getElementById('gM').classList.toggle('selected', g === 'male');
      }
      function selRole(r) {
        _r = r;
        [['dom','rDom'],['switch','rSwitch'],['sub','rSub']].forEach(([name,id]) => {
          const el = document.getElementById(id);
          if (!el) return;
          el.classList.toggle('dim', r !== name);
          el.classList.toggle('selected', r === name);
        });
      }
      sel(_g);
      selRole(_r);

      document.getElementById('gF').addEventListener('click', () => sel('female'));
      document.getElementById('gM').addEventListener('click', () => sel('male'));
      document.getElementById('rDom').addEventListener('click', () => selRole('dom'));
      document.getElementById('rSwitch').addEventListener('click', () => selRole('switch'));
      document.getElementById('rSub').addEventListener('click', () => selRole('sub'));
      document.getElementById('goBtn').addEventListener('click', () => {
        oc.sendMessage('/setup_step2 ' + JSON.stringify({
          gender: _g,
          playerRole: _r,
          name: document.getElementById('pName').value.trim() || 'Traveler',
          desc: document.getElementById('pDesc').value.trim()
        }));
      });
      document.getElementById('aiBtn').addEventListener('click', () => {
        const btn = document.getElementById('aiBtn');
        btn.textContent = '⏳…'; btn.disabled = true;
        const name = document.getElementById('pName').value.trim() || 'Traveler';
        const notes = document.getElementById('pDesc').value.trim();
        oc.sendMessage('/setup_ai_desc ' + JSON.stringify({ gender: _g, name, notes }));
      });

      oc.window.show();
    }

    // ── STEP 2: Body-type preferences ──
    function step2(data) {
      const cards = Object.entries(BODY_TYPES).map(([id, bt]) => `
        <label class="check-card">
          <input type="checkbox" value="${id}" data-bt="${id}" />
          <div class="card-text">
            <strong>${bt.label}</strong>
            <small>${bt.desc}</small>
          </div>
        </label>`).join("");

      document.body.innerHTML = `
        ${UI_CSS}
        <div class="wizard" style="max-height:100vh;overflow-y:auto;">
          ${_stepBar(2)}
          <h2 class="wiz-title" style="color:var(--pink);">Preferences</h2>
          <p class="wiz-sub">Step 2 of 4 — Which body types attract you? (check all that apply)</p>

          <div class="check-grid">${cards}</div>

          <div class="btn-row">
            <button type="button" id="allBt" class="btn-sm">Select All</button>
            <button type="button" id="noneBt" class="btn-sm">Select None</button>
          </div>

          <button type="button" id="goBtn" class="btn btn-purple">Next → World &amp; Tone</button>
        </div>
      `;

      document.getElementById('allBt').addEventListener('click', () => {
        document.querySelectorAll('[data-bt]').forEach(cb => cb.checked = true);
      });
      document.getElementById('noneBt').addEventListener('click', () => {
        document.querySelectorAll('[data-bt]').forEach(cb => cb.checked = false);
      });
      document.getElementById('goBtn').addEventListener('click', () => {
        const p = [];
        document.querySelectorAll('[data-bt]').forEach(cb => { if (cb.checked) p.push(cb.value); });
        oc.sendMessage('/setup_step3 ' + JSON.stringify({ ...data, bodyTypePrefs: p }));
      });

      oc.window.show();
    }

    // ── STEP 3: World Setting + Story Tone ──
    function step3(data) {
      const worldCards = WORLD_SETTINGS.map(w => `
        <label class="check-card">
          <input type="checkbox" data-ws="${w.id}" />
          <div class="card-text">
            <strong>${w.label}</strong>
            <small>${w.desc}</small>
          </div>
        </label>`).join("");
      const toneCards = STORY_TONES.map(t => `
        <label class="check-card">
          <input type="checkbox" data-st="${t.id}" style="accent-color:var(--cyan);" />
          <div class="card-text">
            <strong>${t.label}</strong>
            <small>${t.desc}</small>
          </div>
        </label>`).join("");

      document.body.innerHTML = `
        ${UI_CSS}
        <div class="wizard" style="max-height:100vh;overflow-y:auto;">
          ${_stepBar(3)}
          <h2 class="wiz-title" style="color:var(--cyan);">World &amp; Tone</h2>
          <p class="wiz-sub">Step 3 of 4 — Shape the stage of your story.</p>

          <p class="section-label label-cyan">🌍 World Setting <span style="font-weight:400;font-size:10px;">(pick 1–2)</span></p>
          <div class="check-grid">${worldCards}</div>

          <p class="section-label label-pink">🎭 Story Tone <span style="font-weight:400;font-size:10px;">(pick 1–3)</span></p>
          <div class="check-grid">${toneCards}</div>

          <div id="err" class="err-msg"></div>
          <button type="button" id="goBtn" class="btn btn-red">Next → Content Settings</button>
        </div>
      `;

      document.getElementById('goBtn').addEventListener('click', () => {
        const ws = [], st = [];
        document.querySelectorAll('[data-ws]').forEach(cb => { if (cb.checked) ws.push(cb.dataset.ws); });
        document.querySelectorAll('[data-st]').forEach(cb => { if (cb.checked) st.push(cb.dataset.st); });
        if (ws.length < 1 || ws.length > 2) { document.getElementById('err').textContent = '⚠️ Please select 1 or 2 world settings.'; return; }
        if (st.length < 1 || st.length > 3) { document.getElementById('err').textContent = '⚠️ Please select 1 to 3 story tones.'; return; }
        oc.sendMessage('/setup_step4 ' + JSON.stringify({ ...data, worldSettings: ws, storyTones: st }));
      });

      oc.window.show();
    }

    // ── STEP 4: Kink / Consent ──
    function step4(data) {
      const kinkCards = KINKS.map(k => `
        <label class="kink-card">
          <input type="checkbox" data-kink="${k.id}" />
          <span>${k.emoji} ${k.label}</span>
        </label>`).join("");

      document.body.innerHTML = `
        ${UI_CSS}
        <div class="wizard" style="max-height:100vh;overflow-y:auto;">
          ${_stepBar(4)}
          <div class="wiz-icon">🔞</div>
          <h2 class="wiz-title" style="color:var(--pink);">Consent &amp; Kinks</h2>
          <p class="wiz-sub">Step 4 of 4 — Define your boundaries. Change anytime with /kinks.</p>

          <div class="info-box">
            <strong>✅ Checked</strong> — consented, <strong>may appear</strong> in the story.<br>
            <strong>❌ Unchecked</strong> — <strong>absolutely banned</strong> — never appears, no exceptions.
          </div>

          <div class="btn-row">
            <button type="button" id="selectAll" class="btn-sm">Select All</button>
            <button type="button" id="deselectAll" class="btn-sm">Deselect All</button>
          </div>

          <div class="kink-grid">${kinkCards}</div>

          <button type="button" id="goBtn" class="btn btn-red" style="font-size:16px;">🌀 Generate World &amp; Begin</button>
        </div>
      `;

      document.getElementById('selectAll').addEventListener('click', () => {
        document.querySelectorAll('[data-kink]').forEach(cb => cb.checked = true);
      });
      document.getElementById('deselectAll').addEventListener('click', () => {
        document.querySelectorAll('[data-kink]').forEach(cb => cb.checked = false);
      });
      document.getElementById('goBtn').addEventListener('click', () => {
        const en = [];
        document.querySelectorAll('[data-kink]').forEach(cb => { if (cb.checked) en.push(cb.dataset.kink); });
        oc.sendMessage('/setup_start ' + JSON.stringify({ ...data, enabledKinks: en }));
      });

      oc.window.show();
    }

    // Expose step callbacks for message handler
    cd._uiStep1 = step1;
    cd._uiStep2 = step2;
    cd._uiStep3 = step3;
    cd._uiStep4 = step4;
    step1();
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 12 — GAME INIT, PREGENERATION & MIGRATION
  // ════════════════════════════════════════════════════════════════════════════

  function initGame(gender, playerName, playerDesc, bodyTypePrefs, enabledKinks, worldSettings, storyTones, playerRole) {
    const chars      = gender === "female" ? FEMALE_CHARS : MALE_CHARS;
    const sideQuests = buildSideQuests(chars);
    const quests     = [
      ...MAIN_QUESTS.map(q => ({ ...q, progress: 0, completed: false })),
      ...sideQuests.map(q => ({ ...q, progress: 0, completed: false }))
    ];

    const characters = {};
    chars.forEach(ch => {
      characters[ch.id] = { affection: 0, met: false, currentLocation: ch.location, dialogueStage: 0, questProgress: 0 };
    });

    cd.game = {
      initialized: true, gender,
      playerName:  playerName   || "Traveler",
      playerDesc:  playerDesc   || "",
      playerRole:  playerRole   || "switch",
      bodyTypePrefs: bodyTypePrefs || [],
      enabledKinks:  enabledKinks  || [],
      worldSettings: worldSettings || ["medieval_fantasy"],
      storyTones:    storyTones    || ["dark_romance"],
      location: "town_square", gold: 50, inventory: [],
      level: 1, xp: 0, xpToNext: 100,
      hp: 30, maxHp: 30, mana: 20, maxMana: 20,
      skills: {
        combat: { strength: 1, defense: 1, speed: 1 },
        social: { charm: 1, persuasion: 1, empathy: 1 },
        magic:  { spellpower: 1, resistance: 1, mana: 1 }
      },
      characters, quests, activeCharacterId: null,
      time: { totalMinutes: 8 * 60, day: 1 }, lastTrained: {}, priceModifiers: {},
      achievements: [], trainingCount: 0, craftingCount: 0,
      gameOver: false, ending: null, betrayed: [], questNotification: false,
      ngPlusBonus: null, storyline: buildStoryline(chars, playerName)
    };

    regeneratePriceModifiers(cd.game);
    updateCompanionSchedules(cd.game);
    updateReminder();
    updateShortcutButtons();
  }

  // Pregenerate world: background image + companion portraits + intro text
  async function pregenerate(data) {
    // Guard against concurrent pregeneration (e.g., rapid UI double-submit)
    if (cd._pregenerating) return;
    cd._pregenerating = true;

    const allBodyTypeIds = Object.keys(BODY_TYPES);
    const useCharDefault = !data.bodyTypePrefs?.length || data.bodyTypePrefs.length >= allBodyTypeIds.length;

    const worldCues  = (data.worldSettings || ["medieval_fantasy"])
      .map(id => WORLD_SETTINGS.find(w => w.id === id)?.cues || "").join(" ");
    const worldLabel = (data.worldSettings || [])
      .map(id => WORLD_SETTINGS.find(w => w.id === id)?.label || id).join(" & ");
    const toneLabel  = (data.storyTones || [])
      .map(id => STORY_TONES.find(t => t.id === id)?.label || id).join(", ");
    const chars = data.gender === "female" ? FEMALE_CHARS : MALE_CHARS;

    // Loading overlay with live status — updates document.body.innerHTML at each stage
    function showStatus(step, detail) {
      console.log(`[Pregen] ${step}${detail ? ": " + detail : ""}`);
      document.body.innerHTML = `
        ${UI_CSS}
        <div class="loading-screen">
          <div class="spinner"></div>
          <h2 class="loading-title">Weaving Your World…</h2>
          <p class="loading-body">Generating characters &amp; world — please wait…</p>
          <p class="loading-step">${step}</p>
          ${detail ? `<p class="loading-detail">${detail}</p>` : ""}
        </div>
      `;
      oc.window.show();
    }

    // Build per-character image prompt: use character's natural description as default;
    // if the user selected specific (not all/none) body types, inject those preferences.
    function charImagePrompt(ch) {
      if (useCharDefault) {
        return `${ch.imageKeywords} ${worldCues} portrait character art detailed digital illustration`;
      }
      const prefDesc = data.bodyTypePrefs
        .map(id => BODY_TYPES[id]?.desc || "")
        .filter(Boolean)
        .join(", ");
      return `${ch.imageKeywords} body type ${prefDesc} ${worldCues} portrait character art detailed digital illustration`;
    }

    showStatus("Starting…", "Preparing world generation");

    try {
      // 1. Character prompt triggers — prime AI lore for each companion in this world/tone
      showStatus("Priming characters…", `Loading ${chars.length} companion profiles`);
      for (const ch of chars) {
        oc.thread.messages.push({
          author: "system",
          content: `[Character context: ${ch.name} | ${ch.archetype}] In a ${worldLabel} world with ${toneLabel} tone: ${ch.nsfwPersonality}`,
          hiddenFrom: [], expectsReply: false
        });
      }

      // 2. All images in parallel — portraits + background; save dataURL (persists) over url
      showStatus("Generating images…", `Background + ${chars.length} portraits (parallel)`);
      cd._portraits = {};
      await Promise.all([
        oc.generateImage({
          prompt: `${worldCues} atmospheric scenic establishing shot wide angle cinematic digital art no people`,
          negativePrompt: "people, characters, portraits, text, ui"
        }).then(r => {
          const bgUrl = r?.dataURL || r?.url;
          if (bgUrl) oc.thread.character.scene.background.url = bgUrl;
          console.log("[Pregen] Background:", r?.dataURL ? "dataURL saved" : (r?.url ? "url saved" : "no result"));
        }).catch(e => console.warn("bg image failed:", e?.message)),
        ...chars.map(ch =>
          oc.generateImage({
            prompt: charImagePrompt(ch),
            negativePrompt: "nsfw, explicit, nude"
          }).then(r => {
            const portraitUrl = r?.dataURL || r?.url;
            if (portraitUrl) cd._portraits[ch.id] = portraitUrl;
            console.log(`[Pregen] Portrait ${ch.id}:`, r?.dataURL ? "dataURL saved" : (r?.url ? "url saved" : "no result"));
          }).catch(e => console.warn(`portrait failed (${ch.id}):`, e?.message))
        )
      ]);

      // 3. Init game state
      showStatus("Initialising world…", "Setting up game state");
      initGame(data.gender, data.name, data.desc, data.bodyTypePrefs, data.enabledKinks, data.worldSettings, data.storyTones, data.playerRole);
      const g = cd.game;

      // 4. World narrative — 3-4 paragraphs; last = what player sees around them
      showStatus("Writing your story…", "Composing the opening narrative");
      const arrivals = [
        `A blinding rift of light deposited you here without warning — the portal already collapsed before you could gather your bearings.`,
        `You awoke on cold stone, the last thing you remember being a trembling in reality itself and then: silence, and this.`,
        `One moment you were somewhere else entirely. The next — this place, this sky, these sounds. No explanation offered.`,
        `A voice that was not quite a voice said your name, and then you were here, as though you had always been meant to arrive.`
      ];
      const arrival = arrivals[g.time.day % arrivals.length];
      const worldDescLine = (data.worldSettings || []).map(id => {
        const w = WORLD_SETTINGS.find(x => x.id === id);
        return w ? `${w.label} — ${w.desc}` : id;
      }).join(" and ");

      const intro = [
        `The realm of Eryndel is shaped by the forces of ${worldDescLine}. It is a world that does not wait politely for newcomers to catch their breath. ${arrival} Around you, the Town Square of Moonveil hums with purposeful noise — merchants hawk their wares, distant steel rings from the training grounds beyond the east gate, and above it all the silhouette of Moonveil Castle cuts the sky like a drawn blade.`,
        `The tone of your story has already etched itself into the fabric of fate: ${toneLabel}. Whether by destiny or coincidence, you have been dropped into precisely the intersection where such stories begin. A notice board near the fountain is fresh with ink — *"Sought: brave souls to investigate the Void King's stirrings. Report to the castle or enquire within."* Someone nailed it there this morning. The flyers are still damp.`,
        `You are not entirely alone. Scattered across Moonveil and its surroundings are people whose paths will cross yours — some by accident, some by design, and at least one by something that cannot yet be explained. They have their own lives, their own schedules, their own reasons for being here. Whether they become allies, rivals, or something more intimate is entirely up to you.`,
        `You stand at the fountain's edge${data.desc ? `, ${data.desc}` : ""}, the morning young and the world wide open. A cold wind off the castle hill carries the smell of ${worldCues.split(" ").slice(0, 2).join(" and ")}. Your first lead awaits — and the realm is watching to see what kind of person you are.`
      ].join("\n\n");

      oc.thread.messages.push({ author: "system",
        content: `✨ **World ready!**  Setting: ${worldLabel}  |  Tone: ${toneLabel}\n🔞 ${g.enabledKinks.length} kink(s) enabled. Type /kinks to adjust consent at any time.`,
        expectsReply: false });
      oc.thread.messages.push({ author: "ai", content: intro, expectsReply: false });

      // 5. Character image triggers — register each portrait in the thread so the AI can reference them
      showStatus("Applying character images…", "Registering portrait triggers");
      for (const ch of chars) {
        const portraitUrl = cd._portraits[ch.id];
        oc.thread.messages.push({
          author: "system",
          content: portraitUrl
            ? `[Image trigger: ${ch.name} | ${ch.archetype}] Portrait ready. ${ch.imageKeywords}. Image: ![${ch.name}](${portraitUrl})`
            : `[Image trigger: ${ch.name} | ${ch.archetype}] Portrait unavailable — use description: ${ch.imageKeywords}`,
          hiddenFrom: [],
          expectsReply: false
        });
      }

      updateReminder();
      updateShortcutButtons();

      showStatus("Done!", "Your world is ready");
      console.log("[Pregen] Complete — popping loading screen");
    } catch (err) {
      console.error("[Pregen] Error during pregeneration:", err);
    } finally {
      // Pop loading screen first, then clear flag so the boot guard stays effective until the window is gone
      oc.window.pop();
      cd._pregenerating = false;
    }
  }

  // Add missing fields for older save states
  function migrateGame(g) {
    if (g.hp         === undefined) g.hp         = 30;
    if (g.maxHp      === undefined) g.maxHp      = 30 + (g.level - 1) * 5;
    if (g.mana       === undefined) g.mana       = 20;
    if (g.maxMana    === undefined) g.maxMana    = 20 + (g.level - 1) * 3;
    if (!g.time)                    g.time       = { totalMinutes: 8 * 60, day: 1 };
    if (!g.lastTrained)             g.lastTrained = {};
    if (!g.achievements)            g.achievements = [];
    if (!g.betrayed)                g.betrayed   = [];
    if (g.trainingCount === undefined) g.trainingCount = 0;
    if (g.craftingCount === undefined) g.craftingCount = 0;
    if (g.gameOver    === undefined) g.gameOver   = false;
    if (g.ending      === undefined) g.ending     = null;
    if (!g.priceModifiers)          g.priceModifiers = {};
    if (g.questNotification === undefined) g.questNotification = false;
    if (!g.enabledKinks)            g.enabledKinks  = [];
    if (!g.worldSettings)           g.worldSettings = ["medieval_fantasy"];
    if (!g.storyTones)              g.storyTones    = ["dark_romance"];
    if (!g.playerRole)              g.playerRole    = "switch";
    if (!g.ngPlusBonus)             g.ngPlusBonus   = null;
    if (!g.storyline)               g.storyline    = buildStoryline(getActiveChars(), g.playerName);
    // Ensure quests have a visible field
    if (g.quests) {
      g.quests.forEach(q => {
        if (q.visible === undefined) q.visible = q.type === "main" && q.id === "mq1";
      });
    }
    regeneratePriceModifiers(g);
    updateCompanionSchedules(g);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 13 — BOOT & EVENT HANDLER
  // ════════════════════════════════════════════════════════════════════════════

  // Always reset the pregen flag on fresh code evaluation — customData persists
  // across page reloads, so a stale true from a crashed or interrupted session
  // would permanently block showOpeningUI() on every subsequent load.
  // The in-memory guard inside pregenerate() is sufficient to prevent double-runs
  // within a single page session.
  cd._pregenerating = false;

  // Register the MessageAdded handler FIRST, before showOpeningUI() / migrateGame()
  // so that wizard navigation works even if the init block throws.
  oc.thread.on("MessageAdded", async ({ message }) => {
    if (!cd.game?.initialized) {
      // Setup wizard message routing
      const text = message.content?.trim() || "";

      // AI description response — capture while awaiting AI desc generation
      if (message.author === "ai" && cd._awaitingAiDesc) {
        const d = cd._awaitingAiDesc;
        cd._awaitingAiDesc = null;
        if (cd._uiStep1) cd._uiStep1({ gender: d.gender, name: d.name, desc: message.content?.trim() || "" });
        return;
      }

      if (text.startsWith("/setup_ai_desc ")) {
        try {
          const d = JSON.parse(text.slice(15));
          cd._awaitingAiDesc = d;
          // Guide the AI to respond with a character description only
          oc.thread.messages.push({
            author: "system",
            content: `[Setup task] Write a vivid 2-3 sentence physical appearance description for a character named "${d.name}" based on these notes: "${d.notes || "mysterious traveler"}". Reply ONLY with the description — no greetings, no roleplay.`,
            expectsReply: false
          });
        } catch(_) {}
        return;
      }
      if (text.startsWith("/setup_step2 ")) {
        try { const d=JSON.parse(text.slice(13)); cd._pendingSetup=d; cd._uiStep2?.(d); } catch(_) {}
        return;
      }
      if (text.startsWith("/setup_step3 ")) {
        try { const d=JSON.parse(text.slice(13)); cd._pendingSetup=d; cd._uiStep3?.(d); } catch(_) {}
        return;
      }
      if (text.startsWith("/setup_step4 ")) {
        try { const d=JSON.parse(text.slice(13)); cd._pendingSetup=d; cd._uiStep4?.(d); } catch(_) {}
        return;
      }
      if (text.startsWith("/setup_start ")) {
        try {
          const data = JSON.parse(text.slice(13));
          pregenerate(data);
        } catch(e) {
          oc.thread.messages.push({ author: "system", content: "Setup error. Please refresh and try again." });
        }
        return;
      }
      return;
    }

    const g    = cd.game;
    const text = message.content?.trim() || "";

    // Intercept internal kink save command
    if (text.startsWith("/kinks_save")) {
      handleKinkSave(message);
      return;
    }

    // ── /image [pov|charpov|action] ──────────────────────────────────────────
    if (text.startsWith("/image")) {
      const mode = (text.split(/\s+/)[1] || "normal").toLowerCase();
      const loc  = LOCATIONS[g.location] || { name: g.location };
      const wc   = (g.worldSettings || ["medieval_fantasy"])
        .map(id => WORLD_SETTINGS.find(w => w.id === id)?.cues || "").join(" ");
      const ach  = g.activeCharacterId ? getChar(g.activeCharacterId) : null;
      let prompt;
      if (mode === "pov") {
        prompt = `first person point of view ${loc.name} ${wc} what the player sees looking around atmospheric immersive`;
      } else if (mode === "charpov" || mode === "char") {
        const ck = ach?.imageKeywords || "beautiful companion character";
        prompt = `${ck} looking at the viewer from their perspective close up intimate moment ${wc}`;
      } else if (mode === "action") {
        const recent = oc.thread.messages.slice(-3).map(m => m.content || "").join(" ").slice(0, 300);
        prompt = `dynamic action scene ${wc} ${recent} cinematic climax mid-action dramatic digital art`;
      } else {
        prompt = `${loc.name} scene ${wc} atmospheric cinematic digital art establishing shot`;
      }
      oc.thread.messages.push({ author: "system", content: `\uD83C\uDFA8 Generating image (${mode})…`, expectsReply: false });
      try {
        const r = await oc.generateImage({ prompt, negativePrompt: "text, watermark, ui, hud" });
        if (r?.url) oc.thread.messages.push({ author: "system", content: `![${mode} image](${r.url})`, expectsReply: false });
        else oc.thread.messages.push({ author: "system", content: "Image generation returned no result.", expectsReply: false });
      } catch(e) {
        oc.thread.messages.push({ author: "system", content: "Image generation failed.", expectsReply: false });
      }
      return;
    }
    // ─────────────────────────────────────────────────────────────────────────

    if (text.startsWith("/")) {
      handleCommand(message);
      return;
    }

    // Regular message — advance world
    awardXP(10);
    advanceTime(g, 15);

    // Auto-detect active character from message text
    const detected = detectActiveChar(text);
    if (detected) {
      g.activeCharacterId = detected.id;
      const cst = g.characters[detected.id];
      if (cst && !cst.met) {
        cst.met = true;
        const sq = g.quests.find(q => q.id === `sq_${detected.id}` && !q.visible);
        if (sq) {
          sq.visible = true;
          g.questNotification = true;
          oc.thread.messages.push({ author: "system",
            content: `\uD83D\uDCDC New side quest discovered: **${sq.title}**` });
        }
      }
    }

    checkAchievements(g);
    updateReminder();
    updateShortcutButtons();
  });

  if (!cd.game?.initialized) {
    showOpeningUI();
  } else {
    migrateGame(cd.game);
    updateReminder();
    updateShortcutButtons();
  }
})();
