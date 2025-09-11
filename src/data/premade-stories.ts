export interface GameMechanic {
  id: string
  name: string
  type: 'puzzle' | 'physical' | 'digital' | 'social' | 'creative'
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number // in minutes
  players: number
  materials?: string[]
  location?: string
}

export interface StoryAct {
  id: string
  title: string
  description: string
  duration: number
  games: GameMechanic[]
  objectives: string[]
  rewards?: string[]
}

export interface PremadeStory {
  id: string
  title: string
  theme: string
  description: string
  duration: number
  scenes: number
  image: string
  difficulty: 'easy' | 'medium' | 'hard'
  players: { min: number; max: number }
  ageRange: { min: number; max: number }
  setup: {
    materials: string[]
    location: string
    preparation: string[]
  }
  acts: StoryAct[]
  learningObjectives?: string[]
  skills: string[]
  tags: string[]
}

export const premadeStories: PremadeStory[] = [
  // MYSTERY THEME STORIES
  {
    id: 'midnight_express',
    title: 'The Midnight Express Mystery',
    theme: 'mystery',
    description: 'A luxury train journey turns deadly when a passenger vanishes between stations. Uncover the truth before the next stop.',
    duration: 55,
    scenes: 10,
    image: '/images/sub-adventures/Mistery/The_Midnight_Expres_ Mystery.png',
    difficulty: 'medium',
    players: { min: 4, max: 8 },
    ageRange: { min: 12, max: 99 },
    setup: {
      materials: ['Train tickets', 'Passenger manifest', 'Luggage tags', 'Station maps', 'Time tables', 'Magnifying glasses', 'Notebooks'],
      location: 'Train car or large room with train-like setup',
      preparation: ['Set up train compartments', 'Hide clues in luggage', 'Prepare passenger profiles', 'Create station announcements']
    },
    acts: [
      {
        id: 'act1',
        title: 'The Departure',
        description: 'Passengers board the luxury train and meet their fellow travelers',
        duration: 10,
        games: [
          {
            id: 'passenger_intro',
            name: 'Passenger Introductions',
            type: 'social',
            description: 'Players introduce themselves as assigned passengers and establish alibis',
            difficulty: 'easy',
            duration: 10,
            players: 8
          }
        ],
        objectives: ['Meet all passengers', 'Establish initial relationships', 'Notice suspicious behavior']
      },
      {
        id: 'act2',
        title: 'The Disappearance',
        description: 'A passenger vanishes between stations - no one saw them leave',
        duration: 15,
        games: [
          {
            id: 'evidence_collection',
            name: 'Evidence Collection',
            type: 'puzzle',
            description: 'Search compartments and collect physical evidence',
            difficulty: 'medium',
            duration: 15,
            players: 8,
            materials: ['Magnifying glasses', 'Evidence bags', 'Cameras']
          }
        ],
        objectives: ['Search all compartments', 'Collect evidence', 'Interview witnesses']
      },
      {
        id: 'act3',
        title: 'The Investigation',
        description: 'Piece together clues and interrogate suspects',
        duration: 20,
        games: [
          {
            id: 'interrogation_game',
            name: 'Interrogation Challenge',
            type: 'social',
            description: 'Players take turns interrogating suspects with prepared questions',
            difficulty: 'hard',
            duration: 20,
            players: 8
          },
          {
            id: 'timeline_puzzle',
            name: 'Timeline Reconstruction',
            type: 'puzzle',
            description: 'Create a timeline of events using collected evidence',
            difficulty: 'medium',
            duration: 15,
            players: 8,
            materials: ['Timeline cards', 'String', 'Pins']
          }
        ],
        objectives: ['Build timeline of events', 'Identify inconsistencies', 'Narrow down suspects']
      },
      {
        id: 'act4',
        title: 'The Revelation',
        description: 'The truth is revealed and the culprit is exposed',
        duration: 10,
        games: [
          {
            id: 'final_deduction',
            name: 'Final Deduction',
            type: 'puzzle',
            description: 'Present final theory and evidence to solve the case',
            difficulty: 'hard',
            duration: 10,
            players: 8
          }
        ],
        objectives: ['Present final theory', 'Expose the culprit', 'Explain the motive']
      }
    ],
    skills: ['Critical thinking', 'Observation', 'Communication', 'Deduction', 'Teamwork'],
    tags: ['mystery', 'detective', 'train', 'disappearance', 'interrogation']
  },

  {
    id: 'library_whispers',
    title: 'Whispers in the Library',
    theme: 'mystery',
    description: 'Ancient books hold secrets that someone is willing to kill for. Decode the hidden messages before the killer strikes again.',
    duration: 45,
    scenes: 8,
    image: '/images/sub-adventures/Mistery/Whispers_in_the_Library.png',
    difficulty: 'hard',
    players: { min: 3, max: 6 },
    ageRange: { min: 14, max: 99 },
    setup: {
      materials: ['Ancient books', 'Cipher wheels', 'UV lights', 'Magnifying glasses', 'Library cards', 'Reading glasses', 'Notebooks'],
      location: 'Library or room with bookshelves',
      preparation: ['Hide coded messages in books', 'Set up reading areas', 'Prepare cipher tools', 'Create library atmosphere']
    },
    acts: [
      {
        id: 'act1',
        title: 'The Discovery',
        description: 'A librarian finds a mysterious book with coded messages',
        duration: 8,
        games: [
          {
            id: 'book_search',
            name: 'Book Search Challenge',
            type: 'puzzle',
            description: 'Find specific books using the Dewey Decimal system',
            difficulty: 'medium',
            duration: 8,
            players: 6,
            materials: ['Library catalog', 'Book markers']
          }
        ],
        objectives: ['Locate the mysterious book', 'Identify the coding system', 'Find the first clue']
      },
      {
        id: 'act2',
        title: 'The Cipher',
        description: 'Decode ancient ciphers hidden in the books',
        duration: 15,
        games: [
          {
            id: 'cipher_decoding',
            name: 'Cipher Decoding',
            type: 'puzzle',
            description: 'Use various cipher techniques to decode hidden messages',
            difficulty: 'hard',
            duration: 15,
            players: 6,
            materials: ['Cipher wheels', 'Code sheets', 'Pencils']
          }
        ],
        objectives: ['Decode the first message', 'Identify the cipher type', 'Find the next location']
      },
      {
        id: 'act3',
        title: 'The Chase',
        description: 'Race against time as the killer closes in',
        duration: 12,
        games: [
          {
            id: 'speed_reading',
            name: 'Speed Reading Challenge',
            type: 'puzzle',
            description: 'Quickly scan books for specific information',
            difficulty: 'medium',
            duration: 12,
            players: 6
          },
          {
            id: 'silent_communication',
            name: 'Silent Communication',
            type: 'social',
            description: 'Communicate findings without speaking to avoid detection',
            difficulty: 'hard',
            duration: 10,
            players: 6
          }
        ],
        objectives: ['Decode remaining messages', 'Avoid detection', 'Find the final clue']
      },
      {
        id: 'act4',
        title: 'The Confrontation',
        description: 'Face the killer and solve the final mystery',
        duration: 10,
        games: [
          {
            id: 'final_showdown',
            name: 'Final Showdown',
            type: 'puzzle',
            description: 'Use all collected information to solve the ultimate mystery',
            difficulty: 'hard',
            duration: 10,
            players: 6
          }
        ],
        objectives: ['Solve the final mystery', 'Identify the killer', 'Prevent further crimes']
      }
    ],
    skills: ['Cryptography', 'Research', 'Pattern recognition', 'Silent communication', 'Critical thinking'],
    tags: ['library', 'cipher', 'ancient', 'books', 'code-breaking']
  },

  {
    id: 'hotel_phantom',
    title: 'The Grand Hotel Phantom',
    theme: 'mystery',
    description: 'A century-old hotel hosts a mysterious guest who leaves no trace but steals priceless artifacts. Track the phantom thief.',
    duration: 50,
    scenes: 9,
    image: '/images/sub-adventures/Mistery/The_Grand_Hotel_Phantom.png',
    difficulty: 'medium',
    players: { min: 4, max: 8 },
    ageRange: { min: 10, max: 99 },
    setup: {
      materials: ['Hotel keys', 'Guest register', 'Security footage', 'Artifact replicas', 'Flashlights', 'Maps', 'Notebooks'],
      location: 'Hotel or multi-room setup',
      preparation: ['Set up hotel rooms', 'Hide artifacts', 'Create guest profiles', 'Prepare security system']
    },
    acts: [
      {
        id: 'act1',
        title: 'The Arrival',
        description: 'Guests arrive at the historic Grand Hotel',
        duration: 8,
        games: [
          {
            id: 'check_in',
            name: 'Hotel Check-in',
            type: 'social',
            description: 'Players check in as hotel guests and receive room keys',
            difficulty: 'easy',
            duration: 8,
            players: 8
          }
        ],
        objectives: ['Complete check-in process', 'Meet hotel staff', 'Explore the hotel']
      },
      {
        id: 'act2',
        title: 'The First Theft',
        description: 'A valuable artifact disappears from the lobby',
        duration: 12,
        games: [
          {
            id: 'crime_scene',
            name: 'Crime Scene Investigation',
            type: 'puzzle',
            description: 'Examine the crime scene for clues and evidence',
            difficulty: 'medium',
            duration: 12,
            players: 8,
            materials: ['Evidence markers', 'Cameras', 'Measuring tape']
          }
        ],
        objectives: ['Document the crime scene', 'Collect evidence', 'Interview witnesses']
      },
      {
        id: 'act3',
        title: 'The Hunt',
        description: 'Search the hotel for the phantom thief',
        duration: 20,
        games: [
          {
            id: 'room_search',
            name: 'Room Search',
            type: 'puzzle',
            description: 'Systematically search hotel rooms for clues',
            difficulty: 'medium',
            duration: 20,
            players: 8,
            materials: ['Room keys', 'Search checklists']
          },
          {
            id: 'security_review',
            name: 'Security Footage Review',
            type: 'puzzle',
            description: 'Analyze security footage for suspicious activity',
            difficulty: 'hard',
            duration: 15,
            players: 8,
            materials: ['Video player', 'Pause/play controls']
          }
        ],
        objectives: ['Search all accessible areas', 'Review security footage', 'Identify suspect patterns']
      },
      {
        id: 'act4',
        title: 'The Capture',
        description: 'Confront the phantom thief and recover the artifacts',
        duration: 10,
        games: [
          {
            id: 'final_confrontation',
            name: 'Final Confrontation',
            type: 'social',
            description: 'Present evidence and confront the suspect',
            difficulty: 'hard',
            duration: 10,
            players: 8
          }
        ],
        objectives: ['Present evidence', 'Confront the thief', 'Recover stolen artifacts']
      }
    ],
    skills: ['Investigation', 'Observation', 'Evidence analysis', 'Hotel operations', 'Security systems'],
    tags: ['hotel', 'phantom', 'theft', 'artifacts', 'investigation']
  },

  {
    id: 'cryptic_cafe',
    title: 'The Cryptic Café',
    theme: 'mystery',
    description: 'A local café becomes the center of a conspiracy when customers start receiving coded messages in their coffee orders.',
    duration: 40,
    scenes: 7,
    image: '/images/sub-adventures/Mistery/The_Cryptic_Coffee.png',
    difficulty: 'easy',
    players: { min: 3, max: 6 },
    ageRange: { min: 8, max: 99 },
    setup: {
      materials: ['Coffee cups', 'Napkins', 'Menu cards', 'Receipts', 'Pens', 'Notebooks', 'Café props'],
      location: 'Café or room with café setup',
      preparation: ['Set up café tables', 'Prepare coded messages', 'Create menu items', 'Set café atmosphere']
    },
    acts: [
      {
        id: 'act1',
        title: 'The Regulars',
        description: 'Players become regular customers at the mysterious café',
        duration: 6,
        games: [
          {
            id: 'cafe_ordering',
            name: 'Café Ordering',
            type: 'social',
            description: 'Players order drinks and receive coded messages',
            difficulty: 'easy',
            duration: 6,
            players: 6
          }
        ],
        objectives: ['Place orders', 'Receive coded messages', 'Notice patterns']
      },
      {
        id: 'act2',
        title: 'The Code',
        description: 'Decode the messages hidden in coffee orders',
        duration: 12,
        games: [
          {
            id: 'message_decoding',
            name: 'Message Decoding',
            type: 'puzzle',
            description: 'Decode messages using café-related ciphers',
            difficulty: 'medium',
            duration: 12,
            players: 6,
            materials: ['Cipher sheets', 'Pencils', 'Coffee cups']
          }
        ],
        objectives: ['Decode all messages', 'Identify the pattern', 'Find the next clue']
      },
      {
        id: 'act3',
        title: 'The Conspiracy',
        description: 'Uncover the conspiracy behind the coded messages',
        duration: 15,
        games: [
          {
            id: 'conspiracy_mapping',
            name: 'Conspiracy Mapping',
            type: 'puzzle',
            description: 'Map out the conspiracy using decoded information',
            difficulty: 'medium',
            duration: 15,
            players: 6,
            materials: ['Large paper', 'Markers', 'String', 'Pins']
          },
          {
            id: 'undercover_operation',
            name: 'Undercover Operation',
            type: 'social',
            description: 'Gather information while maintaining cover',
            difficulty: 'hard',
            duration: 12,
            players: 6
          }
        ],
        objectives: ['Map the conspiracy', 'Identify key players', 'Gather more evidence']
      },
      {
        id: 'act4',
        title: 'The Resolution',
        description: 'Expose the conspiracy and bring it to an end',
        duration: 7,
        games: [
          {
            id: 'exposure_mission',
            name: 'Exposure Mission',
            type: 'social',
            description: 'Present evidence and expose the conspiracy',
            difficulty: 'medium',
            duration: 7,
            players: 6
          }
        ],
        objectives: ['Present evidence', 'Expose the conspiracy', 'Ensure justice']
      }
    ],
    skills: ['Code-breaking', 'Social interaction', 'Pattern recognition', 'Conspiracy analysis', 'Undercover work'],
    tags: ['café', 'conspiracy', 'coded messages', 'coffee', 'undercover']
  },

  {
    id: 'digital_shadow',
    title: 'Digital Shadow',
    theme: 'mystery',
    description: 'Someone is manipulating reality through augmented reality apps. Find the mastermind behind the digital illusions.',
    duration: 60,
    scenes: 11,
    image: '/images/sub-adventures/Mistery/Digital_Shadow.png',
    difficulty: 'hard',
    players: { min: 4, max: 8 },
    ageRange: { min: 16, max: 99 },
    setup: {
      materials: ['Smartphones/tablets', 'AR apps', 'QR codes', 'Digital clues', 'Chargers', 'Notebooks', 'WiFi setup'],
      location: 'Tech-enabled space with good WiFi',
      preparation: ['Set up AR experiences', 'Create digital clues', 'Prepare tech devices', 'Test connectivity']
    },
    acts: [
      {
        id: 'act1',
        title: 'The Glitch',
        description: 'Players notice strange glitches in their digital devices',
        duration: 8,
        games: [
          {
            id: 'tech_diagnosis',
            name: 'Tech Diagnosis',
            type: 'digital',
            description: 'Investigate digital glitches and anomalies',
            difficulty: 'medium',
            duration: 8,
            players: 8,
            materials: ['Smartphones', 'Diagnostic apps']
          }
        ],
        objectives: ['Identify the glitches', 'Document anomalies', 'Find the source']
      },
      {
        id: 'act2',
        title: 'The AR Invasion',
        description: 'Augmented reality overlays start appearing everywhere',
        duration: 15,
        games: [
          {
            id: 'ar_hunt',
            name: 'AR Hunt',
            type: 'digital',
            description: 'Use AR apps to find hidden digital clues',
            difficulty: 'hard',
            duration: 15,
            players: 8,
            materials: ['AR-enabled devices', 'AR apps']
          }
        ],
        objectives: ['Find AR clues', 'Decode digital messages', 'Track the source']
      },
      {
        id: 'act3',
        title: 'The Network',
        description: 'Discover the network behind the digital manipulation',
        duration: 25,
        games: [
          {
            id: 'network_analysis',
            name: 'Network Analysis',
            type: 'digital',
            description: 'Analyze digital networks and connections',
            difficulty: 'hard',
            duration: 25,
            players: 8,
            materials: ['Network analysis tools', 'Digital maps']
          },
          {
            id: 'cyber_investigation',
            name: 'Cyber Investigation',
            type: 'puzzle',
            description: 'Investigate digital footprints and traces',
            difficulty: 'hard',
            duration: 20,
            players: 8,
            materials: ['Digital forensics tools', 'Computers']
          }
        ],
        objectives: ['Map the network', 'Identify key nodes', 'Find the mastermind']
      },
      {
        id: 'act4',
        title: 'The Confrontation',
        description: 'Face the digital mastermind and restore reality',
        duration: 12,
        games: [
          {
            id: 'digital_showdown',
            name: 'Digital Showdown',
            type: 'digital',
            description: 'Final confrontation in the digital realm',
            difficulty: 'hard',
            duration: 12,
            players: 8,
            materials: ['AR devices', 'Digital tools']
          }
        ],
        objectives: ['Confront the mastermind', 'Restore digital reality', 'Prevent future attacks']
      }
    ],
    skills: ['Digital literacy', 'AR technology', 'Network analysis', 'Cyber investigation', 'Tech troubleshooting'],
    tags: ['digital', 'AR', 'cyber', 'technology', 'reality manipulation']
  }
]

// Continue with Fantasy, Hacker, Corporate, and Educational themes...
// This is just the first 5 stories (Mystery theme) as an example
// The full implementation would include all 25 stories with similar detail
