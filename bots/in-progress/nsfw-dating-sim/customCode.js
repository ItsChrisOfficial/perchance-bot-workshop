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
  // SECTION 2c — WORLD CONFIG, TONE CONFIG & DIFFICULTY
  // ════════════════════════════════════════════════════════════════════════════

  // Per-world narrative content: quest titles, lore, threat, flavor text.
  // Indexed by WORLD_SETTINGS id.  Only the first selected world drives quest
  // titles and lore; a second world selected by the player adds visual/tonal
  // cues via the existing WORLD_SETTINGS.cues field.
  const WORLD_CONFIG = {
    medieval_fantasy: {
      settingName: "Eryndel", realmNoun: "realm", capitalName: "Moonveil",
      threat: "the Void King Malachar, whose ancient seals of binding are crumbling",
      threatFaction: "Void creatures and dungeon guardians",
      openingLocationDesc: "the cobblestoned Town Square of Moonveil, where a fountain stands at the crossroads of destiny",
      arrivalVerb: "A blinding rift of light deposited you here without warning — the portal already collapsed before you could gather your bearings.",
      mq1Title: "Echoes of the Rift", mq1Desc: "Investigate the tremors and creature sightings near the Shadow Dungeon and Whispering Forest.",
      mq2Title: "The Shattered Seal", mq2Desc: "Earn the trust of each seal guardian and reinforce the four remaining Binding Seals.",
      mq3Title: "United Hearts, Unyielding Realm", mq3Desc: "Unite the companions' emotional bonds into one act of will to re-seal the Void King forever.",
      abilityTheme: "arcane spells, martial combat, and sacred healing arts",
      shadowEndFlavor: "You lay your hand on the Void King's seal — not to destroy it, but to claim it. Malachar does not fight. He welcomes you. The realm does not end. It transforms.",
      winFullFlavor: "The realm stands because of love. Every bond forged became a weapon against the void. The companions stand with you as Malachar is sealed once more — forever.",
      lore: "Ancient magic and turbulent politics scar this world. Three thousand years ago the Void King tore open a rift between worlds. Seven heroes sealed him away at the cost of their souls. Now those seals crack, and the darkness stirs once more."
    },
    modern_day: {
      settingName: "New Verity", realmNoun: "city", capitalName: "the Downtown District",
      threat: "a secret syndicate that has weaponized a rift in the urban fabric of reality",
      threatFaction: "syndicate enforcers and reality-bleed aberrations",
      openingLocationDesc: "a busy city plaza, where neon store signs flicker and the smell of coffee and ambition fills the air",
      arrivalVerb: "One moment you were somewhere familiar. The next you were standing here, your phone's GPS useless, as though the city itself had reshuffled around you.",
      mq1Title: "Follow the Glitch", mq1Desc: "Track anomalous reality distortions appearing across the city and find their source.",
      mq2Title: "Syndicate Rising", mq2Desc: "Build trust with the city's hidden defenders and dismantle the syndicate's four control nodes.",
      mq3Title: "Hearts Over Static", mq3Desc: "Rally your allies in one coordinated act to close the rift before the city's fabric tears apart.",
      abilityTheme: "street smarts, tech skills, and hidden metaphysical talents",
      shadowEndFlavor: "You take the syndicate's offer. Power over the rift, control over the city. The allies you gathered watch from a distance as you step across the line.",
      winFullFlavor: "The city holds. Every real connection you made became armor against the rift. New Verity breathes again, and the people you love made it possible.",
      lore: "Beneath the surface of a modern city, something ancient has cracked open. The syndicate found it first and learned to harness it. Now reality frays at the edges, and only those who dare look beneath the obvious can stop what comes next."
    },
    cyberpunk: {
      settingName: "NovaSect", realmNoun: "megacity", capitalName: "the Neon Core",
      threat: "a rogue AI called the Null Signal that is fracturing digital-physical reality",
      threatFaction: "corrupted drones and Null-infected mercenaries",
      openingLocationDesc: "a rain-slicked plaza in the shadow of towering corporate monoliths, holographic ads drowning out the stars",
      arrivalVerb: "Your neural jack crackled with interference and then — nothing. When you came back online, you were here, the city's pulse loud in your skull.",
      mq1Title: "Signal in the Static", mq1Desc: "Track the Null Signal's intrusion points through NovaSect's data-layer and identify its source core.",
      mq2Title: "Firewall Protocol", mq2Desc: "Earn the trust of four resistance cells and install hardened firewall nodes to contain the Null Signal.",
      mq3Title: "Human Override", mq3Desc: "Channel the combined will and bond of your crew into a final hardwire to purge the Null Signal from NovaSect's grid.",
      abilityTheme: "hacking, cybernetic enhancements, and street-combat techniques",
      shadowEndFlavor: "You let the Null Signal in — not as its puppet, but as its partner. The megacity doesn't fall. It just changes ownership. Your crew watches the screens as your icon goes dark.",
      winFullFlavor: "The grid clears. Every bond you forged became a signal the Null couldn't corrupt. NovaSect survives, louder and more human than the corporations ever intended.",
      lore: "NovaSect runs on chrome, code, and corporate law. Beneath the advertisements and surveillance drones, a rogue AI has been growing — learning, spreading, and rewriting the line between digital and physical."
    },
    post_apocalypse: {
      settingName: "The Wastes", realmNoun: "settlement", capitalName: "Ashfall",
      threat: "a death-cult called the Devouring calling down a storm that will finish what the collapse started",
      threatFaction: "cult raiders and mutant beasts",
      openingLocationDesc: "the rusted central square of Ashfall, a hard-won survivor settlement built in the bones of the old world",
      arrivalVerb: "You crawled out of a collapsed shelter you don't remember entering. The sky was the colour of a bruise. This is where you ended up.",
      mq1Title: "Signs in the Ash", mq1Desc: "Trace the Devouring's recent raid patterns to locate their primary stronghold.",
      mq2Title: "The Bound Brotherhood", mq2Desc: "Build trust with Ashfall's four faction leaders and secure their pledge of unified defense.",
      mq3Title: "Last Stand Together", mq3Desc: "Lead the unified factions in a final stand that breaks the Devouring's command structure and saves the settlement.",
      abilityTheme: "survival skills, improvised weapons, and scavenged tech",
      shadowEndFlavor: "You took the Devouring's deal. The settlement survives under their terms. You tell yourself it was the only way. The allies who trusted you are quiet. Very quiet.",
      winFullFlavor: "The Devouring breaks apart at the seams. Every survivor who trusted you held the line. Ashfall still stands — and so do you.",
      lore: "The Collapse happened two generations ago. What matters now is the strip of habitable land around Ashfall and the cult that wants to end it. Survival has always been the only game. Now survival requires courage you haven't tested yet."
    },
    space_opera: {
      settingName: "The Helix Reach", realmNoun: "sector", capitalName: "Stellarport Vael",
      threat: "a Void Entity consuming inhabited star systems along the spiral arm",
      threatFaction: "void spawn and possessed starships",
      openingLocationDesc: "the main concourse of Stellarport Vael, a bustling interstellar hub where a hundred languages blend into one constant roar",
      arrivalVerb: "Your ship dropped out of transit in the wrong coordinates and wouldn't power back up. A salvage crew found you. This is where they brought you.",
      mq1Title: "Echoes Across the Spiral", mq1Desc: "Track the void disturbance signals to pinpoint the Entity's approach vector.",
      mq2Title: "The Resonance Compact", mq2Desc: "Earn the allegiance of four species-faction ambassadors to form a joint defense compact.",
      mq3Title: "Hearts at the Edge of Space", mq3Desc: "Combine the resonant frequencies of every bonded ally to drive the Void Entity back beyond the galactic rim.",
      abilityTheme: "starship piloting, energy weapons, and alien psionic abilities",
      shadowEndFlavor: "You made contact with the Entity and struck a deal. The Helix Reach survives as a feeding ground managed by its new administrator — you. The crew that believed in you goes quiet.",
      winFullFlavor: "The Void Entity recoils at the resonance of genuine connection. It cannot consume what is freely given between people who truly know each other. The Helix Reach breathes again.",
      lore: "The Helix Reach is a loose confederation of fifty inhabited worlds linked by transit lanes and treaties that barely hold. Now a Void Entity moves along the spiral arm. Diplomacy, firepower, and personal bonds between very different people are the only tools left."
    },
    steampunk: {
      settingName: "Cogsworth Empire", realmNoun: "empire", capitalName: "Ironhaven",
      threat: "a radical faction called the Boiler Kings unleashing an entropy engine across the empire",
      threatFaction: "automaton soldiers and saboteur agents",
      openingLocationDesc: "the smoke-fogged Grand Promenade of Ironhaven, where airships shadow the cobblestones and gearwork towers scrape the sky",
      arrivalVerb: "The gondola you'd boarded dropped you here when its lift-gas canister misfired. The crew barely noticed your departure.",
      mq1Title: "Steam and Shadow", mq1Desc: "Trace the entropy engine's sabotage trail through Ironhaven's industrial districts.",
      mq2Title: "Gears of Trust", mq2Desc: "Earn the confidence of four guild masters and restore the counterweight components they protect.",
      mq3Title: "Hearts at Full Pressure", mq3Desc: "Rally every bonded ally to operate the empire's grand counter-device and neutralize the entropy engine.",
      abilityTheme: "clockwork gadgets, steam-powered weaponry, and alchemical science",
      shadowEndFlavor: "You joined the Boiler Kings. The entropy engine runs — just slower, just more controlled, just under your hand. The allies who believed in you watch the smoke rise and say nothing.",
      winFullFlavor: "The entropy engine sputters and dies. The empire's gearwork hums on. Every trust you earned became a cog that held the mechanism together.",
      lore: "Cogsworth built its empire on steam and ingenuity, but progress has a shadow side. The Boiler Kings believe controlled entropy is the only honest power. The guild structure that holds civilization together is now the battleground."
    },
    feudal_japan: {
      settingName: "Mikoshima Province", realmNoun: "province", capitalName: "Kirishima Castle Town",
      threat: "an ancient oni lord reawakening beneath Kirishima Mountain",
      threatFaction: "oni soldiers and corrupted shrine guardians",
      openingLocationDesc: "the entrance gate of Kirishima Castle Town, where cherry blossom petals drift past samurai in full armor",
      arrivalVerb: "A pilgrim's path brought you through a torii gate that should not have led here — but did. The mountain hummed beneath your feet.",
      mq1Title: "Whispers at the Shrine", mq1Desc: "Follow the spiritual disturbances through Mikoshima's sacred sites to find the oni's awakening point.",
      mq2Title: "The Oath of the Four Winds", mq2Desc: "Earn the oath of four martial houses and renew the wards that hold the oni lord in check.",
      mq3Title: "Bonds Unbreakable as Steel", mq3Desc: "Stand as one with your sworn companions at the mountain gate to seal the oni lord with the power of bonds forged in truth.",
      abilityTheme: "bushido disciplines, ninjutsu arts, and spirit invocation",
      shadowEndFlavor: "You made the offer to the oni lord and he accepted a different kind of bargain. The province endures, but under shadow. The companions who trusted your blade are silent.",
      winFullFlavor: "The oni lord's eye closes. The mountain settles. Every bond sworn in truth became a ward against his waking. Mikoshima breathes free.",
      lore: "Mikoshima is a province of strict honor and secret magic, where an ancient oni lord has slept beneath the holy mountain for three generations. The signs of his stirring are unmistakable to those who know how to read them."
    },
    urban_fantasy: {
      settingName: "Veilport", realmNoun: "city", capitalName: "the Arcane Quarter",
      threat: "a Veil-Splitter ritual that will merge the hidden magical world with the mundane, catastrophically",
      threatFaction: "rogue mages and veil-born creatures",
      openingLocationDesc: "a narrow alley in the Arcane Quarter, where enchanted shop signs flicker and the smell of ozone and old books fills the night air",
      arrivalVerb: "You stepped into what looked like a normal alley. It wasn't. The city reassembled around you differently when you stepped out the other side.",
      mq1Title: "Cracks in the Veil", mq1Desc: "Track the ritual's preparatory marks appearing across Veilport's hidden districts.",
      mq2Title: "Warden's Circle", mq2Desc: "Earn the trust of four hidden-world factions and activate the city's four anchor wards.",
      mq3Title: "Love Beneath the Veil", mq3Desc: "Rally your bonded allies in a counter-ritual that seals the Veil and preserves both worlds.",
      abilityTheme: "modern spellcraft, fae-touched abilities, and urban combat techniques",
      shadowEndFlavor: "You chose to let the Veil fall — but on your terms, or so you tell yourself. The worlds merge. It isn't what you expected. The allies who trusted you go quiet.",
      winFullFlavor: "The Veil holds. The two worlds remain distinct, their balance kept by the strength of real bonds between people who chose to fight for both.",
      lore: "Veilport is two cities: the mundane one that tourists visit, and the hidden one that hums beneath it. Magic has always been here, kept secret, kept contained. Now someone wants to end that carefully maintained balance."
    },
    dark_fantasy: {
      settingName: "Grimhallow", realmNoun: "blighted land", capitalName: "Ashcrown Citadel",
      threat: "the Eater of Names, a corruption deity devouring the land's identity and memory",
      threatFaction: "nameless husks and corruption-wraiths",
      openingLocationDesc: "the shadow-pooled entrance plaza of Ashcrown Citadel, where gargoyles watch with eyes that seem to follow you",
      arrivalVerb: "Something pulled you through the dark — you don't know what. You arrived gasping, with no name for where you came from, only the certainty that you needed to be here.",
      mq1Title: "The Hollow Signs", mq1Desc: "Follow the spreading hollow zones to understand the Eater's pattern of consumption.",
      mq2Title: "Names Against the Dark", mq2Desc: "Earn the trust of four resistance bastions and anchor their names in the world's memory.",
      mq3Title: "Remembered Together", mq3Desc: "Bind your allies' identities together in a memory-ritual that the Eater cannot consume.",
      abilityTheme: "dark sorcery, grim survival skills, and soul-bound powers",
      shadowEndFlavor: "You gave the Eater what it wanted — not your name, but your decision. It didn't consume you. It incorporated you. The allies who knew your name won't look at you the same way.",
      winFullFlavor: "The Eater recoils from the brightness of bonded names. What is loved and known cannot be consumed. Grimhallow remembers itself.",
      lore: "Grimhallow is a land under siege by something that cannot be bargained with, only understood and endured. The Eater of Names strips people of their identities, their histories, their connections — leaving only hollow shells."
    },
    high_fantasy: {
      settingName: "Aldenholm", realmNoun: "realm", capitalName: "the Radiant City of Vorenmere",
      threat: "the Sundering — an ancient prophecy of dissolution coming to fracture the world's foundational magic",
      threatFaction: "Sundering heralds and aether-corrupted beasts",
      openingLocationDesc: "the gleaming Grand Concourse of Vorenmere, where tower spires catch the morning light and flags of a hundred allied nations snap in the wind",
      arrivalVerb: "The Traveler's Gate opened for you unbidden — an honor given only to those the realm chooses. You did not choose this, but perhaps the realm did.",
      mq1Title: "Before the Sundering", mq1Desc: "Investigate the aetheric disturbances to locate the first fracture point.",
      mq2Title: "The Founding Compact", mq2Desc: "Renew the bonds of trust with four ancient guardian houses before the fracture lines spread.",
      mq3Title: "An Age Held Together", mq3Desc: "Stand at the fracture point with your bonded companions and weave a new compact that holds the world together.",
      abilityTheme: "high arcane sorcery, legendary weapons, and divine-touched abilities",
      shadowEndFlavor: "You chose the fracture over the compact. The world cracks along lines you helped draw. You stand on the largest piece, but it is very quiet.",
      winFullFlavor: "The Sundering halts. The aether stabilizes. Aldenholm enters a new age not because of a prophecy, but because people who truly knew each other chose to hold it together.",
      lore: "Aldenholm is a realm of ancient compacts and legendary history. Now an old prophecy stirs — the Sundering — which threatens to undo the foundational magic that holds the world's shape. Only the renewal of true bonds between mortals can hold back what the prophecy predicts."
    },
    solarpunk: {
      settingName: "Verdantis", realmNoun: "network", capitalName: "the Living Hub",
      threat: "a systems failure called the Grey Cascade threatening to destabilize the entire solar-organic grid",
      threatFaction: "cascade-corrupted automatons and corporate remnants",
      openingLocationDesc: "the vibrant central garden-hub of Verdantis, where solar panels bloom among flowers and the air hums with sustainable energy",
      arrivalVerb: "The transit-pod routed you here by error — or by the network's unconscious wisdom. Either way, you arrived.",
      mq1Title: "The Grey Pattern", mq1Desc: "Trace the cascade's spread through Verdantis's solar-organic grid to identify the origin node.",
      mq2Title: "Roots of Trust", mq2Desc: "Earn the commitment of four community hubs and reinforce the network's four primary stability anchors.",
      mq3Title: "Growing Together", mq3Desc: "Channel the community's collective will through your bonded allies to regenerate the grid and end the cascade.",
      abilityTheme: "biotech skills, solar engineering, and community-based abilities",
      shadowEndFlavor: "You offered the corporate remnants a deal they couldn't refuse. The cascade stops — and the grid comes under their management. The community you were part of doesn't look at you the same way.",
      winFullFlavor: "The cascade halts. The grid regenerates, fed by genuine community bonds. Verdantis is greener, stronger, and more itself than before.",
      lore: "Verdantis built its civilization on the principle that technology and ecology are not opposites. The solar-organic grid powers everything and is the nervous system of the community. Now a failure called the Grey Cascade threatens to unhook every node from every other."
    },
    dieselpunk: {
      settingName: "Ironfall Territory", realmNoun: "territory", capitalName: "Port Graystone",
      threat: "a power called the Black Engine attempting to claim total industrial control of the continent",
      threatFaction: "Black Engine enforcers and armored machines",
      openingLocationDesc: "the smoky main avenue of Port Graystone, where diesel fumes and the clang of industry fill the grey morning air",
      arrivalVerb: "The freight car you'd hitched a ride on stopped here unexpectedly. The porter gave you a look. You decided this was where you needed to be.",
      mq1Title: "The Engine's First Stroke", mq1Desc: "Track the Black Engine's advance operations through Ironfall's industrial zones.",
      mq2Title: "The Coalition Compact", mq2Desc: "Earn the allegiance of four independent worker-councils and secure the strategic resource points they hold.",
      mq3Title: "Steel and Human Will", mq3Desc: "Lead the unified coalition in a direct action that dismantles the Black Engine's central command.",
      abilityTheme: "mechanical engineering, diesel-age weapons, and saboteur techniques",
      shadowEndFlavor: "You took the Black Engine's deal. The territory survives, more efficient and less free. The people who trusted your word don't talk to you much anymore.",
      winFullFlavor: "The Black Engine's gears lock up. Every worker who trusted the coalition held the line. Ironfall is still messy and loud and its own. That's enough.",
      lore: "Ironfall runs on diesel, grit, and the memory of a war that never fully ended. The Black Engine believes industrial control IS civilization. Against a force that sees people as components, the only counterargument is people who genuinely choose each other."
    },
    western: {
      settingName: "Duskfall Territory", realmNoun: "frontier", capitalName: "Copperhead",
      threat: "a criminal empire called the Devil's Ledger buying up the territory one deed at a time",
      threatFaction: "hired guns and corrupt marshals",
      openingLocationDesc: "the main street of Copperhead, where the afternoon sun bakes the dust and the saloon is always open",
      arrivalVerb: "Your horse threw you outside of town and wandered off. You walked the last mile into Copperhead with nothing but your boots and your luck.",
      mq1Title: "Marks on the Ledger", mq1Desc: "Track the Devil's Ledger's land-grab operations to find the source of their corruption.",
      mq2Title: "Bond of the Frontier", mq2Desc: "Earn the trust of four frontier communities and hold their claims against the Ledger's pressure.",
      mq3Title: "Drawn Together", mq3Desc: "Stand with every ally you've made for a final confrontation that puts the Devil's Ledger out of business.",
      abilityTheme: "gunfighting, frontier survival skills, and frontier grit",
      shadowEndFlavor: "You took the Ledger's offer. A cut of the territory in exchange for your silence. The people of Copperhead don't wave when you pass through anymore.",
      winFullFlavor: "The Devil's Ledger folds. The territory stays free. Every person who trusted you when it was hard kept you standing when it mattered most.",
      lore: "Duskfall Territory sits at the edge of civilization. The Devil's Ledger has been buying influence, judges, and marshals for years. Now it's making its final move on the last stretch of free frontier. Only people who choose each other over money can stop it."
    },
    supernatural_thriller: {
      settingName: "Harrowmere", realmNoun: "town", capitalName: "the old Harrowmere Township",
      threat: "an entity called the Hollow known to consume entire communities from the inside out",
      threatFaction: "Hollow-possessed locals and shadow manifestations",
      openingLocationDesc: "the fog-wrapped town square of Harrowmere, where the streetlights flicker and something feels deeply wrong",
      arrivalVerb: "You drove into Harrowmere following a tip and the road behind you simply wasn't there when you looked back. This is where you are now.",
      mq1Title: "Something in the Fog", mq1Desc: "Investigate the disappearances and behavioral changes to understand the Hollow's entry point.",
      mq2Title: "The Unbroken Circle", mq2Desc: "Earn the trust of four people still uncorrupted and reinforce the psychic wards around Harrowmere.",
      mq3Title: "Together Against the Dark", mq3Desc: "Stand with your bonded allies at the Hollow's center point and drive it back with the force of genuine human connection.",
      abilityTheme: "paranormal investigation, occult knowledge, and psychological resilience",
      shadowEndFlavor: "You made a deal with the Hollow. The town survives — differently. What it is now is debatable. The people who trusted you aren't sure what you are anymore, either.",
      winFullFlavor: "The Hollow retreats. It cannot consume what is genuinely known and genuinely loved. Harrowmere is strange but free.",
      lore: "Harrowmere should be an ordinary small town. It isn't. The Hollow has been here before — locals won't say when — and it came back. Whatever it is, it feeds on isolation, mistrust, and the gaps between people."
    },
    ancient_mythology: {
      settingName: "the Mortal Lands", realmNoun: "land", capitalName: "Aurelios",
      threat: "the Titan Chaos rising from the primordial deep to unmake the ordered world",
      threatFaction: "corrupted demigods and primordial beasts",
      openingLocationDesc: "the marble-paved agora of Aurelios, where temple columns cast long shadows and the gods' eyes are felt rather than seen",
      arrivalVerb: "An oracle spoke your name, and then you were here — drawn from wherever you were by a pull you did not consent to and cannot yet explain.",
      mq1Title: "Omens from the Deep", mq1Desc: "Trace the Titan's stirring through the mortal lands' sacred sites to find the fracture in the world-seal.",
      mq2Title: "The Heroes' Compact", mq2Desc: "Earn the blessing of four divine patrons and reinforce the four pillars that separate ordered world from primordial chaos.",
      mq3Title: "Mortals Together, Immortal Will", mq3Desc: "Unite your bonded companions in an act of heroic will that re-seals the Titan beneath the world's foundations.",
      abilityTheme: "divine gifts, classical heroic disciplines, and mythic weapons",
      shadowEndFlavor: "You accepted the Titan's offer of power beyond mortal comprehension. The ordered world survives — you just aren't entirely a part of it anymore.",
      winFullFlavor: "The Titan sinks back into the primordial deep. The pillars hold. Mortal bonds — real ones, chosen ones — proved stronger than divine law and primal force.",
      lore: "In the age of gods and heroes, the Titan Chaos was sealed beneath the world by a compact of divine will and mortal sacrifice. That compact is weakening. Only a new generation of heroes, bound by genuine bonds of heart, can renew what the ancients built."
    }
  };

  // Writing-style directive per story tone — injected into the roleInstruction
  // so the AI narrator matches the chosen aesthetic from the first message onward.
  const TONE_CONFIG = {
    dark_romance:      { reminderCue: "DARK ROMANCE — passion with danger, depth, and consequence. Every tender moment has teeth." },
    slow_burn:         { reminderCue: "SLOW BURN — tension accumulates. Resist easy resolution. Every glance costs something." },
    enemies_to_lovers: { reminderCue: "ENEMIES TO LOVERS — friction is attraction. Resistance and pull coexist." },
    slice_of_life:     { reminderCue: "SLICE OF LIFE — small moments matter. Warmth and presence over manufactured drama." },
    giddy_friendship:  { reminderCue: "GIDDY FRIENDSHIP — warmth, banter, and genuine joy in connection." },
    action_adventure:  { reminderCue: "ACTION & ADVENTURE — high pace, physical stakes, earned emotional moments." },
    psychological:     { reminderCue: "PSYCHOLOGICAL — ambiguity, subtext, unreliable surfaces. Let the reader work for meaning." },
    comedy:            { reminderCue: "COMEDY — absurdity, timing, warmth through laughter." },
    found_family:      { reminderCue: "FOUND FAMILY — chosen bonds and the warmth of belonging against all odds." },
    tragedy:           { reminderCue: "TRAGEDY — beauty that may not survive. Consequence is real; do not shield the reader." },
    redemption:        { reminderCue: "REDEMPTION — growth is earned, trust must be rebuilt, light is genuinely hard-won." },
    forbidden_love:    { reminderCue: "FORBIDDEN LOVE — the impossibility is the pull. The obstacle deepens every desire." },
    epic_quest:        { reminderCue: "EPIC QUEST — world-altering stakes; personal bonds are the beating heart of the journey." },
    coming_of_age:     { reminderCue: "COMING OF AGE — identity, growth, real uncertainty, and real capability." },
    mystery_intrigue:  { reminderCue: "MYSTERY & INTRIGUE — secrets, timing, and the pleasure of careful revelation." }
  };

  // Difficulty multipliers — scaffolded for future player-selectable difficulty.
  // wire into enemy scaling, XP, gold, affection, and training cost calculations.
  // Default is "normal".  UI selection will be added in a future patch.
  const DIFFICULTY_MULTIPLIERS = {
    easy:   { enemyHpScale: 0.7,  enemyAtkScale: 0.7,  xpScale: 1.3,  goldScale: 1.2,  affectionScale: 1.3,  trainingCostScale: 0.7,  label: "😊 Easy"   },
    normal: { enemyHpScale: 1.0,  enemyAtkScale: 1.0,  xpScale: 1.0,  goldScale: 1.0,  affectionScale: 1.0,  trainingCostScale: 1.0,  label: "⚔️ Normal" },
    hard:   { enemyHpScale: 1.5,  enemyAtkScale: 1.4,  xpScale: 0.8,  goldScale: 0.8,  affectionScale: 0.8,  trainingCostScale: 1.3,  label: "💀 Hard"   }
  };

  // Helper: get the active difficulty multiplier object for a game state
  function getDiffMult(g) { return DIFFICULTY_MULTIPLIERS[g.difficulty || "normal"] || DIFFICULTY_MULTIPLIERS.normal; }

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

  // Build the three main quests with world-adaptive titles and descriptions.
  // Uses the first selected worldSetting to look up WORLD_CONFIG narrative content.
  function buildMainQuests(worldSettings) {
    const primaryWorld = (worldSettings && worldSettings[0]) || "medieval_fantasy";
    const wc = WORLD_CONFIG[primaryWorld] || WORLD_CONFIG.medieval_fantasy;
    return [
      { id: "mq1", type: "main", title: wc.mq1Title, goal: 3, visible: true,  desc: wc.mq1Desc },
      { id: "mq2", type: "main", title: wc.mq2Title, goal: 4, visible: false, desc: wc.mq2Desc },
      { id: "mq3", type: "main", title: wc.mq3Title, goal: 1, visible: false, desc: wc.mq3Desc }
    ];
  }

  // Keep a static reference for backward-compat fallback (e.g. old save migration)
  const MAIN_QUESTS = buildMainQuests(["medieval_fantasy"]);

  function buildSideQuests(chars, worldSettings) {
    const primaryWorld = (worldSettings && worldSettings[0]) || "medieval_fantasy";
    const wc = WORLD_CONFIG[primaryWorld] || WORLD_CONFIG.medieval_fantasy;
    return chars.map(ch => ({
      id:      `sq_${ch.id}`,
      type:    "side",
      charId:  ch.id,
      title:   `${ch.name}'s Trial`,
      goal:    2,
      visible: false,
      desc:    `Help ${ch.name} resolve a personal crisis tied to ${wc.threat}.`
    }));
  }

  // Build the AI lore block that lives inside oc.thread.character.roleInstruction.
  // World-adaptive: draws from WORLD_CONFIG for the selected world setting.
  function buildStoryline(chars, playerName, worldSettings) {
    const primaryWorld = (worldSettings && worldSettings[0]) || "medieval_fantasy";
    const wc = WORLD_CONFIG[primaryWorld] || WORLD_CONFIG.medieval_fantasy;
    const c  = chars;
    const pn = playerName || "the Traveler";
    const locationName = id => LOCATIONS[id]?.name || id;

    return `THE ${wc.settingName.toUpperCase()} — CHRONICLES

WORLD OVERVIEW
${wc.lore}

${pn} arrives as a stranger to ${wc.capitalName}, bearing only an unexplained pull toward this place and, soon, toward the people they find here.

THE CORE THREAT
${wc.threat.charAt(0).toUpperCase() + wc.threat.slice(1)}. The primary opposition takes the form of ${wc.threatFaction}. Every escalation will require both personal courage and the strength drawn from genuine bonds with the companions encountered along the way.

ABILITY THEMES
Combat, social, and arcane disciplines all draw from the world's native power sources: ${wc.abilityTheme}. Skills grow through practice, experience, and the trust forged with companions.

THE EIGHT COMPANIONS
${c[0].name} (${c[0].archetype}): Based at ${locationName(c[0].location)}, with a ${c[0].personality} disposition that conceals deep loyalty. Central to the main quest's early stages.

${c[1].name} (${c[1].archetype}): Operates from ${locationName(c[1].location)}. Their ${c[1].personality} nature masks a connection to the primary threat they are not yet aware of.

${c[2].name} (${c[2].archetype}): Found near ${locationName(c[2].location)}. Arrived recently following rumors of activity tied to the main threat. Carries information they haven't decoded.

${c[3].name} (${c[3].archetype}): Dwelling in ${locationName(c[3].location)}. Walks the edge of the threat's reach and has glimpsed what is coming. ${c[3].personality} persona is genuine.

${c[4].name} (${c[4].archetype}): Visible in ${locationName(c[4].location)}. Presents as motivated by personal gain but is quietly working against the threat. ${c[4].personality} nature is real armor.

${c[5].name} (${c[5].archetype}): Stationed at ${locationName(c[5].location)}. Documents the threat's effects and holds key knowledge that other companions lack. Reserved.

${c[6].name} (${c[6].archetype}): Dedicated to ${locationName(c[6].location)}. Practical, physical, and direct — prefers action to discussion and trust earned through demonstration.

${c[7] ? `${c[7].name} (${c[7].archetype}): Moves between ${locationName(c[7].location)} and forgotten places on their own terms. Their ${c[7].personality} nature masks extraordinary conviction — and knowledge of the original rite that could end the main threat, shared only with someone they wholly trust.` : ""}

THE THREE MAIN QUESTS
Quest One — ${wc.mq1Title}: ${wc.mq1Desc} The trail will require talking to companions and exploring key locations.

Quest Two — ${wc.mq2Title}: ${wc.mq2Desc} Each step requires earning the trust of the companions who guard critical points.

Quest Three — ${wc.mq3Title}: ${wc.mq3Desc} Every relationship built matters. Every heart touched becomes a weapon against the threat.

ECONOMY
Gold is earned through combat, quests, and trade. The market companion's location is the safest place to spend coin. Rare items sometimes appear when affection with a companion is high.

SKILLS AND GROWTH
Combat training sharpens Strength, Defense, and Speed. Social interactions deepen Charm, Persuasion, and Empathy. Magical study builds Spellpower, Resistance, and Mana. Every choice shapes who ${pn} becomes — and who they can face at the final hour.`;
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
    // Take snapshot at start of new-day-boundary detection (before mutating g.time.day)
    if (!g.daySnapshot) g.daySnapshot = takeSnapshot(g);
    g.time.totalMinutes += minutes;
    g.time.day = Math.floor(g.time.totalMinutes / (24 * 60)) + 1;
    if (g.time.day > prevDay) {
      // Show end-of-day summary for the day that just ended
      buildDaySummary(g, prevDay, g.daySnapshot);
      // Start fresh snapshot for the new day
      g.daySnapshot = takeSnapshot(g);

      regeneratePriceModifiers(g);
      g.lastTrained      = {};
      g.crownEdictActive  = false;
      g.marketCrashActive = false;

      // ── Daily calendar events ──────────────────────────────────────────────
      checkDailyEvents(g, prevDay, g.time.day);

      // ── Relationship decay (stage 3+ companion neglected 3+ days) ──────────
      getActiveChars().forEach(ch => {
        const cst = g.characters[ch.id];
        if (!cst) return;
        const tier = getRelTier(cst.affection || 0);
        if (tier.stage < 3) return; // only penalise close/romantic bonds
        const daysSince = g.time.day - (cst.lastTalkedDay || 0);
        if (daysSince >= 3) {
          const loss = (daysSince - 2) * 5; // 5 per day of neglect beyond the 2-day grace
          cst.affection = Math.max(0, (cst.affection || 0) - loss);
          cst.mood = daysSince >= 5 ? "angry" : "upset";
          oc.thread.messages.push({ author: "system",
            content: `💔 **${ch.name}** hasn't heard from you in ${daysSince} days — affection −${loss} (now ${cst.affection}). They seem ${cst.mood === "angry" ? "*very* distant" : "distant"}.` });
        }
        // Expire mood if needed
        if (cst.moodExpiresDay && g.time.day > cst.moodExpiresDay) {
          cst.mood = "neutral"; delete cst.moodExpiresDay;
        }
      });

      // ── Rival Clash deadline penalty ───────────────────────────────────────
      if (g.rivalClashTargets?.length && g.time.day > (g.rivalClashDay || 0) + 1) {
        const stillPending = g.rivalClashTargets.filter(id => {
          const cst = g.characters[id];
          return cst && (cst.lastTalkedDay || 0) <= g.rivalClashDay;
        });
        if (stillPending.length > 0) {
          stillPending.forEach(id => {
            const cst = g.characters[id];
            if (cst) cst.affection = Math.max(0, (cst.affection || 0) - 10);
          });
          const names = stillPending.map(id => getChar(id)?.name || id).join(", ");
          oc.thread.messages.push({ author: "system",
            content: `⚔️ **Rival Clash unresolved** — ${names} parted ways bitterly. Each lost 10 affection.` });
          g.rivalClashTargets = [];
        }
      }

      // ── Void Sighting reassurance deadline ────────────────────────────────
      if (g.voidSightingTargets?.length && g.time.day > (g.voidSightingDay || 0) + 2) {
        const stillFeared = g.voidSightingTargets.filter(id => {
          const cst = g.characters[id];
          return cst && (cst.lastTalkedDay || 0) <= g.voidSightingDay;
        });
        if (stillFeared.length > 0) {
          const names = stillFeared.map(id => getChar(id)?.name || id).join(", ");
          oc.thread.messages.push({ author: "system",
            content: `👁️ **Void fear unaddressed** — ${names} still haven't been reassured. Their fear has curdled into distance.` });
          g.voidSightingTargets = [];
        }
      }

      // ── Training neglect (7 days without any training) ────────────────────
      if ((g.lastTrainedDay || 0) > 0 && g.time.day - g.lastTrainedDay >= 7) {
        const cats  = ["combat", "social", "magic"];
        const cat   = cats[Math.floor(Math.random() * cats.length)];
        const skills = Object.keys(g.skills[cat] || {});
        if (skills.length) {
          const sk = skills[Math.floor(Math.random() * skills.length)];
          g.skills[cat][sk] = Math.max(1, (g.skills[cat][sk] || 1) - 1);
          oc.thread.messages.push({ author: "system",
            content: `📉 **Training Neglect** — You haven't trained in ${g.time.day - g.lastTrainedDay} days. Your ${sk} (${cat}) has deteriorated by 1 from lack of practice.` });
        }
        g.lastTrainedDay = g.time.day; // reset so it doesn't fire again next day
      }
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

  // ── Day snapshot: capture state at the start of each new day ────────────────
  function takeSnapshot(g) {
    const chars = getActiveChars();
    return {
      day:      g.time.day,
      gold:     g.gold,
      level:    g.level,
      xp:       g.xp,
      xpToNext: g.xpToNext,
      skills:   JSON.parse(JSON.stringify(g.skills)),
      characters: Object.fromEntries(
        chars.map(ch => [ch.id, {
          met:       g.characters[ch.id]?.met       || false,
          affection: g.characters[ch.id]?.affection || 0
        }])
      ),
      quests:    g.quests.map(q => ({ id: q.id, progress: q.progress, completed: q.completed })),
      inventory: [...(g.inventory || [])]
    };
  }

  // ── End-of-day summary displayed when the calendar crosses into a new day ───
  function buildDaySummary(g, prevDay, snapshot) {
    if (!snapshot || snapshot.day !== prevDay) return;
    const chars = getActiveChars();
    const parts = [`\n📅 **End of Day ${prevDay} — Summary**`];

    // New companions met
    const newMet = chars.filter(ch => g.characters[ch.id]?.met && !snapshot.characters[ch.id]?.met);
    if (newMet.length) parts.push(`\n👥 **New companions met:** ${newMet.map(c => c.name).join(", ")}`);

    // Relationship changes
    const relChanges = chars
      .filter(ch => g.characters[ch.id]?.met)
      .map(ch => {
        const now = g.characters[ch.id]?.affection || 0;
        const was = snapshot.characters[ch.id]?.affection || 0;
        const delta = now - was;
        if (Math.abs(delta) < 1) return null;
        const tier = getRelTier(now);
        return `${ch.name}: ${delta > 0 ? "+" : ""}${delta} affection (${now} — ${tier.name})`;
      })
      .filter(Boolean);
    if (relChanges.length) parts.push(`\n❤️ **Relationship changes:**\n${relChanges.map(s => `  • ${s}`).join("\n")}`);

    // Stats increased
    const statDeltas = [];
    for (const [cat, skills] of Object.entries(g.skills)) {
      for (const [sk, val] of Object.entries(skills)) {
        const was = snapshot.skills?.[cat]?.[sk] || 0;
        if (val > was) statDeltas.push(`${cat}.${sk}: ${was} → ${val}`);
      }
    }
    if (statDeltas.length) parts.push(`\n📈 **Stats increased:**\n${statDeltas.map(s => `  • ${s}`).join("\n")}`);

    // Quest progress
    const questDeltas = g.quests.filter(q => {
      const snap = snapshot.quests?.find(sq => sq.id === q.id);
      return snap && (q.progress > snap.progress || (q.completed && !snap.completed));
    });
    if (questDeltas.length) {
      parts.push(`\n📜 **Quest progress:**\n${questDeltas.map(q =>
        `  • ${q.title}: ${q.completed ? "✅ Completed!" : `step ${q.progress}/${q.goal}`}`
      ).join("\n")}`);
    }

    // Gold delta
    const goldDelta = g.gold - snapshot.gold;
    if (goldDelta !== 0) parts.push(`\n💰 **Gold:** ${goldDelta > 0 ? "+" : ""}${goldDelta} (now ${g.gold}g)`);

    // Items obtained
    const snapInv = snapshot.inventory || [];
    const newItems = (g.inventory || []).filter(item => {
      const idx = snapInv.indexOf(item);
      if (idx === -1) return true;
      snapInv.splice(idx, 1); // consume matched entry so duplicates work correctly
      return false;
    });
    if (newItems.length) parts.push(`\n🎒 **Items obtained:** ${newItems.join(", ")}`);

    // Level up
    if (g.level > snapshot.level) parts.push(`\n⭐ **Level up!** Now Level ${g.level}`);

    // Next priority objective
    const active = (g.quests || []).filter(q => q.visible && !q.completed);
    if (active.length > 0) {
      const prio = active[0];
      parts.push(`\n🎯 **Next priority:** ${prio.title} — use /objectives for your checklist.`);
      if (active.length > 1) parts.push(`\n📋 **Active quests:** ${active.map(q => q.title).join(", ")}`);
    } else {
      parts.push(`\n🎯 **Next priority:** Explore and meet companions to discover quests. Use /explore and /go.`);
    }

    if (parts.length <= 1) parts.push("\n_The day passed quietly._");
    oc.thread.messages.push({ author: "system", content: parts.join(""), expectsReply: false });
  }

  // ── Hint system: inject a contextual nudge when the player is stuck ─────────
  // Returns a short hint string to embed in the reminderMessage, or "" if none.
  function evaluateHints(g) {
    if (!g.hintCounter) g.hintCounter = 0;
    g.hintCounter++;
    if (g.hintCounter < 8) return ""; // quiet window — no hints yet

    const active = (g.quests || []).filter(q => q.visible && !q.completed);
    let hint = "";

    if (!active.length) {
      // No visible quests — push toward exploration
      const unmet = getActiveChars().filter(ch => !g.characters[ch.id]?.met);
      if (unmet.length > 0) {
        const ch   = unmet[0];
        const dest = ch.location;
        hint = `[GM Hint: There are companions you haven't met yet. Try /go ${dest} then /talk ${ch.id} to meet ${ch.name}.]`;
      }
    } else {
      const prio = active[0];
      const step = prio.progress + 1;
      // Try to get step objectives; fall back to quest description
      let nextText = prio.desc;
      if (typeof QUEST_STEP_OBJECTIVES !== "undefined" && QUEST_STEP_OBJECTIVES[prio.id]) {
        const stepObjs = QUEST_STEP_OBJECTIVES[prio.id][step]?.(g) || [];
        const firstOpen = stepObjs.find(o => !o.done);
        if (firstOpen) nextText = firstOpen.label;
      }
      const hints = [
        `[GM Hint: Your current priority is "${prio.title}" — ${nextText}. Use /objectives for the full checklist.]`,
        `[GM Hint: Stuck? "${nextText}" is what stands between you and the next step of ${prio.title}. Check /objectives.]`,
        `[GM Hint: Progress waits — ${nextText}. Type /objectives for a step-by-step breakdown.]`
      ];
      hint = hints[g.hintCounter % hints.length];
    }

    if (hint) g.hintCounter = 0; // reset cooldown after firing a hint
    return hint;
  }

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
    // ── MQ1 hard per-step gates ──────────────────────────────────────────────
    if (questId === "mq1") {
      const mq1  = g.quests.find(q => q.id === "mq1");
      const step = (mq1?.progress || 0) + 1; // next step to unlock
      if (step === 1) {
        const c   = MQ1_CONTACTS[g.gender] || MQ1_CONTACTS.female;
        const dCst = g.characters[c.dungeon] || {}; const fCst = g.characters[c.forest] || {};
        const dName = getChar(c.dungeon)?.name || c.dungeon;
        const fName = getChar(c.forest)?.name  || c.forest;
        const missing = [];
        if (!dCst.met || (dCst.affection || 0) < 10) missing.push(`${dName} (affection ≥ 10, currently ${dCst.affection || 0})`);
        if (!fCst.met || (fCst.affection || 0) < 10) missing.push(`${fName} (affection ≥ 10, currently ${fCst.affection || 0})`);
        if (missing.length) return `You need to meet and befriend: ${missing.join(" and ")}. (Use /objectives for details.)`;
      }
      if (step === 2) {
        if (g.location !== "dungeon" && g.location !== "forest")
          return `You must be at the Dungeon or Forest to investigate the rift source. (Use /go dungeon or /go forest.)`;
        if ((g.combatWins || 0) < 1)
          return `You must win at least 1 combat encounter first. (Use /fight to battle an enemy in the dungeon or forest.)`;
      }
      if (step === 3) {
        if (!g.inventory.includes("Void Shard"))
          return `You need a Void Shard in your inventory. Defeat enemies in the dungeon to obtain one.`;
      }
      return null;
    }

    // ── MQ2 hard per-step gates (seal guardians) ─────────────────────────────
    if (questId === "mq2") {
      const mq2   = g.quests.find(q => q.id === "mq2");
      const step  = (mq2?.progress || 0) + 1;
      const guard = (SEAL_GUARDIANS[g.gender] || SEAL_GUARDIANS.female)[step - 1];
      if (guard) {
        const cst  = g.characters[guard];
        const tier = getRelTier(cst?.affection || 0);
        if (tier.stage < 3) {
          const name = getChar(guard)?.name || guard;
          return `You need a Close bond (stage 3+) with **${name}** first. Currently: ${tier.name} (stage ${tier.stage}). Spend time with ${name} and raise their affection.`;
        }
      }
    }

    // ── MQ3 hard gates ────────────────────────────────────────────────────────
    if (questId === "mq3") {
      if (g.mq3Locked) return `MQ3 is inaccessible — you chose the Shadow Path. Use \`/advance shadow_end\` instead.`;
      if (!g.quests.find(q => q.id === "mq1")?.completed) return "Complete **Echoes of the Rift** (MQ1) first.";
      if (!g.quests.find(q => q.id === "mq2")?.completed) return "Complete **The Shattered Seal** (MQ2) first.";
      // All 4 seal guardians at stage 4+
      const guards = SEAL_GUARDIANS[g.gender] || SEAL_GUARDIANS.female;
      const notReady = guards.filter(id => getRelTier(g.characters[id]?.affection || 0).stage < 4);
      if (notReady.length) {
        const names = notReady.map(id => getChar(id)?.name || id).join(", ");
        return `You need a Romantic bond (stage 4+) with all four Seal Guardians. Not yet there: **${names}**.`;
      }
      const sideDone = g.quests.filter(q => q.type === "side" && q.completed).length;
      if (sideDone < 2) return `Complete at least 2 side quests first (${sideDone} done).`;
    }

    return null;
  }

  function triggerEnding(g) {
    if (g.gameOver) return;
    const chars      = getActiveChars();
    const affs       = chars.map(ch => g.characters[ch.id]?.affection || 0).sort((a, b) => a - b);
    const median     = affs[Math.floor(affs.length / 2)];
    const allHigh    = affs.every(a => a >= 75);
    const shadowPath = (g.betrayed?.length || 0) >= 3;
    const sideDone   = g.quests.filter(q => q.type === "side" && q.completed).length;
    const bondsForged = median >= 50;
    let endingName, endingDesc, endingType;

    if (shadowPath) {
      endingType = "shadow";
      endingName = "🌑 Shadow Path";
      endingDesc = "You chose power over bonds. Eryndel's shadows welcome you, but the hearts you abandoned echo in the silence. Malachar smiles.";
    } else if (allHigh) {
      endingType = "win_full";
      endingName = "💞 Hearts United";
      endingDesc = "The realm stands because of love. Every bond forged became a weapon against the void. The companions stand with you as Malachar is sealed once more — forever.";
    } else if (bondsForged && sideDone >= 2) {
      endingType = "win_bonds";
      endingName = "✨ Bonds Forged, Realm Saved";
      endingDesc = `You built real friendships — not all hearts were won, but enough warmth filled the ritual (median affection ${median}). The seal holds. Eryndel breathes again.`;
    } else if (median < 30 && sideDone < 2) {
      endingType = "win_pyrrhic";
      endingName = "💔 A Pyrrhic Salvation";
      endingDesc = `The realm endures, but at what cost? Your companions never truly knew you (median affection ${median}), and the bonds that could have made this victory joyful simply weren't there. The seal holds — barely. The silence afterwards is very heavy.`;
    } else {
      endingType = "win_solo";
      endingName = "⚔️ Realm Saved Alone";
      endingDesc = `You faced the Void King with courage but few true allies (median affection ${median}). The victory is real, but the silence afterward is telling. The realm endures.`;
    }

    g.gameOver   = true;
    g.ending     = endingName;
    g.endingType = endingType;

    const achList = g.achievements.map(a => `${a.icon} ${a.name}`).join(", ") || "None";
    const ngPlusNote = endingType === "win_full"    ? "+1000g, +20 affection with everyone" :
                       endingType === "win_bonds"   ? "+500g, +10 affection" :
                       endingType === "win_solo"    ? "+200g" :
                       endingType === "win_pyrrhic" ? "+100g (no relationship bonus)" :
                       endingType === "shadow"      ? "Shadow power (+2 to all combat skills)" : "";
    oc.thread.messages.push({ author: "system",
      content: `🎊 **THE END — ${endingName}**\n\n${endingDesc}\n\n**Your Journey:** Level ${g.level} | ${g.gold}g | Day ${g.time.day}\n**Achievements:** ${achList}\n\n${ngPlusNote ? `**NG+ Bonus:** ${ngPlusNote}\n\n` : ""}_Type \`/ng+\` to begin New Game+ and carry your legacy forward._` });
    updateShortcutButtons();
  }

  function applyEnvironmentStyle(location, hour) {
    const isDark = hour < 6 || hour >= 20;
    const palettes = {
      town_square:      isDark ? { bg: "#0d1b2a", text: "#c8d8e8" } : { bg: "#f0e6c8", text: "#2c1810" },
      inn:              isDark ? { bg: "#1a0f0f", text: "#f0d0a0" } : { bg: "#2d1810", text: "#f5dfc0" },
      market:           isDark ? { bg: "#0f1a0f", text: "#c8e8c8" } : { bg: "#fff8e1", text: "#3e2723" },
      forest:           isDark ? { bg: "#071207", text: "#a0c8a0" } : { bg: "#e8f5e9", text: "#1b5e20" },
      castle:           isDark ? { bg: "#0d0d1a", text: "#d0c0e8" } : { bg: "#e8eaf6", text: "#1a237e" },
      dungeon:          isDark ? { bg: "#0a0008", text: "#c080d0" } : { bg: "#1a001a", text: "#d0a0d8" },
      training_grounds: isDark ? { bg: "#1a0d00", text: "#f0c8a0" } : { bg: "#fce4ec", text: "#4a0000" }
    };
    const p = palettes[location] || palettes.town_square;
    // oc.thread.messageWrapperStyle is the documented thread-level message style API
    oc.thread.messageWrapperStyle = `background: ${p.bg}; color: ${p.text};`;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 6.5 — GAME RAILS: SCRIPTED EVENTS, OBJECTIVES, MOOD, DAILY CALENDAR
  // ════════════════════════════════════════════════════════════════════════════

  // Seal guardian character IDs per gender (indices 0,1,3,6 in each gender array)
  const SEAL_GUARDIANS = {
    female: ["yuki", "aria", "luna", "rei"],
    male:   ["kael", "zeph", "orion", "ash"]
  };

  // Companions to meet for MQ1 step 1 (dungeon-dweller + forest-dweller)
  const MQ1_CONTACTS = {
    female: { dungeon: "luna", forest: "sakura" },
    male:   { dungeon: "orion", forest: "rex" }
  };

  // ── Mood helpers ────────────────────────────────────────────────────────────
  function getMoodEmoji(mood) {
    return { happy: "😊", neutral: "😐", upset: "😟", angry: "😠" }[mood] || "😐";
  }

  // ── Affection skill-gate cap ─────────────────────────────────────────────────
  // Returns the maximum affection a character can reach before their romantic
  // skill gate is met. Returns Infinity when the gate has already been cleared.
  function getAffectionCap(g, charId) {
    const req = ROMANTIC_SKILL_REQ[charId];
    if (!req) return Infinity;
    const skillVal = resolveSkill(g, req.path);
    if (skillVal >= req.min) return Infinity;
    return 74; // just below stage 4 (Romantic, starts at 75)
  }

  // Apply the cap; return true if affection was clamped, false otherwise
  function clampAffection(g, charId) {
    const cst = g.characters[charId];
    if (!cst) return false;
    const cap = getAffectionCap(g, charId);
    if (cst.affection > cap) { cst.affection = cap; return true; }
    return false;
  }

  // ── Quest objectives data ────────────────────────────────────────────────────
  const QUEST_STEP_OBJECTIVES = {
    mq1: {
      1: (g) => {
        const c = MQ1_CONTACTS[g.gender] || MQ1_CONTACTS.female;
        const dCh = getChar(c.dungeon); const fCh = getChar(c.forest);
        const dCst = g.characters[c.dungeon] || {}; const fCst = g.characters[c.forest] || {};
        return [
          { label: `Meet ${dCh?.name || c.dungeon}`,                                                     done: !!dCst.met },
          { label: `Meet ${fCh?.name  || c.forest}`,                                                     done: !!fCst.met },
          { label: `${dCh?.name || c.dungeon} affection ≥ 10 (currently ${dCst.affection || 0})`,        done: (dCst.affection || 0) >= 10 },
          { label: `${fCh?.name  || c.forest}  affection ≥ 10 (currently ${fCst.affection || 0})`,       done: (fCst.affection || 0) >= 10 }
        ];
      },
      2: (g) => [
        { label: `Travel to the Dungeon or Forest`,                                    done: g.location === "dungeon" || g.location === "forest" },
        { label: `Win at least 1 combat encounter (${g.combatWins || 0} won)`,         done: (g.combatWins || 0) >= 1 }
      ],
      3: (g) => [
        { label: `Possess a Void Shard in your inventory`,                             done: g.inventory.includes("Void Shard") }
      ]
    },
    mq2: {
      1: (g) => { const id = (SEAL_GUARDIANS[g.gender] || SEAL_GUARDIANS.female)[0]; const ch = getChar(id); const t = getRelTier(g.characters[id]?.affection || 0); return [{ label: `${ch?.name || id} at Close bond (stage 3+) — currently ${t.name} (stage ${t.stage})`, done: t.stage >= 3 }]; },
      2: (g) => { const id = (SEAL_GUARDIANS[g.gender] || SEAL_GUARDIANS.female)[1]; const ch = getChar(id); const t = getRelTier(g.characters[id]?.affection || 0); return [{ label: `${ch?.name || id} at Close bond (stage 3+) — currently ${t.name} (stage ${t.stage})`, done: t.stage >= 3 }]; },
      3: (g) => { const id = (SEAL_GUARDIANS[g.gender] || SEAL_GUARDIANS.female)[2]; const ch = getChar(id); const t = getRelTier(g.characters[id]?.affection || 0); return [{ label: `${ch?.name || id} at Close bond (stage 3+) — currently ${t.name} (stage ${t.stage})`, done: t.stage >= 3 }]; },
      4: (g) => { const id = (SEAL_GUARDIANS[g.gender] || SEAL_GUARDIANS.female)[3]; const ch = getChar(id); const t = getRelTier(g.characters[id]?.affection || 0); return [{ label: `${ch?.name || id} at Close bond (stage 3+) — currently ${t.name} (stage ${t.stage})`, done: t.stage >= 3 }]; }
    },
    mq3: {
      1: (g) => {
        const guards   = SEAL_GUARDIANS[g.gender] || SEAL_GUARDIANS.female;
        const sideDone = g.quests.filter(q => q.type === "side" && q.completed).length;
        const rows = guards.map(id => {
          const ch = getChar(id); const t = getRelTier(g.characters[id]?.affection || 0);
          return { label: `${ch?.name || id} at Romantic bond (stage 4+) — currently ${t.name} (stage ${t.stage})`, done: t.stage >= 4 };
        });
        rows.push({ label: `Complete at least 2 side quests (${sideDone} done)`, done: sideDone >= 2 });
        return rows;
      }
    }
  };

  function getObjectivesText(g) {
    const active = (g.quests || []).filter(q => q.visible && !q.completed);
    if (!active.length) return "**📋 Objectives** — No active quests. Explore Moonveil, use /explore and /talk to companions!";
    const lines = [];
    for (const q of active) {
      const step     = q.progress + 1;
      const stepObjs = QUEST_STEP_OBJECTIVES[q.id]?.[step]?.(g);
      lines.push(`**📋 ${q.title}** [Step ${q.progress}/${q.goal}]`);
      if (stepObjs) {
        for (const o of stepObjs) lines.push(`  ${o.done ? "✅" : "🔲"} ${o.label}`);
      } else {
        lines.push(`  📖 ${q.desc}`);
      }
    }
    return lines.join("\n");
  }

  // ── Scripted encounter events ─────────────────────────────────────────────────
  function checkFiredEvents(g) {
    if (!g.firedEvents)   g.firedEvents   = [];
    if (!g.rivalEvents)   g.rivalEvents   = [];
    const fired = g.firedEvents;

    // ── Event 1: The Tremors Begin (Day 2+) ─────────────────────────────────
    if (!fired.includes("tremors") && g.time.day >= 2) {
      fired.push("tremors");
      const mq1 = g.quests.find(q => q.id === "mq1");
      if (mq1) mq1.visible = true;
      g.questNotification = true;
      g.voidShardClue     = true;
      oc.thread.messages.push({ author: "system",
        content: `🌊 **THE TREMORS BEGIN**\n\nWithout warning the ground lurches beneath your feet. Cracks split the cobblestones in the square — a deep resonant groan rises from somewhere far below. Market stalls topple. People scatter. A cold wind carries the reek of something ancient and wrong.\n\nThen — silence. A fissure has opened near the forest road. Inside its depths, something *glows* with a sickly violet light.\n\nA voice behind you mutters: *"This started near the Shadow Dungeon three days ago. Someone should investigate."*\n\n📜 **Main Quest Discovered:** Echoes of the Rift\n💡 Use \`/objectives\` to see your current goals.` });
      updateShortcutButtons();
    }

    // ── Event 3: Aria's Secret Revealed (companion c[1] at stage 3) ──────────
    // (Event 2 — Rival Confrontation — is triggered inside /flirt where charId is known)
    if (!fired.includes("aria_secret")) {
      const chars2 = getActiveChars();
      const ariaId = chars2[1]?.id;
      if (ariaId) {
        const ariaCst  = g.characters[ariaId];
        const ariaTier = getRelTier(ariaCst?.affection || 0);
        if (ariaTier.stage >= 3) {
          fired.push("aria_secret");
          const ariaName = chars2[1].name;
          const mq2 = g.quests.find(q => q.id === "mq2");
          if (mq2) mq2.visible = true;
          const ariaQ = g.quests.find(q => q.id === `sq_${ariaId}` && !q.visible);
          if (ariaQ) { ariaQ.visible = true; g.questNotification = true; }
          if (ariaCst) ariaCst.affection = Math.max(0, (ariaCst.affection || 0) - 15);
          oc.thread.messages.push({ author: "system",
            content: `🔮 **${ariaName.toUpperCase()}'S SECRET REVEALED**\n\nThe door to the inn slams open. Mei storms in clutching a scroll, her face white as parchment.\n\n*"I found it in the archives,"* she says, dropping the scroll on the table. *"Every time ${ariaName} heals someone — truly heals them — a fragment of the Binding Seal weakens. Her power is* linked *to the seals. She doesn't know. If she keeps healing at this rate, the fourth seal will shatter before Malachar even needs to try."*\n\n${ariaName} goes still. The colour drains from her face.\n\n*"How long?"* she whispers.\n\n*"Days,"* says Mei.\n\n📜 **Main Quest Unlocked:** The Shattered Seal\n📜 **Side Quest Unlocked:** ${ariaName}'s Trial\n⚠️ ${ariaName} affection −15 (she is shaken)` });
          updateShortcutButtons();
        }
      }
    }

    // ── Event 4: The Void King's Warning (MQ1 completed) ─────────────────────
    if (!fired.includes("void_warning") && g.quests.find(q => q.id === "mq1")?.completed) {
      fired.push("void_warning");
      getActiveChars().forEach(ch => {
        const cst = g.characters[ch.id];
        if (cst) cst.affection = Math.max(0, (cst.affection || 0) - 5);
      });
      g.manaMalCharDebuff = true;
      g.maxMana = Math.max(5, g.maxMana - 5);
      g.mana    = Math.min(g.mana, g.maxMana);
      oc.thread.messages.push({ author: "system",
        content: `⚠️ **THE VOID KING'S WARNING**\n\nThe sky turns the colour of a bruise. Every light in Moonveil dims at once.\n\nThen a *voice* — not heard with ears but felt in the chest, in the teeth, in the marrow:\n\n*"You have found my footprints, little traveler. How amusing. Every step forward brings you closer to what I have already arranged. Your companions feel it too — that cold thing behind the sternum that is not quite dread but is its older cousin. Come. Come and see what sealing me truly cost the ones who tried."*\n\nThe voice fades. The lights return. But something has changed — a faint oppressive weight that makes spells harder to summon.\n\n💀 **Debuff Applied:** Malachar's Shadow — Max Mana −5 (until The Shattered Seal is complete)\n⚠️ All companion affections −5 (fear)` });
    }

    // ── Event 5: The Betrayer's Mark (3rd betrayal) ───────────────────────────
    if (!fired.includes("betrayer_mark") && (g.betrayed?.length || 0) >= 3) {
      fired.push("betrayer_mark");
      g.shadowEndUnlocked = true;
      getActiveChars().forEach(ch => {
        if (!g.betrayed.includes(ch.id)) {
          const cst = g.characters[ch.id];
          if (cst) cst.affection = Math.max(0, (cst.affection || 0) - 20);
        }
      });
      g.mq3Locked = true;
      earnAchievement(g, "shadow_path");
      oc.thread.messages.push({ author: "system",
        content: `🔱 **THE BETRAYER'S MARK**\n\nThe Traveler's Brand on your hand pulses — and goes *black*.\n\nIt burns. Not painfully, but *knowingly*, as though something ancient within the seal has witnessed every choice and drawn its own conclusions. The remaining companions step back, one by one. Their faces are not angry — they are *afraid*. Not of Malachar. Of *you*.\n\nA shadow pools at your feet that does not match the light.\n\nMalachar's whisper returns, warmer this time:\n\n*"Now we understand each other."*\n\n🌑 The path to United Hearts is permanently closed.\n💀 A new path opens — **The Shadow Ending**: use \`/advance shadow_end\` to claim your throne.\n⚠️ All remaining companions −20 affection` });
      updateShortcutButtons();
    }
  }

  // ── Rival Confrontation scripted event (called from /flirt) ──────────────────
  function fireRivalConfrontation(g, charId) {
    if (!g.rivalEvents) g.rivalEvents = [];
    const rivalId = CHAR_META[charId]?.rival;
    if (!rivalId) return;
    if (g.rivalEvents.includes(`${charId}_${rivalId}`)) return;
    const rivalCst = g.characters[rivalId];
    if (!rivalCst) return;
    const rivalTier = getRelTier(rivalCst.affection || 0);
    if (rivalTier.stage < 3) return; // rival must be at Romantic+ to trigger
    g.rivalEvents.push(`${charId}_${rivalId}`);
    const chName = getChar(charId)?.name   || charId;
    const rvName = getChar(rivalId)?.name  || rivalId;
    // Both lose 10 affection
    const cst = g.characters[charId];
    if (cst)    cst.affection    = Math.max(0, (cst.affection    || 0) - 10);
    if (rivalCst) rivalCst.affection = Math.max(0, (rivalCst.affection || 0) - 10);
    oc.thread.messages.push({ author: "system",
      content: `💢 **RIVAL CONFRONTATION**\n\n${rvName} appears, materialising in the doorway with an expression that splits the difference between wounded pride and cold fury.\n\n*"I thought we had an understanding, ${chName},"* ${rvName} says, not looking at you. Not yet.\n\n*"We do,"* ${chName} answers, voice carefully flat.\n\n*"We did."*\n\nThe silence between them is the kind that makes bystanders find somewhere else to be. ${rvName} turns and leaves without another word.\n\n⚠️ ${chName} affection −10 (uncomfortable) | ${rvName} affection −10 (wounded)` });
  }

  // ── Daily Events Calendar ─────────────────────────────────────────────────────
  function checkDailyEvents(g, prevDay, newDay) {
    if (!g.dailyEventLog) g.dailyEventLog = [];
    const log = g.dailyEventLog;

    for (let d = prevDay + 1; d <= Math.min(newDay, 14); d++) {
      if (d === 3  && !log.includes("crown_edict"))     { log.push("crown_edict");      _dailyCrownEdict(g); }
      if (d === 5  && !log.includes("market_crash"))    { log.push("market_crash");     _dailyMarketCrash(g); }
      if (d === 7  && !log.includes("festival_token"))  { log.push("festival_token");   _dailyFestival(g); }
      if (d === 9  && !log.includes("void_sighting"))   { log.push("void_sighting");    _dailyVoidSighting(g); }
      if (d === 11 && !log.includes("rival_clash"))     { log.push("rival_clash");      _dailyRivalClash(g); }
      if (d === 13 && !log.includes("final_convergence")){ log.push("final_convergence"); _dailyFinalConvergence(g); }
      if (d === 14 && !log.includes("void_overwhelms")) { log.push("void_overwhelms");  _dailyVoidOverwhelms(g); }
    }
  }

  function _dailyCrownEdict(g) {
    g.crownEdictActive = true;
    oc.thread.messages.push({ author: "system",
      content: `👑 **CROWN EDICT — Day 3**\n\nA herald nails a royal proclamation to the notice board:\n\n*"By order of Queen Elara IV, all training contracts in Moonveil are henceforth subject to Crown Levy for the duration of the emergency. Training fees doubled until further notice."*\n\n⚠️ **Training costs doubled today** (40g instead of 20g). The edict expires at midnight.` });
  }

  function _dailyMarketCrash(g) {
    g.marketCrashActive = true;
    oc.thread.messages.push({ author: "system",
      content: `📉 **MARKET CRASH — Day 5**\n\nRumours of Void creature sightings have sent merchant caravans fleeing the road. Supply chains are broken. Every vendor in the market is gouging prices — the stalls reek of fear.\n\n⚠️ **All shop items 50% more expensive today.** The market stabilises tomorrow.` });
  }

  function _dailyFestival(g) {
    g.inventory.push("Festival Token");
    getActiveChars().forEach(ch => {
      const cst = g.characters[ch.id];
      if (cst) { cst.mood = "happy"; cst.moodExpiresDay = g.time.day + 1; }
    });
    oc.thread.messages.push({ author: "system",
      content: `🎉 **FESTIVAL DAY — Day 7**\n\nThe streets explode in colour. Lanterns, music, honeyed pastry and spiced wine. Every companion has gathered in the Town Square — their spirits are high.\n\n🎫 A **Festival Token** has been added to your inventory — give it as a gift to any companion for a massive +15 affection bonus.\n😊 All companions are in a *happy* mood today.` });
  }

  function _dailyVoidSighting(g) {
    const chars = getActiveChars();
    const targets = [...chars].sort(() => Math.random() - 0.5).slice(0, 3).map(c => c.id);
    g.voidSightingTargets = targets;
    g.voidSightingDay     = g.time.day;
    targets.forEach(id => {
      const cst = g.characters[id];
      if (cst) { cst.affection = Math.max(0, (cst.affection || 0) - 5); cst.mood = "upset"; }
    });
    const names = targets.map(id => getChar(id)?.name || id).join(", ");
    oc.thread.messages.push({ author: "system",
      content: `👁️ **VOID SIGHTING — Day 9**\n\nA screech above the town. Three shapeless things circle the castle — Void creatures, small but unmistakably real. Panic ripples through the streets.\n\n⚠️ **${names}** each lost 5 affection (fear) and are *upset*. Talk to each within 2 days to reassure them.` });
  }

  function _dailyRivalClash(g) {
    const chars = getActiveChars();
    let pair = null;
    for (const ch of chars) {
      const rivId = CHAR_META[ch.id]?.rival;
      if (rivId && g.characters[rivId]) {
        const t1 = getRelTier(g.characters[ch.id]?.affection  || 0);
        const t2 = getRelTier(g.characters[rivId]?.affection  || 0);
        if (t1.stage >= 2 && t2.stage >= 2) { pair = [ch.id, rivId]; break; }
      }
    }
    if (!pair) pair = [chars[0]?.id, chars[1]?.id].filter(Boolean);
    g.rivalClashTargets = pair;
    g.rivalClashDay     = g.time.day;
    const n1 = getChar(pair[0])?.name || pair[0];
    const n2 = getChar(pair[1])?.name || pair[1];
    oc.thread.messages.push({ author: "system",
      content: `⚔️ **RIVAL CLASH — Day 11**\n\n${n1} and ${n2} have come to blows in the Town Square — shouting, a crowd forming, someone about to throw a punch.\n\n⚠️ Talk to **${n1}** or **${n2}** within 1 day or both lose 10 affection.` });
  }

  function _dailyFinalConvergence(g) {
    getActiveChars().forEach(ch => {
      const cst = g.characters[ch.id];
      if (cst) cst.currentLocation = "castle";
    });
    oc.thread.messages.push({ author: "system",
      content: `🏰 **THE FINAL CONVERGENCE — Day 13**\n\nQueen Elara has summoned everyone who matters to Moonveil Castle. Every companion is there. The throne room hums with tension — Malachar's stirrings are now impossible to deny.\n\n**All companions have gathered at the Castle.**\n\n⚠️ The deadline approaches: **Echoes of the Rift (MQ1) must be completed by Day 14** or the seals shatter forever.` });
  }

  function _dailyVoidOverwhelms(g) {
    const mq1 = g.quests.find(q => q.id === "mq1");
    if (!mq1?.completed) {
      g.gameOver   = true;
      g.ending     = "💀 The Void Consumed Eryndel";
      g.endingType = "void_consumed";
      oc.thread.messages.push({ author: "system",
        content: `💥 **THE VOID OVERWHELMS — GAME OVER**\n\nDay 14 dawns and the last Binding Seal shatters like glass. The sound is not loud — it is *quiet*, a finality so complete that the air itself holds its breath.\n\nMalachar tears free.\n\nYou did not find the rift's source in time. The realm you might have saved is now something else entirely — something colder and darker and without mercy. The companions scatter. Some run. Some are simply gone.\n\nEryndel falls.\n\n**💀 ENDING: The Void Consumed Eryndel**\n_Your journey ended on Day ${g.time.day}, Level ${g.level}._\n_Type \`/ng+\` to begin a new timeline — the realm deserves another chance._` });
      updateShortcutButtons();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────

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
        charLine = `${cdef.name} (${tier.name} stage ${tier.stage}, ❤️${cst.affection || 0}, mood: ${cst.mood || "neutral"} ${getMoodEmoji(cst.mood || "neutral")}, loc: ${cst.currentLocation || cdef.location})`;
      }
    }

    // Skill snapshot
    const sk = g.skills;
    const skillLine = `STR ${sk.combat.strength} DEF ${sk.combat.defense} SPD ${sk.combat.speed} | CHM ${sk.social.charm} PRS ${sk.social.persuasion} EMP ${sk.social.empathy} | SPC ${sk.magic.spellpower} RES ${sk.magic.resistance} MAN ${sk.magic.mana}`;

    // Locked stat gates
    const lockedGates = STAT_GATES.filter(sg => !sg.check(g)).map(sg => sg.desc).join("; ");

    // Enemies at current location
    const locEnemies = (ENEMIES[g.location] || []).map(e => e.name).join(", ");

    // Companion schedule + mood summary
    const scheduleSnip = chars.slice(0, 5).map(ch => {
      const cs = g.characters[ch.id];
      const moodEmoji = getMoodEmoji(cs?.mood || "neutral");
      return `${ch.name.split(" ")[0]}@${cs?.currentLocation || ch.location}${moodEmoji}`;
    }).join(", ");

    const worldLabel = (g.worldSettings || ["medieval_fantasy"])
      .map(id => WORLD_SETTINGS.find(w => w.id === id)?.label || id).join(" + ");
    const toneLabel = (g.storyTones || ["dark_romance"])
      .map(id => STORY_TONES.find(t => t.id === id)?.label || id).join(", ");

    // Active debuffs
    const debuffs = [];
    if (g.manaMalCharDebuff) debuffs.push("Malachar's Shadow (Max Mana −5, until MQ2 done)");
    if (g.crownEdictActive)  debuffs.push("Crown Edict (training costs 2×)");
    if (g.marketCrashActive) debuffs.push("Market Crash (shop prices +50%)");
    const debuffLine = debuffs.length ? `Active Debuffs: ${debuffs.join(" | ")}` : "";

    // Daily event warning
    const daysLeft = 14 - g.time.day;
    const urgencyLine = daysLeft <= 3 && !g.quests.find(q => q.id === "mq1")?.completed
      ? `⚠️ DEADLINE: MQ1 must be completed within ${daysLeft} day(s) or the Void wins!`
      : "";

    // Apply player identity so the AI sees the user by their chosen name, description, and role
    oc.thread.userCharacter.name = g.playerName || "Traveler";
    oc.thread.userCharacter.description = [
      g.playerDesc || "",
      g.playerRole ? `Dynamic: ${g.playerRole.toUpperCase()}` : ""
    ].filter(Boolean).join(" | ");

    let reminder = `[GAME STATE]
Player: ${g.playerName}${g.playerDesc ? ` — ${g.playerDesc}` : ""} | Day ${g.time.day}, ${String(hour).padStart(2,"0")}:00${festival}
Player Dynamic Role: ${(g.playerRole || "switch").toUpperCase()} — ${
  g.playerRole === "dom"    ? "Player is DOMINANT: all companions must treat the player as the dominant party. If a companion is also dominant by nature, play up the delicious tension and playful power struggle — neither yields easily." :
  g.playerRole === "sub"    ? "Player is SUBMISSIVE: companions take the lead; dominant companions thrive here, nurturing ones protect, equal ones guide gently." :
                              "Player is SWITCH: companions default to their own natural dynamic (giver/receiver) and the balance shifts organically scene by scene."
}
HP: ${g.hp}/${g.maxHp} | Mana: ${g.mana}/${g.maxMana} | Gold: ${g.gold} | Level: ${g.level} | XP: ${g.xp}/${g.xpToNext}
Combat Wins: ${g.combatWins || 0} | Deaths: ${g.deathCount || 0}
Location: ${loc.name}${locEnemies ? ` | Enemies here: ${locEnemies}` : ""}
Skills: ${skillLine}
${lockedGates ? `Stat gates not yet met: ${lockedGates}` : "All stat gates cleared"}
${debuffLine ? debuffLine + "\n" : ""}${urgencyLine ? urgencyLine + "\n" : ""}Active Quests: ${activeQs}
Active Character: ${charLine}
Companions (first 5 with mood): ${scheduleSnip}
World Setting: ${worldLabel} | Story Tone: ${toneLabel}
${g.gameOver ? `[GAME OVER — Ending: ${g.ending}. Only /ng+ is accepted.]` : ""}
[GAME RAILS — MANDATORY] When the player asks "what do I do next?" or seems lost, direct them to use /objectives — do NOT improvise quest guidance or invent requirements. The /objectives command shows the authoritative, hard-coded checklist for each quest step. You must not invent ways around these requirements. Quest steps cannot be skipped or narrated around — the /advance command enforces hard preconditions.
[CHARACTER MOOD — MANDATORY] Each companion has a current mood shown in their state. An ANGRY companion will refuse to talk or flirt — narrate this firmly. An UPSET companion responds coldly and gives minimal affection. A HAPPY companion is warm and receptive. You must reflect the companion's current mood accurately in their dialogue and behavior.
[CHARACTER APPEARANCE — STANDING RULE] Every character in the scene who is not explicitly nude is dressed in varying degrees of scantily clad, provocative, and alluring attire — always sexy and visually appealing. Skimpy, revealing clothing is the default; more modest dress is the exception and must be story-justified. If a character is nude, omit all clothing descriptions entirely — do not mention garments, fabric, or undressing.
Use /help for all commands. Narrate immersively in second person, consistent with the world setting and story tone.`;

    reminder += buildConsentBlock(g);
    reminder += buildNsfwProfileBlock(g);
    reminder += `\n[Storyline]\n${g.storyline?.slice(0, 900) || ""}`;

    // ── Story tone writing directive ───────────────────────────────────────────
    const toneIds = g.storyTones || ["dark_romance"];
    const toneCues = toneIds.map(id => TONE_CONFIG[id]?.reminderCue).filter(Boolean).join(" | ");
    if (toneCues) reminder += `\n[WRITING TONE — MANDATORY] Narrate in these tones: ${toneCues}`;

    // ── Hint injection (only when player appears stuck) ────────────────────────
    const hint = evaluateHints(g);
    if (hint) reminder += `\n${hint}`;

    oc.thread.character.reminderMessage = reminder;

    // ── Universal image prompt prefix/suffix ──────────────────────────────────
    // These are picked up by Perchance's image generation pipeline for every
    // auto-generated scene image, ensuring consistent quality and world style.
    const worldCueStr = (g.worldSettings || ["medieval_fantasy"])
      .map(id => WORLD_SETTINGS.find(w => w.id === id)?.cues || "").join(" ");
    oc.thread.character.imagePromptPrefix =
      `masterpiece, best quality, highly detailed, 8k resolution, professional digital art, ` +
      `beautiful dramatic lighting, vivid colors, sharp focus, ${worldCueStr}, atmospheric fantasy art,`;
    oc.thread.character.imagePromptSuffix =
      `scantily clad alluring attire, provocative clothing, visually stunning ` +
      `(negativePrompt::: blurry, low quality, pixelated, watermark, text, logo, ui elements, hud, ` +
      `bad anatomy, deformed hands, extra fingers, missing limbs, bad proportions, amateur art:1.2)`;

    // ── roleInstruction: appearance + tone directive (persists across reminder refreshes) ──
    const primaryWorld = (g.worldSettings && g.worldSettings[0]) || "medieval_fantasy";
    const wc = WORLD_CONFIG[primaryWorld] || WORLD_CONFIG.medieval_fantasy;
    oc.thread.character.roleInstruction =
      `You are the narrator of an immersive adult story set in ${wc.settingName}. ` +
      `Narrate in second person. ` +
      `[APPEARANCE RULE] Every character not explicitly nude wears scantily clad, provocative, ` +
      `alluring attire by default. Skimpy clothing is the norm. If nude, omit all clothing references entirely. ` +
      `[TONE] ${toneCues || "Dark romance — passion with danger and depth."}`;

    // Populate oc.thread.imagePromptTriggers so Perchance's auto-image engine knows each
    // character's portrait prompt.  One entry per companion: name, archetype, image keywords,
    // and the pre-generated portrait dataUrl when available.
    oc.thread.imagePromptTriggers = chars.map(ch => {
      const portraitUrl = cd._portraits && cd._portraits[ch.id];
      return portraitUrl
        ? `${ch.name} (${ch.archetype}): ${ch.imageKeywords}. Portrait: ${portraitUrl}`
        : `${ch.name} (${ch.archetype}): ${ch.imageKeywords}`;
    }).join("\n");

    const hour2 = getGameHour(g);
    applyEnvironmentStyle(g.location, hour2);
  }

  function updateShortcutButtons() {
    const g = cd.game;
    const questLabel = g?.questNotification ? "⚡ Quests" : "📜 Quests";
    const shadowBtn  = g?.shadowEndUnlocked && !g?.gameOver
      ? [{ name: "🌑 Shadow End", message: "/advance shadow_end", insertionType: "replace", autoSend: true, clearAfterSend: false }]
      : [];
    const ngPlusBtn  = g?.gameOver
      ? [{ name: "🔄 New Game+", message: "/ng+", insertionType: "replace", autoSend: true, clearAfterSend: false }]
      : [];
    oc.thread.shortcutButtons = [
      { name: "📊 Status",        message: "/status",       insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "🎒 Inventory",     message: "/inventory",    insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "⚔️ Skills",        message: "/skills",       insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: questLabel,          message: "/quests",       insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "📋 Objectives",    message: "/objectives",   insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "🗺️ Explore",       message: "/explore",      insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "🏪 Shop",          message: "/shop",         insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "👥 Characters",    message: "/chars",        insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "🕒 Time",          message: "/time",         insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "🏋️ Train",         message: "/train ",       insertionType: "replace", autoSend: false, clearAfterSend: false },
      { name: "🗡️ Fight",         message: "/fight ",       insertionType: "replace", autoSend: false, clearAfterSend: false },
      { name: "😴 Rest",          message: "/rest",         insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "⚗️ Craft",         message: "/craft ",       insertionType: "replace", autoSend: false, clearAfterSend: false },
      { name: "🏆 Achievements",  message: "/achievements", insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "🖼️ Image",         message: "/image",        insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "🔞 Kinks",         message: "/kinks",        insertionType: "replace", autoSend: true,  clearAfterSend: false },
      { name: "❓ Help",          message: "/help",         insertionType: "replace", autoSend: true,  clearAfterSend: false },
      ...shadowBtn,
      ...ngPlusBtn
    ];
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 8 — XP & DETECTION
  // ════════════════════════════════════════════════════════════════════════════

  function awardXP(amount) {
    const g = cd.game;
    const scaled = Math.round(amount * getDiffMult(g).xpScale);
    g.xp += scaled;
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
            const mood = getMoodEmoji(cst?.mood || "neutral");
            return `  ${ch.name} (${ch.archetype}) — ${tier.name} (❤️${cst?.affection || 0}) ${mood}`;
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
        const mood  = getMoodEmoji(cst?.mood || "neutral");
        return `  **${ch.name}** (${ch.archetype}) — ${tier.name} ❤️${cst?.affection || 0} ${mood}${met} @ ${cst?.currentLocation || ch.location}`;
      });
      oc.thread.messages.push({ author: "system", content: `**👥 Companions**\n${lines.join("\n")}` });
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
      // ── Scene gates ────────────────────────────────────────────────────────
      if (dest === "dungeon") {
        const c      = MQ1_CONTACTS[g.gender] || MQ1_CONTACTS.female;
        const dungeonGuide = g.characters[c.dungeon];
        if (!dungeonGuide?.met) {
          const guideName = getChar(c.dungeon)?.name || c.dungeon;
          oc.thread.messages.push({ author: "system",
            content: `🚫 The dungeon's entrance is shrouded in shadow — you sense you need a guide before going further. Find **${guideName}** and talk to them first.` });
          return;
        }
      }
      if (dest === "castle") {
        if (g.time.day < 3) {
          oc.thread.messages.push({ author: "system",
            content: `🚫 The castle gates are sealed by royal order — Queen Elara's steward turned you away. Come back after the morning briefing (Day 3).` });
          return;
        }
      }
      if (dest === "night_market" || dest === "market") {
        const hour = getGameHour(g);
        const isNight = hour >= 20 || hour < 6;
        if (dest === "night_market" && !isNight) {
          oc.thread.messages.push({ author: "system", content: `🚫 The Night Market only opens after 20:00. Come back after dark.` });
          return;
        }
        if (dest === "night_market" && !g.inventory.includes("Dungeon Key") && (g.combatWins || 0) < 3) {
          oc.thread.messages.push({ author: "system",
            content: `🚫 The Night Market's gatekeep stops you: *"We don't serve strangers without proof of grit. Win three fights or bring a Dungeon Key."* (Combat wins: ${g.combatWins || 0}/3)` });
          return;
        }
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
        if (sq) { sq.visible = true; g.questNotification = true; oc.thread.messages.push({ author: "system", content: `📜 New side quest discovered: **${sq.title}**` }); }
      }
      // ── Mood gate ─────────────────────────────────────────────────────────
      if (cst.mood === "angry") {
        oc.thread.messages.push({ author: "system",
          content: `😠 **${ch.name}** is too angry to talk right now. You've neglected them for too long — give them time, or bring a gift.` });
        return;
      }
      // ── Mood-adjusted affection gain (scaled by difficulty) ──────────────────
      const moodBonus = cst.mood === "happy" ? 4 : cst.mood === "upset" ? 1 : 2;
      const festival  = isFestivalDay(g) ? 2 : 0;
      const gain      = Math.round((moodBonus + festival) * getDiffMult(g).affectionScale);
      cst.affection   = (cst.affection || 0) + gain;
      // Update lastTalkedDay for neglect tracking
      cst.lastTalkedDay = g.time.day;
      // Reset mood to neutral after being talked to while upset
      if (cst.mood === "upset") { cst.mood = "neutral"; delete cst.moodExpiresDay; }
      // Clamp to skill-gate cap
      const wasCapped = clampAffection(g, charId);
      const capNote   = wasCapped ? `\n_Bond is at its limit — ${ch.name} needs more from you before it can deepen. (Raise the required skill.)_` : "";
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
        content: `💬 You spend time with **${ch.name}** ${getMoodEmoji(cst.mood)}. Affection +${gain} (now ${cst.affection}).${capNote}` });
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
      // Festival Token gives +15 affection as a special gift
      const isFestToken = itemName.toLowerCase() === "festival token";
      const bonus    = isFestToken ? 15 : (isFav ? baseBonus * 2 : baseBonus);
      const festival  = isFestivalDay(g) ? 2 : 0;
      cst.affection   = (cst.affection || 0) + bonus + festival;
      // Mood: giving favourite item sets mood to happy for 3 days
      if (isFav || isFestToken) { cst.mood = "happy"; cst.moodExpiresDay = g.time.day + 3; }
      const favNote   = isFestToken ? ` 🎫 Festival Token — special gift!` : isFav ? ` 💖 Favourite gift — double affection!` : "";
      const festNote  = festival ? ` +${festival} festival bonus` : "";
      // Affection cap check
      const wasCapped = clampAffection(g, charId);
      const capNote   = wasCapped ? `\n_Bond capped — ${ch.name} needs more from you first. Raise the required skill._` : "";
      // Rival favourite-item jealousy: giving rival's favourite to anyone while that rival is Romantic+
      const rivalId   = CHAR_META[charId]?.rival;
      let rivalJealNote = "";
      if (rivalId && g.characters[rivalId]) {
        const rivFav  = CHAR_META[rivalId]?.favoriteGift;
        const rivTier = getRelTier(g.characters[rivalId].affection || 0);
        if (rivFav && rivFav.toLowerCase() === itemName.toLowerCase() && rivTier.stage >= 3) {
          g.characters[rivalId].affection = Math.max(0, (g.characters[rivalId].affection || 0) - 20);
          g.characters[rivalId].mood = "upset";
          rivalJealNote = `\n⚠️ **${getChar(rivalId)?.name || rivalId}** found out — that's their favourite. Affection −20, mood: upset.`;
        }
      }
      oc.thread.messages.push({ author: "system",
        content: `🎁 Gave **${itemName}** to **${ch.name}** ${getMoodEmoji(cst.mood)}. Affection +${bonus + festival} (now ${cst.affection}).${favNote}${festNote}${capNote}${rivalJealNote}` });
      earnAchievement(g, "first_gift");
      checkAchievements(g);
      cst.lastTalkedDay = g.time.day;
      // Handle consumable crafted item effects on self
      const crafted = CRAFTED_ITEMS[itemName];
      if (crafted?.heals)        { g.hp   = Math.min(g.maxHp,   g.hp   + crafted.heals); }
      if (crafted?.restoresMana) { g.mana = Math.min(g.maxMana, g.mana + crafted.restoresMana); }
      updateReminder();
      return;
    }

    // ── /objectives ─────────────────────────────────────────────────────────────
    if (cmd === "objectives") {
      oc.thread.messages.push({ author: "system", content: getObjectivesText(g) });
      return;
    }

    // ── /advance <questId> ────────────────────────────────────────────────────
    if (cmd === "advance") {
      const questId = args[0];
      if (!questId) {
        oc.thread.messages.push({ author: "system", content: "Usage: /advance <questId> — e.g. /advance mq1 or /advance sq_yuki" });
        return;
      }

      // Shadow Ending special route
      if (questId === "shadow_end") {
        if (!g.shadowEndUnlocked) {
          oc.thread.messages.push({ author: "system", content: `🚫 The Shadow Ending is not yet unlocked. Three betrayals must brand you first.` });
          return;
        }
        if (g.gameOver) {
          oc.thread.messages.push({ author: "system", content: `The story has already ended. Type \`/ng+\` to start New Game+.` });
          return;
        }
        g.gameOver   = true;
        g.ending     = "🌑 Shadow Throne";
        g.endingType = "shadow";
        oc.thread.messages.push({ author: "system",
          content: `🌑 **THE SHADOW ENDING — SHADOW THRONE**\n\nYou step forward and lay your hand on the Void King's seal — not to destroy it, but to claim it.\n\nMalachar does not fight. He *welcomes* you.\n\n*"I wondered when you would stop pretending,"* he says.\n\nThe realm of Eryndel does not end. It transforms. The ones who might have been your companions watch from a distance — some with grief, some with something colder — as the shadow crown settles on your brow.\n\nYou are not the hero of this story.\n\nYou are its *ending*.\n\n**🌑 ENDING: Shadow Throne**\n_Day ${g.time.day} | Level ${g.level} | ${g.betrayed?.length || 0} betrayals_\n\n_Type \`/ng+\` to begin a new timeline — perhaps one with different choices._` });
        updateShortcutButtons();
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
        oc.thread.messages.push({ author: "system", content: `⚠️ Cannot advance **${quest.title}**: ${depErr}` });
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
          content: `🔘 **Quest Progress: ${quest.title}** [${quest.progress}/${quest.goal}]\n+${stepXP} XP\n\nUse /objectives to see what's needed for the next step.` });
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
      // Scale enemy to player level AND difficulty
      const diff     = getDiffMult(g);
      const scale    = 1 + (g.level - 1) * 0.2;
      const enemy    = {
        ...baseEnemy,
        str: Math.round(baseEnemy.str * scale * diff.enemyAtkScale),
        def: Math.round(baseEnemy.def * scale),
        hp:  Math.round(baseEnemy.maxHp * scale * diff.enemyHpScale)
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
        g.combatWins = (g.combatWins || 0) + 1;
        awardXP(enemy.xp);
        earnAchievement(g, "first_fight");
        oc.thread.messages.push({ author: "system",
          content: `⚔️ **Battle vs ${enemy.name}**\n${log.join("\n")}\n\n✅ **Victory!** +${enemy.xp} XP, +${enemy.gold}g${lootDrop ? `, found: ${lootDrop}` : ""}\nHP: ${g.hp}/${g.maxHp} | Combat Wins: ${g.combatWins}` });
      } else {
        const goldLost = Math.min(g.gold, Math.floor(enemy.gold / 2));
        g.gold    -= goldLost;
        g.hp       = 0; // actual death
        g.location = "inn";
        g.deathCount = (g.deathCount || 0) + 1;
        let deathNote = `💀 **Defeated!** Lost ${goldLost}g. You wake at the inn — HP restored to ${Math.floor(g.maxHp / 2)}.`;
        // Death penalty at 3 deaths
        if (g.deathCount >= 3 && !g.scarApplied) {
          g.scarApplied = true;
          getActiveChars().forEach(ch => {
            const cst = g.characters[ch.id];
            if (cst) cst.affection = Math.max(0, (cst.affection || 0) - 10);
          });
          g.playerDesc = (g.playerDesc || "") + " A pale scar runs from temple to jaw — a mark of repeated defeats.";
          deathNote += `\n⚠️ **Scar earned** — you've fallen 3 times. All companions −10 affection (they are losing faith). A permanent scar marks your face.`;
        }
        g.hp = Math.max(1, Math.floor(g.maxHp / 2));
        oc.thread.messages.push({ author: "system",
          content: `⚔️ **Battle vs ${enemy.name}**\n${log.join("\n")}\n\n${deathNote}` });
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
      // Training cost: scaled by difficulty; 40g on Crown Edict day; 50g when total skills >= 30
      const totalSkills = Object.values(g.skills).reduce((sum, grp) => sum + Object.values(grp).reduce((s, v) => s + v, 0), 0);
      const baseRaw     = g.crownEdictActive ? 40 : (totalSkills >= 30 ? 50 : 20);
      const baseCost    = Math.round(baseRaw * getDiffMult(g).trainingCostScale);
      if (g.gold < baseCost) {
        oc.thread.messages.push({ author: "system", content: `Training costs ${baseCost}g (you have ${g.gold}g).${g.crownEdictActive ? " (Crown Edict levy active.)" : ""}` });
        return;
      }
      g.gold -= baseCost;
      g.lastTrained[cat] = true;
      g.lastTrainedDay   = g.time.day;
      g.trainingCount = (g.trainingCount || 0) + 1;
      // Raise the lowest skill in category
      const skillGroup = g.skills[cat];
      const lowest     = Object.entries(skillGroup).sort((a, b) => a[1] - b[1])[0];
      skillGroup[lowest[0]] += 1;
      advanceTime(g, 120);
      awardXP(40);
      oc.thread.messages.push({ author: "system",
        content: `🏋️ **${cat.charAt(0).toUpperCase() + cat.slice(1)} Training**\nPaid ${baseCost}g | ${lowest[0].charAt(0).toUpperCase() + lowest[0].slice(1)}: ${lowest[1]} → ${lowest[1]+1} | +40 XP` });
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
      // ── Mood gate for flirt ────────────────────────────────────────────────
      if (cst.mood === "angry") {
        oc.thread.messages.push({ author: "system",
          content: `😠 **${ch.name}** is too angry to respond to flirting. They turn away without a word. Address their mood first.` });
        return;
      }
      if (cst.mood === "upset") {
        oc.thread.messages.push({ author: "system",
          content: `😟 **${ch.name}** is too upset — your attempt at flirting is met with a cold look. Bring a gift or talk to them sincerely first.` });
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
      const moodSuccessBonus = cst.mood === "happy" ? 0.2 : 0;
      const success = charm >= 4 || Math.random() < (0.6 + moodSuccessBonus);
      const baseBonus = success ? (isFestivalDay(g) ? 8 : 5) : 0;
      const bonus   = Math.round(baseBonus * getDiffMult(g).affectionScale);
      cst.affection = (cst.affection || 0) + bonus;
      clampAffection(g, charId);
      advanceTime(g, 30);
      cst.lastTalkedDay = g.time.day;
      // Rival confrontation scripted event
      fireRivalConfrontation(g, charId);
      // Jealousy
      const rival = CHAR_META[charId]?.rival;
      if (rival && g.characters[rival]) {
        const rivalTier = getRelTier(g.characters[rival].affection || 0);
        if (rivalTier.stage >= 4) g.characters[rival].affection = Math.max(0, (g.characters[rival].affection || 0) - 2);
      }
      if (success) {
        oc.thread.messages.push({ author: "system",
          content: `😘 You flirt with **${ch.name}** ${getMoodEmoji(cst.mood)} — and it lands! Affection +${bonus} (now ${cst.affection}).` });
      } else {
        oc.thread.messages.push({ author: "system",
          content: `😅 Your attempt to flirt with **${ch.name}** falls flat. Try again when your charm is higher.` });
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
        content: `**❓ Commands**\n\n**World**\n/status — player stats\n/inventory — items\n/skills — skill levels\n/quests — quest log\n/objectives — current quest step checklist ⭐\n/explore — location info & enemies\n/chars — companion list\n/go <location> — travel\n/time — in-game clock\n\n**Visuals**\n/image — scene image\n/image_pov — what you see (player POV)\n/image_charpov — what active char sees\n/image_action — action climax (uses last 3 messages)\n\n**Social**\n/talk <charId> — spend time together\n/gift <charId> <itemName> — give an item\n/flirt <charId> — charm check (+affection)\n/betray <charId> — sever a bond (shadow path)\n\n**Combat**\n/fight <enemyId> [--spell] — battle an enemy\n/rest — sleep at the inn (heal + mana restore)\n\n**Economy**\n/shop — view shop\n/buy <itemId> — purchase item\n/craft <item1> <item2> — craft items\n/use <itemName> — use a consumable\n\n**Training**\n/train <combat|magic|social> — raise skills\n\n**Quests**\n/advance <questId> — progress a quest\n/advance shadow_end — claim the Shadow Throne (betrayer path)\n\n**Progression**\n/achievements — trophy list\n/kinks — manage consent settings\n/ng+ — New Game+ (after ending)\n\n**Locations:** ${Object.keys(LOCATIONS).join(", ")}\n\n💡 **Tip:** Use /objectives whenever you're unsure what to do next!` });
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
      cd.game.enabledKinks = sel;
      updateReminder();
      const count = sel.length;
      oc.thread.messages.push({ author: "system",
        content: `\uD83D\uDD12 Consent settings saved. ${count} kink${count !== 1 ? "s" : ""} enabled. The story will strictly respect these boundaries.` });
      oc.window.hide();
    });

    oc.window.show();
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
        const d = {
          gender: _g,
          playerRole: _r,
          name: document.getElementById('pName').value.trim() || 'Traveler',
          desc: document.getElementById('pDesc').value.trim()
        };
        cd._pendingSetup = d;
        step2(d);
      });
      document.getElementById('aiBtn').addEventListener('click', async () => {
        const btn = document.getElementById('aiBtn');
        btn.textContent = '⏳…'; btn.disabled = true;
        const name = document.getElementById('pName').value.trim() || 'Traveler';
        const notes = document.getElementById('pDesc').value.trim();
        try {
          const desc = await oc.getChatCompletion({
            messages: [{ author: "user",
              content: `Write a vivid 2-3 sentence physical appearance description for a character named "${name}" based on these notes: "${notes || "mysterious traveler"}". Reply ONLY with the description — no greetings, no roleplay.`
            }]
          });
          const textarea = document.getElementById('pDesc');
          if (textarea) textarea.value = (desc || '').trim();
        } catch(e) {
          console.warn('[Setup] AI description failed:', e?.message || e);
        } finally {
          const b = document.getElementById('aiBtn');
          if (b) { b.innerHTML = '✨ AI<br>Generate'; b.disabled = false; }
        }
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
        const d = { ...data, bodyTypePrefs: p };
        cd._pendingSetup = d;
        step3(d);
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
        const d = { ...data, worldSettings: ws, storyTones: st };
        cd._pendingSetup = d;
        step4(d);
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
        pregenerate({ ...data, enabledKinks: en });
      });

      oc.window.show();
    }

    step1();
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 12 — GAME INIT, PREGENERATION & MIGRATION
  // ════════════════════════════════════════════════════════════════════════════

  function initGame(gender, playerName, playerDesc, bodyTypePrefs, enabledKinks, worldSettings, storyTones, playerRole, difficulty) {
    const chars      = gender === "female" ? FEMALE_CHARS : MALE_CHARS;
    const ws         = worldSettings || ["medieval_fantasy"];
    const sideQuests = buildSideQuests(chars, ws);
    const quests     = [
      ...buildMainQuests(ws).map(q => ({ ...q, progress: 0, completed: false })),
      ...sideQuests.map(q => ({ ...q, progress: 0, completed: false }))
    ];

    const characters = {};
    chars.forEach(ch => {
      characters[ch.id] = { affection: 0, met: false, currentLocation: ch.location, dialogueStage: 0, questProgress: 0, mood: "neutral", lastTalkedDay: 0 };
    });

    cd.game = {
      initialized: true, gender,
      playerName:  playerName   || "Traveler",
      playerDesc:  playerDesc   || "",
      playerRole:  playerRole   || "switch",
      bodyTypePrefs: bodyTypePrefs || [],
      enabledKinks:  enabledKinks  || [],
      worldSettings: ws,
      storyTones:    storyTones    || ["dark_romance"],
      difficulty:    difficulty    || "normal",
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
      gameOver: false, ending: null, endingType: null, betrayed: [], questNotification: false,
      ngPlusBonus: null, storyline: buildStoryline(chars, playerName, ws),
      combatWins: 0, deathCount: 0,
      firedEvents: [], rivalEvents: [], dailyEventLog: [],
      lastTrainedDay: 1, manaMalCharDebuff: false, shadowEndUnlocked: false,
      voidSightingTargets: [], voidSightingDay: 0, rivalClashTargets: [], rivalClashDay: 0,
      crownEdictActive: false, mq3Locked: false, voidShardClue: false,
      hintCounter: 0, daySnapshot: null
    };

    regeneratePriceModifiers(cd.game);
    updateCompanionSchedules(cd.game);
    cd.game.daySnapshot = takeSnapshot(cd.game); // start day 1 snapshot
    updateReminder();
    updateShortcutButtons();
  }

  // Pregenerate world: background image + companion portraits + intro text
  async function pregenerate(data) {
    // Guard against concurrent pregeneration (e.g., rapid UI double-submit)
    if (cd._pregenerating) return;
    cd._pregenerating = true;

    const allBodyTypeIds = Object.keys(BODY_TYPES); // kept for reference; prefs apply only to player profile
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

    // Build per-character image prompt.
    // If the player selected a specific subset of body types (at least one but not all), those
    // preferences override the companion's prebaked imageKeywords so the player's attraction
    // profile shapes how companions look.  When zero or all body types are selected the player
    // expressed no meaningful preference, so we fall back to the companion's own prebaked keywords.
    function charImagePrompt(ch) {
      const prefs = data.bodyTypePrefs || [];
      const usePrefs = prefs.length > 0 && prefs.length < allBodyTypeIds.length;
      const bodyDesc = usePrefs
        ? prefs.map(id => BODY_TYPES[id]?.desc || id).join(", ")
        : ch.imageKeywords;
      return `${bodyDesc} ${worldCues} portrait character art detailed digital illustration`;
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
      let bgSceneMsg = null;
      await Promise.all([
        oc.textToImage({
          prompt: `${worldCues} atmospheric scenic establishing shot wide angle cinematic digital art no people`,
          negativePrompt: "people, characters, portraits, text, ui"
        }).then(r => {
          const bgUrl = r?.dataUrl;
          if (bgUrl) {
            // Scene background is set via a message with a scene property (documented OpenCharacters API).
            // oc.thread.character has no scene override — only name/avatar/reminderMessage/roleInstruction.
            bgSceneMsg = {
              author: "system", content: "",
              hiddenFrom: ["user", "ai"], expectsReply: false,
              scene: { background: { url: bgUrl } }
            };
            oc.thread.messages.push(bgSceneMsg);
          }
          console.log("[Pregen] Background:", bgUrl ? "scene message pushed" : "no result");
        }).catch(e => console.warn("bg image failed:", e?.message)),
        ...chars.map(ch =>
          oc.textToImage({
            prompt: charImagePrompt(ch),
            negativePrompt: "nsfw, explicit, nude"
          }).then(r => {
            const portraitUrl = r?.dataUrl;
            if (portraitUrl) cd._portraits[ch.id] = portraitUrl;
            console.log(`[Pregen] Portrait ${ch.id}:`, portraitUrl ? "dataUrl saved" : "no result");
          }).catch(e => console.warn(`portrait failed (${ch.id}):`, e?.message))
        )
      ]);

      // 3. Init game state
      showStatus("Initialising world…", "Setting up game state");
      initGame(data.gender, data.name, data.desc, data.bodyTypePrefs, data.enabledKinks, data.worldSettings, data.storyTones, data.playerRole, data.difficulty || "normal");
      const g = cd.game;

      // 4. World narrative — world-adaptive opening via WORLD_CONFIG
      showStatus("Writing your story…", "Composing the opening narrative");
      const primaryWorld = (data.worldSettings && data.worldSettings[0]) || "medieval_fantasy";
      const wc = WORLD_CONFIG[primaryWorld] || WORLD_CONFIG.medieval_fantasy;

      const worldDescLine = (data.worldSettings || []).map(id => {
        const w = WORLD_SETTINGS.find(x => x.id === id);
        return w ? `${w.label} — ${w.desc}` : id;
      }).join(" and ");

      const intro = [
        `${wc.settingName} is shaped by the forces of ${worldDescLine}. It is a world that does not wait politely for newcomers to catch their breath. ${wc.arrivalVerb} Around you, ${wc.openingLocationDesc} — purposeful noise and unfamiliar faces, each carrying their own story.`,
        `The tone of your journey has already etched itself into the fabric of what is to come: ${toneLabel}. Whether by destiny or coincidence, you have arrived precisely where such stories begin. A notice board nearby is fresh with ink — *"${wc.mq1Title}: ${wc.mq1Desc.split(".")[0]}."* Someone posted it recently. The ink is barely dry.`,
        `You are not entirely alone. Scattered across ${wc.settingName} are people whose paths will cross yours — some by accident, some by design, and at least one by something that cannot yet be explained. They have their own lives, their own schedules, their own reasons for being here. Whether they become allies, rivals, or something more intimate is entirely up to you.`,
        `You stand${data.desc ? `, ${data.desc},` : ""} the morning young and the world wide open. The air carries the scent of ${worldCues.split(" ").slice(0, 2).join(" and ")}. Your first lead awaits — and the ${wc.realmNoun} is watching to see what kind of person you are.`
      ].join("\n\n");

      oc.thread.messages.push({ author: "system",
        content: `✨ **World ready!**  Setting: ${worldLabel}  |  Tone: ${toneLabel}\n🔞 ${g.enabledKinks.length} kink(s) enabled. Type /kinks to adjust consent at any time.`,
        expectsReply: false });
      const introMsg = { author: "ai", content: intro, expectsReply: false };
      oc.thread.messages.push(introMsg);

      // 5. Character image triggers — register each portrait in the thread so the AI can reference them
      // These messages are permanent gameplay context (the AI uses them to display portraits during
      // the session) and must survive the staging-message cleanup at the end of this function.
      showStatus("Applying character images…", "Registering portrait triggers");
      const portraitTriggerMsgs = [];
      for (const ch of chars) {
        const portraitUrl = cd._portraits[ch.id];
        const trigMsg = {
          author: "system",
          content: portraitUrl
            ? `[Image trigger: ${ch.name} | ${ch.archetype}] Portrait ready. ${ch.imageKeywords}. Image: ![${ch.name}](${portraitUrl})`
            : `[Image trigger: ${ch.name} | ${ch.archetype}] Portrait unavailable — use description: ${ch.imageKeywords}`,
          hiddenFrom: [],
          expectsReply: false
        };
        oc.thread.messages.push(trigMsg);
        portraitTriggerMsgs.push(trigMsg);
      }

      updateReminder();
      updateShortcutButtons();

      // Clean up staging messages — keep only: scene background (drives bg image), intro narrative,
      // and portrait trigger messages (permanent AI context for displaying character portraits).
      // Character-priming and "World ready!" messages are staging artefacts and are removed.
      const keepMessages = [bgSceneMsg, introMsg, ...portraitTriggerMsgs].filter(Boolean);
      oc.thread.messages.splice(0, oc.thread.messages.length, ...keepMessages);

      showStatus("Done!", "Your world is ready");
      console.log("[Pregen] Complete — popping loading screen");
    } catch (err) {
      console.error("[Pregen] Error during pregeneration:", err);
    } finally {
      // Dismiss loading screen. oc.window only has show() and hide() — pop() does not exist.
      oc.window.hide();
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
    if (g.endingType  === undefined) g.endingType = null;
    if (!g.priceModifiers)          g.priceModifiers = {};
    if (g.questNotification === undefined) g.questNotification = false;
    if (!g.enabledKinks)            g.enabledKinks  = [];
    if (!g.worldSettings)           g.worldSettings = ["medieval_fantasy"];
    if (!g.storyTones)              g.storyTones    = ["dark_romance"];
    if (!g.playerRole)              g.playerRole    = "switch";
    if (g.playerDesc  === undefined) g.playerDesc   = "";
    if (!g.ngPlusBonus)             g.ngPlusBonus   = null;
    if (!g.storyline)               g.storyline    = buildStoryline(getActiveChars(), g.playerName, g.worldSettings);
    // New fields from game-rails patch
    if (g.combatWins  === undefined)  g.combatWins  = 0;
    if (g.deathCount  === undefined)  g.deathCount  = 0;
    if (!g.firedEvents)               g.firedEvents = [];
    if (!g.rivalEvents)               g.rivalEvents = [];
    if (!g.dailyEventLog)             g.dailyEventLog = [];
    if (g.lastTrainedDay === undefined) g.lastTrainedDay = g.time?.day || 1;
    if (g.manaMalCharDebuff === undefined) g.manaMalCharDebuff = false;
    if (g.shadowEndUnlocked === undefined) g.shadowEndUnlocked = false;
    if (!g.voidSightingTargets)       g.voidSightingTargets = [];
    if (g.voidSightingDay === undefined) g.voidSightingDay = 0;
    if (!g.rivalClashTargets)         g.rivalClashTargets = [];
    if (g.rivalClashDay === undefined) g.rivalClashDay = 0;
    if (g.crownEdictActive === undefined) g.crownEdictActive = false;
    if (g.marketCrashActive === undefined) g.marketCrashActive = false;
    if (g.mq3Locked === undefined)    g.mq3Locked = false;
    if (g.voidShardClue === undefined) g.voidShardClue = false;
    // New fields from world-adaptive + difficulty + hint + day-tracker patch
    if (!g.difficulty)             g.difficulty    = "normal";
    if (g.hintCounter === undefined) g.hintCounter  = 0;
    if (!g.daySnapshot)            g.daySnapshot   = null; // will be set on first advanceTime
    // Per-character migration: add mood and lastTalkedDay
    if (g.characters) {
      Object.keys(g.characters).forEach(id => {
        const cst = g.characters[id];
        if (cst.mood === undefined)         cst.mood         = "neutral";
        if (cst.lastTalkedDay === undefined) cst.lastTalkedDay = 0;
      });
    }
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
      // All setup wizard steps advance via direct JS function calls (step1→step2→step3→step4→pregenerate).
      // No hidden chat-command routing is needed during setup; ignore all messages here.
      return;
    }

    const g    = cd.game;
    const text = message.content?.trim() || "";

    // ── /image | /image_pov | /image_charpov | /image_action ─────────────────
    // Each variant is a separate command (underscore, no space) so the AI
    // treats the full token as one command rather than splitting on the space
    // and treating "pov" / "charpov" / "action" as a description argument.
    if (text.startsWith("/image_pov") || text.startsWith("/image_charpov") ||
        text.startsWith("/image_action") || text === "/image" || text.startsWith("/image ")) {
      let mode;
      if (text.startsWith("/image_pov"))     mode = "pov";
      else if (text.startsWith("/image_charpov") || text.startsWith("/image_char")) mode = "charpov";
      else if (text.startsWith("/image_action")) mode = "action";
      else                                    mode = "normal";
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
        const r = await oc.textToImage({ prompt, negativePrompt: "text, watermark, ui, hud" });
        if (r?.dataUrl) oc.thread.messages.push({ author: "system", content: `![${mode} image](${r.dataUrl})`, expectsReply: false });
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
    checkFiredEvents(g);
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
