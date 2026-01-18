import React, { useState, useEffect, useRef } from 'react';
import { GameState, UserProgress, Lesson } from './types';
import { LESSONS, MODULE_TITLE, MODULE_OBJECTIVE, RANKS, QUIZ_QUESTIONS, FUTURE_MODULES, PLATFORM_NAME, LOGO_URL } from './constants';
import { IconBook, IconCheck, IconLock, IconPlay, IconTrophy, IconFile, IconArrowLeft, IconChevronLeft, IconChevronRight } from './components/Icons';
import { AITutor } from './components/AITutor';

// Confetti Component
const Confetti = ({ active }: { active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ['#3b82f6', '#fbbf24', '#10b981', '#f472b6'];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.y += 0.1; // gravity
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);

        if (p.y > canvas.height) {
           particles[i] = {
             x: Math.random() * canvas.width,
             y: -20,
             vx: Math.random() * 4 - 2,
             vy: Math.random() * 4 + 2,
             color: colors[Math.floor(Math.random() * colors.length)],
             size: Math.random() * 8 + 4
           }
        }
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();
    const timeout = setTimeout(() => cancelAnimationFrame(animationId), 5000); // Stop after 5s

    return () => {
        cancelAnimationFrame(animationId);
        clearTimeout(timeout);
    }
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
};

const App = () => {
  // --- State ---
  const [view, setView] = useState<GameState>(GameState.MODULE_SELECT);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedLessonIds: [],
    xp: 0,
    level: 1,
    streak: 1,
    rankTitle: RANKS[0].title,
    notes: {}
  });

  // Reading State
  const [currentPage, setCurrentPage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const [mode, setMode] = useState<'READING' | 'NOTES'>('READING');
  
  // Quiz State
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false); 
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // --- Effects ---
  useEffect(() => {
    // Check Level Up
    const newRank = RANKS.slice().reverse().find(r => userProgress.xp >= r.threshold);
    if (newRank && newRank.title !== userProgress.rankTitle) {
      setUserProgress(prev => ({ ...prev, rankTitle: newRank.title }));
      setLevelUp(true);
      setTimeout(() => setLevelUp(false), 4000);
    }
  }, [userProgress.xp]);

  // --- Handlers ---
  const handleLessonSelect = (lesson: Lesson) => {
    const isLocked = lesson.id > 1 && !userProgress.completedLessonIds.includes(lesson.id - 1);
    
    if (!isLocked) {
      setActiveLesson(lesson);
      setCurrentPage(0);
      setMode('READING');
      setView(GameState.LESSON_VIEW);
    }
  };

  const updateNotes = (text: string) => {
      if (!activeLesson) return;
      setUserProgress(prev => ({
          ...prev,
          notes: {
              ...prev.notes,
              [activeLesson.id]: text
          }
      }));
  };

  const completeLesson = () => {
    if (activeLesson && !userProgress.completedLessonIds.includes(activeLesson.id)) {
      setUserProgress(prev => ({
        ...prev,
        completedLessonIds: [...prev.completedLessonIds, activeLesson.id],
        xp: prev.xp + 100
      }));
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    setView(GameState.DASHBOARD);
    setActiveLesson(null);
  };

  const startQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setQuizCompleted(false);
    setView(GameState.QUIZ);
  };

  const handleQuizAnswer = (optionIndex: number) => {
    if (quizAnswered) return;
    
    setSelectedOption(optionIndex);
    setQuizAnswered(true);

    const isCorrect = optionIndex === QUIZ_QUESTIONS[currentQuestionIndex].correctAnswer;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }

    setTimeout(() => {
        if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setQuizAnswered(false);
            setSelectedOption(null);
        } else {
            setQuizCompleted(true);
            if (!userProgress.completedLessonIds.includes(999)) {
                const finalXP = isCorrect ? (quizScore + 1) * 50 : quizScore * 50; 
                setUserProgress(prev => ({
                    ...prev,
                    xp: prev.xp + finalXP,
                    completedLessonIds: [...prev.completedLessonIds, 999]
                }));
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);
            }
        }
    }, 1500);
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
        // YouTube Video Parsing: [VIDEO](VIDEO_ID)
        const videoMatch = line.match(/\[VIDEO\]\((.*?)\)/);
        if (videoMatch) {
            return (
                <div key={i} className="my-12 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-geo-accent to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                        <div className="flex items-center gap-2 p-3 bg-slate-800 border-b border-slate-700">
                             <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                             <span className="text-xs font-bold text-white uppercase tracking-widest">Transmissão Segura Interceptada</span>
                        </div>
                        <iframe 
                            className="w-full aspect-video" 
                            src={`https://www.youtube.com/embed/${videoMatch[1]}`} 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            );
        }

        // Image Parsing: ![Alt](Url)
        const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
        if (imgMatch) {
            return (
                <div key={i} className="my-10 group">
                    <div className="relative overflow-hidden rounded-xl shadow-2xl border-2 border-slate-700">
                        <div className="absolute inset-0 bg-geo-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none mix-blend-overlay"></div>
                        <img 
                            src={imgMatch[2]} 
                            alt={imgMatch[1]} 
                            className="w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                            <p className="text-center text-xs font-mono text-geo-accent uppercase tracking-widest border-l-2 border-geo-accent pl-2">
                                FIG.{i}: {imgMatch[1]}
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (line.startsWith('# ')) return <h1 key={i} className="text-4xl md:text-5xl font-display font-black text-white mb-10 border-b-2 border-slate-700 pb-6 mt-4 tracking-tight drop-shadow-lg">{line.replace('# ', '')}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl md:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-geo-accent to-white mb-6 mt-12 flex items-center gap-3"><span className="w-2 h-8 bg-geo-accent rounded-sm"></span>{line.replace('## ', '')}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-white mb-4 mt-8 pl-4 border-l-2 border-geo-gold">{line.replace('### ', '')}</h3>;
        if (line.startsWith('> ')) return <blockquote key={i} className="my-10 pl-8 border-l-4 border-geo-gold italic text-slate-300 text-xl leading-relaxed bg-slate-800/30 py-6 pr-6 rounded-r-xl shadow-lg relative"><span className="absolute top-0 left-0 text-6xl text-geo-gold opacity-20 -translate-y-4 translate-x-2">"</span>{line.replace('> ', '')}</blockquote>;
        if (line.startsWith('* ')) return <li key={i} className="ml-6 list-disc text-slate-300 mb-3 pl-2 marker:text-geo-accent text-lg">{line.replace('* ', '')}</li>;
        if (line.match(/^\d\./)) return <li key={i} className="ml-6 list-decimal text-slate-300 mb-3 pl-2 marker:text-geo-gold font-medium text-lg">{line.replace(/^\d\.\s/, '')}</li>;
        if (line.trim() === '') return <br key={i} />;
        
        // Bold Text Parsing
        const parts = line.split(/(\*\*.*?\*\*)/g);
        if (parts.length > 1) {
             return <p key={i} className="mb-6 text-slate-300 leading-8 text-lg text-justify font-light tracking-wide">
                {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j} className="text-white font-bold bg-white/5 px-1 rounded">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}
            </p>;
        }

        return <p key={i} className="mb-6 text-slate-300 leading-8 text-lg text-justify font-light tracking-wide">{line}</p>;
    });
  };

  // --- Render Helpers ---

  const renderModuleSelection = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 pb-20 pt-8">
            {/* Header Text */}
            <div className="mb-20 text-center space-y-4 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-geo-accent/10 blur-[120px] rounded-full pointer-events-none"></div>
                <h1 className="relative text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter drop-shadow-2xl">
                    Centro de Comando
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-xl font-light">Selecione sua missão. O nível de credencial atual permite acesso restrito.</p>
            </div>

            <div className="grid gap-12 relative z-10">
                
                {/* Active Module 1 */}
                <div 
                    onClick={() => setView(GameState.DASHBOARD)}
                    className="cursor-pointer group relative glass-panel border border-geo-accent/30 p-8 rounded-3xl overflow-hidden hover:border-geo-accent transition-all duration-500 hover:shadow-[0_0_50px_rgba(14,165,233,0.2)] transform hover:-translate-y-2"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-geo-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute right-0 top-0 p-6">
                        <div className="flex items-center gap-2 text-geo-success bg-geo-success/10 px-4 py-2 rounded-full border border-geo-success/20 animate-pulse-slow">
                            <div className="w-2 h-2 rounded-full bg-geo-success animate-ping"></div>
                            <span className="text-xs font-bold uppercase tracking-widest">Acesso Autorizado</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                        <div className="w-32 h-32 bg-gradient-to-br from-geo-accent to-blue-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 group-hover:rotate-6 transition-transform duration-500">
                            <span className="text-6xl font-display font-black text-white">01</span>
                        </div>
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-white group-hover:text-geo-accent transition-colors">
                                {MODULE_TITLE}
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">{MODULE_OBJECTIVE}</p>
                            <div className="pt-4 flex items-center gap-4 justify-center md:justify-start">
                                <span className="text-sm font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <IconBook className="w-4 h-4" /> 15 Aulas
                                </span>
                                <span className="text-sm font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <IconTrophy className="w-4 h-4" /> Exame Final
                                </span>
                            </div>
                        </div>
                        <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-10 group-hover:translate-x-0">
                            <div className="bg-white text-black p-4 rounded-full shadow-lg">
                                <IconChevronRight className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Locked Future Modules */}
                <div className="grid md:grid-cols-2 gap-8">
                    {FUTURE_MODULES.map((module) => (
                        <div key={module.id} className="glass-panel border border-slate-800 p-8 rounded-3xl relative overflow-hidden opacity-50 hover:opacity-70 transition-all duration-300 grayscale hover:grayscale-0 group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10 pointer-events-none"></div>
                            
                            <div className="absolute top-4 right-4">
                                <IconLock className="w-6 h-6 text-slate-600" />
                            </div>

                            <div className="flex flex-col gap-6">
                                <span className="text-5xl font-display font-black text-slate-700 select-none">0{module.id}</span>
                                <div>
                                    <h3 className="text-xl font-display font-bold text-slate-300 mb-2 uppercase tracking-tight">{module.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{module.description}</p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-800/50 flex justify-between items-center">
                                    <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">{module.lessons.length} Tópicos</span>
                                    <span className="px-3 py-1 bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-700">Classificado</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
  };

  const renderDashboard = () => {
    const progressPercent = (userProgress.completedLessonIds.length / LESSONS.length) * 100;
    const allLessonsDone = userProgress.completedLessonIds.length >= LESSONS.length;

    return (
      <div className="max-w-7xl mx-auto px-4 pb-20 pt-8">
        
        {/* Back to Modules */}
        <button 
            onClick={() => setView(GameState.MODULE_SELECT)}
            className="mb-8 flex items-center text-slate-500 hover:text-white transition-colors group"
        >
            <IconArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-mono uppercase tracking-widest font-bold">Voltar para Seleção de Módulos</span>
        </button>

        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
                { label: 'Patente Atual', value: userProgress.rankTitle, color: 'border-geo-accent', text: 'text-white' },
                { label: 'XP Total', value: userProgress.xp, color: 'border-geo-gold', text: 'text-geo-gold' },
                { label: 'Missões Cumpridas', value: `${userProgress.completedLessonIds.length} / ${LESSONS.length}`, color: 'border-geo-success', text: 'text-white' },
                { label: 'Dias em Operação', value: userProgress.streak, color: 'border-purple-500', text: 'text-white' }
            ].map((stat, i) => (
                <div key={i} className={`glass-panel p-6 rounded-2xl border-l-4 ${stat.color} shadow-2xl flex flex-col hover:scale-105 transition-transform duration-300 relative overflow-hidden group`}>
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-700">
                        <IconTrophy className="w-32 h-32" />
                    </div>
                    <span className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-2 font-bold z-10">{stat.label}</span>
                    <span className={`text-2xl md:text-3xl font-display font-bold ${stat.text} z-10`}>{stat.value}</span>
                </div>
            ))}
        </div>

        {/* Hero */}
        <div className="mb-20 text-center space-y-8 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
            <h1 className="relative text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 uppercase tracking-tighter drop-shadow-2xl">
                MÓDULO 1
            </h1>
            <p className="text-slate-400 max-w-4xl mx-auto text-2xl leading-relaxed font-light">{MODULE_OBJECTIVE}</p>
            
            {/* Progress Bar */}
            <div className="relative w-full max-w-2xl mx-auto h-6 bg-slate-900 rounded-full mt-12 overflow-hidden border border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
                <div 
                    className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-geo-accent transition-all duration-1000 ease-out shadow-[0_0_30px_rgba(59,130,246,0.6)] relative"
                    style={{ width: `${progressPercent}%` }}
                >
                    <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </div>
            </div>
             <div className="flex justify-between max-w-2xl mx-auto mt-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
                <span>Inicialização</span>
                <span className="text-geo-accent font-bold">{Math.round(progressPercent)}% Sincronizado</span>
                <span>Conclusão</span>
             </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 relative z-10">
            {LESSONS.map((lesson, index) => {
                const isCompleted = userProgress.completedLessonIds.includes(lesson.id);
                const isLocked = index > 0 && !userProgress.completedLessonIds.includes(LESSONS[index - 1].id);
                const isNext = !isCompleted && !isLocked;

                return (
                    <button
                        key={lesson.id}
                        onClick={() => handleLessonSelect(lesson)}
                        disabled={isLocked}
                        className={`group relative flex items-center p-8 rounded-3xl border backdrop-blur-md transition-all duration-500 text-left w-full overflow-hidden
                            ${isLocked 
                                ? 'bg-slate-900/40 border-slate-800 opacity-50 cursor-not-allowed grayscale' 
                                : 'glass-panel border-slate-700/50 hover:border-geo-accent/50 hover:bg-slate-800/80 hover:shadow-[0_0_40px_rgba(14,165,233,0.15)] hover:-translate-y-2'
                            }
                        `}
                    >
                         {/* Next Lesson Indicator */}
                        {isNext && <div className="absolute top-0 right-0 w-32 h-32 bg-geo-accent/10 rounded-bl-[100px] -mr-10 -mt-10 animate-pulse-slow"></div>}

                        {/* Status Icon */}
                        <div className={`mr-8 flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center border-2 shadow-2xl relative z-10 transform group-hover:scale-110 transition-transform duration-500
                            ${isCompleted 
                                ? 'bg-geo-success/10 border-geo-success text-geo-success' 
                                : isLocked 
                                    ? 'bg-slate-800 border-slate-700 text-slate-600' 
                                    : 'bg-geo-accent/10 border-geo-accent text-geo-accent'
                            }`}>
                            {isCompleted ? <IconCheck className="w-8 h-8" /> : isLocked ? <IconLock className="w-8 h-8" /> : <IconPlay className="ml-1 w-8 h-8" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 relative z-10">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-xs font-bold uppercase tracking-[0.2em] ${isNext ? 'text-geo-accent' : 'text-slate-500'}`}>
                                    Dossiê Classificado 0{index + 1}
                                </span>
                                <span className="text-xs text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-600 font-mono shadow-inner">{lesson.duration}</span>
                            </div>
                            <h3 className={`text-2xl font-bold font-display mb-3 group-hover:text-geo-accent transition-colors ${isLocked ? 'text-slate-500' : 'text-slate-100'}`}>
                                {lesson.title}
                            </h3>
                            <p className="text-base text-slate-400 line-clamp-2 leading-relaxed group-hover:text-slate-300 transition-colors">{lesson.description}</p>
                        </div>
                    </button>
                );
            })}
        </div>

        {/* Quiz Section Unlock */}
        <div className="mt-32 text-center pb-20 border-b border-slate-800/50">
            <button
                disabled={!allLessonsDone}
                onClick={startQuiz}
                className={`relative group px-16 py-8 rounded-full font-black text-3xl font-display uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-6 mx-auto overflow-hidden
                    ${allLessonsDone 
                        ? 'text-black hover:scale-105 shadow-[0_0_60px_rgba(234,179,8,0.6)] ring-4 ring-geo-gold/50' 
                        : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                    }
                `}
            >
                {allLessonsDone && <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 animate-scan opacity-100"></div>}
                <IconTrophy className={`w-10 h-10 relative z-10 ${allLessonsDone ? 'animate-bounce' : ''}`} />
                <span className="relative z-10">{allLessonsDone ? "INICIAR OPERAÇÃO FINAL" : "ACESSO BLOQUEADO"}</span>
            </button>
            {!allLessonsDone && <p className="mt-6 text-slate-500 text-sm uppercase tracking-[0.3em] animate-pulse">Complete todos os dossiês para desbloquear o protocolo final</p>}
        </div>
      </div>
    );
  };

  const renderLessonView = () => {
    if (!activeLesson) return null;

    const isCompleted = userProgress.completedLessonIds.includes(activeLesson.id);
    const totalPages = activeLesson.pages.length;
    const progress = ((currentPage + 1) / totalPages) * 100;
    const currentNotes = userProgress.notes[activeLesson.id] || "";

    return (
      <div className="max-w-6xl mx-auto px-4 h-full flex flex-col pt-6 pb-6">
         {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
             <button 
                onClick={() => setView(GameState.DASHBOARD)}
                className="flex items-center text-slate-400 hover:text-white transition-colors bg-slate-900/50 px-5 py-3 rounded-xl border border-slate-700 hover:border-slate-500 hover:bg-slate-800"
            >
                <IconArrowLeft className="mr-2 w-5 h-5" /> RETORNAR AO MÓDULO
            </button>
            
            {/* Mode Switcher */}
            <div className="flex bg-slate-900 rounded-xl p-1.5 border border-slate-700 shadow-xl">
                <button 
                    onClick={() => setMode('READING')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'READING' ? 'bg-geo-accent text-white shadow-lg scale-105' : 'text-slate-400 hover:text-white'}`}
                >
                    LEITURA TÁTICA
                </button>
                <button 
                    onClick={() => setMode('NOTES')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'NOTES' ? 'bg-geo-gold text-black shadow-lg scale-105' : 'text-slate-400 hover:text-white'}`}
                >
                    CADERNO DE CAMPO
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-panel border border-slate-700 rounded-3xl shadow-2xl flex flex-col relative overflow-hidden h-[80vh]">
             
             {mode === 'READING' ? (
                 <>
                    <div className="absolute top-0 w-full h-1.5 bg-slate-900 z-30">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-geo-accent transition-all duration-500 shadow-[0_0_10px_currentColor]" style={{ width: `${progress}%` }}></div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <IconFile className="w-96 h-96 text-white" />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 overflow-y-auto p-8 md:p-16 scroll-smooth custom-scrollbar relative z-10">
                        <div className="max-w-4xl mx-auto animate-fade-in pb-12">
                            <div className="flex justify-between items-center border-b border-slate-700/50 pb-6 mb-10">
                                <span className="text-xs font-mono text-geo-accent bg-geo-accent/10 px-3 py-1.5 rounded-full border border-geo-accent/20 tracking-wider font-bold">PÁGINA CONFIDENCIAL {currentPage + 1} DE {totalPages}</span>
                                <span className="text-xs font-mono text-slate-500">ID: {activeLesson.id}-GEO-SEC-{Math.floor(Math.random() * 9999)}</span>
                            </div>
                            
                            {/* Rich Text Parsing using dangerouslySetInnerHTML replacement logic */}
                            <div className="prose prose-invert max-w-none">
                                {formatText(activeLesson.pages[currentPage])}
                            </div>

                            <div className="mt-20 flex justify-center pb-8 border-t border-slate-700/50 pt-8 text-slate-600 text-xs font-mono uppercase tracking-[0.2em]">
                                Documento Gerado Pelo Sistema de Inteligência VGEO Academy
                            </div>
                        </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="p-6 bg-slate-900/90 border-t border-slate-700 backdrop-blur-xl flex justify-between items-center z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                            className="flex items-center px-8 py-4 rounded-xl text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed text-white hover:bg-slate-800 border border-slate-700 hover:border-slate-500"
                        >
                            <IconChevronLeft className="mr-3 w-5 h-5" /> ANTERIOR
                        </button>

                        <div className="text-slate-400 font-mono text-sm hidden md:block">
                            <span className="text-2xl font-bold text-white">{currentPage + 1}</span> <span className="text-slate-600 mx-3">/</span> {totalPages}
                        </div>

                        {currentPage < totalPages - 1 ? (
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                className="flex items-center px-8 py-4 rounded-xl text-sm font-bold bg-white text-geo-dark hover:bg-slate-200 transition-all shadow-xl hover:shadow-white/20 hover:-translate-y-1"
                            >
                                PRÓXIMA <IconChevronRight className="ml-3 w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={completeLesson}
                                className="flex items-center px-10 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-105"
                            >
                                <IconCheck className="mr-3 w-6 h-6" /> CONCLUIR MISSÃO
                            </button>
                        )}
                    </div>
                 </>
             ) : (
                 // EDITABLE NOTES SECTION
                 <div className="flex-1 flex flex-col p-8 animate-fade-in bg-[#0f1115] relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-geo-gold/5 blur-[100px] rounded-full pointer-events-none"></div>
                     <div className="mb-6 flex items-center gap-3 text-geo-gold border-b border-slate-800 pb-6 relative z-10">
                         <div className="p-3 bg-geo-gold/10 rounded-lg">
                            <IconFile className="w-6 h-6" />
                         </div>
                         <div>
                            <span className="block font-display font-bold uppercase tracking-widest text-lg">Arquivo Pessoal do Analista</span>
                            <span className="text-xs text-slate-500 font-mono">{activeLesson.title.toUpperCase()}</span>
                         </div>
                     </div>
                     <textarea
                        value={currentNotes}
                        onChange={(e) => updateNotes(e.target.value)}
                        placeholder=">> Digite suas observações estratégicas, insights e correlações aqui.&#10;>> Este arquivo é persistente e confidencial."
                        className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-geo-gold/50 focus:bg-slate-900 transition-all resize-none custom-scrollbar text-lg placeholder-slate-600 relative z-10"
                        spellCheck={false}
                     />
                     <div className="mt-4 flex justify-between items-center text-xs text-slate-500 font-mono relative z-10">
                         <span className="flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full ${currentNotes ? 'bg-green-500' : 'bg-slate-600'} animate-pulse`}></span>
                             STATUS: {currentNotes ? "DADOS CRIPTOGRAFADOS E SALVOS" : "AGUARDANDO INPUT"}
                         </span>
                         <span>{currentNotes.length} CARACTERES</span>
                     </div>
                 </div>
             )}
        </div>
        
        <AITutor currentContext={activeLesson.title + (mode === 'READING' ? " - Página " + (currentPage + 1) : " - Caderno de Notas")} />
      </div>
    );
  };

  const renderQuiz = () => {
    if (quizCompleted) {
        return (
          <div className="max-w-4xl mx-auto px-4 pt-12 text-center animate-fade-in flex flex-col items-center justify-center h-[80vh]">
              <div className="bg-slate-900/80 border border-slate-700 rounded-3xl p-12 shadow-2xl relative overflow-hidden max-w-2xl w-full backdrop-blur-sm">
                  <div className="absolute inset-0 bg-geo-gold/5 animate-pulse"></div>
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <IconTrophy className="w-32 h-32 text-geo-gold mb-8 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-bounce" />
                    <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 uppercase tracking-tight">Relatório de Missão</h2>
                    
                    <div className="text-2xl text-slate-300 mb-10 font-light">
                        Resultado: <span className="text-geo-gold font-bold text-4xl">{quizScore}</span> <span className="text-slate-500 text-lg mx-2">/</span> <span className="text-white font-bold text-3xl">{QUIZ_QUESTIONS.length}</span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
                        <button 
                            onClick={() => setView(GameState.DASHBOARD)}
                            className="flex-1 px-8 py-4 bg-geo-accent hover:bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-500/30"
                        >
                            Retornar ao Módulo
                        </button>
                        <button 
                            onClick={startQuiz}
                            className="flex-1 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold uppercase tracking-widest transition-all border border-slate-700"
                        >
                            Reiniciar
                        </button>
                    </div>
                  </div>
              </div>
          </div>
        );
    }

    // Safety check if questions exist
    if (!QUIZ_QUESTIONS || QUIZ_QUESTIONS.length === 0) return <div>Erro: Sem questões.</div>;
    
    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
    if (!currentQuestion) return <div>Erro: Questão não encontrada.</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 pt-8 flex flex-col min-h-[85vh]">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <button 
                    onClick={() => setView(GameState.DASHBOARD)}
                    className="text-slate-500 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest flex items-center gap-2"
                >
                    <IconArrowLeft className="w-4 h-4" /> ABORTAR
                </button>
                <div className="text-slate-400 font-mono text-sm bg-slate-800/50 px-4 py-1 rounded-full border border-slate-700">
                    QUESTÃO <span className="text-white font-bold text-lg mx-1">{currentQuestionIndex + 1}</span> / {QUIZ_QUESTIONS.length}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-900 rounded-full mb-12 overflow-hidden border border-slate-800">
                <div 
                    className="h-full bg-geo-gold transition-all duration-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                    style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                ></div>
            </div>

            {/* Question Card */}
            <div className="flex-1 flex flex-col justify-center animate-fade-in relative">
                 <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-12 leading-tight drop-shadow-lg text-center px-4">
                    {currentQuestion.question}
                 </h2>

                 <div className="grid gap-4 max-w-2xl mx-auto w-full px-4">
                     {currentQuestion.options.map((option, index) => {
                         let buttonClass = "bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-500 text-slate-300";
                         let iconClass = "border-slate-600 text-slate-500 group-hover:border-slate-400 group-hover:text-slate-400";
                         
                         if (quizAnswered) {
                             if (index === currentQuestion.correctAnswer) {
                                 buttonClass = "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]";
                                 iconClass = "border-green-500 text-green-500 bg-green-500/20";
                             } else if (selectedOption === index) {
                                 buttonClass = "bg-red-500/20 border-red-500 text-red-400 opacity-50";
                                 iconClass = "border-red-500 text-red-400 bg-red-500/20";
                             } else {
                                 buttonClass = "bg-slate-900/50 border-slate-800 text-slate-600 opacity-30 cursor-not-allowed";
                                 iconClass = "border-slate-800 text-slate-700";
                             }
                         } else if (selectedOption === index) {
                             buttonClass = "bg-slate-700 border-geo-accent text-white";
                         }

                         return (
                            <button
                                key={index}
                                onClick={() => handleQuizAnswer(index)}
                                disabled={quizAnswered}
                                className={`p-6 rounded-2xl border-2 text-left font-medium text-lg transition-all duration-200 flex items-center justify-between group transform active:scale-95 ${buttonClass}`}
                            >
                                <span className="flex items-center gap-4">
                                    <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${iconClass}`}>
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span>{option}</span>
                                </span>
                                {quizAnswered && index === currentQuestion.correctAnswer && <IconCheck className="w-6 h-6 text-green-500 animate-bounce" />}
                            </button>
                         );
                     })}
                 </div>
            </div>
            
             <div className="mt-12 text-center text-[10px] text-slate-600 font-mono uppercase tracking-widest pb-8 opacity-50">
                SISTEMA DE AVALIAÇÃO TÁTICA // MÓDULO 1
             </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen pb-12 overflow-x-hidden">
      <Confetti active={showConfetti} />
      
      {/* Level Up Modal Overlay */}
      {levelUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
              <div className="text-center relative">
                  <div className="absolute inset-0 bg-geo-gold/20 blur-[100px] rounded-full"></div>
                  <h1 className="relative text-7xl md:text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700 animate-bounce mb-6 drop-shadow-[0_0_35px_rgba(251,191,36,0.8)]">
                      NOVA PATENTE
                  </h1>
                  <p className="relative text-3xl md:text-5xl text-white font-bold tracking-[0.2em] uppercase animate-pulse">{userProgress.rankTitle}</p>
              </div>
          </div>
      )}

      {/* Top Navigation */}
      <nav className="border-b border-white/5 bg-geo-dark/90 backdrop-blur-xl sticky top-0 z-40 mb-8 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setView(GameState.MODULE_SELECT)}>
                <div className="w-12 h-12 flex items-center justify-center transition-all transform group-hover:scale-105">
                    <img src={LOGO_URL} alt="VGEO Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-display font-black text-white tracking-tight leading-none">{PLATFORM_NAME}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-[0.3em] leading-none mt-1.5 font-bold">Educação Geopolítica</span>
                </div>
            </div>
            <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-4 bg-slate-800/50 px-6 py-2 rounded-full border border-slate-700">
                     <div className="text-right">
                         <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Nível Operacional</div>
                         <div className="text-geo-gold font-display font-bold text-xl leading-none">{userProgress.level}</div>
                     </div>
                     <div className="h-8 w-[1px] bg-slate-700"></div>
                     <IconTrophy className="w-8 h-8 text-geo-gold drop-shadow-lg" />
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden relative shadow-xl hover:border-geo-accent transition-colors cursor-pointer">
                    <img src="https://api.dicebear.com/7.x/bottts/svg?seed=General" alt="Avatar" className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                </div>
            </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="animate-fade-in">
        {view === GameState.MODULE_SELECT && renderModuleSelection()}
        {view === GameState.DASHBOARD && renderDashboard()}
        {view === GameState.LESSON_VIEW && renderLessonView()}
        {view === GameState.QUIZ && renderQuiz()}
      </main>
    </div>
  );
};

export default App;