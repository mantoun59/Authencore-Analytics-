export interface CareerLaunchQuestion {
  id: string;
  category: 'RIASEC' | 'Aptitude' | 'Personality' | 'Values';
  dimension: string;
  question: string;
  optionA: string;
  optionB: string;
  scoringWeight: number;
  isReversed: boolean;
}

export const careerLaunchQuestions: CareerLaunchQuestion[] = [
  // RIASEC - Realistic (Q001-Q012)
  {
    "id": "Q001",
    "category": "RIASEC",
    "dimension": "Realistic",
    "question": "I enjoy working with tools and machines.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q002",
    "category": "RIASEC",
    "dimension": "Realistic",
    "question": "I like building or repairing things with my hands.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q003",
    "category": "RIASEC",
    "dimension": "Realistic",
    "question": "I feel comfortable working outdoors regardless of weather.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q004",
    "category": "RIASEC",
    "dimension": "Realistic",
    "question": "I prefer tasks that involve physical effort.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q005",
    "category": "RIASEC",
    "dimension": "Realistic",
    "question": "I'm interested in learning how mechanical systems work.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q006",
    "category": "RIASEC",
    "dimension": "Realistic",
    "question": "I enjoy using power tools or operating equipment.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q007",
    "category": "RIASEC",
    "dimension": "Realistic",
    "question": "I would like to work on a construction site.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q008",
    "category": "RIASEC",
    "dimension": "Realistic",
    "question": "I am drawn to jobs that involve using my hands or body.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q009",
    "category": "RIASEC",
    "dimension": "Realistic",
    "question": "I enjoy fixing things when they are broken.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q010",
    "category": "RIASEC",
    "dimension": "Realistic",
    "question": "I like planting, farming, or landscaping tasks.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q011",
    "category": "RIASEC",
    "dimension": "Realistic",
    "question": "I'm good at tasks requiring physical coordination and strength.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q012",
    "category": "RIASEC",
    "dimension": "Realistic",
    "question": "I would rather do practical tasks than sit at a desk all day.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // RIASEC - Investigative (Q013-Q024)
  {
    "id": "Q013",
    "category": "RIASEC",
    "dimension": "Investigative",
    "question": "I enjoy analyzing information to solve problems.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q014",
    "category": "RIASEC",
    "dimension": "Investigative",
    "question": "I am curious about how things work.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q015",
    "category": "RIASEC",
    "dimension": "Investigative",
    "question": "I like reading about scientific discoveries or new technologies.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q016",
    "category": "RIASEC",
    "dimension": "Investigative",
    "question": "I enjoy conducting research and experiments.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q017",
    "category": "RIASEC",
    "dimension": "Investigative",
    "question": "I prefer tasks that require logical reasoning.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q018",
    "category": "RIASEC",
    "dimension": "Investigative",
    "question": "I like exploring theories and models in depth.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q019",
    "category": "RIASEC",
    "dimension": "Investigative",
    "question": "I enjoy solving math or logic puzzles.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q020",
    "category": "RIASEC",
    "dimension": "Investigative",
    "question": "I am interested in science, engineering, or medicine.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q021",
    "category": "RIASEC",
    "dimension": "Investigative",
    "question": "I enjoy identifying patterns and drawing conclusions.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q022",
    "category": "RIASEC",
    "dimension": "Investigative",
    "question": "I prefer working with data over working with people.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q023",
    "category": "RIASEC",
    "dimension": "Investigative",
    "question": "I enjoy designing studies to test hypotheses.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q024",
    "category": "RIASEC",
    "dimension": "Investigative",
    "question": "I feel energized when learning complex subjects.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // RIASEC - Artistic (Q025-Q036)
  {
    "id": "Q025",
    "category": "RIASEC",
    "dimension": "Artistic",
    "question": "I enjoy expressing myself through art, writing, or music.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q026",
    "category": "RIASEC",
    "dimension": "Artistic",
    "question": "I like creating things that are unique and imaginative.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q027",
    "category": "RIASEC",
    "dimension": "Artistic",
    "question": "I prefer unstructured work environments.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q028",
    "category": "RIASEC",
    "dimension": "Artistic",
    "question": "I feel energized when I'm involved in a creative project.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q029",
    "category": "RIASEC",
    "dimension": "Artistic",
    "question": "I enjoy brainstorming new ideas or concepts.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q030",
    "category": "RIASEC",
    "dimension": "Artistic",
    "question": "I like experimenting with colors, sounds, or designs.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q031",
    "category": "RIASEC",
    "dimension": "Artistic",
    "question": "I'm drawn to music, theater, dance, or visual arts.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q032",
    "category": "RIASEC",
    "dimension": "Artistic",
    "question": "I value originality more than convention.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q033",
    "category": "RIASEC",
    "dimension": "Artistic",
    "question": "I enjoy storytelling, poetry, or screenwriting.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q034",
    "category": "RIASEC",
    "dimension": "Artistic",
    "question": "I appreciate beauty in everyday things.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q035",
    "category": "RIASEC",
    "dimension": "Artistic",
    "question": "I would enjoy designing clothes, posters, or digital graphics.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q036",
    "category": "RIASEC",
    "dimension": "Artistic",
    "question": "I like finding new and different ways to express emotions.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // RIASEC - Social (Q037-Q048)
  {
    "id": "Q037",
    "category": "RIASEC",
    "dimension": "Social",
    "question": "I enjoy helping people understand or learn something new.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q038",
    "category": "RIASEC",
    "dimension": "Social",
    "question": "I feel fulfilled when I support others emotionally.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q039",
    "category": "RIASEC",
    "dimension": "Social",
    "question": "I like mentoring or tutoring students or peers.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q040",
    "category": "RIASEC",
    "dimension": "Social",
    "question": "I enjoy listening to others and offering advice.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q041",
    "category": "RIASEC",
    "dimension": "Social",
    "question": "I prefer collaborative work over solo tasks.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q042",
    "category": "RIASEC",
    "dimension": "Social",
    "question": "I feel motivated by making a positive impact on others.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q043",
    "category": "RIASEC",
    "dimension": "Social",
    "question": "I enjoy volunteering or community service.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q044",
    "category": "RIASEC",
    "dimension": "Social",
    "question": "I'm interested in health, counseling, or education fields.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q045",
    "category": "RIASEC",
    "dimension": "Social",
    "question": "I like teaching, training, or coaching others.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q046",
    "category": "RIASEC",
    "dimension": "Social",
    "question": "I am patient when explaining things to others.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q047",
    "category": "RIASEC",
    "dimension": "Social",
    "question": "I prefer working in teams rather than independently.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q048",
    "category": "RIASEC",
    "dimension": "Social",
    "question": "I would enjoy a career that focuses on human development.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // RIASEC - Enterprising (Q049-Q060)
  {
    "id": "Q049",
    "category": "RIASEC",
    "dimension": "Enterprising",
    "question": "I enjoy leading projects or taking initiative.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q050",
    "category": "RIASEC",
    "dimension": "Enterprising",
    "question": "I like persuading others to support my ideas.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q051",
    "category": "RIASEC",
    "dimension": "Enterprising",
    "question": "I'm interested in starting or managing a business.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q052",
    "category": "RIASEC",
    "dimension": "Enterprising",
    "question": "I feel confident speaking in front of a group.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q053",
    "category": "RIASEC",
    "dimension": "Enterprising",
    "question": "I enjoy setting goals and motivating others to reach them.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q054",
    "category": "RIASEC",
    "dimension": "Enterprising",
    "question": "I prefer competitive environments that reward success.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q055",
    "category": "RIASEC",
    "dimension": "Enterprising",
    "question": "I like organizing people and resources to achieve results.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q056",
    "category": "RIASEC",
    "dimension": "Enterprising",
    "question": "I enjoy negotiating, selling, or promoting things.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q057",
    "category": "RIASEC",
    "dimension": "Enterprising",
    "question": "I'm energized by challenges and fast-paced work.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q058",
    "category": "RIASEC",
    "dimension": "Enterprising",
    "question": "I would enjoy managing a team or department.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q059",
    "category": "RIASEC",
    "dimension": "Enterprising",
    "question": "I like debating or defending a point of view.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q060",
    "category": "RIASEC",
    "dimension": "Enterprising",
    "question": "I'm interested in marketing, law, or politics.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // RIASEC - Conventional (Q061-Q072)
  {
    "id": "Q061",
    "category": "RIASEC",
    "dimension": "Conventional",
    "question": "I enjoy organizing data, records, or files.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q062",
    "category": "RIASEC",
    "dimension": "Conventional",
    "question": "I prefer structured tasks with clear procedures.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q063",
    "category": "RIASEC",
    "dimension": "Conventional",
    "question": "I like working with spreadsheets or financial documents.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q064",
    "category": "RIASEC",
    "dimension": "Conventional",
    "question": "I feel comfortable following rules and routines.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q065",
    "category": "RIASEC",
    "dimension": "Conventional",
    "question": "I enjoy checking for accuracy and correcting errors.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q066",
    "category": "RIASEC",
    "dimension": "Conventional",
    "question": "I value order, consistency, and reliability in my work.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q067",
    "category": "RIASEC",
    "dimension": "Conventional",
    "question": "I like planning schedules and tracking deadlines.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q068",
    "category": "RIASEC",
    "dimension": "Conventional",
    "question": "I enjoy sorting, categorizing, or classifying information.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q069",
    "category": "RIASEC",
    "dimension": "Conventional",
    "question": "I prefer working in environments with clear hierarchies.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q070",
    "category": "RIASEC",
    "dimension": "Conventional",
    "question": "I would enjoy managing office operations or logistics.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q071",
    "category": "RIASEC",
    "dimension": "Conventional",
    "question": "I like working with budgets, forms, or documentation.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q072",
    "category": "RIASEC",
    "dimension": "Conventional",
    "question": "I am interested in roles that require precision and attention to detail.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // Aptitude - Numerical (Q073-Q078)
  {
    "id": "Q073",
    "category": "Aptitude",
    "dimension": "Numerical",
    "question": "I can quickly perform mental calculations.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q074",
    "category": "Aptitude",
    "dimension": "Numerical",
    "question": "I understand and interpret numerical data easily.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q075",
    "category": "Aptitude",
    "dimension": "Numerical",
    "question": "I enjoy solving math-related problems.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q076",
    "category": "Aptitude",
    "dimension": "Numerical",
    "question": "I can analyze charts, tables, or graphs with ease.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q077",
    "category": "Aptitude",
    "dimension": "Numerical",
    "question": "I'm confident in estimating quantities or trends.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q078",
    "category": "Aptitude",
    "dimension": "Numerical",
    "question": "I understand percentages, ratios, and proportions well.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // Aptitude - Verbal (Q079-Q084)
  {
    "id": "Q079",
    "category": "Aptitude",
    "dimension": "Verbal",
    "question": "I can summarize written content accurately.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q080",
    "category": "Aptitude",
    "dimension": "Verbal",
    "question": "I understand complex written texts easily.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q081",
    "category": "Aptitude",
    "dimension": "Verbal",
    "question": "I can detect ambiguity or bias in writing.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q082",
    "category": "Aptitude",
    "dimension": "Verbal",
    "question": "I enjoy explaining abstract ideas clearly.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q083",
    "category": "Aptitude",
    "dimension": "Verbal",
    "question": "I grasp the main point of a passage quickly.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q084",
    "category": "Aptitude",
    "dimension": "Verbal",
    "question": "I'm confident when debating or justifying my views.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // Aptitude - Spatial (Q085-Q090)
  {
    "id": "Q085",
    "category": "Aptitude",
    "dimension": "Spatial",
    "question": "I can visualize objects from different angles.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q086",
    "category": "Aptitude",
    "dimension": "Spatial",
    "question": "I understand how parts fit together in space.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q087",
    "category": "Aptitude",
    "dimension": "Spatial",
    "question": "I enjoy solving puzzles involving shapes or patterns.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q088",
    "category": "Aptitude",
    "dimension": "Spatial",
    "question": "I can mentally rotate or transform 3D objects.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q089",
    "category": "Aptitude",
    "dimension": "Spatial",
    "question": "I understand diagrams or blueprints easily.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q090",
    "category": "Aptitude",
    "dimension": "Spatial",
    "question": "I can plan how to arrange or organize physical spaces.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // Aptitude - Problem Solving (Q091-Q096)
  {
    "id": "Q091",
    "category": "Aptitude",
    "dimension": "ProblemSolving",
    "question": "I enjoy solving unfamiliar problems.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q092",
    "category": "Aptitude",
    "dimension": "ProblemSolving",
    "question": "I approach challenges with logical strategies.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q093",
    "category": "Aptitude",
    "dimension": "ProblemSolving",
    "question": "I can identify multiple solutions to a single problem.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q094",
    "category": "Aptitude",
    "dimension": "ProblemSolving",
    "question": "I break big problems into smaller, manageable parts.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q095",
    "category": "Aptitude",
    "dimension": "ProblemSolving",
    "question": "I learn quickly from trial and error.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q096",
    "category": "Aptitude",
    "dimension": "ProblemSolving",
    "question": "I stay calm and focused when facing difficult tasks.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // Personality - Extraversion (Q097-Q102)
  {
    "id": "Q097",
    "category": "Personality",
    "dimension": "Extraversion",
    "question": "I enjoy being the center of attention in social settings.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q098",
    "category": "Personality",
    "dimension": "Extraversion",
    "question": "I feel energized by group interactions.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q099",
    "category": "Personality",
    "dimension": "Extraversion",
    "question": "I find it easy to start conversations with strangers.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q100",
    "category": "Personality",
    "dimension": "Extraversion",
    "question": "I prefer lively environments to quiet ones.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q101",
    "category": "Personality",
    "dimension": "Extraversion",
    "question": "I enjoy participating in group activities.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q102",
    "category": "Personality",
    "dimension": "Extraversion",
    "question": "I'm usually talkative and outgoing.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // Personality - Conscientiousness (Q103-Q108)
  {
    "id": "Q103",
    "category": "Personality",
    "dimension": "Conscientiousness",
    "question": "I plan my tasks carefully before starting.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q104",
    "category": "Personality",
    "dimension": "Conscientiousness",
    "question": "I follow through on commitments without reminders.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q105",
    "category": "Personality",
    "dimension": "Conscientiousness",
    "question": "I keep my workspace and schedule organized.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q106",
    "category": "Personality",
    "dimension": "Conscientiousness",
    "question": "I set goals and work steadily toward them.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q107",
    "category": "Personality",
    "dimension": "Conscientiousness",
    "question": "I avoid procrastination whenever possible.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q108",
    "category": "Personality",
    "dimension": "Conscientiousness",
    "question": "I'm detail-oriented and thorough in my work.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // Personality - Emotional Stability (Q109-Q114)
  {
    "id": "Q109",
    "category": "Personality",
    "dimension": "EmotionalStability",
    "question": "I stay calm even in stressful situations.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q110",
    "category": "Personality",
    "dimension": "EmotionalStability",
    "question": "I recover quickly from setbacks.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q111",
    "category": "Personality",
    "dimension": "EmotionalStability",
    "question": "I rarely feel overwhelmed by emotions.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q112",
    "category": "Personality",
    "dimension": "EmotionalStability",
    "question": "I handle criticism without getting upset.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q113",
    "category": "Personality",
    "dimension": "EmotionalStability",
    "question": "I don't worry excessively about the future.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q114",
    "category": "Personality",
    "dimension": "EmotionalStability",
    "question": "I remain level-headed during conflict.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // Personality - Openness (Q115-Q120)
  {
    "id": "Q115",
    "category": "Personality",
    "dimension": "Openness",
    "question": "I'm curious about new ideas, cultures, or concepts.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q116",
    "category": "Personality",
    "dimension": "Openness",
    "question": "I enjoy trying new foods, experiences, or activities.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q117",
    "category": "Personality",
    "dimension": "Openness",
    "question": "I like thinking about abstract or philosophical topics.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q118",
    "category": "Personality",
    "dimension": "Openness",
    "question": "I'm imaginative and enjoy exploring possibilities.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q119",
    "category": "Personality",
    "dimension": "Openness",
    "question": "I appreciate art, beauty, and creativity.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q120",
    "category": "Personality",
    "dimension": "Openness",
    "question": "I question traditional ways of doing things.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // Values - Autonomy (Q121-Q126)
  {
    "id": "Q121",
    "category": "Values",
    "dimension": "Autonomy",
    "question": "I prefer jobs where I can make decisions independently.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q122",
    "category": "Values",
    "dimension": "Autonomy",
    "question": "I value the freedom to organize my own work.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q123",
    "category": "Values",
    "dimension": "Autonomy",
    "question": "I dislike being micromanaged.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q124",
    "category": "Values",
    "dimension": "Autonomy",
    "question": "I enjoy taking responsibility for my outcomes.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q125",
    "category": "Values",
    "dimension": "Autonomy",
    "question": "I prefer flexible schedules over fixed ones.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q126",
    "category": "Values",
    "dimension": "Autonomy",
    "question": "I like being trusted to work without close supervision.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // Values - Security (Q127-Q132)
  {
    "id": "Q127",
    "category": "Values",
    "dimension": "Security",
    "question": "I want a career that provides long-term stability.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q128",
    "category": "Values",
    "dimension": "Security",
    "question": "I prefer a predictable income over variable earnings.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q129",
    "category": "Values",
    "dimension": "Security",
    "question": "I value benefits like healthcare and retirement plans.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q130",
    "category": "Values",
    "dimension": "Security",
    "question": "I feel more comfortable with steady roles than risky ones.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q131",
    "category": "Values",
    "dimension": "Security",
    "question": "I want to avoid frequent job changes.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q132",
    "category": "Values",
    "dimension": "Security",
    "question": "I prefer working in structured, established organizations.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // Values - Impact (Q133-Q138)
  {
    "id": "Q133",
    "category": "Values",
    "dimension": "Impact",
    "question": "I want my work to positively affect others.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q134",
    "category": "Values",
    "dimension": "Impact",
    "question": "I care deeply about doing meaningful work.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q135",
    "category": "Values",
    "dimension": "Impact",
    "question": "I seek roles that align with my personal values.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q136",
    "category": "Values",
    "dimension": "Impact",
    "question": "I enjoy helping people or making a difference.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q137",
    "category": "Values",
    "dimension": "Impact",
    "question": "I want to leave a legacy or create change.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q138",
    "category": "Values",
    "dimension": "Impact",
    "question": "I'm motivated by social, environmental, or ethical causes.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },

  // Values - Growth (Q139-Q144)
  {
    "id": "Q139",
    "category": "Values",
    "dimension": "Growth",
    "question": "I want a job that challenges me to improve.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q140",
    "category": "Values",
    "dimension": "Growth",
    "question": "I seek regular opportunities to learn new things.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q141",
    "category": "Values",
    "dimension": "Growth",
    "question": "I value career advancement and promotions.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q142",
    "category": "Values",
    "dimension": "Growth",
    "question": "I prefer dynamic environments where I can evolve.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q143",
    "category": "Values",
    "dimension": "Growth",
    "question": "I set personal development goals for myself.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  },
  {
    "id": "Q144",
    "category": "Values",
    "dimension": "Growth",
    "question": "I'm energized by continuous learning and growth.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree",
    "scoringWeight": 1,
    "isReversed": false
  }
];