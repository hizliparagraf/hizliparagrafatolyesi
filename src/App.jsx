import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, BookOpen, TrendingUp, Award, Video, FileText, CheckCircle, Circle, Clock, BarChart3, User, LogOut, Check, X, ChevronRight, ChevronLeft, Home } from 'lucide-react';

const ReadingPlatform = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [isReading, setIsReading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [readingResults, setReadingResults] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [videoProgress, setVideoProgress] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [showVideoNotes, setShowVideoNotes] = useState(false);

  const studentStats = {
    weeklyActivity: [
      { week: 'Hafta 1', completed: 75 },
      { week: 'Hafta 2', completed: 0 },
      { week: 'Hafta 3', completed: 0 },
      { week: 'Hafta 4', completed: 0 }
    ],
    readingSpeedHistory: [
      { date: '1 Kas', speed: 200, test: 'İlk Test' },
      { date: '3 Kas', speed: 225, test: 'Test 2' },
      { date: '5 Kas', speed: 245, test: 'Test 3' },
      { date: '7 Kas', speed: 260, test: 'Test 4' }
    ],
    quizPerformance: {
      totalQuestions: 10,
      correctAnswers: 7,
      accuracy: 70,
      timeSpent: '12 dakika',
      strongTopics: ['Kolay Seviye', 'Orta Seviye'],
      weakTopics: ['Çok Zor Seviye']
    },
    weeklyGoals: {
      videoWatched: true,
      quizCompleted: true,
      speedTest: true,
      eyeExercises: 5,
      homeworkDone: false
    },
    achievements: [
      { name: 'İlk Hız Testi', date: '1 Kas 2024', icon: '🎯' },
      { name: 'İlk Quiz Tamamlandı', date: '3 Kas 2024', icon: '📝' },
      { name: 'Video İzlendi', date: '1 Kas 2024', icon: '🎥' },
      { name: '5 Gün Egzersiz', date: '6 Kas 2024', icon: '💪' }
    ]
  };

  const quizData = [
    {
      id: 1,
      difficulty: "Kolay",
      text: "Düzenli uyku, bedensel ve zihinsel sağlığımız için olmazsa olmazdır. Yeterli uyku almayan kişilerde konsantrasyon bozuklukları, hafıza sorunları ve bağışıklık sisteminde zayıflama görülür. Özellikle gençlerin günde en az 8-9 saat uyuması, beyinlerinin gelişimi açısından kritik önem taşır. Uyku düzenini korumak, akademik başarıyı da doğrudan etkileyen faktörlerden biridir.",
      question: "Bu paragrafın ana fikri aşağıdakilerden hangisidir?",
      options: [
        "Gençlerin günde 8-9 saat uyuması gerekir.",
        "Düzenli uyku, sağlık ve başarı için çok önemlidir.",
        "Uyku bozuklukları hafıza sorunlarına yol açar.",
        "Akademik başarı için uyku şarttır."
      ],
      correctAnswer: 1,
      explanation: "Ana fikir ilk cümlede: 'Düzenli uyku... olmazsa olmazdır.' Diğer cümleler bu fikri destekleyen detaylardır."
    },
    {
      id: 2,
      difficulty: "Kolay",
      text: "Kitap okumak, insanın kelime dağarcığını genişleten en etkili yöntemlerden biridir. Düzenli kitap okuyan çocuklar, akranlarına göre daha fazla kelime bilir ve kendini daha iyi ifade edebilir. Ayrıca okuma, hayal gücünü geliştirerek yaratıcı düşünme becerisini artırır. Farklı türde kitaplar okumak, farklı bakış açıları kazandırır ve empati yeteneğini güçlendirir. Tüm bu nedenlerle kitap okuma alışkanlığı, çocukluk yaşlarında kazandırılması gereken en değerli alışkanlıklardan biridir.",
      question: "Bu paragrafta asıl anlatılmak istenen nedir?",
      options: [
        "Kitap okumak hayal gücünü geliştirir.",
        "Çocuklar farklı türde kitaplar okumalıdır.",
        "Kitap okumak kelime dağarcığını genişletir.",
        "Kitap okuma alışkanlığı çok değerlidir ve erken yaşta kazandırılmalıdır."
      ],
      correctAnswer: 3,
      explanation: "Asıl vurgu son cümlede: 'en değerli alışkanlıklardan biri' ve 'çocukluk yaşlarında kazandırılması gereken'."
    }
  ];

  const testText = "Eğitim, bireyin zihinsel, duygusal ve sosyal gelişimini destekleyen en önemli araçlardan biridir. İyi bir eğitim sistemi, öğrencilerin sadece bilgi edinmesini değil, aynı zamanda eleştirel düşünme, problem çözme ve yaratıcılık becerilerini de geliştirmesini sağlar.";
  const wordCount = testText.split(' ').length;

  useEffect(() => {
    let interval;
    if (isReading && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isReading, startTime]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 100);
    return `${seconds}.${milliseconds}`;
  };

  const startReading = () => {
    setStartTime(Date.now());
    setIsReading(true);
    setShowResult(false);
  };

  const stopReading = () => {
    setIsReading(false);
    const timeInSeconds = elapsedTime / 1000;
    const wpm = Math.round((wordCount / timeInSeconds) * 60);
    const result = {
      date: new Date().toLocaleDateString('tr-TR'),
      time: formatTime(elapsedTime),
      wpm: wpm,
      wordCount: wordCount
    };
    setCurrentResult(result);
    setReadingResults([...readingResults, result]);
    setShowResult(true);
  };

  const resetTest = () => {
    setIsReading(false);
    setStartTime(null);
    setElapsedTime(0);
    setShowResult(false);
    setCurrentResult(null);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    const isCorrect = selectedAnswer === quizData[currentQuestion].correctAnswer;
    setQuizResults([...quizResults, { questionId: quizData[currentQuestion].id, correct: isCorrect }]);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizResults([]);
    setQuizCompleted(false);
  };

  const Logo = () => (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
        <BookOpen className="text-white" size={24} />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-gray-800">Hızlı<span className="text-indigo-600">Paragraf</span></span>
        <span className="text-xs text-gray-500">Atölyesi</span>
      </div>
    </div>
  );

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
          <button onClick={() => { setIsLoggedIn(true); setCurrentPage('dashboard'); }} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Giriş Yap
          </button>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">Okuma Hızını <span className="text-indigo-600">2 Katına</span> Çıkar</h1>
        <p className="text-xl text-gray-600 mb-8">8 haftalık interaktif program</p>
        <button onClick={() => { setIsLoggedIn(true); setCurrentPage('dashboard'); }} className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700">
          Hemen Başla
        </button>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
          <button onClick={() => { setIsLoggedIn(false); setCurrentPage('landing'); }} className="text-red-600">
            <LogOut size={20} />
          </button>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Hoş Geldiniz!</h1>
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <button onClick={() => setCurrentPage('video')} className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-xl shadow-lg hover:shadow-xl transition text-left text-white">
            <Video className="mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Video Ders</h3>
            <p className="opacity-90">Hafta 1 - 25 dakika</p>
          </button>
          <button onClick={() => setCurrentPage('quiz')} className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-left">
            <FileText className="text-purple-600 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Quiz</h3>
            <p className="text-gray-600">10 paragraf</p>
          </button>
          <button onClick={() => setCurrentPage('test')} className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-left">
            <Clock className="text-orange-600 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Hız Testi</h3>
            <p className="text-gray-600">Hızınızı ölçün</p>
          </button>
          <button onClick={() => setCurrentPage('progress')} className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-left">
            <BarChart3 className="text-green-600 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">İlerleme</h3>
            <p className="text-gray-600">İstatistikler</p>
          </button>
        </div>
      </div>
    </div>
  );

  const QuizPage = () => {
    const currentQ = quizData[currentQuestion];
    const correctCount = quizResults.filter(r => r.correct).length;

    if (quizCompleted) {
      return (
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm p-4">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <Logo />
              <button onClick={() => setCurrentPage('dashboard')} className="text-indigo-600 hover:underline">← Dashboard</button>
            </div>
          </nav>
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <Award className="inline-block text-green-600 mb-4" size={64} />
              <h1 className="text-3xl font-bold mb-4">Tebrikler! Quiz Tamamlandı</h1>
              <div className="grid md:grid-cols-3 gap-4 my-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-gray-600 mb-2">Toplam Soru</div>
                  <div className="text-4xl font-bold">{quizData.length}</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="text-gray-600 mb-2">Doğru</div>
                  <div className="text-4xl font-bold text-green-600">{correctCount}</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-gray-600 mb-2">Başarı</div>
                  <div className="text-4xl font-bold text-indigo-600">%{Math.round((correctCount/quizData.length)*100)}</div>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <button onClick={resetQuiz} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">Tekrar Dene</button>
                <button onClick={() => setCurrentPage('dashboard')} className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700">Dashboard'a Dön</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Logo />
            <button onClick={() => setCurrentPage('dashboard')} className="text-indigo-600 hover:underline">← Dashboard</button>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Ana Fikir Bulma</h2>
                <p className="text-gray-600">Soru {currentQuestion + 1} / {quizData.length}</p>
              </div>
              <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                currentQ.difficulty === 'Kolay' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {currentQ.difficulty}
              </span>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded">
              <p className="text-gray-800 leading-relaxed text-lg">{currentQ.text}</p>
            </div>
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">{currentQ.question}</h3>
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === currentQ.correctAnswer;
                  const showStatus = showExplanation;
                  let bgColor = 'bg-white hover:bg-gray-50';
                  let borderColor = 'border-gray-300';
                  let icon = null;
                  if (showStatus) {
                    if (isCorrect) {
                      bgColor = 'bg-green-50';
                      borderColor = 'border-green-500';
                      icon = <Check className="text-green-600" size={20} />;
                    } else if (isSelected && !isCorrect) {
                      bgColor = 'bg-red-50';
                      borderColor = 'border-red-500';
                      icon = <X className="text-red-600" size={20} />;
                    }
                  } else if (isSelected) {
                    bgColor = 'bg-indigo-50';
                    borderColor = 'border-indigo-500';
                  }
                  return (
                    <button key={idx} onClick={() => handleAnswerSelect(idx)} disabled={showExplanation} className={`w-full text-left p-4 border-2 ${borderColor} ${bgColor} rounded-lg transition flex items-center justify-between`}>
                      <span className="text-gray-800">{String.fromCharCode(65 + idx)}) {option}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>
            </div>
            {showExplanation && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6 rounded">
                <h4 className="font-bold text-gray-900 mb-2">Açıklama:</h4>
                <p className="text-gray-700">{currentQ.explanation}</p>
              </div>
            )}
            <div className="flex justify-between">
              <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                <Home size={20} />Ana Sayfa
              </button>
              <div className="flex gap-3">
                {!showExplanation ? (
                  <button onClick={handleCheckAnswer} disabled={selectedAnswer === null} className={`px-8 py-3 rounded-lg font-semibold ${selectedAnswer === null ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                    Cevabı Kontrol Et
                  </button>
                ) : (
                  <button onClick={handleNextQuestion} className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                    {currentQuestion < quizData.length - 1 ? 'Sonraki Soru' : 'Sonuçları Gör'}
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isLoggedIn && currentPage === 'landing') return <LandingPage />;
  if (currentPage === 'quiz') return <QuizPage />;
  if (currentPage === 'test') {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Logo />
            <button onClick={() => setCurrentPage('dashboard')} className="text-indigo-600 hover:underline">← Dashboard</button>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6">Okuma Hızı Testi</h1>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-4 bg-gray-100 px-8 py-4 rounded-lg">
                <Clock className="text-indigo-600" size={32} />
                <div className="text-4xl font-bold">{formatTime(elapsedTime)}</div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg mb-8">
              <p className="text-lg leading-relaxed">{testText}</p>
            </div>
            <div className="flex gap-4 justify-center">
              {!isReading && !showResult && (
                <button onClick={startReading} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700">
                  <Play size={24} />Teste Başla
                </button>
              )}
              {isReading && (
                <button onClick={stopReading} className="flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700">
                  <Pause size={24} />Testi Bitir
                </button>
              )}
              {(isReading || showResult) && (
                <button onClick={resetTest} className="flex items-center gap-2 bg-gray-600 text-white px-6 py-4 rounded-lg hover:bg-gray-700">
                  <RotateCcw size={20} />Sıfırla
                </button>
              )}
            </div>
            {showResult && currentResult && (
              <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                <Award className="inline-block text-green-600 mb-4" size={64} />
                <h2 className="text-2xl font-bold mb-4">Test Tamamlandı!</h2>
                <div className="text-5xl font-bold text-indigo-600 mb-2">{currentResult.wpm}</div>
                <div className="text-gray-600">kelime/dakika</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  return <Dashboard />;
};

export default ReadingPlatform;
