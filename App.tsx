import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, User, ChevronRight, ChevronLeft, Lock, X } from 'lucide-react';
import { QUESTIONS, CATEGORY_COLORS, CATEGORY_ACCENT } from './constants';
import { StudentSubmission, Question, ResponseType } from './types';
import { EmojiScale } from './components/EmojiScale';
import { TeacherDashboard } from './components/TeacherDashboard';

export default function App() {
  // --- State ---
  const [view, setView] = useState<'welcome' | 'questions' | 'finished'>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [showTeacherPanel, setShowTeacherPanel] = useState(false);
  
  // Password protection state
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // --- Effects ---
  // Load submissions from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('class_evaluations');
    if (stored) {
      try {
        setSubmissions(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored submissions", e);
      }
    }
  }, []);

  // Save submissions whenever they change
  useEffect(() => {
    localStorage.setItem('class_evaluations', JSON.stringify(submissions));
  }, [submissions]);

  // --- Handlers ---

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    setView('questions');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswer = (val: number | string) => {
    const currentQ = QUESTIONS[currentQuestionIndex];
    setAnswers(prev => ({ ...prev, [currentQ.id]: val }));
    
    // Auto-advance for Likert if it's not the last question (optional UX choice)
    // Here we'll just let them click next to be deliberate
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishAssessment();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishAssessment = () => {
    const newSubmission: StudentSubmission = {
      id: Date.now().toString(),
      studentName: studentName,
      date: new Date().toISOString(),
      responses: Object.entries(answers).map(([qid, val]) => ({ questionId: qid, value: val }))
    };

    setSubmissions(prev => [...prev, newSubmission]);
    setView('finished');
  };

  const resetApp = () => {
    setStudentName('');
    setAnswers({});
    setCurrentQuestionIndex(0);
    setView('welcome');
  };

  const clearAllData = () => {
    if (confirm("Estàs segura que vols esborrar totes les dades de la classe? Aquesta acció no es pot desfer.")) {
      setSubmissions([]);
      localStorage.removeItem('class_evaluations');
      setShowTeacherPanel(false);
    }
  };

  // --- Password Handlers ---
  const handleTeacherAccessRequest = () => {
    setShowPasswordPrompt(true);
    setPasswordInput('');
    setPasswordError(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Gurri1234') {
      setShowTeacherPanel(true);
      setShowPasswordPrompt(false);
    } else {
      setPasswordError(true);
    }
  };

  // --- Render Helpers ---

  const progressPercentage = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;
  const currentAnswer = answers[currentQuestion?.id];
  const canProceed = currentAnswer !== undefined && currentAnswer !== '';

  if (view === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]">
        
        {/* Floating background shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-lg border-4 border-white text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-2 tracking-tight">
            Hola! 👋
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-indigo-600 mb-8">
            Estàs a punt d'avaluar-te el trimestre.
          </h2>

          <form onSubmit={handleStart} className="space-y-6">
            <div className="text-left">
              <label htmlFor="name" className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                Com et dius?
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                <input
                  id="name"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Escriu el teu nom..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-indigo-50/30"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!studentName.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl text-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              Començar <ArrowRight strokeWidth={3} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
            <button 
              onClick={handleTeacherAccessRequest}
              className="text-xs text-gray-400 hover:text-indigo-500 flex items-center gap-1 transition-colors"
            >
              <Lock size={12} /> Accés Mestres
            </button>
          </div>
        </div>

        {/* Password Prompt Modal */}
        {showPasswordPrompt && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in-up">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Lock className="text-indigo-600" size={20} />
                  Accés Mestra
                </h3>
                <button 
                  onClick={() => setShowPasswordPrompt(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={20} />
                </button>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                Aquesta zona està reservada per a les mestres. Introdueix la contrasenya per accedir als resultats.
              </p>
              
              <form onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  className={`
                    w-full p-3 border-2 rounded-xl mb-2 outline-none transition-colors
                    ${passwordError 
                      ? 'border-red-300 bg-red-50 focus:border-red-500' 
                      : 'border-gray-200 focus:border-indigo-500 bg-gray-50 focus:bg-white'}
                  `}
                  placeholder="Contrasenya"
                  autoFocus
                />
                
                {passwordError && (
                  <p className="text-red-500 text-xs font-bold mb-3 animate-pulse">
                    🚫 Contrasenya incorrecta
                  </p>
                )}
                
                <div className="flex gap-3 mt-4">
                  <button 
                    type="button"
                    onClick={() => setShowPasswordPrompt(false)}
                    className="flex-1 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel·lar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    Entrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showTeacherPanel && (
          <TeacherDashboard 
            submissions={submissions} 
            onClose={() => setShowTeacherPanel(false)} 
            onClearData={clearAllData} 
          />
        )}
      </div>
    );
  }

  if (view === 'finished') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-lg w-full animate-fade-in-up">
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 size={64} className="text-green-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Fantàstic, {studentName}!</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Has completat la teva autoavaluació. Les teves respostes s'han guardat correctament per a la mestra.
          </p>
          <button
            onClick={resetApp}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            Tornar a l'inici
          </button>
        </div>
      </div>
    );
  }

  // Question View
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 w-full fixed top-0 z-50">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-4xl mx-auto w-full">
        <div className={`
          w-full bg-white rounded-3xl shadow-xl overflow-hidden border-b-8 transition-all duration-500
          ${CATEGORY_COLORS[currentQuestion.category]}
        `}>
          {/* Header Card */}
          <div className="p-6 md:p-8 border-b border-black/5 bg-white/50">
            <div className="flex justify-between items-center mb-4">
              <span className={`text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full bg-white/80 ${CATEGORY_ACCENT[currentQuestion.category]}`}>
                {currentQuestion.category}
              </span>
              <span className="text-sm font-bold text-gray-400">
                {currentQuestionIndex + 1} / {QUESTIONS.length}
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight">
              {currentQuestion.text}
            </h2>
          </div>

          {/* Interaction Area */}
          <div className="p-6 md:p-10 bg-white min-h-[300px] flex flex-col justify-center">
            {currentQuestion.type === ResponseType.LIKERT ? (
              <EmojiScale 
                value={answers[currentQuestion.id] as number} 
                onChange={handleAnswer} 
              />
            ) : (
              <div className="w-full">
                <textarea
                  value={(answers[currentQuestion.id] as string) || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Escriu la teva resposta aquí..."
                  className="w-full h-48 p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none resize-none transition-all bg-gray-50"
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentQuestionIndex === 0 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              <ChevronLeft size={20} /> Enrere
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all
                ${!canProceed 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 hover:shadow-indigo-200'
                }
              `}
            >
              {isLastQuestion ? 'Finalitzar' : 'Següent'} <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}