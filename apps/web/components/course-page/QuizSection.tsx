"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
// Remove toast import
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface QuizQuestion {
  question: string;   // Changed from "q" to "question"
  options: string[];
  answer: string;
  explanation: string;
}

interface QuizSectionProps {
  quizQuestions: QuizQuestion[];
  quizLoading: boolean;
  selectedAnswers: Record<number, string>;
  submittedAnswers: Record<number, boolean>;
  showExplanations: Record<number, boolean>;
  currentQuestionIndex: number;
  setSelectedAnswers: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  setSubmittedAnswers: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  setShowExplanations: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  setShowQuiz: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function QuizSection({
  quizQuestions,
  quizLoading,
  selectedAnswers,
  submittedAnswers,
  showExplanations,
  currentQuestionIndex,
  setSelectedAnswers,
  setSubmittedAnswers,
  setShowExplanations,
  setCurrentQuestionIndex,
  setShowQuiz
}: QuizSectionProps) {
  // Handle answer selection
  const handleAnswerSelect = (questionIndex: number, option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };
  
  // Handle quiz submission for a single question
  const handleSubmitAnswer = (questionIndex: number) => {
    const selectedOption = selectedAnswers[questionIndex];
    const question = quizQuestions[questionIndex];
    
    if (!selectedOption || !question) return;
    
    const isCorrect = selectedOption === question.answer;
    
    setSubmittedAnswers(prev => ({
      ...prev,
      [questionIndex]: isCorrect
    }));
    
    setShowExplanations(prev => ({
      ...prev,
      [questionIndex]: true
    }));
    
    // Removed toast success/error notifications
  };

  // Function to go to the next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Function to go to the previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-5 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Practice Quiz
      </h3>
      
      {quizLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      ) : quizQuestions && quizQuestions.length > 0 ? (
        <div>
          {/* Quiz Progress Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </div>
            <div className="w-2/3 bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out" 
                style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}%
            </div>
          </div>
          
          {/* Display Current Question */}
          {quizQuestions[currentQuestionIndex] && (
            <Card className={`
              ${submittedAnswers[currentQuestionIndex] === true ? 'border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : ''}
              ${submittedAnswers[currentQuestionIndex] === false ? 'border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''}
              shadow-md transition-all duration-300 animate-fadeIn
            `}>
              <CardHeader>
                <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
                <CardDescription className="text-base font-medium text-foreground mt-1">
                  {quizQuestions[currentQuestionIndex]?.question}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <RadioGroup 
                  value={selectedAnswers[currentQuestionIndex]} 
                  onValueChange={(value) => handleAnswerSelect(currentQuestionIndex, value)}
                  className="space-y-3"
                >
                  {quizQuestions[currentQuestionIndex]?.options.map((option, i) => (
                    <div 
                      key={i} 
                      className={`
                        flex items-center space-x-3 p-3 rounded-md transition-all 
                        ${submittedAnswers[currentQuestionIndex] !== undefined && option === quizQuestions[currentQuestionIndex]?.answer ? 
                          'bg-green-100 dark:bg-green-900/30 ring-2 ring-green-500/40' : ''}
                        ${submittedAnswers[currentQuestionIndex] === false && option === selectedAnswers[currentQuestionIndex] ? 
                          'bg-red-100 dark:bg-red-900/30 ring-2 ring-red-500/40' : ''}
                        ${submittedAnswers[currentQuestionIndex] === undefined ? 
                          'hover:bg-secondary/70 cursor-pointer border border-border hover:border-primary/30' : 
                          'cursor-default'}
                      `}
                      onClick={() => {
                        if (submittedAnswers[currentQuestionIndex] === undefined) {
                          handleAnswerSelect(currentQuestionIndex, option);
                        }
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <RadioGroupItem 
                          value={option} 
                          id={`q${currentQuestionIndex}-option${i}`}
                          disabled={submittedAnswers[currentQuestionIndex] !== undefined}
                        />
                      </div>
                      <Label 
                        htmlFor={`q${currentQuestionIndex}-option${i}`}
                        className={`
                          flex-grow cursor-pointer select-none text-base
                          ${submittedAnswers[currentQuestionIndex] !== undefined && option === quizQuestions[currentQuestionIndex]?.answer ? 
                            'font-semibold text-green-700 dark:text-green-400' : ''}
                          ${submittedAnswers[currentQuestionIndex] === false && option === selectedAnswers[currentQuestionIndex] ? 
                            'text-red-700 dark:text-red-400' : ''}
                        `}
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {/* Show explanation after answering */}
                {showExplanations[currentQuestionIndex] && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm animate-fadeIn">
                    <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Explanation
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed">
                      {quizQuestions[currentQuestionIndex]?.explanation}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="py-3 flex flex-wrap sm:flex-row gap-3 justify-between items-center border-t">
                <div className="flex items-center gap-2">
                  {submittedAnswers[currentQuestionIndex] === undefined ? (
                    <Button 
                      onClick={() => handleSubmitAnswer(currentQuestionIndex)}
                      disabled={!selectedAnswers[currentQuestionIndex]}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <div></div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-2 py-1 h-9"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180 mr-1" /> Previous
                  </Button>

                  <Button 
                    variant={submittedAnswers[currentQuestionIndex] !== undefined ? "default" : "outline"}
                    size="sm"
                    onClick={goToNextQuestion}
                    disabled={currentQuestionIndex === quizQuestions.length - 1}
                    className={`
                      px-2 py-1 h-9
                      ${submittedAnswers[currentQuestionIndex] !== undefined ? 
                        'bg-primary hover:bg-primary/90' : ''}
                    `}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
  
          
          {/* Quiz Summary - Show when all questions are answered */}
          {Object.keys(submittedAnswers).length === quizQuestions.length && (
            <div className="mt-8 p-5 bg-muted/30 rounded-lg border border-border animate-fadeIn">
              <h3 className="text-lg font-semibold mb-3">Quiz Summary</h3>
              <p className="mb-4">
                You answered {Object.values(submittedAnswers).filter(Boolean).length} out of {quizQuestions.length} questions correctly.
              </p>
              <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-out" 
                  style={{ 
                    width: `${(Object.values(submittedAnswers).filter(Boolean).length / quizQuestions.length) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  className="text-primary border-primary hover:bg-primary/10"
                  onClick={() => {
                    setSelectedAnswers({});
                    setSubmittedAnswers({});
                    setShowExplanations({});
                    setCurrentQuestionIndex(0);
                  }}
                >
                  Restart Quiz
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 bg-muted rounded-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          <p className="text-muted-foreground font-medium">No quiz questions available for this video yet.</p>
          <p className="text-sm text-muted-foreground mt-2">Select another video or check back later!</p>
        </div>
      )}
    </div>
  );
}
