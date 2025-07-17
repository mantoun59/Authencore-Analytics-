export interface CareerLaunchQuestion {
  id: string;
  category: 'Interest' | 'Aptitude' | 'Personality' | 'Values';
  dimension: string;
  question: string;
  optionA: string;
  optionB: string;
}

export const careerLaunchQuestions: CareerLaunchQuestion[] = [
  {
    "id": "int001",
    "category": "Interest",
    "dimension": "Realistic",
    "question": "You enjoy repairing mechanical equipment or using tools.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree"
  },
  {
    "id": "int002",
    "category": "Interest",
    "dimension": "Investigative",
    "question": "You like exploring scientific theories and solving complex problems.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree"
  },
  {
    "id": "int003",
    "category": "Interest",
    "dimension": "Artistic",
    "question": "You enjoy creative expression through writing, art, or music.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree"
  },
  {
    "id": "int004",
    "category": "Interest",
    "dimension": "Social",
    "question": "You feel energized when helping others learn or grow.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree"
  },
  {
    "id": "int005",
    "category": "Interest",
    "dimension": "Enterprising",
    "question": "You're motivated to lead projects, pitch ideas, or manage teams.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree"
  },
  {
    "id": "int006",
    "category": "Interest",
    "dimension": "Conventional",
    "question": "You enjoy organizing systems, data, or following structured routines.",
    "optionA": "Strongly Agree",
    "optionB": "Strongly Disagree"
  },
  {
    "id": "apt001",
    "category": "Aptitude",
    "dimension": "Numerical Reasoning",
    "question": "You feel comfortable working with numbers and interpreting data.",
    "optionA": "Agree",
    "optionB": "Disagree"
  },
  {
    "id": "apt002",
    "category": "Aptitude",
    "dimension": "Verbal Reasoning",
    "question": "You can quickly analyze written content and summarize ideas.",
    "optionA": "Agree",
    "optionB": "Disagree"
  },
  {
    "id": "apt003",
    "category": "Aptitude",
    "dimension": "Spatial Thinking",
    "question": "You enjoy visualizing 3D objects or navigating spatial environments.",
    "optionA": "Agree",
    "optionB": "Disagree"
  },
  {
    "id": "apt004",
    "category": "Aptitude",
    "dimension": "Problem Solving",
    "question": "You often find multiple solutions to complex problems.",
    "optionA": "Agree",
    "optionB": "Disagree"
  },
  {
    "id": "per001",
    "category": "Personality",
    "dimension": "Extraversion",
    "question": "You prefer working in groups rather than alone.",
    "optionA": "Agree",
    "optionB": "Disagree"
  },
  {
    "id": "per002",
    "category": "Personality",
    "dimension": "Conscientiousness",
    "question": "You stay organized and complete tasks on time.",
    "optionA": "Agree",
    "optionB": "Disagree"
  },
  {
    "id": "per003",
    "category": "Personality",
    "dimension": "Emotional Stability",
    "question": "You manage stress well under pressure.",
    "optionA": "Agree",
    "optionB": "Disagree"
  },
  {
    "id": "per004",
    "category": "Personality",
    "dimension": "Openness to Experience",
    "question": "You enjoy learning new things and exploring new ideas.",
    "optionA": "Agree",
    "optionB": "Disagree"
  },
  {
    "id": "val001",
    "category": "Values",
    "dimension": "Autonomy",
    "question": "You prefer jobs where you can make independent decisions.",
    "optionA": "Agree",
    "optionB": "Disagree"
  },
  {
    "id": "val002",
    "category": "Values",
    "dimension": "Security",
    "question": "You value long-term stability and predictability in your career.",
    "optionA": "Agree",
    "optionB": "Disagree"
  },
  {
    "id": "val003",
    "category": "Values",
    "dimension": "Impact",
    "question": "You want to make a meaningful difference through your work.",
    "optionA": "Agree",
    "optionB": "Disagree"
  },
  {
    "id": "val004",
    "category": "Values",
    "dimension": "Growth",
    "question": "You seek continuous personal and professional development.",
    "optionA": "Agree",
    "optionB": "Disagree"
  }
];