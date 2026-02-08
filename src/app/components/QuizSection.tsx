'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, RotateCcw, Zap, Share2, Twitter, Facebook, Link, Download } from 'lucide-react';
import NewspaperBorder from './NewspaperBorder';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const allQuestions: Question[] = [
  {
    id: 1,
    question: "Who was the first Black woman to win an Academy Award?",
    options: ["Dorothy Dandridge", "Hattie McDaniel", "Whoopi Goldberg", "Halle Berry"],
    correctAnswer: 1,
    explanation: "Hattie McDaniel won the Oscar for Best Supporting Actress in 1940 for her role in 'Gone with the Wind', becoming the first Black American to win an Academy Award.",
    difficulty: 'medium'
  },
  {
    id: 2,
    question: "The 'I Have a Dream' speech was delivered during which event?",
    options: ["Selma to Montgomery March", "March on Washington", "Million Man March", "Freedom Summer"],
    correctAnswer: 1,
    explanation: "Dr. Martin Luther King Jr. delivered his iconic 'I Have a Dream' speech during the March on Washington on August 28, 1963.",
    difficulty: 'easy'
  },
  {
    id: 3,
    question: "What did Madam C.J. Walker become famous for?",
    options: ["Civil rights activism", "Becoming the first female self-made millionaire in America", "Inventing the telephone", "Writing novels"],
    correctAnswer: 1,
    explanation: "Madam C.J. Walker (Sarah Breedlove) created a line of hair care products and built a business empire, becoming the first female self-made millionaire in America.",
    difficulty: 'medium'
  },
  {
    id: 4,
    question: "Which city is considered the birthplace of jazz music?",
    options: ["Chicago", "New York", "New Orleans", "Memphis"],
    correctAnswer: 2,
    explanation: "New Orleans is widely recognized as the birthplace of jazz, where it emerged in the early 20th century from a blend of African and European musical traditions.",
    difficulty: 'easy'
  },
  {
    id: 5,
    question: "Who wrote the autobiography 'I Know Why the Caged Bird Sings'?",
    options: ["Toni Morrison", "Maya Angelou", "Alice Walker", "Zora Neale Hurston"],
    correctAnswer: 1,
    explanation: "Maya Angelou wrote this powerful autobiography in 1969, detailing her early years and the challenges she faced growing up as a Black woman in America.",
    difficulty: 'easy'
  },
  {
    id: 6,
    question: "The Tuskegee Airmen were the first Black military aviators in which branch?",
    options: ["U.S. Navy", "U.S. Marines", "U.S. Army Air Corps", "U.S. Coast Guard"],
    correctAnswer: 2,
    explanation: "The Tuskegee Airmen were the first Black military aviators in the U.S. Army Air Corps during World War II, overcoming discrimination to become highly decorated pilots.",
    difficulty: 'medium'
  },
  {
    id: 7,
    question: "What did Carter G. Woodson create that later became Black History Month?",
    options: ["Black History Day", "Negro History Week", "African Heritage Month", "Freedom Week"],
    correctAnswer: 1,
    explanation: "Carter G. Woodson, known as the 'Father of Black History,' created Negro History Week in 1926, which was later expanded to Black History Month in 1976.",
    difficulty: 'hard'
  },
  {
    id: 8,
    question: "Which Black inventor created an improved filament for the light bulb?",
    options: ["Garrett Morgan", "Lewis Latimer", "George Washington Carver", "Elijah McCoy"],
    correctAnswer: 1,
    explanation: "Lewis Latimer worked with Thomas Edison and invented an improved carbon filament that made light bulbs more practical and longer-lasting.",
    difficulty: 'hard'
  },
  {
    id: 9,
    question: "The Black Panther Party was founded in which year?",
    options: ["1960", "1963", "1966", "1970"],
    correctAnswer: 2,
    explanation: "The Black Panther Party was founded in Oakland, California in 1966 by Huey P. Newton and Bobby Seale.",
    difficulty: 'medium'
  },
  {
    id: 10,
    question: "Who was the first Black woman in space?",
    options: ["Mae C. Jemison", "Stephanie Wilson", "Joan Higginbotham", "Jeanette Epps"],
    correctAnswer: 0,
    explanation: "Mae C. Jemison became the first Black woman in space when she flew aboard the Space Shuttle Endeavour in September 1992.",
    difficulty: 'medium'
  },
  {
    id: 11,
    question: "What was the name of the first major Black newspaper in America?",
    options: ["The Chicago Defender", "The Pittsburgh Courier", "Freedom's Journal", "The North Star"],
    correctAnswer: 2,
    explanation: "Freedom's Journal, founded in 1827 by John Russwurm and Samuel Cornish, was the first Black-owned and operated newspaper in the United States.",
    difficulty: 'hard'
  },
  {
    id: 12,
    question: "Which law did Rosa Parks' bus boycott help lead to?",
    options: ["Civil Rights Act of 1964", "Voting Rights Act of 1965", "Browder v. Gayle ruling", "13th Amendment"],
    correctAnswer: 2,
    explanation: "The Montgomery Bus Boycott led to the Browder v. Gayle Supreme Court ruling that declared bus segregation unconstitutional.",
    difficulty: 'hard'
  }
];

export default function QuizSection() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  // Get 5 random questions for today's quiz
  const dailyQuestions = useMemo(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const shuffled = [...allQuestions].sort((a, b) => {
      const hashA = (a.id * seed) % 100;
      const hashB = (b.id * seed) % 100;
      return hashA - hashB;
    });
    return shuffled.slice(0, 5);
  }, []);

  const currentQuestion = dailyQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < dailyQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizComplete(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / dailyQuestions.length) * 100;
    if (percentage === 100) return "PERFECT SCORE! You're a Black History expert! 🎉";
    if (percentage >= 80) return "Excellent work! Your knowledge is impressive! 🌟";
    if (percentage >= 60) return "Good job! Keep learning and growing! 📚";
    if (percentage >= 40) return "Not bad! There's always more to discover! 💪";
    return "Keep exploring Black history - every day is a chance to learn! 📖";
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      easy: 'bg-[var(--accent-green)]',
      medium: 'bg-[var(--accent-gold)]',
      hard: 'bg-[var(--accent-red)]'
    };
    return colors[difficulty as keyof typeof colors] || colors.medium;
  };

  const getShareText = () => {
    const percentage = Math.round((score / dailyQuestions.length) * 100);
    return `🏆 I scored ${score}/${dailyQuestions.length} (${percentage}%) on today's Black History Quiz at The Black History Chronicle! Test your knowledge too! #BlackHistoryMonth #BlackHistory`;
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(getShareText())}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${getShareText()}\n\n${window.location.href}`);
      alert('Result copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const saveAsImage = () => {
    // Create a canvas with the result
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 600, 400);
    
    // Border
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 580, 380);
    
    // Inner border
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 560, 360);
    
    // Title
    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('THE BLACK HISTORY CHRONICLE', 300, 70);
    
    // Subtitle
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText('Daily Quiz Results', 300, 100);
    
    // Divider line
    ctx.beginPath();
    ctx.moveTo(100, 120);
    ctx.lineTo(500, 120);
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Score
    ctx.font = 'bold 72px Georgia, serif';
    ctx.fillStyle = '#CE1126';
    ctx.fillText(`${score}/${dailyQuestions.length}`, 300, 200);
    
    // Percentage
    const percentage = Math.round((score / dailyQuestions.length) * 100);
    ctx.font = 'bold 32px Georgia, serif';
    ctx.fillStyle = '#FCD116';
    ctx.fillText(`${percentage}%`, 300, 250);
    
    // Message
    ctx.font = '18px Georgia, serif';
    ctx.fillStyle = '#1A1A1A';
    const message = score === 5 ? "Perfect Score!" : score >= 3 ? "Great Job!" : "Keep Learning!";
    ctx.fillText(message, 300, 300);
    
    // Date
    ctx.font = '14px monospace';
    ctx.fillStyle = '#3D3D3D';
    ctx.fillText(new Date().toLocaleDateString(), 300, 340);
    
    // Hashtag
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#006B3F';
    ctx.fillText('#BlackHistoryMonth', 300, 370);
    
    // Download
    const link = document.createElement('a');
    link.download = `black-history-quiz-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (quizComplete) {
    return (
      <NewspaperBorder title="Quiz Results" variant="featured">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <Trophy className="mx-auto mb-4" size={64} style={{ color: 'var(--accent-gold)' }} />
          
          <h3 className="headline text-3xl md:text-4xl mb-4">
            {score} / {dailyQuestions.length}
          </h3>
          
          <p className="body-text text-lg md:text-xl mb-6 max-w-md mx-auto">
            {getScoreMessage()}
          </p>

          {/* Score visualization */}
          <div className="flex justify-center gap-2 mb-8">
            {dailyQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 border-[3px] border-[var(--ink-black)] flex items-center justify-center ${
                  index < score ? 'bg-[var(--accent-green)]' : 'bg-[var(--paper-cream)]'
                }`}
              >
                {index < score ? (
                  <CheckCircle size={16} className="text-white" />
                ) : (
                  <XCircle size={16} className="text-[var(--accent-red)]" />
                )}
              </div>
            ))}
          </div>

          {/* Share buttons */}
          <div className="mb-8">
            <p className="text-sm typewriter text-[var(--ink-faded)] mb-4">
              <Share2 size={14} className="inline mr-2" />
              SHARE YOUR RESULTS:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={shareToTwitter}
                className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white border-[3px] border-[var(--ink-black)] hover:opacity-90 transition-opacity"
                style={{ boxShadow: 'var(--shadow-subtle)' }}
              >
                <Twitter size={18} />
                <span className="text-sm font-bold">Twitter</span>
              </button>
              <button
                onClick={shareToFacebook}
                className="flex items-center gap-2 px-4 py-2 bg-[#4267B2] text-white border-[3px] border-[var(--ink-black)] hover:opacity-90 transition-opacity"
                style={{ boxShadow: 'var(--shadow-subtle)' }}
              >
                <Facebook size={18} />
                <span className="text-sm font-bold">Facebook</span>
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--paper-cream)] text-[var(--ink-black)] border-[3px] border-[var(--ink-black)] hover:bg-[var(--paper-aged)] transition-colors"
                style={{ boxShadow: 'var(--shadow-subtle)' }}
              >
                <Link size={18} />
                <span className="text-sm font-bold">Copy</span>
              </button>
              <button
                onClick={saveAsImage}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-green)] text-white border-[3px] border-[var(--ink-black)] hover:opacity-90 transition-opacity"
                style={{ boxShadow: 'var(--shadow-subtle)' }}
              >
                <Download size={18} />
                <span className="text-sm font-bold">Save Image</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--ink-black)] text-[var(--paper-cream)] border-[3px] border-[var(--ink-black)] hover:bg-[var(--accent-red)] hover:border-[var(--accent-red)] transition-colors headline"
            style={{ boxShadow: 'var(--shadow-cartoon)' }}
          >
            <RotateCcw size={20} />
            TRY AGAIN
          </button>

          <p className="mt-6 text-sm typewriter text-[var(--ink-faded)]">
            Come back tomorrow for new questions!
          </p>
        </motion.div>
      </NewspaperBorder>
    );
  }

  return (
    <NewspaperBorder title="Daily Quiz">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-6">
          <span className="typewriter text-sm">
            Question {currentQuestionIndex + 1} of {dailyQuestions.length}
          </span>
          <div className="flex items-center gap-2">
            <Zap size={16} style={{ color: 'var(--accent-gold)' }} />
            <span className="headline text-lg">{score} pts</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {dailyQuestions.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 border border-[var(--ink-black)] ${
                index < currentQuestionIndex
                  ? 'bg-[var(--accent-green)]'
                  : index === currentQuestionIndex
                  ? 'bg-[var(--accent-gold)]'
                  : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-2 py-1 text-white text-xs uppercase ${getDifficultyBadge(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty}
            </span>
          </div>

          <h3 className="headline text-xl md:text-2xl mb-6">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  whileHover={!showResult ? { scale: 1.01 } : {}}
                  whileTap={!showResult ? { scale: 0.99 } : {}}
                  disabled={showResult}
                  className={`
                    w-full text-left p-4 border-[3px] transition-all body-text
                    ${isSelected && !showResult ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)] bg-opacity-20' : ''}
                    ${showCorrect ? 'border-[var(--accent-green)] bg-[var(--accent-green)] bg-opacity-20' : ''}
                    ${showWrong ? 'border-[var(--accent-red)] bg-[var(--accent-red)] bg-opacity-20' : ''}
                    ${!isSelected && !showCorrect && !showWrong ? 'border-[var(--ink-black)] hover:border-[var(--accent-gold)]' : ''}
                  `}
                  style={{ boxShadow: isSelected ? 'var(--shadow-subtle)' : 'none' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 flex-shrink-0 border-2 border-current flex items-center justify-center font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {showCorrect && <CheckCircle className="ml-auto text-[var(--accent-green)]" size={24} />}
                    {showWrong && <XCircle className="ml-auto text-[var(--accent-red)]" size={24} />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Explanation */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-[var(--paper-aged)] border-l-4 border-[var(--accent-gold)]"
            >
              <p className="body-text text-sm md:text-base">
                <strong>Did you know?</strong> {currentQuestion.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="px-8 py-3 bg-[var(--ink-black)] text-[var(--paper-cream)] border-[3px] border-[var(--ink-black)] hover:bg-[var(--accent-green)] hover:border-[var(--accent-green)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed headline"
              style={{ boxShadow: 'var(--shadow-cartoon)' }}
            >
              SUBMIT ANSWER
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-[var(--accent-gold)] text-[var(--ink-black)] border-[3px] border-[var(--ink-black)] hover:bg-[var(--accent-red)] hover:text-white transition-colors headline"
              style={{ boxShadow: 'var(--shadow-cartoon)' }}
            >
              {currentQuestionIndex < dailyQuestions.length - 1 ? 'NEXT QUESTION' : 'SEE RESULTS'}
            </button>
          )}
        </div>
      </div>
    </NewspaperBorder>
  );
}
