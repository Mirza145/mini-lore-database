// Milestone 0 — the sample universe.
// All descriptions and lore notes are written in our own words. Sources point to
// reference pages and manga chapters rather than reproducing copyrighted text.

export const characters = [
  {
    name: 'Monkey D. Luffy',
    aliases: ['Straw Hat Luffy', 'Mugiwara'],
    description:
      'Captain of the Straw Hat Pirates. He ate the Gum-Gum Fruit, stretches like rubber, and chases the title of Pirate King with a grin that rarely fades.',
    firstAppearance: 'Manga Chapter 1 — "Romance Dawn"',
  },
  {
    name: 'Roronoa Zoro',
    aliases: ['Pirate Hunter'],
    description:
      'Three-sword-style swordsman and Luffy\'s first crewmate. He carries a promise to become the world\'s greatest swordsman.',
    firstAppearance: 'Manga Chapter 3 — "Enter Zoro"',
  },
  {
    name: 'Nami',
    aliases: ['Cat Burglar'],
    description:
      'Navigator and cartographer of the Straw Hats. Her dream is to draw a map of the entire world, and she is far better with money than the rest of the crew.',
    firstAppearance: 'Manga Chapter 8 — "Nami Enters"',
  },
  {
    name: 'Usopp',
    aliases: ['Sogeking', 'God Usopp'],
    description:
      'Inventive sniper from Syrup Village. His tall tales hide a genuinely brave marksman who would rather scare an enemy than fight one head-on.',
    firstAppearance: 'Manga Chapter 23 — "Usopp the Liar"',
  },
  {
    name: 'Sanji',
    aliases: ['Black Leg'],
    description:
      'Cook of the Straw Hats who fights with his legs and refuses to let anyone go hungry. He is searching for the legendary sea called the All Blue.',
    firstAppearance: 'Manga Chapter 43 — "Sanji the Cook"',
  },
  {
    name: 'Tony Tony Chopper',
    aliases: ['Cotton Candy Lover'],
    description:
      'A reindeer doctor who ate the Human-Human Fruit. He can change form at will and dreams of curing every disease in the world.',
    firstAppearance: 'Manga Chapter 134 — "Dr. Kureha"',
  },
  {
    name: 'Nico Robin',
    aliases: ['Devil Child', 'Miss All Sunday'],
    description:
      'Archaeologist and the only survivor of Ohara. She can read Poneglyphs and is searching for the True History that the World Government wants buried.',
    firstAppearance: 'Manga Chapter 114 — "Miss All Sunday"',
  },
  {
    name: 'Franky',
    aliases: ['Cutty Flam', 'Iron Man Franky'],
    description:
      'Cyborg shipwright from Water 7. He built the Thousand Sunny and treats the Straw Hats\' ship as his finest work.',
    firstAppearance: 'Manga Chapter 329 — "Franky the Cyborg"',
  },
  {
    name: 'Brook',
    aliases: ['Soul King'],
    description:
      'A living skeleton and musician who ate the Revive-Revive Fruit. He keeps a decades-old promise to return to the whale Laboon.',
    firstAppearance: 'Manga Chapter 442 — "Adventure in the Florian Triangle"',
  },
  {
    name: 'Jinbe',
    aliases: ['Knight of the Sea'],
    description:
      'Fish-man helmsman and former Warlord of the Sea. He values honour and carries the legacy of Fisher Tiger and the Sun Pirates.',
    firstAppearance: 'Manga Chapter 528 — "Jinbe the Knight of the Sea"',
  },
  {
    name: 'Shanks',
    aliases: ['Red-Haired Shanks'],
    description:
      'A Yonko of the sea who gave Luffy his straw hat. He believed in Luffy\'s dream long before anyone else did.',
    firstAppearance: 'Manga Chapter 1 — "Romance Dawn"',
  },
  {
    name: 'Portgas D. Ace',
    aliases: ['Fire Fist Ace'],
    description:
      'Luffy\'s sworn brother and a commander of the Whitebeard Pirates. He wielded the Flame-Flame Fruit and protected those he considered family.',
    firstAppearance: 'Manga Chapter 154 — "Ace the Fire Fist"',
  },
  {
    name: 'Marshall D. Teach',
    aliases: ['Blackbeard'],
    description:
      'A Yonko who holds the Dark-Dark and Tremor-Tremor Fruits. Patient, ambitious and willing to break pirate conventions to reach his goal.',
    firstAppearance: 'Manga Chapter 223 — "Blackbeard"',
  },
  {
    name: 'Silvers Rayleigh',
    aliases: ['Dark King'],
    description:
      'Former first mate of the Roger Pirates. He retired to Sabaody and later trained Luffy in Haki on Rusukaina.',
    firstAppearance: 'Manga Chapter 500 — "Rayleigh the Dark King"',
  },
  {
    name: 'Trafalgar Law',
    aliases: ['Surgeon of Death'],
    description:
      'Captain of the Heart Pirates and a member of the Worst Generation. He formed a pragmatic alliance with Luffy during the Punk Hazard arc.',
    firstAppearance: 'Manga Chapter 498 — "Law the Surgeon of Death"',
  },
];

export const relationships = [
  {
    from: 'Monkey D. Luffy',
    to: 'Roronoa Zoro',
    type: 'captain',
    description: 'Luffy is the captain Zoro chose to follow after Shells Town.',
    sourceReference: 'Manga Chapter 6',
  },
  {
    from: 'Monkey D. Luffy',
    to: 'Nami',
    type: 'captain',
    description: 'Luffy insists that Nami is his navigator, even when she steals the Going Merry.',
    sourceReference: 'Manga Chapter 8',
  },
  {
    from: 'Monkey D. Luffy',
    to: 'Usopp',
    type: 'captain',
    description: 'Luffy welcomed Usopp aboard after the fight at Syrup Village.',
    sourceReference: 'Manga Chapter 41',
  },
  {
    from: 'Monkey D. Luffy',
    to: 'Sanji',
    type: 'captain',
    description: 'Luffy recruited Sanji from the Baratie after the battle with Don Krieg.',
    sourceReference: 'Manga Chapter 68',
  },
  {
    from: 'Monkey D. Luffy',
    to: 'Tony Tony Chopper',
    type: 'captain',
    description: 'Luffy asked Chopper to join after Drum Island, promising him a place among friends.',
    sourceReference: 'Manga Chapter 152',
  },
  {
    from: 'Monkey D. Luffy',
    to: 'Nico Robin',
    type: 'captain',
    description: 'Luffy refused to let Robin leave the crew at Enies Lobby and declared her one of them.',
    sourceReference: 'Manga Chapter 398',
  },
  {
    from: 'Monkey D. Luffy',
    to: 'Franky',
    type: 'captain',
    description: 'Luffy convinced Franky to join as shipwright after the events of Water 7.',
    sourceReference: 'Manga Chapter 436',
  },
  {
    from: 'Monkey D. Luffy',
    to: 'Brook',
    type: 'captain',
    description: 'Luffy accepted Brook into the crew after Thriller Bark because of his music and his promise.',
    sourceReference: 'Manga Chapter 489',
  },
  {
    from: 'Monkey D. Luffy',
    to: 'Jinbe',
    type: 'captain',
    description: 'Jinbe officially joined the Straw Hats during the Wano Country arc.',
    sourceReference: 'Manga Chapter 976',
  },
  {
    from: 'Roronoa Zoro',
    to: 'Monkey D. Luffy',
    type: 'crewmate',
    description: 'Zoro was Luffy\'s first crewmate and often acts as his right hand.',
    sourceReference: 'Manga Chapter 6',
  },
  {
    from: 'Nami',
    to: 'Monkey D. Luffy',
    type: 'crewmate',
    description: 'Nami keeps the crew on course, in navigation and in spending alike.',
    sourceReference: 'Manga Chapter 8',
  },
  {
    from: 'Sanji',
    to: 'Monkey D. Luffy',
    type: 'crewmate',
    description: 'Sanji feeds the crew and fights beside Luffy while calling him a reckless idiot.',
    sourceReference: 'Manga Chapter 68',
  },
  {
    from: 'Nico Robin',
    to: 'Monkey D. Luffy',
    type: 'crewmate',
    description: 'Robin found in Luffy the first crew that refused to abandon her.',
    sourceReference: 'Manga Chapter 398',
  },
  {
    from: 'Portgas D. Ace',
    to: 'Monkey D. Luffy',
    type: 'family',
    description: 'Ace and Luffy grew up as sworn brothers under Garp\'s care.',
    sourceReference: 'Manga Chapter 585',
  },
  {
    from: 'Shanks',
    to: 'Monkey D. Luffy',
    type: 'mentor',
    description: 'Shanks inspired Luffy\'s dream and entrusted him with the straw hat.',
    sourceReference: 'Manga Chapter 1',
  },
  {
    from: 'Silvers Rayleigh',
    to: 'Monkey D. Luffy',
    type: 'mentor',
    description: 'Rayleigh spent two years teaching Luffy the basics of Haki.',
    sourceReference: 'Manga Chapter 597',
  },
  {
    from: 'Roronoa Zoro',
    to: 'Sanji',
    type: 'rival',
    description: 'Zoro and Sanji bicker constantly while trusting each other in a fight.',
    sourceReference: 'Manga Chapter 43',
  },
  {
    from: 'Marshall D. Teach',
    to: 'Monkey D. Luffy',
    type: 'rival',
    description: 'Blackbeard sees Luffy as a rival for the age of piracy itself.',
    sourceReference: 'Manga Chapter 234',
  },
  {
    from: 'Marshall D. Teach',
    to: 'Portgas D. Ace',
    type: 'enemy',
    description: 'Blackbeard defeated Ace and handed him to the Marines, setting Marineford in motion.',
    sourceReference: 'Manga Chapter 441',
  },
  {
    from: 'Trafalgar Law',
    to: 'Monkey D. Luffy',
    type: 'ally',
    description: 'Law proposed a pirate alliance at Punk Hazard and fought beside Luffy against Doflamingo.',
    sourceReference: 'Manga Chapter 668',
  },
];

export const loreEntries = [
  {
    title: 'The straw hat is a promise',
    content:
      'Shanks gave Luffy his straw hat after the boy declared he would become Pirate King. Luffy treats the hat as a promise to return it once his dream is fulfilled, which is why losing it matters more than losing treasure.',
    category: 'canon',
    characters: ['Monkey D. Luffy', 'Shanks'],
    sourceTitle: 'One Piece Wiki — Straw Hat',
    sourceUrl: 'https://onepiece.fandom.com/wiki/Straw_Hat',
    episodeOrChapter: 'Manga Chapter 1',
  },
  {
    title: 'Rayleigh teaches Luffy Haki',
    content:
      'During the two-year timeskip, Rayleigh trained Luffy on Rusukaina. The training covered the three types of Haki and gave Luffy a way to fight Logia users without relying on luck.',
    category: 'canon',
    characters: ['Monkey D. Luffy', 'Silvers Rayleigh'],
    sourceTitle: 'One Piece Wiki — Silvers Rayleigh',
    sourceUrl: 'https://onepiece.fandom.com/wiki/Silvers_Rayleigh',
    episodeOrChapter: 'Manga Chapter 597',
  },
  {
    title: 'Ace was Roger\'s son',
    content:
      'Ace was the biological son of Gol D. Roger and Portgas D. Rouge. He carried the name Portgas to honour his mother and spent much of his life measuring himself against a father he never met.',
    category: 'canon',
    characters: ['Portgas D. Ace', 'Monkey D. Luffy'],
    sourceTitle: 'One Piece Wiki — Portgas D. Ace',
    sourceUrl: 'https://onepiece.fandom.com/wiki/Portgas_D._Ace',
    episodeOrChapter: 'Manga Chapter 550',
  },
  {
    title: 'Why can Blackbeard use two Devil Fruits?',
    content:
      'Blackbeard is the only known person to wield two Devil Fruit powers at once: the Dark-Dark Fruit and the Tremor-Tremor Fruit. The story has not explained the full mechanism, making this one of the biggest open questions in the series.',
    category: 'question',
    characters: ['Marshall D. Teach'],
    sourceTitle: 'One Piece Wiki — Marshall D. Teach',
    sourceUrl: 'https://onepiece.fandom.com/wiki/Marshall_D._Teach',
    episodeOrChapter: 'Manga Chapter 577',
  },
  {
    title: 'The Will of D.',
    content:
      'Several characters carry the initial D. in their names, and the meaning of that initial is still unknown. A recurring theory is that the D. is inherited will connected to the Void Century, but no character has confirmed what it stands for.',
    category: 'theory',
    characters: ['Monkey D. Luffy', 'Portgas D. Ace', 'Marshall D. Teach'],
    sourceTitle: 'One Piece Wiki — D.',
    sourceUrl: 'https://onepiece.fandom.com/wiki/D.',
    episodeOrChapter: 'Manga Chapter 96',
  },
  {
    title: 'Zoro\'s vow to Kuina',
    content:
      'As a child, Zoro promised his rival Kuina that one of them would become the world\'s greatest swordsman. After Kuina\'s death he carries her sword and the promise as his reason to keep training.',
    category: 'canon',
    characters: ['Roronoa Zoro'],
    sourceTitle: 'One Piece Wiki — Roronoa Zoro',
    sourceUrl: 'https://onepiece.fandom.com/wiki/Roronoa_Zoro',
    episodeOrChapter: 'Manga Chapter 5',
  },
  {
    title: 'Is the One Piece a treasure or a story?',
    content:
      'Characters speak of the One Piece as Roger\'s treasure, yet the series keeps its exact nature hidden. Some readers argue it is a physical reward, while others expect it to be a truth about the world. The story presents both readings as plausible.',
    category: 'disputed',
    characters: ['Monkey D. Luffy'],
    sourceTitle: 'One Piece Wiki — One Piece (Treasure)',
    sourceUrl: 'https://onepiece.fandom.com/wiki/One_Piece_(Treasure)',
    episodeOrChapter: 'Manga Chapter 967',
  },
  {
    title: 'Jinbe and Fisher Tiger\'s legacy',
    content:
      'Jinbe served under Fisher Tiger in the Sun Pirates and later became a Warlord to protect Fish-Man Island. His sense of duty to Tiger\'s legacy shapes his decision to stand with Luffy at Marineford and eventually join his crew.',
    category: 'canon',
    characters: ['Jinbe', 'Portgas D. Ace'],
    sourceTitle: 'One Piece Wiki — Jinbe',
    sourceUrl: 'https://onepiece.fandom.com/wiki/Jinbe',
    episodeOrChapter: 'Manga Chapter 620',
  },
  {
    title: 'Who is Joy Boy?',
    content:
      'Joy Boy is a figure from the Void Century whose name appears in Poneglyphs and in connection with the legendary treasure. The story has revealed that Luffy\'s awakened fruit carries that name, but the person behind the legend is still unexplained.',
    category: 'question',
    characters: ['Monkey D. Luffy'],
    sourceTitle: 'One Piece Wiki — Joy Boy',
    sourceUrl: 'https://onepiece.fandom.com/wiki/Joy_Boy',
    episodeOrChapter: 'Manga Chapter 1044',
  },
];
