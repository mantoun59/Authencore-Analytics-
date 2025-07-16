export interface DigitalWellnessQuestion {
  id: number;
  dimension: 'screenBalance' | 'digitalBoundaries' | 'mindfulUsage' | 'techLifeIntegration' | 'distortion';
  text: string;
  reversed: boolean;
  weight: number;
  distortionType?: 'overClaiming' | 'underReporting';
}

export interface DigitalScenario {
  id: number;
  dimension: string;
  scenario: string;
  options: Array<{
    text: string;
    scores: { [key: string]: number };
  }>;
}

export interface TimeTask {
  id: number;
  type: 'duration' | 'frequency' | 'notification';
  activity: string;
  typicalRange: { min: number; max: number };
  dimension: string;
}

export interface BehavioralSimulation {
  id: number;
  type: 'appUsage' | 'detox' | 'notifications';
  instruction: string;
  scoring: { [key: string]: { [key: string]: number } };
}

export const digitalWellnessQuestions: DigitalWellnessQuestion[] = [
  {
    id: 1,
    dimension: 'screenBalance',
    text: 'I feel anxious when I cannot check my phone for an extended period',
    reversed: true,
    weight: 1
  },
  {
    id: 2,
    dimension: 'digitalBoundaries',
    text: 'I successfully disconnect from work devices after hours',
    reversed: false,
    weight: 1
  },
  {
    id: 3,
    dimension: 'mindfulUsage',
    text: 'I often find myself scrolling without a specific purpose',
    reversed: true,
    weight: 1
  },
  {
    id: 4,
    dimension: 'techLifeIntegration',
    text: 'Technology enhances my relationships rather than replacing them',
    reversed: false,
    weight: 1
  },
  {
    id: 5,
    dimension: 'distortion',
    text: 'I never use my phone while eating meals',
    reversed: false,
    weight: 1,
    distortionType: 'overClaiming'
  },
  {
    id: 6,
    dimension: 'screenBalance',
    text: 'I experience eye strain or headaches from screen use',
    reversed: true,
    weight: 1
  },
  {
    id: 7,
    dimension: 'digitalBoundaries',
    text: 'I check work emails or messages during personal time',
    reversed: true,
    weight: 1
  },
  {
    id: 8,
    dimension: 'mindfulUsage',
    text: 'I am aware of how much time I spend on different apps',
    reversed: false,
    weight: 1
  },
  {
    id: 9,
    dimension: 'techLifeIntegration',
    text: 'My technology use aligns with my personal values and goals',
    reversed: false,
    weight: 1
  },
  {
    id: 10,
    dimension: 'screenBalance',
    text: 'I have trouble sleeping due to late-night screen use',
    reversed: true,
    weight: 1
  },
  {
    id: 11,
    dimension: 'digitalBoundaries',
    text: 'I set specific times when I am completely offline',
    reversed: false,
    weight: 1
  },
  {
    id: 12,
    dimension: 'mindfulUsage',
    text: 'I use technology with clear intentions and purposes',
    reversed: false,
    weight: 1
  },
  {
    id: 13,
    dimension: 'techLifeIntegration',
    text: 'Digital devices help me maintain meaningful connections',
    reversed: false,
    weight: 1
  },
  {
    id: 14,
    dimension: 'distortion',
    text: 'I always put my phone away during important conversations',
    reversed: false,
    weight: 1,
    distortionType: 'overClaiming'
  },
  {
    id: 15,
    dimension: 'screenBalance',
    text: 'I prioritize screen-free activities for relaxation',
    reversed: false,
    weight: 1
  }
];

export const digitalScenarios: DigitalScenario[] = [
  {
    id: 1,
    dimension: 'screenBalance',
    scenario: 'You wake up in the middle of the night. Your phone is on the nightstand.',
    options: [
      {
        text: 'Check the time and immediately go back to sleep',
        scores: { screenBalance: 5, mindfulUsage: 4 }
      },
      {
        text: 'Check the time, then quickly scan notifications',
        scores: { screenBalance: 3, mindfulUsage: 2 }
      },
      {
        text: 'Check social media since you are already awake',
        scores: { screenBalance: 1, mindfulUsage: 1 }
      },
      {
        text: 'Do not check phone - use a separate alarm clock',
        scores: { screenBalance: 5, digitalBoundaries: 5 }
      }
    ]
  },
  {
    id: 2,
    dimension: 'digitalBoundaries',
    scenario: 'Your manager sends a work message at 9 PM on Friday.',
    options: [
      {
        text: 'Respond immediately to show dedication',
        scores: { digitalBoundaries: 1, techLifeIntegration: 2 }
      },
      {
        text: 'Read it but wait until Monday to respond',
        scores: { digitalBoundaries: 3, techLifeIntegration: 3 }
      },
      {
        text: 'Do not check work messages after hours',
        scores: { digitalBoundaries: 5, techLifeIntegration: 4 }
      },
      {
        text: 'Set an auto-response about your availability',
        scores: { digitalBoundaries: 5, techLifeIntegration: 5 }
      }
    ]
  },
  {
    id: 3,
    dimension: 'mindfulUsage',
    scenario: 'You open your phone to check the time and see a notification.',
    options: [
      {
        text: 'Check the time and immediately close the phone',
        scores: { mindfulUsage: 5, screenBalance: 4 }
      },
      {
        text: 'Check the time, then quickly view the notification',
        scores: { mindfulUsage: 3, screenBalance: 3 }
      },
      {
        text: 'Get distracted and spend 10 minutes browsing',
        scores: { mindfulUsage: 1, screenBalance: 1 }
      },
      {
        text: 'Turn off notifications during focus time',
        scores: { mindfulUsage: 5, digitalBoundaries: 4 }
      }
    ]
  },
  {
    id: 4,
    dimension: 'techLifeIntegration',
    scenario: 'You are at dinner with friends and everyone is on their phones.',
    options: [
      {
        text: 'Join them and check your phone too',
        scores: { techLifeIntegration: 1, screenBalance: 1 }
      },
      {
        text: 'Suggest everyone puts phones away',
        scores: { techLifeIntegration: 5, screenBalance: 4 }
      },
      {
        text: 'Continue eating and ignore the phones',
        scores: { techLifeIntegration: 3, screenBalance: 3 }
      },
      {
        text: 'Start a conversation to engage everyone',
        scores: { techLifeIntegration: 5, mindfulUsage: 4 }
      }
    ]
  },
  {
    id: 5,
    dimension: 'screenBalance',
    scenario: 'You have been working on your computer for 3 hours straight.',
    options: [
      {
        text: 'Continue working to finish the task',
        scores: { screenBalance: 1, mindfulUsage: 2 }
      },
      {
        text: 'Take a 5-minute break to check social media',
        scores: { screenBalance: 2, mindfulUsage: 1 }
      },
      {
        text: 'Take a 15-minute walk outside',
        scores: { screenBalance: 5, techLifeIntegration: 4 }
      },
      {
        text: 'Do some stretching exercises at your desk',
        scores: { screenBalance: 4, techLifeIntegration: 3 }
      }
    ]
  },
  {
    id: 6,
    dimension: 'digitalBoundaries',
    scenario: 'Your phone buzzes with notifications during an important meeting.',
    options: [
      {
        text: 'Check the notification discreetly',
        scores: { digitalBoundaries: 2, mindfulUsage: 1 }
      },
      {
        text: 'Turn the phone to silent mode',
        scores: { digitalBoundaries: 4, mindfulUsage: 4 }
      },
      {
        text: 'Leave the phone in another room for meetings',
        scores: { digitalBoundaries: 5, mindfulUsage: 5 }
      },
      {
        text: 'Ignore the notification completely',
        scores: { digitalBoundaries: 3, mindfulUsage: 3 }
      }
    ]
  },
  {
    id: 7,
    dimension: 'mindfulUsage',
    scenario: 'You realize you have been scrolling social media for 45 minutes.',
    options: [
      {
        text: 'Continue scrolling for a few more minutes',
        scores: { mindfulUsage: 1, screenBalance: 1 }
      },
      {
        text: 'Immediately close the app and do something else',
        scores: { mindfulUsage: 5, screenBalance: 4 }
      },
      {
        text: 'Set a timer for 10 more minutes',
        scores: { mindfulUsage: 3, screenBalance: 2 }
      },
      {
        text: 'Reflect on what you were looking for',
        scores: { mindfulUsage: 4, techLifeIntegration: 3 }
      }
    ]
  },
  {
    id: 8,
    dimension: 'techLifeIntegration',
    scenario: 'You want to learn a new skill. How do you approach it?',
    options: [
      {
        text: 'Watch YouTube videos exclusively',
        scores: { techLifeIntegration: 2, screenBalance: 1 }
      },
      {
        text: 'Take an online course with practical exercises',
        scores: { techLifeIntegration: 4, mindfulUsage: 4 }
      },
      {
        text: 'Find a mentor or join a local group',
        scores: { techLifeIntegration: 5, screenBalance: 5 }
      },
      {
        text: 'Mix online resources with offline practice',
        scores: { techLifeIntegration: 5, mindfulUsage: 5 }
      }
    ]
  },
  {
    id: 9,
    dimension: 'screenBalance',
    scenario: 'It is bedtime but you feel the urge to check your phone.',
    options: [
      {
        text: 'Check it quickly and then go to sleep',
        scores: { screenBalance: 2, digitalBoundaries: 2 }
      },
      {
        text: 'Charge the phone in another room',
        scores: { screenBalance: 5, digitalBoundaries: 5 }
      },
      {
        text: 'Use it until you feel tired',
        scores: { screenBalance: 1, mindfulUsage: 1 }
      },
      {
        text: 'Read a book or do relaxation exercises instead',
        scores: { screenBalance: 5, techLifeIntegration: 4 }
      }
    ]
  },
  {
    id: 10,
    dimension: 'digitalBoundaries',
    scenario: 'You are on vacation and receive work-related messages.',
    options: [
      {
        text: 'Respond immediately to stay on top of things',
        scores: { digitalBoundaries: 1, techLifeIntegration: 1 }
      },
      {
        text: 'Check messages but only respond to urgent ones',
        scores: { digitalBoundaries: 2, techLifeIntegration: 2 }
      },
      {
        text: 'Set an out-of-office message and do not respond',
        scores: { digitalBoundaries: 5, techLifeIntegration: 5 }
      },
      {
        text: 'Designate specific times to check messages',
        scores: { digitalBoundaries: 4, mindfulUsage: 4 }
      }
    ]
  }
];

export const timeTasks: TimeTask[] = [
  {
    id: 1,
    type: 'duration',
    activity: 'Checking social media per day',
    typicalRange: { min: 60, max: 180 },
    dimension: 'mindfulUsage'
  },
  {
    id: 2,
    type: 'frequency',
    activity: 'How many times do you pick up your phone daily?',
    typicalRange: { min: 50, max: 150 },
    dimension: 'screenBalance'
  },
  {
    id: 3,
    type: 'duration',
    activity: 'Working on computer without breaks',
    typicalRange: { min: 30, max: 120 },
    dimension: 'screenBalance'
  },
  {
    id: 4,
    type: 'duration',
    activity: 'Watching streaming content per day',
    typicalRange: { min: 60, max: 240 },
    dimension: 'mindfulUsage'
  },
  {
    id: 5,
    type: 'frequency',
    activity: 'How many notifications do you receive per hour?',
    typicalRange: { min: 5, max: 30 },
    dimension: 'digitalBoundaries'
  },
  {
    id: 6,
    type: 'duration',
    activity: 'Time spent on your phone before bed',
    typicalRange: { min: 15, max: 90 },
    dimension: 'screenBalance'
  },
  {
    id: 7,
    type: 'duration',
    activity: 'Longest period without checking phone',
    typicalRange: { min: 60, max: 480 },
    dimension: 'digitalBoundaries'
  },
  {
    id: 8,
    type: 'frequency',
    activity: 'How many apps do you use daily?',
    typicalRange: { min: 10, max: 50 },
    dimension: 'mindfulUsage'
  },
  {
    id: 9,
    type: 'duration',
    activity: 'Time spent in video calls per day',
    typicalRange: { min: 30, max: 300 },
    dimension: 'techLifeIntegration'
  },
  {
    id: 10,
    type: 'duration',
    activity: 'Screen-free time for meals per day',
    typicalRange: { min: 30, max: 120 },
    dimension: 'techLifeIntegration'
  }
];

export const behavioralSimulations: BehavioralSimulation[] = [
  {
    id: 1,
    type: 'appUsage',
    instruction: 'Arrange these apps by your daily usage time',
    scoring: {
      workFirst: { techLifeIntegration: 5, screenBalance: 3 },
      socialFirst: { techLifeIntegration: 2, screenBalance: 2 },
      balancedMix: { techLifeIntegration: 4, screenBalance: 4 }
    }
  },
  {
    id: 2,
    type: 'detox',
    instruction: 'Select times when you could realistically disconnect from devices',
    scoring: {
      highCommitment: { digitalBoundaries: 5, mindfulUsage: 5 },
      moderateCommitment: { digitalBoundaries: 3, mindfulUsage: 3 },
      lowCommitment: { digitalBoundaries: 2, mindfulUsage: 2 }
    }
  },
  {
    id: 3,
    type: 'notifications',
    instruction: 'Configure which notifications you would allow during focus time',
    scoring: {
      minimal: { digitalBoundaries: 5, mindfulUsage: 5 },
      selective: { digitalBoundaries: 4, mindfulUsage: 4 },
      permissive: { digitalBoundaries: 2, mindfulUsage: 2 }
    }
  },
  {
    id: 4,
    type: 'appUsage',
    instruction: 'Prioritize apps for a digital wellness day',
    scoring: {
      wellnessFocused: { techLifeIntegration: 5, screenBalance: 5 },
      balanced: { techLifeIntegration: 4, screenBalance: 4 },
      entertainmentFocused: { techLifeIntegration: 2, screenBalance: 2 }
    }
  },
  {
    id: 5,
    type: 'detox',
    instruction: 'Plan your ideal digital sabbath',
    scoring: {
      comprehensive: { digitalBoundaries: 5, techLifeIntegration: 5 },
      partial: { digitalBoundaries: 3, techLifeIntegration: 3 },
      minimal: { digitalBoundaries: 2, techLifeIntegration: 2 }
    }
  }
];

export const appCategories = [
  { id: 'social', name: 'Social Media', icon: '📱' },
  { id: 'work', name: 'Work Apps', icon: '💼' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'communication', name: 'Messaging', icon: '💬' },
  { id: 'productivity', name: 'Productivity', icon: '📊' },
  { id: 'news', name: 'News', icon: '📰' },
  { id: 'wellness', name: 'Wellness', icon: '🧘' },
  { id: 'learning', name: 'Learning', icon: '📚' },
  { id: 'finance', name: 'Finance', icon: '💰' },
  { id: 'health', name: 'Health', icon: '🏥' }
];

export const notificationTypes = [
  { id: 'work-email', name: 'Work Emails', icon: '📧' },
  { id: 'personal-message', name: 'Personal Messages', icon: '💬' },
  { id: 'social-media', name: 'Social Media', icon: '📱' },
  { id: 'news', name: 'News Updates', icon: '📰' },
  { id: 'games', name: 'Game Notifications', icon: '🎮' },
  { id: 'shopping', name: 'Shopping Deals', icon: '🛍️' },
  { id: 'calendar', name: 'Calendar Reminders', icon: '📅' },
  { id: 'weather', name: 'Weather Alerts', icon: '🌤️' }
];