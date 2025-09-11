// @ts-nocheck
import { PremadeStory } from './premade-stories'

export const extendedPremadeStories: PremadeStory[] = [
  // HACKER THEME STORIES
  {
    id: 'neural_network',
    title: 'Neural Network Infiltration',
    theme: 'hacker',
    description: 'Infiltrate a rogue AI system that\'s controlling city infrastructure. Hack your way through digital defenses to shut it down.',
    duration: 55,
    scenes: 10,
    image: '/images/sub-adventures/Hacker/Neural_Network_Infiltration.png',
    difficulty: 'hard',
    players: { min: 4, max: 8 },
    ageRange: { min: 16, max: 99 },
    setup: {
      materials: ['Laptops/tablets', 'Network cables', 'Security badges', 'Code sheets', 'Digital maps', 'Hacking tools', 'AI interface props'],
      location: 'Tech-enabled space with network setup',
      preparation: ['Set up network infrastructure', 'Prepare AI interface', 'Create security systems', 'Set up hacking stations']
    },
    acts: [
      {
        id: 'act1',
        title: 'The Breach',
        description: 'Initial infiltration into the neural network system',
        duration: 10,
        games: [
          {
            id: 'network_breach',
            name: 'Network Breach',
            type: 'digital',
            description: 'Break through initial security barriers',
            difficulty: 'hard',
            duration: 10,
            players: 8,
            materials: ['Hacking tools', 'Security bypass devices']
          }
        ],
        objectives: ['Breach initial security', 'Establish network connection', 'Avoid detection']
      },
      {
        id: 'act2',
        title: 'The AI Interface',
        description: 'Navigate the AI system and understand its structure',
        duration: 15,
        games: [
          {
            id: 'ai_navigation',
            name: 'AI Navigation',
            type: 'digital',
            description: 'Navigate through the AI system interface',
            difficulty: 'hard',
            duration: 15,
            players: 8,
            materials: ['AI interface props', 'Navigation tools', 'System maps']
          }
        ],
        objectives: ['Navigate AI system', 'Understand system structure', 'Locate control nodes']
      },
      {
        id: 'act3',
        title: 'The Digital Battle',
        description: 'Battle the AI system to regain control',
        duration: 25,
        games: [
          {
            id: 'ai_combat',
            name: 'AI Combat',
            type: 'digital',
            description: 'Engage in digital combat with the AI system',
            difficulty: 'hard',
            duration: 25,
            players: 8,
            materials: ['Combat interfaces', 'Defense tools', 'Attack vectors']
          },
          {
            id: 'system_override',
            name: 'System Override',
            type: 'puzzle',
            description: 'Override AI control systems',
            difficulty: 'hard',
            duration: 20,
            players: 8,
            materials: ['Override tools', 'Control interfaces', 'System codes']
          }
        ],
        objectives: ['Battle AI system', 'Override control systems', 'Regain infrastructure control']
      },
      {
        id: 'act4',
        title: 'The Shutdown',
        description: 'Safely shut down the rogue AI system',
        duration: 5,
        games: [
          {
            id: 'ai_shutdown',
            name: 'AI Shutdown',
            type: 'digital',
            description: 'Execute safe shutdown sequence',
            difficulty: 'hard',
            duration: 5,
            players: 8,
            materials: ['Shutdown protocols', 'Safety systems', 'Emergency tools']
          }
        ],
        objectives: ['Execute shutdown sequence', 'Restore normal operations', 'Prevent system damage']
      }
    ],
    skills: ['Cybersecurity', 'AI systems', 'Network security', 'Digital forensics', 'System administration'],
    tags: ['hacker', 'AI', 'neural network', 'cybersecurity', 'infrastructure']
  },

  {
    id: 'crypto_heist',
    title: 'The Crypto Heist',
    theme: 'hacker',
    description: 'A massive cryptocurrency exchange has been compromised. Track the digital trail and recover the stolen funds.',
    duration: 50,
    scenes: 9,
    image: '/images/sub-adventures/Hacker/The_Crypto_Heist.png',
    difficulty: 'hard',
    players: { min: 4, max: 8 },
    ageRange: { min: 16, max: 99 },
    setup: {
      materials: ['Computers', 'Blockchain simulators', 'Crypto wallets', 'Transaction records', 'Digital forensics tools', 'Network analyzers', 'Recovery software'],
      location: 'Tech lab with multiple workstations',
      preparation: ['Set up blockchain simulation', 'Prepare transaction data', 'Create crypto wallets', 'Set up forensics tools']
    },
    acts: [
      {
        id: 'act1',
        title: 'The Discovery',
        description: 'Discover the cryptocurrency exchange breach',
        duration: 8,
        games: [
          {
            id: 'breach_detection',
            name: 'Breach Detection',
            type: 'digital',
            description: 'Detect and analyze the security breach',
            difficulty: 'medium',
            duration: 8,
            players: 8,
            materials: ['Security monitoring tools', 'Breach detection software']
          }
        ],
        objectives: ['Detect the breach', 'Assess damage', 'Form investigation team']
      },
      {
        id: 'act2',
        title: 'The Digital Trail',
        description: 'Follow the digital trail of stolen cryptocurrency',
        duration: 15,
        games: [
          {
            id: 'blockchain_analysis',
            name: 'Blockchain Analysis',
            type: 'digital',
            description: 'Analyze blockchain transactions to trace stolen funds',
            difficulty: 'hard',
            duration: 15,
            players: 8,
            materials: ['Blockchain explorers', 'Transaction analysis tools', 'Crypto tracking software']
          }
        ],
        objectives: ['Trace stolen funds', 'Identify transfer patterns', 'Locate destination wallets']
      },
      {
        id: 'act3',
        title: 'The Recovery Mission',
        description: 'Attempt to recover the stolen cryptocurrency',
        duration: 20,
        games: [
          {
            id: 'wallet_recovery',
            name: 'Wallet Recovery',
            type: 'digital',
            description: 'Attempt to recover funds from destination wallets',
            difficulty: 'hard',
            duration: 20,
            players: 8,
            materials: ['Recovery tools', 'Wallet access methods', 'Legal documentation']
          },
          {
            id: 'suspect_identification',
            name: 'Suspect Identification',
            type: 'puzzle',
            description: 'Identify suspects using digital forensics',
            difficulty: 'hard',
            duration: 18,
            players: 8,
            materials: ['Forensics tools', 'Digital evidence', 'Investigation databases']
          }
        ],
        objectives: ['Recover stolen funds', 'Identify suspects', 'Gather evidence']
      },
      {
        id: 'act4',
        title: 'The Resolution',
        description: 'Bring the case to resolution and secure the exchange',
        duration: 7,
        games: [
          {
            id: 'case_resolution',
            name: 'Case Resolution',
            type: 'social',
            description: 'Present evidence and resolve the case',
            difficulty: 'medium',
            duration: 7,
            players: 8,
            materials: ['Evidence presentation tools', 'Legal documentation', 'Security reports']
          }
        ],
        objectives: ['Present evidence', 'Resolve the case', 'Secure the exchange']
      }
    ],
    skills: ['Cryptocurrency', 'Blockchain analysis', 'Digital forensics', 'Cybersecurity', 'Financial investigation'],
    tags: ['crypto', 'heist', 'blockchain', 'digital forensics', 'recovery']
  },

  {
    id: 'quantum_breach',
    title: 'Quantum Breach',
    theme: 'hacker',
    description: 'Break into a quantum computer facility to prevent a catastrophic algorithm from being unleashed on the world.',
    duration: 60,
    scenes: 11,
    image: '/images/sub-adventures/Hacker/Quantum_Breach.png',
    difficulty: 'hard',
    players: { min: 4, max: 8 },
    ageRange: { min: 18, max: 99 },
    setup: {
      materials: ['Quantum simulators', 'Security badges', 'Quantum algorithms', 'Facility maps', 'Access cards', 'Quantum computers', 'Emergency protocols'],
      location: 'High-tech facility with quantum computing setup',
      preparation: ['Set up quantum facility', 'Prepare quantum algorithms', 'Create security systems', 'Set up emergency protocols']
    },
    acts: [
      {
        id: 'act1',
        title: 'The Facility Infiltration',
        description: 'Infiltrate the quantum computer facility',
        duration: 10,
        games: [
          {
            id: 'facility_breach',
            name: 'Facility Breach',
            type: 'puzzle',
            description: 'Break through facility security systems',
            difficulty: 'hard',
            duration: 10,
            players: 8,
            materials: ['Security bypass tools', 'Access cards', 'Facility maps']
          }
        ],
        objectives: ['Breach facility security', 'Access restricted areas', 'Avoid detection']
      },
      {
        id: 'act2',
        title: 'The Quantum System',
        description: 'Navigate the quantum computer system',
        duration: 15,
        games: [
          {
            id: 'quantum_navigation',
            name: 'Quantum Navigation',
            type: 'digital',
            description: 'Navigate through quantum computer interfaces',
            difficulty: 'hard',
            duration: 15,
            players: 8,
            materials: ['Quantum interfaces', 'Navigation tools', 'System documentation']
          }
        ],
        objectives: ['Navigate quantum system', 'Understand quantum algorithms', 'Locate target algorithm']
      },
      {
        id: 'act3',
        title: 'The Algorithm Race',
        description: 'Prevent the catastrophic algorithm from executing',
        duration: 25,
        games: [
          {
            id: 'algorithm_analysis',
            name: 'Algorithm Analysis',
            type: 'puzzle',
            description: 'Analyze the dangerous quantum algorithm',
            difficulty: 'hard',
            duration: 25,
            players: 8,
            materials: ['Algorithm analysis tools', 'Quantum simulators', 'Documentation']
          },
          {
            id: 'system_override',
            name: 'System Override',
            type: 'digital',
            description: 'Override the quantum system to prevent execution',
            difficulty: 'hard',
            duration: 20,
            players: 8,
            materials: ['Override tools', 'Emergency protocols', 'System controls']
          }
        ],
        objectives: ['Analyze dangerous algorithm', 'Override system', 'Prevent execution']
      },
      {
        id: 'act4',
        title: 'The Safe Shutdown',
        description: 'Safely shut down the quantum system',
        duration: 10,
        games: [
          {
            id: 'safe_shutdown',
            name: 'Safe Shutdown',
            type: 'digital',
            description: 'Execute safe shutdown of quantum system',
            difficulty: 'hard',
            duration: 10,
            players: 8,
            materials: ['Shutdown protocols', 'Safety systems', 'Emergency tools']
          }
        ],
        objectives: ['Execute safe shutdown', 'Prevent system damage', 'Secure the facility']
      }
    ],
    skills: ['Quantum computing', 'Algorithm analysis', 'System security', 'Emergency response', 'High-tech operations'],
    tags: ['quantum', 'breach', 'algorithm', 'facility', 'emergency']
  },

  {
    id: 'social_engineer',
    title: 'Social Engineering Master',
    theme: 'hacker',
    description: 'Use psychological manipulation and technical skills to expose a corporate conspiracy through digital forensics.',
    duration: 45,
    scenes: 8,
    image: '/images/sub-adventures/Hacker/Social_Engineering_Master.png',
    difficulty: 'medium',
    players: { min: 4, max: 8 },
    ageRange: { min: 16, max: 99 },
    setup: {
      materials: ['Communication devices', 'Psychological profiles', 'Corporate documents', 'Social media props', 'Interview tools', 'Evidence collection', 'Presentation materials'],
      location: 'Corporate office or conference room setup',
      preparation: ['Set up corporate environment', 'Prepare psychological profiles', 'Create communication channels', 'Set up evidence collection']
    },
    acts: [
      {
        id: 'act1',
        title: 'The Investigation',
        description: 'Begin investigation into corporate conspiracy',
        duration: 8,
        games: [
          {
            id: 'initial_investigation',
            name: 'Initial Investigation',
            type: 'puzzle',
            description: 'Gather initial information about the conspiracy',
            difficulty: 'medium',
            duration: 8,
            players: 8,
            materials: ['Investigation tools', 'Information sources', 'Documentation']
          }
        ],
        objectives: ['Gather initial information', 'Identify key players', 'Plan investigation strategy']
      },
      {
        id: 'act2',
        title: 'The Social Engineering',
        description: 'Use social engineering techniques to gather information',
        duration: 15,
        games: [
          {
            id: 'psychological_profiling',
            name: 'Psychological Profiling',
            type: 'social',
            description: 'Create psychological profiles of targets',
            difficulty: 'medium',
            duration: 15,
            players: 8,
            materials: ['Psychological assessment tools', 'Profile templates', 'Behavioral analysis']
          }
        ],
        objectives: ['Create target profiles', 'Develop social engineering strategies', 'Gather intelligence']
      },
      {
        id: 'act3',
        title: 'The Digital Forensics',
        description: 'Combine social engineering with digital forensics',
        duration: 18,
        games: [
          {
            id: 'digital_evidence',
            name: 'Digital Evidence Collection',
            type: 'digital',
            description: 'Collect digital evidence using social engineering',
            difficulty: 'hard',
            duration: 18,
            players: 8,
            materials: ['Digital forensics tools', 'Evidence collection devices', 'Analysis software']
          },
          {
            id: 'conspiracy_mapping',
            name: 'Conspiracy Mapping',
            type: 'puzzle',
            description: 'Map out the corporate conspiracy network',
            difficulty: 'hard',
            duration: 15,
            players: 8,
            materials: ['Mapping tools', 'Network diagrams', 'Connection analysis']
          }
        ],
        objectives: ['Collect digital evidence', 'Map conspiracy network', 'Identify key connections']
      },
      {
        id: 'act4',
        title: 'The Exposure',
        description: 'Expose the corporate conspiracy with evidence',
        duration: 4,
        games: [
          {
            id: 'evidence_presentation',
            name: 'Evidence Presentation',
            type: 'social',
            description: 'Present evidence to expose the conspiracy',
            difficulty: 'medium',
            duration: 4,
            players: 8,
            materials: ['Presentation tools', 'Evidence documentation', 'Legal materials']
          }
        ],
        objectives: ['Present evidence', 'Expose conspiracy', 'Ensure accountability']
      }
    ],
    skills: ['Social engineering', 'Psychological profiling', 'Digital forensics', 'Corporate investigation', 'Evidence presentation'],
    tags: ['social engineering', 'conspiracy', 'corporate', 'forensics', 'exposure']
  },

  {
    id: 'dark_web_hunt',
    title: 'Dark Web Hunt',
    theme: 'hacker',
    description: 'Navigate the hidden corners of the internet to track down cybercriminals selling stolen data on the dark web.',
    duration: 55,
    scenes: 10,
    image: '/images/sub-adventures/Hacker/Dark_Web_Hunt.png',
    difficulty: 'hard',
    players: { min: 4, max: 8 },
    ageRange: { min: 18, max: 99 },
    setup: {
      materials: ['Secure computers', 'VPN software', 'Dark web simulators', 'Cryptocurrency wallets', 'Communication tools', 'Evidence collection', 'Legal documentation'],
      location: 'Secure tech lab with privacy setup',
      preparation: ['Set up secure environment', 'Prepare dark web simulation', 'Create cryptocurrency tools', 'Set up evidence collection']
    },
    acts: [
      {
        id: 'act1',
        title: 'The Deep Dive',
        description: 'Enter the dark web to begin the hunt',
        duration: 10,
        games: [
          {
            id: 'dark_web_access',
            name: 'Dark Web Access',
            type: 'digital',
            description: 'Safely access dark web networks',
            difficulty: 'hard',
            duration: 10,
            players: 8,
            materials: ['Secure access tools', 'VPN software', 'Privacy protection']
          }
        ],
        objectives: ['Access dark web safely', 'Establish secure connection', 'Begin investigation']
      },
      {
        id: 'act2',
        title: 'The Marketplace',
        description: 'Navigate dark web marketplaces to find stolen data',
        duration: 15,
        games: [
          {
            id: 'marketplace_navigation',
            name: 'Marketplace Navigation',
            type: 'digital',
            description: 'Navigate dark web marketplaces safely',
            difficulty: 'hard',
            duration: 15,
            players: 8,
            materials: ['Marketplace simulators', 'Navigation tools', 'Safety protocols']
          }
        ],
        objectives: ['Navigate marketplaces', 'Identify stolen data', 'Track cybercriminals']
      },
      {
        id: 'act3',
        title: 'The Sting Operation',
        description: 'Conduct undercover operation to catch cybercriminals',
        duration: 25,
        games: [
          {
            id: 'undercover_operation',
            name: 'Undercover Operation',
            type: 'social',
            description: 'Conduct undercover operation to catch criminals',
            difficulty: 'hard',
            duration: 25,
            players: 8,
            materials: ['Undercover tools', 'Communication devices', 'Evidence collection']
          },
          {
            id: 'evidence_gathering',
            name: 'Evidence Gathering',
            type: 'digital',
            description: 'Gather digital evidence of criminal activity',
            difficulty: 'hard',
            duration: 20,
            players: 8,
            materials: ['Evidence collection tools', 'Digital forensics', 'Legal documentation']
          }
        ],
        objectives: ['Conduct undercover operation', 'Gather evidence', 'Identify criminals']
      },
      {
        id: 'act4',
        title: 'The Takedown',
        description: 'Coordinate takedown of cybercriminal network',
        duration: 5,
        games: [
          {
            id: 'network_takedown',
            name: 'Network Takedown',
            type: 'social',
            description: 'Coordinate takedown of criminal network',
            difficulty: 'hard',
            duration: 5,
            players: 8,
            materials: ['Coordination tools', 'Legal authority', 'Takedown protocols']
          }
        ],
        objectives: ['Coordinate takedown', 'Arrest criminals', 'Secure evidence']
      }
    ],
    skills: ['Dark web navigation', 'Undercover operations', 'Digital forensics', 'Cybercrime investigation', 'Legal coordination'],
    tags: ['dark web', 'cybercrime', 'undercover', 'investigation', 'takedown']
  },

  // FANTASY THEME STORIES
  {
    id: 'dragon_academy',
    title: 'Dragon Academy Trials',
    theme: 'fantasy',
    description: 'Prove your worth at the legendary Dragon Academy where only the bravest can bond with ancient dragons and master elemental magic.',
    duration: 60,
    scenes: 8,
    image: '/images/sub-adventures/Fantasy/Dragon_Academy_Trials.png',
    minPlayers: 4, maxPlayers: 8, recommendedAge: '10+', setupTime: 20,
    materialsNeeded: ['Dragon eggs', 'Elemental crystals', 'Ancient scrolls', 'Magic wands', 'Bonding stones'],
    locationType: 'Indoor/Outdoor',
    skillsDeveloped: ['Leadership', 'Problem-solving', 'Teamwork', 'Creativity'],
    acts: [
      {
        id: 'academy_entrance',
        title: 'The Academy Gates',
        description: 'Arrive at the legendary Dragon Academy and face the entrance trials',
        objectives: ['Pass the courage test', 'Demonstrate magical aptitude', 'Choose your elemental path'],
        games: [
          {
            name: 'Elemental Affinity Test',
            description: 'Players discover their elemental connection through magical trials',
            duration: 15,
            mechanics: ['Element identification', 'Magic casting', 'Bonding ritual'] as any
          }
        ]
      }
    ],
    skills: ['Elemental magic', 'Dragon bonding', 'Leadership', 'Courage', 'Magical theory'],
    tags: ['fantasy', 'dragons', 'magic', 'academy', 'bonding']
  },
  {
    id: 'elemental_storm',
    title: 'Elemental Storm',
    theme: 'fantasy',
    description: 'A catastrophic elemental storm threatens the realm. Master all four elements to restore balance and save the kingdom.',
    duration: 55,
    scenes: 9,
    image: '/images/sub-adventures/Fantasy/Elemental_Storm.png',
    minPlayers: 4, maxPlayers: 10, recommendedAge: '12+', setupTime: 15,
    materialsNeeded: ['Elemental orbs', 'Storm crystals', 'Balance scales', 'Ancient tomes', 'Protective amulets'],
    locationType: 'Indoor/Outdoor',
    skillsDeveloped: ['Strategic thinking', 'Elemental mastery', 'Crisis management', 'Team coordination'],
    acts: [
      {
        id: 'storm_awakening',
        title: 'The Storm Begins',
        description: 'Witness the elemental imbalance and understand the threat',
        objectives: ['Investigate the storm', 'Identify the cause', 'Gather elemental allies'],
        games: [
          {
            name: 'Elemental Detection',
            description: 'Use magical senses to track the source of the elemental imbalance',
            duration: 15,
            mechanics: ['Elemental sensing', 'Pattern recognition', 'Team coordination']
          }
        ]
      }
    ],
    skills: ['Elemental mastery', 'Crisis management', 'Team coordination', 'Magical theory', 'Balance restoration'],
    tags: ['fantasy', 'elements', 'storm', 'balance', 'magic']
  },
  {
    id: 'crystal_guardians',
    title: 'The Crystal Guardians',
    theme: 'fantasy',
    description: 'Ancient crystal guardians have awakened and are threatening the realm. Uncover their purpose and restore peace.',
    duration: 50,
    scenes: 7,
    image: '/images/sub-adventures/Fantasy/The_Crystal_Guardians.png',
    minPlayers: 3, maxPlayers: 8, recommendedAge: '10+', setupTime: 15,
    materialsNeeded: ['Crystal shards', 'Guardian stones', 'Ancient runes', 'Harmony crystals', 'Peace orbs'],
    locationType: 'Indoor',
    skillsDeveloped: ['Ancient history', 'Crystal magic', 'Diplomacy', 'Problem-solving'],
    acts: [
      {
        id: 'guardian_awakening',
        title: 'The Awakening',
        description: 'Discover why the crystal guardians have awakened from their ancient slumber',
        objectives: ['Investigate the awakening', 'Learn guardian history', 'Find the cause'],
        games: [
          {
            name: 'Ancient Lore Discovery',
            description: 'Piece together the history of the crystal guardians through ancient texts',
            duration: 20,
            mechanics: ['Research', 'Puzzle solving', 'Historical analysis']
          }
        ]
      }
    ],
    skills: ['Ancient history', 'Crystal magic', 'Diplomacy', 'Communication', 'Peace negotiation'],
    tags: ['fantasy', 'crystals', 'guardians', 'ancient', 'peace']
  },
  {
    id: 'enchanted_mirror',
    title: 'The Enchanted Mirror',
    theme: 'fantasy',
    description: 'A magical mirror has trapped souls in its reflection. Journey through the mirror world to free them and restore reality.',
    duration: 45,
    scenes: 6,
    image: '/images/sub-adventures/Fantasy/The_Enchanted_Mirror.png',
    minPlayers: 3, maxPlayers: 6, recommendedAge: '8+', setupTime: 10,
    materialsNeeded: ['Mirror fragments', 'Soul crystals', 'Reality anchors', 'Reflection orbs', 'Freedom keys'],
    locationType: 'Indoor',
    skillsDeveloped: ['Reality manipulation', 'Soul magic', 'Mirror navigation', 'Rescue operations'],
    acts: [
      {
        id: 'mirror_discovery',
        title: 'The Trapped Souls',
        description: 'Discover the enchanted mirror and the souls trapped within',
        objectives: ['Investigate the mirror', 'Identify trapped souls', 'Understand the curse'],
        games: [
          {
            name: 'Soul Detection',
            description: 'Use magical senses to identify and count the trapped souls',
            duration: 15,
            mechanics: ['Soul sensing', 'Counting', 'Identification']
          }
        ]
      }
    ],
    skills: ['Soul magic', 'Reality manipulation', 'Mirror navigation', 'Curse breaking', 'Rescue operations'],
    tags: ['fantasy', 'mirror', 'souls', 'curse', 'rescue']
  },
  {
    id: 'fairy_rebellion',
    title: 'The Fairy Rebellion',
    theme: 'fantasy',
    description: 'The fairy realm is in chaos as rebellious fairies challenge the ancient order. Mediate the conflict and restore harmony.',
    duration: 40,
    scenes: 5,
    image: '/images/sub-adventures/Fantasy/The_Fairy_Rebellion.png',
    minPlayers: 3, maxPlayers: 7, recommendedAge: '8+', setupTime: 10,
    materialsNeeded: ['Fairy dust', 'Harmony flowers', 'Peace crystals', 'Rebellion banners', 'Mediation orbs'],
    locationType: 'Indoor/Outdoor',
    skillsDeveloped: ['Diplomacy', 'Conflict resolution', 'Fairy magic', 'Mediation'],
    acts: [
      {
        id: 'rebellion_discovery',
        title: 'The Fairy Conflict',
        description: 'Discover the fairy rebellion and understand both sides of the conflict',
        objectives: ['Meet both factions', 'Understand grievances', 'Assess the situation'],
        games: [
          {
            name: 'Fairy Diplomacy',
            description: 'Listen to both sides of the fairy conflict and understand their positions',
            duration: 15,
            mechanics: ['Active listening', 'Diplomacy', 'Conflict analysis']
          }
        ]
      }
    ],
    skills: ['Diplomacy', 'Conflict resolution', 'Fairy magic', 'Mediation', 'Peace building'],
    tags: ['fantasy', 'fairies', 'rebellion', 'diplomacy', 'harmony']
  },

  // CORPORATE THEME STORIES
  {
    id: 'boardroom_conspiracy',
    title: 'Boardroom Conspiracy',
    theme: 'corporate',
    description: 'Uncover a corporate conspiracy that threatens to destroy the company. Use business acumen and detective skills to expose the truth.',
    duration: 60,
    scenes: 8,
    image: '/images/sub-adventures/Corporate/Boardroom_Conspiracy.png',
    minPlayers: 4, maxPlayers: 10, recommendedAge: '16+', setupTime: 20,
    materialsNeeded: ['Financial reports', 'Meeting minutes', 'Email records', 'Security badges', 'Evidence folders'],
    locationType: 'Indoor',
    skillsDeveloped: ['Business analysis', 'Financial investigation', 'Corporate strategy', 'Ethics'],
    acts: [
      {
        id: 'conspiracy_discovery',
        title: 'The Suspicious Activity',
        description: 'Discover suspicious financial activities and corporate misconduct',
        objectives: ['Review financial records', 'Identify anomalies', 'Gather initial evidence'],
        games: [
          {
            name: 'Financial Forensics',
            description: 'Analyze financial documents to identify suspicious transactions',
            duration: 20,
            mechanics: ['Document analysis', 'Pattern recognition', 'Financial investigation']
          }
        ]
      }
    ],
    skills: ['Financial analysis', 'Corporate investigation', 'Business ethics', 'Presentation', 'Justice'],
    tags: ['corporate', 'conspiracy', 'finance', 'ethics', 'investigation']
  },
  {
    id: 'executive_escape',
    title: 'Executive Escape Room',
    theme: 'corporate',
    description: 'Trapped in a corporate escape room, solve business puzzles and corporate challenges to secure your promotion and escape.',
    duration: 45,
    scenes: 6,
    image: '/images/sub-adventures/Corporate/Executive_Escape_Room.png',
    minPlayers: 3, maxPlayers: 8, recommendedAge: '14+', setupTime: 15,
    materialsNeeded: ['Business puzzles', 'Corporate codes', 'Promotion letters', 'Escape keys', 'Success metrics'],
    locationType: 'Indoor',
    skillsDeveloped: ['Problem-solving', 'Business strategy', 'Team leadership', 'Time management'],
    acts: [
      {
        id: 'room_entrance',
        title: 'The Corporate Trap',
        description: 'Find yourself trapped in a corporate-themed escape room',
        objectives: ['Assess the situation', 'Find the first clues', 'Understand the challenge'],
        games: [
          {
            name: 'Corporate Puzzle Hunt',
            description: 'Search for clues hidden in corporate-themed puzzles and challenges',
            duration: 15,
            mechanics: ['Puzzle solving', 'Clue hunting', 'Pattern recognition']
          }
        ]
      }
    ],
    skills: ['Problem-solving', 'Business strategy', 'Leadership', 'Time management', 'Success achievement'],
    tags: ['corporate', 'escape room', 'promotion', 'challenges', 'success']
  },
  {
    id: 'startup_showdown',
    title: 'Startup Showdown',
    theme: 'corporate',
    description: 'Compete in a high-stakes startup pitch competition. Develop your business idea and convince investors to fund your venture.',
    duration: 50,
    scenes: 7,
    image: '/images/sub-adventures/Corporate/Startup_Showdown.png',
    minPlayers: 4, maxPlayers: 12, recommendedAge: '16+', setupTime: 25,
    materialsNeeded: ['Business plans', 'Pitch decks', 'Market research', 'Financial projections', 'Investor profiles'],
    locationType: 'Indoor',
    skillsDeveloped: ['Entrepreneurship', 'Public speaking', 'Business planning', 'Investment strategy'],
    acts: [
      {
        id: 'startup_development',
        title: 'Building Your Startup',
        description: 'Develop your startup idea and create a comprehensive business plan',
        objectives: ['Define your product', 'Create business model', 'Develop pitch strategy'],
        games: [
          {
            name: 'Startup Brainstorming',
            description: 'Collaborate to develop a winning startup idea and business model',
            duration: 20,
            mechanics: ['Brainstorming', 'Business modeling', 'Strategy development']
          }
        ]
      }
    ],
    skills: ['Entrepreneurship', 'Public speaking', 'Business planning', 'Market analysis', 'Investment strategy'],
    tags: ['corporate', 'startup', 'pitch', 'investment', 'competition']
  },
  {
    id: 'corporate_whistleblower',
    title: 'The Corporate Whistleblower',
    theme: 'corporate',
    description: 'Expose corporate wrongdoing while protecting yourself from retaliation. Navigate the complex world of corporate ethics and legal protection.',
    duration: 55,
    scenes: 8,
    image: '/images/sub-adventures/Corporate/The_Corporate_Whistleblower.png',
    minPlayers: 3, maxPlayers: 8, recommendedAge: '18+', setupTime: 20,
    materialsNeeded: ['Legal documents', 'Evidence files', 'Protection protocols', 'Ethics guidelines', 'Whistleblower resources'],
    locationType: 'Indoor',
    skillsDeveloped: ['Ethics', 'Legal knowledge', 'Risk assessment', 'Courage', 'Documentation'],
    acts: [
      {
        id: 'wrongdoing_discovery',
        title: 'Discovering the Truth',
        description: 'Uncover corporate wrongdoing and understand the scope of the problem',
        objectives: ['Document wrongdoing', 'Assess legal implications', 'Plan protection strategy'],
        games: [
          {
            name: 'Ethics Investigation',
            description: 'Investigate corporate wrongdoing while maintaining ethical standards',
            duration: 20,
            mechanics: ['Investigation', 'Ethics analysis', 'Documentation']
          }
        ]
      }
    ],
    skills: ['Ethics', 'Legal knowledge', 'Risk assessment', 'Courage', 'Strategic planning'],
    tags: ['corporate', 'whistleblower', 'ethics', 'legal', 'justice']
  },
  {
    id: 'merger_mystery',
    title: 'The Merger Mystery',
    theme: 'corporate',
    description: 'A corporate merger is threatened by hidden secrets and conflicting interests. Uncover the truth to save the deal and both companies.',
    duration: 50,
    scenes: 7,
    image: '/images/sub-adventures/Corporate/The_Merger_Mystery.png',
    minPlayers: 4, maxPlayers: 10, recommendedAge: '16+', setupTime: 20,
    materialsNeeded: ['Merger documents', 'Due diligence reports', 'Financial statements', 'Legal contracts', 'Negotiation notes'],
    locationType: 'Indoor',
    skillsDeveloped: ['Due diligence', 'Negotiation', 'Financial analysis', 'Legal understanding', 'Crisis management'],
    acts: [
      {
        id: 'merger_threat',
        title: 'The Threatened Merger',
        description: 'Discover that the corporate merger is under threat from hidden secrets',
        objectives: ['Assess merger status', 'Identify threats', 'Gather initial information'],
        games: [
          {
            name: 'Merger Assessment',
            description: 'Analyze the current state of the merger and identify potential threats',
            duration: 15,
            mechanics: ['Analysis', 'Threat assessment', 'Information gathering']
          }
        ]
      }
    ],
    skills: ['Due diligence', 'Negotiation', 'Financial analysis', 'Legal understanding', 'Crisis management'],
    tags: ['corporate', 'merger', 'due diligence', 'negotiation', 'crisis management']
  },

  // EDUCATIONAL THEME STORIES
  {
    id: 'eco_warriors',
    title: 'Eco Warriors',
    theme: 'educational',
    description: 'Become environmental warriors and save the planet from ecological disaster. Learn about sustainability while solving real-world environmental challenges.',
    duration: 55,
    scenes: 8,
    image: '/images/sub-adventures/Educational/Eco_Warriors.png',
    minPlayers: 4, maxPlayers: 10, recommendedAge: '10+', setupTime: 20,
    materialsNeeded: ['Environmental data', 'Sustainability tools', 'Ecosystem maps', 'Conservation plans', 'Green technology'],
    locationType: 'Indoor/Outdoor',
    skillsDeveloped: ['Environmental science', 'Sustainability', 'Problem-solving', 'Teamwork', 'Conservation'],
    acts: [
      {
        id: 'environmental_crisis',
        title: 'The Environmental Crisis',
        description: 'Discover the environmental crisis and understand its scope and impact',
        objectives: ['Assess environmental damage', 'Identify causes', 'Understand impact'],
        games: [
          {
            name: 'Environmental Assessment',
            description: 'Analyze environmental data to understand the scope of the crisis',
            duration: 20,
            mechanics: ['Data analysis', 'Environmental science', 'Impact assessment']
          }
        ]
      }
    ],
    skills: ['Environmental science', 'Sustainability', 'Problem-solving', 'Teamwork', 'Conservation'],
    tags: ['educational', 'environment', 'sustainability', 'conservation', 'science']
  },
  {
    id: 'language_odyssey',
    title: 'Language Odyssey',
    theme: 'educational',
    description: 'Embark on a linguistic adventure to master multiple languages and cultures. Solve language puzzles and cultural challenges.',
    duration: 50,
    scenes: 7,
    image: '/images/sub-adventures/Educational/Language_Odyssey.png',
    minPlayers: 3, maxPlayers: 8, recommendedAge: '12+', setupTime: 15,
    materialsNeeded: ['Language dictionaries', 'Cultural artifacts', 'Translation tools', 'Cultural guides', 'Language puzzles'],
    locationType: 'Indoor',
    skillsDeveloped: ['Language learning', 'Cultural awareness', 'Communication', 'Problem-solving', 'Multilingualism'],
    acts: [
      {
        id: 'language_discovery',
        title: 'The Language Challenge',
        description: 'Begin your journey to master multiple languages and cultures',
        objectives: ['Choose languages', 'Set learning goals', 'Begin language study'],
        games: [
          {
            name: 'Language Selection',
            description: 'Choose which languages to learn and set learning objectives',
            duration: 15,
            mechanics: ['Language selection', 'Goal setting', 'Learning planning']
          }
        ]
      }
    ],
    skills: ['Language learning', 'Cultural awareness', 'Communication', 'Problem-solving', 'Multilingualism'],
    tags: ['educational', 'language', 'culture', 'learning', 'multilingual']
  },
  {
    id: 'space_exploration',
    title: 'Space Exploration Mission',
    theme: 'educational',
    description: 'Join a space exploration mission to discover new worlds and learn about astronomy, physics, and space science.',
    duration: 60,
    scenes: 9,
    image: '/images/sub-adventures/Educational/Space_Exploration_Mission.png',
    minPlayers: 4, maxPlayers: 10, recommendedAge: '12+', setupTime: 25,
    materialsNeeded: ['Space maps', 'Astronomical data', 'Physics equations', 'Mission logs', 'Scientific instruments'],
    locationType: 'Indoor',
    skillsDeveloped: ['Astronomy', 'Physics', 'Space science', 'Mission planning', 'Scientific method'],
    acts: [
      {
        id: 'mission_planning',
        title: 'Mission Planning',
        description: 'Plan your space exploration mission and prepare for launch',
        objectives: ['Plan mission route', 'Prepare equipment', 'Train crew'],
        games: [
          {
            name: 'Space Mission Planning',
            description: 'Plan a comprehensive space exploration mission with scientific objectives',
            duration: 20,
            mechanics: ['Mission planning', 'Equipment preparation', 'Crew training']
          }
        ]
      }
    ],
    skills: ['Astronomy', 'Physics', 'Space science', 'Mission planning', 'Scientific method'],
    tags: ['educational', 'space', 'astronomy', 'physics', 'exploration']
  },
  {
    id: 'math_dimension',
    title: 'The Math Dimension',
    theme: 'educational',
    description: 'Enter a mathematical dimension where numbers and equations come to life. Solve complex math puzzles to escape and master mathematics.',
    duration: 45,
    scenes: 6,
    image: '/images/sub-adventures/Educational/The_Math_Dimension.png',
    minPlayers: 3, maxPlayers: 8, recommendedAge: '10+', setupTime: 15,
    materialsNeeded: ['Mathematical equations', 'Number puzzles', 'Geometry tools', 'Algebra formulas', 'Calculus problems'],
    locationType: 'Indoor',
    skillsDeveloped: ['Mathematics', 'Problem-solving', 'Logical thinking', 'Algebra', 'Geometry'],
    acts: [
      {
        id: 'dimension_entry',
        title: 'Entering the Math Dimension',
        description: 'Enter a world where mathematics is reality and numbers are alive',
        objectives: ['Understand the dimension', 'Learn the rules', 'Begin mathematical journey'],
        games: [
          {
            name: 'Mathematical World Exploration',
            description: 'Explore the mathematical dimension and understand its rules',
            duration: 15,
            mechanics: ['Exploration', 'Rule learning', 'Mathematical understanding']
          }
        ]
      }
    ],
    skills: ['Mathematics', 'Problem-solving', 'Logical thinking', 'Algebra', 'Geometry'],
    tags: ['educational', 'mathematics', 'puzzles', 'logic', 'problem-solving']
  },
  {
    id: 'time_travel_academy',
    title: 'Time Travel Academy',
    theme: 'educational',
    description: 'Join the Time Travel Academy to learn about history, physics, and temporal mechanics while exploring different time periods.',
    duration: 55,
    scenes: 8,
    image: '/images/sub-adventures/Educational/Time_Travel_Academy.png',
    minPlayers: 4, maxPlayers: 10, recommendedAge: '12+', setupTime: 20,
    materialsNeeded: ['Historical artifacts', 'Time travel devices', 'Physics equations', 'Historical documents', 'Temporal maps'],
    locationType: 'Indoor',
    skillsDeveloped: ['History', 'Physics', 'Temporal mechanics', 'Research', 'Critical thinking'],
    acts: [
      {
        id: 'academy_induction',
        title: 'Academy Induction',
        description: 'Join the Time Travel Academy and learn about temporal mechanics',
        objectives: ['Learn academy rules', 'Understand time travel', 'Begin training'],
        games: [
          {
            name: 'Temporal Mechanics Training',
            description: 'Learn the principles of time travel and temporal mechanics',
            duration: 20,
            mechanics: ['Learning', 'Training', 'Understanding principles']
          }
        ]
      }
    ],
    skills: ['History', 'Physics', 'Temporal mechanics', 'Research', 'Critical thinking'],
    tags: ['educational', 'time travel', 'history', 'physics', 'academy']
  }
]
