import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, BookOpen, TrendingUp, Award, Video, FileText, CheckCircle, Circle, Clock, BarChart3, User, LogOut, Check, X, ChevronRight, ChevronLeft, Home } from 'lucide-react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

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
// Auth states
  const [user, setUser] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
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
    },
    {
      id: 3,
      difficulty: "Orta",
      text: "İnsan beyni, öğrenme kapasitesi en yüksek organ olmasına rağmen, sürekli tekrar olmadan öğrendiklerini unutabilir. Nörologlar, öğrenilen bir bilginin kalıcı hale gelmesi için en az 6-7 kez tekrar edilmesi gerektiğini söyler. Tekrar, öğrenmenin anahtarıdır ve bilgilerin uzun süreli belleğe yerleşmesini sağlar. Öğrenciler ders çalışırken sadece bir kez okumakla yetinmemeli, düzenli aralıklarla konuları gözden geçirmelidir.",
      question: "Bu parçada anlatılmak istenen temel düşünce nedir?",
      options: [
        "İnsan beyni öğrenme kapasitesi en yüksek organdır.",
        "Bilgilerin kalıcı olması için tekrar şarttır.",
        "Öğrenciler düzenli çalışmalıdır.",
        "Beyin kaslar gibi egzersizle güçlenir."
      ],
      correctAnswer: 1,
      explanation: "Ana fikir ortadaki cümlede: 'Tekrar, öğrenmenin anahtarıdır...'. İlk cümle giriş, sonrakiler örnektir."
    },
    {
      id: 4,
      difficulty: "Orta",
      text: "Yapılan araştırmalar, fiziksel aktivitenin sadece bedensel sağlığı değil, zihinsel sağlığı da olumlu etkilediğini gösteriyor. Düzenli egzersiz yapan kişilerde stres hormonu kortizolün seviyesi düşüyor ve mutluluk hormonu endorfin salgılanıyor. Özellikle açık havada yapılan aktiviteler, bireylerin ruh halini iyileştirerek depresyon riskini azaltıyor. Ayrıca spor, konsantrasyonu artırıyor ve bilişsel fonksiyonları geliştiriyor. Tüm bu veriler gösteriyor ki spor, yalnızca fiziksel değil, ruhsal bir ihtiyaçtır.",
      question: "Paragrafın ana fikrini veren cümle hangisidir?",
      options: [
        "İlk cümle",
        "İkinci cümle",
        "Dördüncü cümle",
        "Son cümle"
      ],
      correctAnswer: 3,
      explanation: "Yazar önce detayları sıralıyor, sonunda ana fikri özetliyor: 'spor... ruhsal bir ihtiyaçtır'."
    },
    {
      id: 5,
      difficulty: "Orta",
      text: "Teknolojinin eğitime entegrasyonu, öğrenme süreçlerini köklü bir şekilde değiştirmiştir. Geleneksel sınıf ortamlarında öğretmen merkezli olan eğitim, dijital araçlarla birlikte öğrenci merkezli hale gelmiştir. Tablet ve akıllı tahtalar sayesinde dersler daha interaktif ve eğlenceli hale gelmiş, öğrencilerin ilgisi artmıştır. Online eğitim platformları, öğrencilere kendi hızlarında öğrenme imkanı sunarak bireysel farklılıkları dikkate almaktadır.",
      question: "Bu paragrafta vurgulanan ana düşünce nedir?",
      options: [
        "Eğitimde teknoloji kullanımı dikkatli olmalıdır.",
        "Teknoloji, eğitimi öğrenci merkezli hale getirmiştir.",
        "Teknoloji eğitim süreçlerini köklü şekilde değiştirmiştir.",
        "Online platformlar bireysel farklılıkları dikkate alır."
      ],
      correctAnswer: 2,
      explanation: "İlk cümle ana fikri veriyor: 'köklü bir şekilde değiştirmiştir'. Sonrakiler nasıl değiştirdiğini açıklıyor."
    },
    {
      id: 6,
      difficulty: "Zor",
      text: "Sosyal medya platformları, milyarlarca insanı bir araya getirerek iletişimi kolaylaştırmıştır. İnsanlar dünyanın her yerinden haber alabilir, arkadaşlarıyla anında iletişime geçebilir ve fikirlerini özgürce paylaşabilirler. Ancak bu platformlarda geçirilen aşırı zaman, gerçek hayattaki ilişkileri zayıflatmakta, yüz yüze iletişim becerilerini olumsuz etkilemektedir. Özellikle gençler arasında beğeni odaklı yaşam tarzı, özgüven eksikliği ve karşılaştırma sendromu yaygınlaşmıştır. Bilim insanları, sosyal medya kullanımının kontrollü ve bilinçli yapılması gerektiğini vurgulamaktadır.",
      question: "Bu paragrafın temel iletisi nedir?",
      options: [
        "Sosyal medya iletişimi kolaylaştırır.",
        "Gençler sosyal medyada çok vakit geçiriyor.",
        "Sosyal medyanın olumlu ve olumsuz yanları vardır, bilinçli kullanılmalıdır.",
        "Sosyal medya özgüven sorunlarına yol açar."
      ],
      correctAnswer: 2,
      explanation: "Paragrafta hem olumlu hem olumsuz yönler anlatılıyor ve sonuçta 'kontrollü kullanım' önerisi yapılıyor."
    },
    {
      id: 7,
      difficulty: "Zor",
      text: "Antik çağlardan bu yana insanlar, yıldızlara bakarak yön bulmuş, takvim oluşturmuş ve gelecekle ilgili tahminlerde bulunmuştur. Astronomi bilimi, evreni anlama çabasının ürünüdür. İnsanoğlu, evrendeki yerini anlamak ve bilinmeyene dair merakını gidermek için sürekli gökyüzüne bakmış, sorular sormuştur. Galileo'nun teleskopu icat etmesiyle başlayan modern astronomi, bugün uzay teleskopları ve Mars'a gönderilen araçlarla devam etmektedir.",
      question: "Paragrafın ana fikri hangisidir?",
      options: [
        "İnsanlar antik çağdan beri astronomiyle ilgilenir.",
        "İnsan, merak duygusuyla evreni anlamaya çalışır.",
        "Modern astronomi Galileo ile başlamıştır.",
        "Uzay keşfi insanlık için önemlidir."
      ],
      correctAnswer: 1,
      explanation: "Ana fikir: 'evrendeki yerini anlamak ve merakını gidermek'. İlk ve son cümleler bu fikri destekler."
    },
    {
      id: 8,
      difficulty: "Zor",
      text: "Ormanlar, sadece ağaçlardan ibaret değildir; binlerce canlı türünün yaşam alanıdır. Ağaçlar oksijen üretir, havayı temizler ve iklimi dengeler. Orman toprağı su tutar, seller önler ve toprak erozyonunu engeller. Hayvanlar için barınak, besin kaynağı ve üreme alanı sağlar. İnsanlar için odun, meyve ve şifalı bitkiler sunar. Bu kadar çok işleve sahip ormanları korumak, aslında kendi geleceğimizi korumak demektir.",
      question: "Yazarın bu paragrafta vurgulamak istediği asıl düşünce nedir?",
      options: [
        "Ormanlar binlerce canlı türüne ev sahipliği yapar.",
        "Ağaçlar oksijen üretir ve havayı temizler.",
        "Ormanları korumak, geleceğimizi korumaktır.",
        "Ormanlar insanlara birçok fayda sağlar."
      ],
      correctAnswer: 2,
      explanation: "Yazar önce ormanların faydalarını sıralıyor, sonunda asıl mesajını veriyor: 'korumak... geleceğimizi korumak'."
    },
    {
      id: 9,
      difficulty: "Çok Zor",
      text: "Eleştirel düşünme, bir bilgiyi sorgusuz kabul etmek yerine, onu analiz etme ve değerlendirme yeteneğidir. Günümüzde yanlış bilginin hızla yayıldığı dijital ortamda, gördüğümüz her habere inanmak büyük yanılgılara yol açabilir. Bir bilginin doğruluğunu sorgulamak, kaynaklarını araştırmak ve farklı bakış açılarını değerlendirmek, bilinçli bir birey olmanın gereğidir.",
      question: "Bu paragrafın temel mesajı nedir?",
      options: [
        "Dijital ortamda yanlış bilgi çok yaygındır.",
        "Eleştirel düşünme becerisi günümüzde çok önemlidir.",
        "Okullar öğrencilere düşünmeyi öğretmelidir.",
        "Gelecekte başarı için çok bilgi gerekir."
      ],
      correctAnswer: 1,
      explanation: "Ana fikir ilk cümlede tanımlanıyor ve tüm paragraf 'neden önemli' açıklıyor."
    },
    {
      id: 10,
      difficulty: "Çok Zor",
      text: "İklim değişikliği, dünyamızın karşı karşıya olduğu en büyük tehditlerin başında gelir. Buzullar eriyor, deniz seviyeleri yükseliyor ve aşırı hava olayları sıklaşıyor. Bilim insanları onlarca yıldır uyarılarda bulunmasına rağmen, küresel ölçekte yeterli önlem alınmamıştır. Fosil yakıt kullanımı azaltılmalı, yenilenebilir enerji kaynaklarına geçilmeli ve orman tahribatı durdurulmalıdır.",
      question: "Bu paragrafın ana fikri en iyi hangisiyle ifade edilir?",
      options: [
        "İklim değişikliği dünyanın en büyük sorunudur.",
        "Bilim insanları yıllardır uyarı yapıyor ama dinlenmiyor.",
        "İklim krizine karşı hem küresel politikalar hem bireysel çabalar gereklidir.",
        "Bireysel küçük adımlar büyük fark yaratabilir."
      ],
      correctAnswer: 2,
      explanation: "Paragraf sorun + çözüm yapısında. Ana fikir sadece sorunu değil, çözümü de içermeli."
    }
  ];

  const testText = `Eğitim, bireyin zihinsel, duygusal ve sosyal gelişimini destekleyen en önemli araçlardan biridir. İyi bir eğitim sistemi, öğrencilerin sadece bilgi edinmesini değil, aynı zamanda eleştirel düşünme, problem çözme ve yaratıcılık becerilerini de geliştirmesini sağlar. Günümüz dünyasında hızla değişen teknoloji ve iş dünyası koşulları, eğitim sistemlerinin de sürekli yenilenmesini gerektirmektedir. Öğrencilere 21. yüzyıl becerileri kazandırılması, onların gelecekte başarılı bireyler olması için kritik öneme sahiptir.`;
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

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        if (currentPage !== 'landing' && currentPage !== 'auth') {
          setCurrentPage('landing');
        }
      }
    });
    return () => unsubscribe();
  }, []);
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
// Kayıt fonksiyonu
  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      setAuthEmail('');
      setAuthPassword('');
      setCurrentPage('dashboard');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setAuthError('Bu email adresi zaten kullanılıyor.');
      } else if (error.code === 'auth/weak-password') {
        setAuthError('Şifre en az 6 karakter olmalıdır.');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('Geçersiz email adresi.');
      } else {
        setAuthError('Kayıt sırasında bir hata oluştu: ' + error.message);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Giriş fonksiyonu
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      setAuthEmail('');
      setAuthPassword('');
      setCurrentPage('dashboard');
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setAuthError('Email veya şifre hatalı.');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('Geçersiz email adresi.');
      } else {
        setAuthError('Giriş sırasında bir hata oluştu: ' + error.message);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Çıkış fonksiyonu
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage('landing');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
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
          <button 
            onClick={() => setCurrentPage('auth')} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Giriş Yap / Kayıt Ol
          </button>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Okuma Hızını <span className="text-indigo-600">2 Katına</span> Çıkar
        </h1>
        <p className="text-xl text-gray-600 mb-8">8 haftalık interaktif program</p>
        <button 
          onClick={() => setCurrentPage('auth')} 
          className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700"
        >
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
          <button onClick={() => { setIsLoggedIn(false); setCurrentPage('landing'); }} className="text-red-600 hover:text-red-700">
            <LogOut size={20} />
          </button>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Hoş Geldiniz!</h1>
        <div className="grid md:grid-cols-4 gap-6">
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
                currentQ.difficulty === 'Kolay' ? 'bg-green-100 text-green-700' : 
                currentQ.difficulty === 'Orta' ? 'bg-orange-100 text-orange-700' :
                currentQ.difficulty === 'Zor' ? 'bg-red-100 text-red-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {currentQ.difficulty}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
              <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{width: `${((currentQuestion + 1) / quizData.length) * 100}%`}}></div>
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
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 border-2 ${borderColor} ${bgColor} rounded-lg transition flex items-center justify-between`}
                >
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
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <Home size={20} />
            Ana Sayfa
          </button>
          <div className="flex gap-3">
            {!showExplanation ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
                className={`px-8 py-3 rounded-lg font-semibold ${
                  selectedAnswer === null
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Cevabı Kontrol Et
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                {currentQuestion < quizData.length - 1 ? 'Sonraki Soru' : 'Sonuçları Gör'}
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);};
const VideoPage = () => (
<div className="min-h-screen bg-gray-50">
<nav className="bg-white shadow-sm p-4">
<div className="max-w-7xl mx-auto flex justify-between items-center">
<Logo />
<button onClick={() => setCurrentPage('dashboard')} className="text-indigo-600 hover:underline flex items-center gap-2">
<Home size={20} />
Dashboard
</button>
</div>
</nav>
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
            Hafta 1
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} />
            25 dakika
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Temeller ve Farkındalık</h1>
        <p className="opacity-90">Hızlı okuma yolculuğunuzun ilk adımı</p>
      </div>

      <div className="relative bg-black aspect-video">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <Video size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-4">Video Player</p>
            <p className="text-sm opacity-75 mb-4">Gerçek videolar yüklendikinde burada görünecek</p>
            <button 
              onClick={() => {
                setVideoProgress(100);
                setVideoCompleted(true);
              }}
              className="bg-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Demo: Videoyu Tamamlandı Say
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">İzleme İlerlemesi</span>
          <span className="text-sm font-bold text-indigo-600">{videoProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${videoProgress}%` }}
          ></div>
        </div>
        {videoCompleted && (
          <div className="mt-4 flex items-center gap-2 text-green-600">
            <CheckCircle size={20} />
            <span className="font-medium">Video tamamlandı! 🎉</span>
          </div>
        )}
      </div>

      <div className="border-b">
        <div className="flex">
          <button 
            onClick={() => setShowVideoNotes(false)}
            className={`px-6 py-3 font-medium border-b-2 transition ${
              !showVideoNotes 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Genel Bakış
          </button>
          <button 
            onClick={() => setShowVideoNotes(true)}
            className={`px-6 py-3 font-medium border-b-2 transition ${
              showVideoNotes 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Ders Notları
          </button>
        </div>
      </div>

      <div className="p-6">
        {!showVideoNotes ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Bu Derste Neler Öğreneceksiniz?</h3>
              <ul className="space-y-2">
                {[
                  "Okuma Hızı Testi - Teori ve Uygulama",
                  "Yavaş Okuma Nedenleri",
                  "Göz Hareketleri Egzersizleri",
                  "Paragraf Yapısı",
                  "Ana Fikir Bulma Teknikleri"
                ].map((topic, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 text-sm font-bold">{idx + 1}</span>
                    </div>
                    <span className="text-gray-700">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Hafta 1 - Detaylı Ders Notları</h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="font-semibold text-blue-900 mb-2">📝 Not Alma İpucu</p>
              <p className="text-blue-800 text-sm">
                Bu notları yazdırıp yanınızda bulundurabilir, önemli yerlerin altını çizebilirsiniz.
              </p>
            </div>
            <h4 className="text-lg font-bold mt-6 mb-3">1. Okuma Hızı Nasıl Ölçülür?</h4>
            <p className="text-gray-700 mb-4">
              Okuma hızınızı ölçmek için basit bir formül kullanıyoruz:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-center">
              (Kelime Sayısı ÷ Okuma Süresi (saniye)) × 60 = Kelime/Dakika
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</div>);
const ProgressPage = () => {
const initialSpeed = studentStats.readingSpeedHistory[0].speed;
const currentSpeed = studentStats.readingSpeedHistory[studentStats.readingSpeedHistory.length - 1].speed;
const improvement = currentSpeed - initialSpeed;
const improvementPercent = Math.round((improvement / initialSpeed) * 100);
  return (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-white shadow-sm p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Logo />
        <button onClick={() => setCurrentPage('dashboard')} className="text-indigo-600 hover:underline flex items-center gap-2">
          <Home size={20} />
          Dashboard
        </button>
      </div>
    </nav>

    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">İlerleme & İstatistikler</h1>
        <p className="text-gray-600">Gelişiminizi takip edin</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-indigo-100">Mevcut Hız</span>
            <TrendingUp size={24} />
          </div>
          <div className="text-4xl font-bold mb-1">{currentSpeed}</div>
          <div className="text-indigo-100 text-sm">kelime/dakika</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100">Gelişim</span>
            <Award size={24} />
          </div>
          <div className="text-4xl font-bold mb-1">+{improvement}</div>
          <div className="text-green-100 text-sm">kelime ({improvementPercent}% artış)</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100">Quiz Başarısı</span>
            <CheckCircle size={24} />
          </div>
          <div className="text-4xl font-bold mb-1">%{studentStats.quizPerformance.accuracy}</div>
          <div className="text-purple-100 text-sm">{studentStats.quizPerformance.correctAnswers}/{studentStats.quizPerformance.totalQuestions} doğru</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-100">Toplam Test</span>
            <BarChart3 size={24} />
          </div>
          <div className="text-4xl font-bold mb-1">{studentStats.readingSpeedHistory.length}</div>
          <div className="text-orange-100 text-sm">hız testi</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="text-indigo-600" />
          Okuma Hızı Gelişimi
        </h2>
        
        <div className="space-y-4">
          {studentStats.readingSpeedHistory.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item.test}</span>
                <span className="text-sm font-bold text-indigo-600">{item.speed} kelime/dk</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16">{item.date}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-1000"
                    style={{ width: `${(item.speed / 400) * 100}%` }}
                  >
                    <span className="text-white text-xs font-bold">{item.speed}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Hedef: 400 kelime/dakika</span>
            <span className="text-sm font-bold text-gray-900">{Math.round((currentSpeed/400)*100)}% tamamlandı</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${(currentSpeed/400)*100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);};
if (!isLoggedIn && currentPage === 'landing') return <LandingPage />;
if (currentPage === 'quiz') return <QuizPage />;
if (currentPage === 'video') return <VideoPage />;
if (currentPage === 'progress') return <ProgressPage />;
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
