export interface CareerLaunchQuestion {
  id: string;
  category: 'interest' | 'aptitude' | 'personality' | 'value';
  dimension: string;
  question: string;
  optionA: string;
  optionB: string;
}

export const careerLaunchQuestions: CareerLaunchQuestion[] = [
  {
    "id": "int001",
    "category": "interest",
    "dimension": "realistic",
    "question": "Which activity do you prefer?",
    "optionA": "Fixing a bicycle chain",
    "optionB": "Writing a short story"
  },
  {
    "id": "int002",
    "category": "interest",
    "dimension": "investigative",
    "question": "Which activity is more appealing?",
    "optionA": "Solving a scientific puzzle",
    "optionB": "Helping someone with a personal issue"
  },
  {
    "id": "int003",
    "category": "interest",
    "dimension": "artistic",
    "question": "Choose the activity you would enjoy more:",
    "optionA": "Designing a poster",
    "optionB": "Organizing financial records"
  },
  {
    "id": "int004",
    "category": "interest",
    "dimension": "social",
    "question": "What would you rather do?",
    "optionA": "Lead a group discussion",
    "optionB": "Research in a quiet space"
  },
  {
    "id": "int005",
    "category": "interest",
    "dimension": "enterprising",
    "question": "Which role sounds more exciting?",
    "optionA": "Convince others to try something new",
    "optionB": "Record data into spreadsheets"
  },
  {
    "id": "int006",
    "category": "interest",
    "dimension": "conventional",
    "question": "Which task would you prefer?",
    "optionA": "Sort files in an office",
    "optionB": "Sketch a creative design"
  },
  {
    "id": "apt001",
    "category": "aptitude",
    "dimension": "verbal",
    "question": "Which word is most similar in meaning to 'Eloquent'?",
    "optionA": "Persuasive",
    "optionB": "Silent"
  },
  {
    "id": "apt002",
    "category": "aptitude",
    "dimension": "numerical",
    "question": "What is 15% of 80?",
    "optionA": "12",
    "optionB": "10"
  },
  {
    "id": "apt003",
    "category": "aptitude",
    "dimension": "abstract",
    "question": "What comes next in the sequence: 2, 4, 8, 16, ?",
    "optionA": "32",
    "optionB": "20"
  },
  {
    "id": "apt004",
    "category": "aptitude",
    "dimension": "memory",
    "question": "Which of these was mentioned last: Apple, Table, Moon, Tiger?",
    "optionA": "Tiger",
    "optionB": "Apple"
  },
  {
    "id": "per001",
    "category": "personality",
    "dimension": "introversion",
    "question": "How do you recharge after a busy day?",
    "optionA": "Spending time alone",
    "optionB": "Meeting with friends"
  },
  {
    "id": "per002",
    "category": "personality",
    "dimension": "openness",
    "question": "What appeals more to you?",
    "optionA": "Trying a new experience",
    "optionB": "Repeating a familiar routine"
  },
  {
    "id": "per003",
    "category": "personality",
    "dimension": "conscientiousness",
    "question": "What are you more likely to do?",
    "optionA": "Stick to a schedule",
    "optionB": "Go with the flow"
  },
  {
    "id": "per004",
    "category": "personality",
    "dimension": "adaptability",
    "question": "How do you react to last-minute changes?",
    "optionA": "Adjust easily",
    "optionB": "Feel stressed"
  },
  {
    "id": "val001",
    "category": "value",
    "dimension": "security",
    "question": "Which matters more to you?",
    "optionA": "A stable income",
    "optionB": "Exciting challenges"
  },
  {
    "id": "val002",
    "category": "value",
    "dimension": "achievement",
    "question": "Which motivates you more?",
    "optionA": "Recognition for success",
    "optionB": "Harmony in relationships"
  },
  {
    "id": "val003",
    "category": "value",
    "dimension": "creativity",
    "question": "Which is more important in a job?",
    "optionA": "Creative freedom",
    "optionB": "Routine tasks"
  },
  {
    "id": "val004",
    "category": "value",
    "dimension": "community",
    "question": "Which work setting appeals more?",
    "optionA": "Helping others",
    "optionB": "Working independently"
  }
];