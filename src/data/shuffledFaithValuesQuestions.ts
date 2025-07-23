// Shuffled Faith Values Questions with Validity Questions Integrated Throughout
// This file takes the complete90FaithValuesQuestions and redistributes validity questions

import { complete90FaithValuesQuestions } from './complete90FaithValuesQuestions';
import { type FaithValuesQuestion } from './expandedFaithValuesQuestions';

// Separate validity questions from regular questions
const validityQuestions = complete90FaithValuesQuestions.filter(q => q.validityCheck === true);
const regularQuestions = complete90FaithValuesQuestions.filter(q => !q.validityCheck);

// Function to insert validity questions at strategic intervals
function insertValidityQuestions(questions: FaithValuesQuestion[], validityQs: FaithValuesQuestion[]): FaithValuesQuestion[] {
  const result: FaithValuesQuestion[] = [];
  const totalQuestions = questions.length;
  const validityCount = validityQs.length;
  
  // Calculate intervals to distribute validity questions evenly
  const interval = Math.floor(totalQuestions / validityCount);
  let validityIndex = 0;
  
  for (let i = 0; i < questions.length; i++) {
    result.push(questions[i]);
    
    // Insert validity question at calculated intervals
    if (validityIndex < validityCount && 
        ((i + 1) % interval === 0 || i === Math.floor((validityIndex + 1) * interval) - 1)) {
      // Remove the category from validity questions to integrate them seamlessly
      const validityQuestion = { 
        ...validityQs[validityIndex], 
        category: questions[i].category // Inherit category from surrounding questions
      };
      result.push(validityQuestion);
      validityIndex++;
    }
  }
  
  // Add any remaining validity questions at the end
  while (validityIndex < validityCount) {
    result.push(validityQs[validityIndex]);
    validityIndex++;
  }
  
  return result;
}

// Create the shuffled question set
export const shuffledFaithValuesQuestions = insertValidityQuestions(regularQuestions, validityQuestions);

export default shuffledFaithValuesQuestions;