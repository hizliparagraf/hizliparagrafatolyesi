Tabii! İşte düzeltilmiş `App.jsx` dosyasının tam hali:
Action: file_editor view /app/repo/src/App.jsx
Observation: /app/repo/src/App.jsx:
1|import React, { useState, useEffect, useCallback, useMemo } from 'react';
2|import { Play, Pause, RotateCcw, BookOpen, TrendingUp, Award, Video, FileText, CheckCircle, Circle, Clock, BarChart3, User, LogOut, Check, X, ChevronRight, ChevronLeft, Home } from 'lucide-react';
3|import { auth, db } from './firebase';
4|import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
5|import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
6|
7|// =================================================================
8|// HELPER FONKSİYONLAR
9|// =================================================================
10|
11|// Zaman formatlama
12|const formatTime = (ms) => {
13|  const seconds = Math.floor(ms / 1000);
14|  const milliseconds = Math.floor((ms % 1000) / 100);
15|  return `${seconds}.${milliseconds}`;
16|};
17|
18|// Quiz istatistiklerini hesaplama
19|const calculateQuizStats = (results, quizData) => {
20|  const totalQuestions = quizData.length;
21|  const correctAnswers = results.filter(r => r.correct).length;
22|  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
23|  
24|  return {
25|    totalQuestions,
26|    correctAnswers,
27|    accuracy,
28|    timeSpent: 'N/A', // Zaman takibi eklenmediği için N/A
29|    strongTopics: [],
30|    weakTopics: []
31|  };
32|};
33|
34|// Logo Component
35|const Logo = () => (
36|  <div className="flex items-center gap-2">
37|    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
38|      <BookOpen className="text-white" size={24} />
39|    </div>
40|    <div className="flex flex-col">
41|      <span className="text-xl font-bold text-gray-800">Hızlı<span className="text-indigo-600">Paragraf</span></span>
42|      <span className="text-xs text-gray-500">Atölyesi</span>
43|    </div>
44|  </div>
45|);
46|
47|// Quiz Data (Kısaltılmış)
48|const quizData = [
49|  {
50|    id: 1,
51|    difficulty: "Kolay",
52|    text: "Düzenli uyku, bedensel ve zihinsel sağlığımız için olmazsa olmazdır. Yeterli uyku almayan kişilerde konsantrasyon bozuklukları, hafıza sorunları ve bağışıklık sisteminde zayıflama görülür. Özellikle gençlerin günde en az 8-9 saat uyuması, beyinlerinin gelişimi açısından kritik önem taşır. Uyku düzenini korumak, akademik başarıyı da doğrudan etkileyen faktörlerden biridir.",
53|    question: "Bu paragrafın ana fikri aşağıdakilerden hangisidir?",
54|    options: [
55|      "Gençlerin günde 8-9 saat uyuması gerekir.",
56|      "Düzenli uyku, sağlık ve başarı için çok önemlidir.",
57|      "Uyku bozuklukları hafıza sorunlarına yol açar.",
58|      "Akademik başarı için uyku şarttır."
59|    ],
60|    correctAnswer: 1,
61|    explanation: "Ana fikir ilk cümlede: 'Düzenli uyku... olmazsa olmazdır.' Diğer cümleler bu fikri destekleyen detaylardır."
62|  },
63|  {
64|    id: 2,
65|    difficulty: "Kolay",
66|    text: "Kitap okumak, insanın kelime dağarcığını genişleten en etkili yöntemlerden biridir. Düzenli kitap okuyan çocuklar, akranlarına göre daha fazla kelime bilir ve kendini daha iyi ifade edebilir. Ayrıca okuma, hayal gücünü geliştirerek yaratıcı düşünme becerisini artırır. Farklı türde kitaplar okumak, farklı bakış açıları kazandırır ve empati yeteneğini güçlendirir. Tüm bu nedenlerle kitap okuma alışkanlığı, çocukluk yaşlarında kazandırılması gereken en değerli alışkanlıklardan biridir.",
67|    question: "Bu paragrafta asıl anlatılmak istenen nedir?",
68|    options: [
69|      "Kitap okumak hayal gücünü geliştirir.",
70|      "Çocuklar farklı türde kitaplar okumalıdır.",
71|      "Kitap okumak kelime dağarcığını genişletir.",
72|      "Kitap okuma alışkanlığı çok değerlidir ve erken yaşta kazandırılmalıdır."
73|    ],
74|    correctAnswer: 3,
75|    explanation: "Asıl vurgu son cümlede: 'en değerli alışkanlıklardan biri' ve 'çocukluk yaşlarında kazandırılması gereken'."
76|  },
77|  // ... (Diğer quiz verileri buraya eklenecek)
78|];
79|
80|// Test Metni
81|const testText = `Eğitim, bireyin zihinsel, duygusal ve sosyal gelişimini destekleyen en önemli araçlardan biridir. İyi bir eğitim sistemi, öğrencilerin sadece bilgi edinmesini değil, aynı zamanda eleştirel düşünme, problem çözme ve yaratıcılık becerilerini de geliştirmesini sağlar. Günümüz dünyasında hızla değişen teknoloji ve iş dünyası koşulları, eğitim sistemlerinin de sürekli yenilenmesini gerektirmektedir. Öğrencilere 21. yüzyıl becerileri kazandırılması, onların gelecekte başarılı bireyler olması için kritik öneme sahiptir.`;
82|const wordCount = testText.split(' ').length;
83|
84|
85|const ReadingPlatform = () => {
86|  const [currentPage, setCurrentPage] = useState('landing');
87|  const [isLoggedIn, setIsLoggedIn] = useState(false);
88|  
89|  // Reading Test States
90|  const [isReading, setIsReading] = useState(false);
91|  const [startTime, setStartTime] = useState(null);
92|  const [elapsedTime, setElapsedTime] = useState(0);
93|  const [showResult, setShowResult] = useState(false);
94|  const [currentResult, setCurrentResult] = useState(null);
95|
96|  // Quiz States
97|  const [currentQuestion, setCurrentQuestion] = useState(0);
98|  const [selectedAnswer, setSelectedAnswer] = useState(null);
99|  const [showExplanation, setShowExplanation] = useState(false);
100|  const [quizResults, setQuizResults] = useState([]);
101|  const [quizCompleted, setQuizCompleted] = useState(false);
102|
103|  // Video States
104|  const [videoProgress, setVideoProgress] = useState(0);
105|  const [videoCompleted, setVideoCompleted] = useState(false);
106|  const [showVideoNotes, setShowVideoNotes] = useState(false);
107|
108|  // Auth States
109|  const [user, setUser] = useState(null);
110|  const [authEmail, setAuthEmail] = useState('');
111|  const [authPassword, setAuthPassword] = useState('');
112|  const [authError, setAuthError] = useState('');
113|  const [authLoading, setAuthLoading] = useState(false);
114|  
115|  // User Stats States
116|  const [userStats, setUserStats] = useState(null);
117|  const [statsLoading, setStatsLoading] = useState(true);
118|
119|  // =================================================================
120|  // FIREBASE VE VERİ YÖNETİMİ
121|  // =================================================================
122|
123|  // Veri kaydetme fonksiyonu - userStats'ı bağımlılık olarak almadan güncelleyen versiyon
124|  const saveUserStats = useCallback(async (newStats) => {
125|    if (user) {
126|      try {
127|        const userRef = doc(db, 'users', user.uid);
128|        
129|        // Firestore'dan güncel veriyi çek
130|        const userSnap = await getDoc(userRef);
131|        const currentStats = userSnap.exists() ? userSnap.data() : {};
132|
133|        // Yeni veriyi mevcut veriye ekle
134|        const updatedData = { ...currentStats };
135|
136|        // readingSpeedHistory'yi güncelle
137|        if (newStats.readingSpeedHistory) {
138|            updatedData.readingSpeedHistory = [...(currentStats.readingSpeedHistory || []), ...newStats.readingSpeedHistory];
139|            delete newStats.readingSpeedHistory;
140|        }
141|
142|        // quizResults'ı güncelle
143|        if (newStats.quizResults) {
144|            updatedData.quizResults = [...(currentStats.quizResults || []), ...newStats.quizResults];
145|            delete newStats.quizResults;
146|        }
147|
148|        // Diğer verileri merge et
149|        Object.assign(updatedData, newStats);
150|        
151|        await setDoc(userRef, updatedData, { merge: true });
152|        
153|        // State'i güncellemek için fonksiyonel form kullan
154|        setUserStats(prevStats => {
155|            // Önceki state'i al
156|            let newStatsState = { ...prevStats };
157|
158|            // readingSpeedHistory'yi güncelle
159|            if (newStats.readingSpeedHistory) {
160|                newStatsState.readingSpeedHistory = [...(prevStats?.readingSpeedHistory || []), ...newStats.readingSpeedHistory];
161|            }
162|
163|            // quizResults'ı güncelle
164|            if (newStats.quizResults) {
165|                newStatsState.quizResults = [...(prevStats?.quizResults || []), ...newStats.quizResults];
166|            }
167|
168|            // Diğer verileri merge et
169|            Object.assign(newStatsState, newStats);
170|
171|            return newStatsState;
172|        });
173|
174|      } catch (error) {
175|        console.error('❌ Veri kaydetme hatası:', error);
176|      }
177|    }
178|  }, [user, db]); // db bağımlılığı eklendi
179|
180|  // Kullanıcı verilerini yükle
181|  useEffect(() => {
182|    let isMounted = true;
183|    let timeoutId;
184|
185|    const loadUserStats = async () => {
186|      if (user) {
187|        setStatsLoading(true);
188|        
189|        // 10 saniye timeout ekle - yükleme çok uzun sürerse durdur
190|        timeoutId = setTimeout(() => {
191|          if (isMounted) {
192|            console.warn('Veri yükleme zaman aşımı - varsayılan verilerle devam ediliyor');
193|            setStatsLoading(false);
194|            // Varsayılan veriler
195|            const defaultStats = {
196|              readingSpeedHistory: [],
197|              quizResults: [],
198|              weeklyActivity: [
199|                { week: 'Hafta 1', completed: 0 },
200|                { week: 'Hafta 2', completed: 0 },
201|                { week: 'Hafta 3', completed: 0 },
202|                { week: 'Hafta 4', completed: 0 }
203|              ],
204|              weeklyGoals: {
205|                videoWatched: false,
206|                quizCompleted: false,
207|                speedTest: false,
208|                eyeExercises: 0,
209|                homeworkDone: false
210|              },
211|              achievements: []
212|            };
213|            setUserStats(defaultStats);
214|          }
215|        }, 10000); // 10 saniye timeout
216|        
217|        try {
218|          const userRef = doc(db, 'users', user.uid);
219|          const userSnap = await getDoc(userRef);
220|          
221|          if (!isMounted) return;
222|          
223|          if (userSnap.exists()) {
224|            setUserStats(userSnap.data());
225|          } else {
226|            const defaultStats = {
227|              readingSpeedHistory: [],
228|              quizResults: [],
229|              weeklyActivity: [
230|                { week: 'Hafta 1', completed: 0 },
231|                { week: 'Hafta 2', completed: 0 },
232|                { week: 'Hafta 3', completed: 0 },
233|                { week: 'Hafta 4', completed: 0 }
234|              ],
235|              weeklyGoals: {
236|                videoWatched: false,
237|                quizCompleted: false,
238|                speedTest: false,
239|                eyeExercises: 0,
240|                homeworkDone: false
241|              },
242|              achievements: []
243|            };
244|            await setDoc(userRef, defaultStats);
245|            setUserStats(defaultStats);
246|          }
247|        } catch (error) {
248|          console.error('Veri yükleme hatası:', error);
249|          // Hata durumunda varsayılan verilerle devam et
250|          const defaultStats = {
251|            readingSpeedHistory: [],
252|            quizResults: [],
253|            weeklyActivity: [
254|              { week: 'Hafta 1', completed: 0 },
255|              { week: 'Hafta 2', completed: 0 },
256|              { week: 'Hafta 3', completed: 0 },
257|              { week: 'Hafta 4', completed: 0 }
258|            ],
259|            weeklyGoals: {
260|              videoWatched: false,
261|              quizCompleted: false,
262|              speedTest: false,
263|              eyeExercises: 0,
264|              homeworkDone: false
265|            },
266|            achievements: []
267|          };
268|          setUserStats(defaultStats);
269|        } finally {
270|          // Timeout'u temizle
271|          if (timeoutId) clearTimeout(timeoutId);
272|          // Bu satırın her zaman çalışması, sonsuz yüklenmeyi önler
273|          if (isMounted) {
274|            setStatsLoading(false);
275|          }
276|        }
277|      } else {
278|        setUserStats(null);
279|        setStatsLoading(false);
280|      }
281|    };
282|
283|    // user değiştiğinde veya db değiştiğinde çalışır
284|    if (user && db) {
285|        loadUserStats();
286|    } else if (!user) {
287|        // Kullanıcı çıkış yaptığında veya henüz giriş yapmadığında yüklemeyi bitir
288|        setStatsLoading(false);
289|    }
290|    
291|    // Cleanup function
292|    return () => {
293|      isMounted = false;
294|      if (timeoutId) clearTimeout(timeoutId);
295|    };
296|  }, [user, db]);
297|
298|  // Auth listener
299|  useEffect(() => {
300|    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
301|      setUser(currentUser);
302|      if (currentUser) {
303|        setIsLoggedIn(true);
304|        // Kullanıcı giriş yaptıysa ve hala landing/auth sayfasındaysa dashboard'a yönlendir
305|        if (currentPage === 'landing' || currentPage === 'auth') {
306|          setCurrentPage('dashboard');
307|        }
308|      } else {
309|        setIsLoggedIn(false);
310|        if (currentPage !== 'landing' && currentPage !== 'auth') {
311|          setCurrentPage('landing');
312|        }
313|      }
314|    });
315|    return () => unsubscribe();
316|  }, [currentPage]);
317|
318|  // Reading Timer
319|  useEffect(() => {
320|    let interval;
321|    if (isReading && startTime) {
322|      interval = setInterval(() => {
323|        setElapsedTime(Date.now() - startTime);
324|      }, 100);
325|    }
326|    return () => clearInterval(interval);
327|  }, [isReading, startTime]);
328|
329|  // =================================================================
330|  // HANDLERS
331|  // =================================================================
332|
333|  const startReading = () => {
334|    setStartTime(Date.now());
335|    setIsReading(true);
336|    setShowResult(false);
337|  };
338|
339|  const stopReading = () => {
340|    setIsReading(false);
341|    const timeInSeconds = elapsedTime / 1000;
342|    const wpm = Math.round((wordCount / timeInSeconds) * 60);
343|    const result = {
344|      date: new Date().toISOString(),
345|      time: formatTime(elapsedTime),
346|      wpm: wpm,
347|      wordCount: wordCount
348|    };
349|    setCurrentResult(result);
350|    
351|    // Hız testi sonucunu kaydet
352|    saveUserStats({
353|      readingSpeedHistory: [result] // Sadece yeni sonucu gönder
354|    });
355|    setShowResult(true);
356|  };
357|
358|  const resetTest = () => {
359|    setIsReading(false);
360|    setStartTime(null);
361|    setElapsedTime(0);
362|    setShowResult(false);
363|    setCurrentResult(null);
364|  };
365|
366|  const handleAnswerSelect = (answerIndex) => {
367|    if (showExplanation) return;
368|    setSelectedAnswer(answerIndex);
369|  };
370|
371|  const handleCheckAnswer = () => {
372|    if (selectedAnswer === null) return;
373|    const isCorrect = selectedAnswer === quizData[currentQuestion].correctAnswer;
374|    setQuizResults([...quizResults, { questionId: quizData[currentQuestion].id, correct: isCorrect }]);
375|    setShowExplanation(true);
376|  };
377|
378|  const handleNextQuestion = () => {
379|    if (currentQuestion < quizData.length - 1) {
380|      setCurrentQuestion(currentQuestion + 1);
381|      setSelectedAnswer(null);
382|      setShowExplanation(false);
383|    } else {
384|      setQuizCompleted(true);
385|      // Quiz sonuçlarını kaydet
386|      const finalResults = calculateQuizStats(quizResults, quizData);
387|      saveUserStats({
388|        quizPerformance: finalResults,
389|        quizResults: [{ // Sadece yeni sonucu gönder
390|          date: new Date().toISOString(),
391|          correct: finalResults.correctAnswers,
392|          total: finalResults.totalQuestions,
393|          accuracy: finalResults.accuracy,
394|          results: quizResults
395|        }]
396|      });
397|    }
398|  };
399|
400|  const resetQuiz = () => {
401|    setCurrentQuestion(0);
402|    setSelectedAnswer(null);
403|    setShowExplanation(false);
404|    setQuizResults([]);
405|    setQuizCompleted(false);
406|  };
407|  
408|  // Auth Handlers
409|  const handleRegister = async (e) => {
410|    e.preventDefault();
411|    setAuthError('');
412|    setAuthLoading(true);
413|
414|    try {
415|      await createUserWithEmailAndPassword(auth, authEmail, authPassword);
416|      setAuthEmail('');
417|      setAuthPassword('');
418|      setCurrentPage('dashboard');
419|    } catch (error) {
420|      if (error.code === 'auth/email-already-in-use') {
421|        setAuthError('Bu email adresi zaten kullanılıyor.');
422|      } else if (error.code === 'auth/weak-password') {
423|        setAuthError('Şifre en az 6 karakter olmalıdır.');
424|      } else if (error.code === 'auth/invalid-email') {
425|        setAuthError('Geçersiz email adresi.');
426|      } else {
427|        setAuthError('Kayıt sırasında bir hata oluştu: ' + error.message);
428|      }
429|    } finally {
430|      setAuthLoading(false);
431|    }
432|  };
433|
434|  const handleLogin = async (e) => {
435|    e.preventDefault();
436|    setAuthError('');
437|    setAuthLoading(true);
438|
439|    try {
440|      await signInWithEmailAndPassword(auth, authEmail, authPassword);
441|      setAuthEmail('');
442|      setAuthPassword('');
443|      setCurrentPage('dashboard');
444|    } catch (error) {
445|      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
446|        setAuthError('Email veya şifre hatalı.');
447|      } else if (error.code === 'auth/invalid-email') {
448|        setAuthError('Geçersiz email adresi.');
449|      } else {
450|        setAuthError('Giriş sırasında bir hata oluştu: ' + error.message);
451|      }
452|    } finally {
453|      setAuthLoading(false);
454|    }
455|  };
456|
457|  const handleLogout = async () => {
458|    try {
459|      await signOut(auth);
460|      setCurrentPage('landing');
461|    } catch (error) {
462|      console.error('Çıkış hatası:', error);
463|    }
464|  };
465|
466|  // =================================================================
467|  // COMPONENTS
468|  // =================================================================
469|
470|  const LandingPage = () => (
471|    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
472|      <header className="bg-white shadow-sm p-4">
473|        <div className="max-w-7xl mx-auto flex justify-between items-center">
474|          <Logo />
475|          <button 
476|            onClick={() => setCurrentPage('auth')} 
477|            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
478|          >
479|            Giriş Yap / Kayıt Ol
480|          </button>
481|        </div>
482|      </header>
483|      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
484|        <h1 className="text-5xl font-bold mb-6">
485|          Okuma Hızını <span className="text-indigo-600">2 Katına</span> Çıkar
486|        </h1>
487|        <p className="text-xl text-gray-600 mb-8">8 haftalık interaktif program</p>
488|        <button 
489|          onClick={() => setCurrentPage('auth')} 
490|          className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700"
491|        >
492|          Hemen Başla
493|        </button>
494|      </div>
495|    </div>
496|  );
497|
498|  const AuthPage = () => {
499|    const [localIsLogin, setLocalIsLogin] = useState(true);
500|    const [localEmail, setLocalEmail] = useState('');
501|    const [localPassword, setLocalPassword] = useState('');
502|    const [localError, setLocalError] = useState('');
503|    const [localLoading, setLocalLoading] = useState(false);
504|
505|    const handleSubmit = async (e) => {
506|      e.preventDefault();
507|      setLocalError('');
508|      setLocalLoading(true);
509|
510|      try {
511|        if (localIsLogin) {
512|          await signInWithEmailAndPassword(auth, localEmail, localPassword);
513|        } else {
514|          await createUserWithEmailAndPassword(auth, localEmail, localPassword);
515|        }
516|        setLocalEmail('');
517|        setLocalPassword('');
518|        setCurrentPage('dashboard');
519|      } catch (error) {
520|        if (error.code === 'auth/email-already-in-use') {
521|          setLocalError('Bu email adresi zaten kullanılıyor.');
522|        } else if (error.code === 'auth/weak-password') {
523|          setLocalError('Şifre en az 6 karakter olmalıdır.');
524|        } else if (error.code === 'auth/invalid-email') {
525|          setLocalError('Geçersiz email adresi.');
526|        } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
527|          setLocalError('Email veya şifre hatalı.');
528|        } else {
529|          setLocalError('Bir hata oluştu: ' + error.message);
530|        }
531|      } finally {
532|        setLocalLoading(false);
533|      }
534|    };
535|
536|    return (
537|      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
538|        <div className="max-w-md w-full">
539|          <div className="text-center mb-8">
540|            <div className="flex justify-center mb-6">
541|              <Logo />
542|            </div>
543|            <h2 className="text-3xl font-bold text-gray-900 mb-2">
544|              {localIsLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
545|            </h2>
546|            <p className="text-gray-600">
547|              {localIsLogin 
548|                ? 'Hesabınıza giriş yapın' 
549|                : 'Yeni hesap oluşturun ve başlayın'}
550|            </p>
551|          </div>
552|
553|          <div className="bg-white rounded-xl shadow-lg p-8">
554|            <form onSubmit={handleSubmit}>
555|              <div className="mb-4">
556|                <label className="block text-gray-700 font-medium mb-2">Email</label>
557|                <input
558|                  type="email"
559|                  value={localEmail}
560|                  onChange={(e) => setLocalEmail(e.target.value)}
561|                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
562|                  placeholder="ornek@email.com"
563|                  required
564|                  autoComplete="email"
565|                />
566|              </div>
567|
568|              <div className="mb-6">
569|                <label className="block text-gray-700 font-medium mb-2">Şifre</label>
570|                <input
571|                  type="password"
572|                  value={localPassword}
573|                  onChange={(e) => setLocalPassword(e.target.value)}
574|                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
575|                  placeholder="En az 6 karakter"
576|                  required
577|                  minLength={6}
578|                  autoComplete={localIsLogin ? "current-password" : "new-password"}
579|                />
580|              </div>
581|
582|              {localError && (
583|                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
584|                  {localError}
585|                </div>
586|              )}
587|
588|              <button
589|                type="submit"
590|                disabled={localLoading}
591|                className={`w-full py-3 rounded-lg font-semibold text-white transition ${
592|                  localLoading 
593|                    ? 'bg-gray-400 cursor-not-allowed' 
594|                    : 'bg-indigo-600 hover:bg-indigo-700'
595|                }`}
596|              >
597|                {localLoading 
598|                  ? 'İşlem yapılıyor...' 
599|                  : localIsLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
600|              </button>
601|            </form>
602|
603|            <div className="mt-6 text-center">
604|              <button
605|                type="button"
606|                onClick={() => {
607|                  setLocalIsLogin(!localIsLogin);
608|                  setLocalError('');
609|                }}
610|                className="text-indigo-600 hover:text-indigo-700 font-medium"
611|              >
612|                {localIsLogin 
613|                  ? 'Hesabınız yok mu? Kayıt olun' 
614|                  : 'Zaten hesabınız var mı? Giriş yapın'}
615|              </button>
616|            </div>
617|
618|            <div className="mt-4 text-center">
619|              <button
620|                type="button"
621|                onClick={() => setCurrentPage('landing')}
622|                className="text-gray-600 hover:text-gray-700"
623|              >
624|                ← Ana Sayfaya Dön
625|              </button>
626|            </div>
627|          </div>
628|        </div>
629|      </div>
630|    );
631|  };
632|
633|  const Dashboard = () => (
634|    <div className="min-h-screen bg-gray-50">
635|      <nav className="bg-white shadow-sm p-4">
636|        <div className="max-w-7xl mx-auto flex justify-between items-center">
637|          <Logo />
638|          <div className="flex items-center gap-4">
639|            {user && (
640|              <span className="text-gray-700 text-sm">{user.email}</span>
641|            )}
642|            <button onClick={handleLogout} className="text-red-600 hover:text-red-700" title="Çıkış Yap">
643|              <LogOut size={20} />
644|            </button>
645|          </div>
646|        </div>
647|      </nav>
648|      <div className="max-w-7xl mx-auto px-4 py-8">
649|        <h1 className="text-3xl font-bold mb-8">Hoş Geldiniz!</h1>
650|        <div className="grid md:grid-cols-4 gap-6">
651|          <button onClick={() => setCurrentPage('video')} className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-xl shadow-lg hover:shadow-xl transition text-left text-white">
652|            <Video className="mb-4" size={40} />
653|            <h3 className="text-xl font-bold mb-2">Video Ders</h3>
654|            <p className="opacity-90">Hafta 1 - 25 dakika</p>
655|          </button>
656|          <button onClick={() => setCurrentPage('quiz')} className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-left">
657|            <FileText className="text-purple-600 mb-4" size={40} />
658|            <h3 className="text-xl font-bold mb-2">Quiz</h3>
659|            <p className="text-gray-600">10 paragraf</p>
660|          </button>
661|          <button onClick={() => setCurrentPage('test')} className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-left">
662|            <Clock className="text-orange-600 mb-4" size={40} />
663|            <h3 className="text-xl font-bold mb-2">Hız Testi</h3>
664|            <p className="text-gray-600">Hızınızı ölçün</p>
665|          </button>
666|          <button onClick={() => setCurrentPage('progress')} className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-left">
667|            <BarChart3 className="text-green-600 mb-4" size={40} />
668|            <h3 className="text-xl font-bold mb-2">İlerleme</h3>
669|            <p className="text-gray-600">İstatistikler</p>
670|          </button>
671|        </div>
672|      </div>
673|    </div>
674|  );
675|
676|  const QuizPage = () => {
677|    const currentQ = quizData[currentQuestion];
678|    // Kullanıcının en son kaydettiği quiz sonuçlarını kullan
679|    const latestQuiz = userStats?.quizResults?.[userStats.quizResults.length - 1];
680|    const correctCount = latestQuiz ? latestQuiz.correct : quizResults.filter(r => r.correct).length;
681|    const totalQuestions = latestQuiz ? latestQuiz.total : quizData.length;
682|    const accuracy = latestQuiz ? latestQuiz.accuracy : Math.round((correctCount/totalQuestions)*100);
683|
684|    if (quizCompleted) {
685|      return (
686|        <div className="min-h-screen bg-gray-50">
687|          <nav className="bg-white shadow-sm p-4">
688|            <div className="max-w-4xl mx-auto flex justify-between items-center">
689|              <Logo />
690|              <button onClick={() => setCurrentPage('dashboard')} className="text-indigo-600 hover:underline">← Dashboard</button>
691|            </div>
692|          </nav>
693|          <div className="max-w-4xl mx-auto px-4 py-12">
694|            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
695|              <Award className="inline-block text-green-600 mb-4" size={64} />
696|              <h1 className="text-3xl font-bold mb-4">Tebrikler! Quiz Tamamlandı</h1>
697|              <div className="grid md:grid-cols-3 gap-4 my-8">
698|                <div className="bg-gray-50 p-6 rounded-lg">
699|                  <div className="text-gray-600 mb-2">Toplam Soru</div>
700|                  <div className="text-4xl font-bold">{totalQuestions}</div>
701|                </div>
702|                <div className="bg-green-50 p-6 rounded-lg">
703|                  <div className="text-gray-600 mb-2">Doğru</div>
704|                  <div className="text-4xl font-bold text-green-600">{correctCount}</div>
705|                </div>
706|                <div className="bg-gray-50 p-6 rounded-lg">
707|                  <div className="text-gray-600 mb-2">Başarı</div>
708|                  <div className="text-4xl font-bold text-indigo-600">%{accuracy}</div>
709|                </div>
710|              </div>
711|              <div className="flex gap-4 justify-center">
712|                <button onClick={resetQuiz} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">Tekrar Dene</button>
713|                <button onClick={() => setCurrentPage('dashboard')} className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700">Dashboard'a Dön</button>
714|              </div>
715|            </div>
716|          </div>
717|        </div>
718|      );
719|    }
720|
721|    return (
722|      <div className="min-h-screen bg-gray-50">
723|        <nav className="bg-white shadow-sm p-4">
724|          <div className="max-w-4xl mx-auto flex justify-between items-center">
725|            <Logo />
726|            <button onClick={() => setCurrentPage('dashboard')} className="text-indigo-600 hover:underline">← Dashboard</button>
727|          </div>
728|        </nav>
729|        <div className="max-w-4xl mx-auto px-4 py-8">
730|          <div className="bg-white rounded-xl shadow-lg p-8">
731|            <div className="flex justify-between items-center mb-6">
732|              <h1 className="text-2xl font-bold text-gray-900">Quiz: Paragraf Soruları</h1>
733|              <span className="text-lg font-semibold text-indigo-600">{currentQuestion + 1} / {quizData.length}</span>
734|            </div>
735|            
736|            <div className="flex justify-between items-center mb-6">
737|              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
738|                currentQ.difficulty === 'Kolay' ? 'bg-green-100 text-green-700' :
739|                currentQ.difficulty === 'Orta' ? 'bg-yellow-100 text-yellow-700' :
740|                currentQ.difficulty === 'Zor' ? 'bg-red-100 text-red-700' :
741|                'bg-purple-100 text-purple-700'
742|              }`}>
743|                {currentQ.difficulty}
744|              </span>
745|            </div>
746|            
747|            <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
748|              <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{width: `${((currentQuestion + 1) / quizData.length) * 100}%`}}></div>
749|            </div>
750|            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded">
751|              <p className="text-gray-800 leading-relaxed text-lg">{currentQ.text}</p>
752|            </div>
753|
754|            <div className="mb-8">
755|              <h3 className="font-bold text-gray-900 mb-4 text-lg">{currentQ.question}</h3>
756|              <div className="space-y-3">
757|                {currentQ.options.map((option, idx) => {
758|                  const isSelected = selectedAnswer === idx;
759|                  const isCorrect = idx === currentQ.correctAnswer;
760|                  const showStatus = showExplanation;
761|                  let bgColor = 'bg-white hover:bg-gray-50';
762|                  let borderColor = 'border-gray-300';
763|                  let icon = null;
764|
765|                  if (showStatus) {
766|                    if (isCorrect) {
767|                      bgColor = 'bg-green-50';
768|                      borderColor = 'border-green-500';
769|                      icon = <Check className="text-green-600" size={20} />;
770|                    } else if (isSelected && !isCorrect) {
771|                      bgColor = 'bg-red-50';
772|                      borderColor = 'border-red-500';
773|                      icon = <X className="text-red-600" size={20} />;
774|                    }
775|                  } else if (isSelected) {
776|                    bgColor = 'bg-indigo-50';
777|                    borderColor = 'border-indigo-500';
778|                  }
779|
780|                  return (
781|                    <button
782|                      key={idx}
783|                      onClick={() => handleAnswerSelect(idx)}
784|                      disabled={showExplanation}
785|                      className={`w-full text-left p-4 border-2 ${borderColor} ${bgColor} rounded-lg transition flex items-center justify-between`}
786|                    >
787|                      <span className="text-gray-800">{String.fromCharCode(65 + idx)}) {option}</span>
788|                      {icon}
789|                    </button>
790|                  );
791|                })}
792|              </div>
793|            </div>
794|
795|            {showExplanation && (
796|              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6 rounded">
797|                <h4 className="font-bold text-gray-900 mb-2">Açıklama:</h4>
798|                <p className="text-gray-700">{currentQ.explanation}</p>
799|              </div>
800|            )}
801|
802|            <div className="flex justify-between">
803|              <button
804|                onClick={() => setCurrentPage('dashboard')}
805|                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
806|              >
807|                <Home size={20} />
808|                Ana Sayfa
809|              </button>
810|              <div className="flex gap-3">
811|                {!showExplanation ? (
812|                  <button
813|                    onClick={handleCheckAnswer}
814|                    disabled={selectedAnswer === null}
815|                    className={`px-8 py-3 rounded-lg font-semibold ${
816|                      selectedAnswer === null
817|                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
818|                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
819|                    }`}
820|                  >
821|                    Cevabı Kontrol Et
822|                  </button>
823|                ) : (
824|                  <button
825|                    onClick={handleNextQuestion}
826|                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
827|                  >
828|                    {currentQuestion < quizData.length - 1 ? 'Sonraki Soru' : 'Sonuçları Gör'}
829|                    <ChevronRight size={20} />
830|                  </button>
831|                )}
832|              </div>
833|            </div>
834|          </div>
835|        </div>
836|      </div>
837|    );
838|  };
839|
840|  const VideoPage = () => (
841|    <div className="min-h-screen bg-gray-50">
842|      <nav className="bg-white shadow-sm p-4">
843|        <div className="max-w-7xl mx-auto flex justify-between items-center">
844|          <Logo />
845|          <button onClick={() => setCurrentPage('dashboard')} className="text-indigo-600 hover:underline flex items-center gap-2">
846|            <Home size={20} />
847|            Dashboard
848|          </button>
849|        </div>
850|      </nav>
851|      <div className="max-w-7xl mx-auto px-4 py-8">
852|        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
853|          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
854|            <div className="flex items-center gap-3 mb-2">
855|              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
856|                Hafta 1
857|              </div>
858|              <div className="flex items-center gap-2 text-sm">
859|                <Clock size={16} />
860|                25 dakika
861|              </div>
862|            </div>
863|            <h1 className="text-3xl font-bold mb-2">Temeller ve Farkındalık</h1>
864|            <p className="opacity-90">Hızlı okuma yolculuğunuzun ilk adımı</p>
865|          </div>
866|
867|          <div className="relative bg-black aspect-video">
868|            <div className="absolute inset-0 flex items-center justify-center">
869|              <div className="text-center text-white">
870|                <Video size={64} className="mx-auto mb-4 opacity-50" />
871|                <p className="text-lg mb-4">Video Player</p>
872|                <p className="text-sm opacity-75 mb-4">Gerçek videolar yüklendikinde burada görünecek</p>
873|                <button 
874|                  onClick={() => {
875|                    setVideoProgress(100);
876|                    setVideoCompleted(true);
877|                  }}
878|                  className="bg-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
879|                >
880|                  Demo: Videoyu Tamamlandı Say
881|                </button>
882|              </div>
883|            </div>
884|          </div>
885|
886|          <div className="p-6 border-b">
887|            <div className="flex items-center justify-between mb-2">
888|              <span className="text-sm font-medium text-gray-700">İzleme İlerlemesi</span>
889|              <span className="text-sm font-bold text-indigo-600">{videoProgress}%</span>
890|            </div>
891|            <div className="w-full bg-gray-200 rounded-full h-3">
892|              <div 
893|                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
894|                style={{ width: `${videoProgress}%` }}
895|              ></div>
896|            </div>
897|            {videoCompleted && (
898|              <div className="mt-4 flex items-center gap-2 text-green-600">
899|                <CheckCircle size={20} />
900|                <span className="font-medium">Video tamamlandı! 🎉</span>
901|              </div>
902|            )}
903|          </div>
904|
905|          <div className="border-b">
906|            <div className="flex">
907|              <button 
908|                onClick={() => setShowVideoNotes(false)}
909|                className={`px-6 py-3 font-medium border-b-2 transition ${
910|                  !showVideoNotes 
911|                    ? 'border-indigo-600 text-indigo-600' 
912|                    : 'border-transparent text-gray-600 hover:text-gray-900'
913|                }`}
914|              >
915|                Genel Bakış
916|              </button>
917|              <button 
918|                onClick={() => setShowVideoNotes(true)}
919|                className={`px-6 py-3 font-medium border-b-2 transition ${
920|                  showVideoNotes 
921|                    ? 'border-indigo-600 text-indigo-600' 
922|                    : 'border-transparent text-gray-600 hover:text-gray-900'
923|                }`}
924|              >
925|                Ders Notları
926|              </button>
927|            </div>
928|          </div>
929|
930|          <div className="p-6">
931|            {!showVideoNotes ? (
932|              <div className="space-y-6">
933|                <div>
934|                  <h3 className="text-lg font-bold text-gray-900 mb-3">Bu Derste Neler Öğreneceksiniz?</h3>
935|                  <ul className="space-y-2">
936|                    {[
937|                      "Okuma Hızı Testi - Teori ve Uygulama",
938|                      "Yavaş Okuma Nedenleri",
939|                      "Göz Hareketleri Egzersizleri",
940|                      "Paragraf Yapısı",
941|                      "Ana Fikir Bulma Teknikleri"
942|                    ].map((topic, idx) => (
943|                      <li key={idx} className="flex items-start gap-3">
944|                        <div className="mt-1 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
945|                          <span className="text-indigo-600 text-sm font-bold">{idx + 1}</span>
946|                        </div>
947|                        <span className="text-gray-700">{topic}</span>
948|                      </li>
949|                    ))}
950|                  </ul>
951|                </div>
952|              </div>
953|            ) : (
954|              <div className="prose max-w-none">
955|                <h3 className="text-xl font-bold text-gray-900 mb-4">Hafta 1 - Detaylı Ders Notları</h3>
956|                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
957|                  <p className="font-semibold text-blue-900 mb-2">📝 Not Alma İpucu</p>
958|                  <p className="text-blue-800 text-sm">
959|                    Bu notları yazdırıp yanınızda bulundurabilir, önemli yerlerin altını çizebilirsiniz.
960|                  </p>
961|                </div>
962|                <h4 className="text-lg font-bold mt-6 mb-3">1. Okuma Hızı Nasıl Ölçülür?</h4>
963|                <p className="text-gray-700 mb-4">
964|                  Okuma hızınızı ölçmek için basit bir formül kullanıyoruz:
965|                </p>
966|                <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-center">
967|                  (Kelime Sayısı ÷ Okuma Süresi (saniye)) × 60 = Kelime/Dakika
968|                </div>
969|              </div>
970|            )}
971|          </div>
972|        </div>
973|      </div>
974|    </div>
975|  );
976|
977|  const ProgressPage = () => {
978|    // Loading durumu
979|    if (statsLoading) {
980|      return (
981|        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
982|          <div className="text-center">
983|            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
984|            <p className="text-gray-600">Veriler yükleniyor...</p>
985|          </div>
986|        </div>
987|      );
988|    }
989|
990|    // Kullanıcı verisi veya varsayılan
991|    const stats = userStats || {
992|      readingSpeedHistory: [],
993|      quizResults: [],
994|      weeklyActivity: [
995|        { week: 'Hafta 1', completed: 0 },
996|        { week: 'Hafta 2', completed: 0 },
997|        { week: 'Hafta 3', completed: 0 },
998|        { week: 'Hafta 4', completed: 0 }
999|      ]
1000|    };
1001|
1002|    // Quiz istatistikleri
1003|    const latestQuiz = stats.quizResults && stats.quizResults.length > 0 
1004|      ? stats.quizResults[stats.quizResults.length - 1]
1005|      : { totalQuestions: 0, correctAnswers: 0, accuracy: 0 };
1006|
1007|    // Okuma hızı
1008|    const readingHistory = stats.readingSpeedHistory || [];
1009|    const hasHistory = readingHistory.length > 0;
1010|    const initialSpeed = hasHistory ? readingHistory[0].wpm : 200; // wpm kullan
1011|    const currentSpeed = hasHistory ? readingHistory[readingHistory.length - 1].wpm : 200; // wpm kullan
1012|    const improvement = currentSpeed - initialSpeed;
1013|    const improvementPercent = initialSpeed > 0 ? Math.round((improvement / initialSpeed) * 100) : 0;
1014|
1015|    return (
1016|      <div className="min-h-screen bg-gray-50">
1017|        <nav className="bg-white shadow-sm p-4">
1018|          <div className="max-w-7xl mx-auto flex justify-between items-center">
1019|            <Logo />
1020|            <button onClick={() => setCurrentPage('dashboard')} className="text-indigo-600 hover:underline flex items-center gap-2">
1021|              <Home size={20} />
1022|              Dashboard
1023|            </button>
1024|          </div>
1025|        </nav>
1026|
1027|        <div className="max-w-7xl mx-auto px-4 py-8">
1028|          <div className="mb-8">
1029|            <h1 className="text-3xl font-bold text-gray-900 mb-2">İlerleme & İstatistikler</h1>
1030|            <p className="text-gray-600">Gelişimizi takip edin</p>
1031|          </div>
1032|
1033|          <div className="grid md:grid-cols-4 gap-6 mb-8">
1034|            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
1035|              <div className="flex items-center justify-between mb-2">
1036|                <span className="text-indigo-100">Mevcut Hız</span>
1037|                <TrendingUp size={24} />
1038|              </div>
1039|              <div className="text-4xl font-bold mb-1">{currentSpeed}</div>
1040|              <div className="text-indigo-100 text-sm">kelime/dakika</div>
1041|            </div>
1042|
1043|            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
1044|              <div className="flex items-center justify-between mb-2">
1045|                <span className="text-green-100">Gelişim</span>
1046|                <Award size={24} />
1047|              </div>
1048|              <div className="text-4xl font-bold mb-1">+{improvement}</div>
1049|              <div className="text-green-100 text-sm">kelime ({improvementPercent}% artış)</div>
1050|            </div>
1051|
1052|            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
1053|              <div className="flex items-center justify-between mb-2">
1054|                <span className="text-purple-100">Quiz Başarısı</span>
1055|                <CheckCircle size={24} />
1056|              </div>
1057|              <div className="text-4xl font-bold mb-1">%{latestQuiz.accuracy}</div>
1058|              <div className="text-purple-100 text-sm">{latestQuiz.correctAnswers}/{latestQuiz.totalQuestions} doğru</div>
1059|            </div>
1060|
1061|            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
1062|              <div className="flex items-center justify-between mb-2">
1063|                <span className="text-orange-100">Toplam Test</span>
1064|                <BarChart3 size={24} />
1065|              </div>
1066|              <div className="text-4xl font-bold mb-1">{readingHistory.length}</div>
1067|              <div className="text-orange-100 text-sm">hız testi</div>
1068|            </div>
1069|          </div>
1070|
1071|          {hasHistory ? (
1072|            <div className="bg-white rounded-xl shadow-lg p-6">
1073|              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
1074|                <TrendingUp className="text-indigo-600" />
1075|                Okuma Hızı Gelişimi
1076|              </h2>
1077|              
1078|              <div className="space-y-4">
1079|                {readingHistory.map((item, idx) => (
1080|                  <div key={idx}>
1081|                    <div className="flex justify-between mb-2">
1082|                      <span className="text-sm font-medium text-gray-700">{item.test}</span>
1083|                      <span className="text-sm font-bold text-indigo-600">{item.wpm} kelime/dk</span>
1084|                    </div>
1085|                    <div className="flex items-center gap-3">
1086|                      <span className="text-xs text-gray-500 w-24">{new Date(item.date).toLocaleDateString('tr-TR')}</span>
1087|                      <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
1088|                        <div 
1089|                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-1000"
1090|                          style={{ width: `${(item.wpm / 400) * 100}%` }}
1091|                        >
1092|                          <span className="text-white text-xs font-bold">{item.wpm}</span>
1093|                        </div>
1094|                      </div>
1095|                    </div>
1096|                  </div>
1097|                ))}
1098|              </div>
1099|
1100|              <div className="mt-6 pt-6 border-t">
1101|                <div className="flex items-center justify-between mb-2">
1102|                  <span className="text-sm text-gray-600">Hedef: 400 kelime/dakika</span>
1103|                  <span className="text-sm font-bold text-gray-900">{Math.round((currentSpeed/400)*100)}% tamamlandı</span>
1104|                </div>
1105|                <div className="bg-gray-200 rounded-full h-2">
1106|                  <div 
1107|                    className="bg-green-500 h-2 rounded-full transition-all"
1108|                    style={{ width: `${(currentSpeed/400)*100}%` }}
1109|                  ></div>
1110|                </div>
1111|              </div>
1112|            </div>
1113|          ) : (
1114|            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
1115|              <Clock className="mx-auto text-blue-600 mb-4" size={48} />
1116|              <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz Test Yapmadınız</h3>
1117|              <p className="text-gray-600 mb-4">Okuma hızınızı ölçmek için ilk testinizi yapın!</p>
1118|              <button 
1119|                onClick={() => setCurrentPage('test')}
1120|                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
1121|              >
1122|                Hız Testine Git →
1123|              </button>
1124|            </div>
1125|          )}
1126|
1127|          <div className="mt-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
1128|            <h3 className="text-2xl font-bold mb-3">🎉 Harika Gidiyorsun!</h3>
1129|            <p className="text-indigo-100 mb-4">
1130|              {hasHistory ? `Okuma hızında ${improvementPercent}% artış sağladın. Bu tempoyu koru!` : 'Öğrenme yolculuğuna başla ve ilerlemeni takip et!'}
1131|            </p>
1132|            {hasHistory && (
1133|              <div className="bg-white/20 p-4 rounded-lg">
1134|                <p className="text-sm font-medium mb-2">Bir Sonraki Hedef:</p>
1135|                <p className="text-lg font-bold">300 kelime/dakika</p>
1136|                <div className="mt-2 bg-white/30 rounded-full h-2">
1137|                  <div 
1138|                    className="bg-white h-2 rounded-full"
1139|                    style={{ width: `${Math.min((currentSpeed/300)*100, 100)}%` }}
1140|                  ></div>
1141|                </div>
1142|              </div>
1143|            )}
1144|          </div>
1145|        </div>
1146|      </div>
1147|    );
1148|  };
1149|
1150|  const ReadingTestPage = () => {
1151|    const wpmHistory = userStats?.readingSpeedHistory || [];
1152|    
1153|    return (
1154|      <div className="min-h-screen bg-gray-50">
1155|        <nav className="bg-white shadow-sm p-4">
1156|          <div className="max-w-4xl mx-auto flex justify-between items-center">
1157|            <Logo />
1158|            <button onClick={() => setCurrentPage('dashboard')} className="text-indigo-600 hover:underline">← Dashboard</button>
1159|          </div>
1160|        </nav>
1161|        <div className="max-w-4xl mx-auto px-4 py-8">
1162|          <div className="bg-white rounded-xl shadow-lg p-8">
1163|            <h1 className="text-3xl font-bold mb-6">Okuma Hızı Testi</h1>
1164|            <div className="text-center mb-8">
1165|              <div className="inline-flex items-center gap-4 bg-gray-100 px-8 py-4 rounded-lg">
1166|                <Clock className="text-indigo-600" size={32} />
1167|                <div className="text-4xl font-bold">{formatTime(elapsedTime)}</div>
1168|              </div>
1169|            </div>
1170|            <div className="bg-gray-50 p-8 rounded-lg mb-8">
1171|              <p className="text-lg leading-relaxed">{testText}</p>
1172|            </div>
1173|            <div className="flex gap-4 justify-center">
1174|              {!isReading && !showResult && (
1175|                <button onClick={startReading} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700">
1176|                  <Play size={24} />Teste Başla
1177|                </button>
1178|              )}
1179|              {isReading && (
1180|                <button onClick={stopReading} className="flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700">
1181|                  <Pause size={24} />Bitir
1182|                </button>
1183|              )}
1184|              {!isReading && showResult && currentResult && (
1185|                <>
1186|                  <button onClick={resetTest} className="flex items-center gap-2 bg-gray-600 text-white px-8 py-4 rounded-lg hover:bg-gray-700">
1187|                    <RotateCcw size={24} />Tekrar Dene
1188|                  </button>
1189|                  <div className="bg-green-100 text-green-800 p-4 rounded-lg font-bold text-lg">
1190|                    Hızınız: {currentResult.wpm} kelime/dakika
1191|                  </div>
1192|                </>
1193|              )}
1194|            </div>
1195|          </div>
1196|        </div>
1197|      </div>
1198|    );
1199|  };
1200|
1201|  // =================================================================
1202|  // ANA RENDER BLOĞU
1203|  // =================================================================
1204| 
1205|  // Giriş yapmamış kullanıcılar için
1206|  if (!isLoggedIn && currentPage === 'landing') return <LandingPage />;
1207|  if (currentPage === 'auth') return <AuthPage />;
1208|  
1209|  // Giriş yapmış kullanıcılar için sayfalar
1210|  if (currentPage === 'quiz') return <QuizPage />;
1211|  if (currentPage === 'video') return <VideoPage />;
1212|  if (currentPage === 'progress') return <ProgressPage />;
1213|  if (currentPage === 'test') return <ReadingTestPage />;
1214|  if (currentPage === 'dashboard') return <Dashboard />;
1215|
1216|  // Eğer kullanıcı giriş yapmışsa ve sayfa belirtilmemişse dashboard'a yönlendir
1217|  if (isLoggedIn && currentPage !== 'dashboard') {
1218|    setCurrentPage('dashboard');
1219|  }
1220|  
1221|  // Kullanıcı giriş yapmamışsa landing page'e yönlendir
1222|  if (!isLoggedIn) {
1223|    setCurrentPage('landing');
1224|  }
1225|
1226|  // Geçici yükleme ekranı (sadece state güncellenene kadar gösterilir)
1227|  return (
1228|    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
1229|      <div className="text-center">
1230|        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
1231|        <p className="text-gray-600">Yükleniyor...</p>
1232|      </div>
1233|    </div>
1234|  );
1235|};
1236|
1237|export default ReadingPlatform;
1238|
