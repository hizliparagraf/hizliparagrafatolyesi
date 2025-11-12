import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase"; // senin firebase.js dosyan
import { Home, TrendingUp, Award, CheckCircle, BarChart3, Clock, Play, Pause, RotateCcw } from "lucide-react";


// =========================
// ProgressPage (Kişiye özel istatistik sayfası)
// =========================
const ProgressPage = ({ setCurrentPage }) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [userStats, setUserStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Kullanıcıya özel Firestore verisini çek
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        if (!currentUser) {
          setError("Kullanıcı oturumu bulunamadı.");
          setStatsLoading(false);
          return;
        }

        const q = query(
          collection(db, "userStats"),
          where("uid", "==", currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setUserStats(querySnapshot.docs[0].data());
        } else {
          // Yeni kullanıcıysa varsayılan istatistik oluştur
          const defaultStats = {
            uid: currentUser.uid,
            readingSpeedHistory: [],
            quizResults: [],
            weeklyActivity: [
              { week: "Hafta 1", completed: 0 },
              { week: "Hafta 2", completed: 0 },
              { week: "Hafta 3", completed: 0 },
              { week: "Hafta 4", completed: 0 },
            ],
          };
          await setDoc(doc(db, "userStats", currentUser.uid), defaultStats);
          setUserStats(defaultStats);
        }
      } catch (err) {
        console.error("Veri alınırken hata:", err);
        setError("Veriler alınamadı.");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserStats();
  }, [currentUser]);

  // 🔹 Loading durumu
  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  // 🔹 Hata durumu
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  // 🔹 İstatistik hesaplamaları
  const stats = userStats || {
    readingSpeedHistory: [],
    quizResults: [],
    weeklyActivity: [],
  };

  const readingHistory = stats.readingSpeedHistory || [];
  const hasHistory = readingHistory.length > 0;
  const initialSpeed = hasHistory ? readingHistory[0].speed : 200;
  const currentSpeed = hasHistory
    ? readingHistory[readingHistory.length - 1].speed
    : 200;
  const improvement = currentSpeed - initialSpeed;
  const improvementPercent =
    initialSpeed > 0 ? Math.round((improvement / initialSpeed) * 100) : 0;

  const latestQuiz =
    stats.quizResults && stats.quizResults.length > 0
      ? stats.quizResults[stats.quizResults.length - 1]
      : { totalQuestions: 0, correctAnswers: 0, accuracy: 0 };

  // 🔹 Sayfa Arayüzü
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
         <h1 className="text-xl font-bold text-indigo-600">Hızlı Paragraf Atölyesi</h1>

          <button
            onClick={() => setCurrentPage("dashboard")}
            className="text-indigo-600 hover:underline flex items-center gap-2"
          >
            <Home size={20} />
            Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          İlerleme & İstatistikler
        </h1>
        <p className="text-gray-600 mb-8">Gelişiminizi takip edin</p>

        {/* 📊 İstatistik Kartları */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Hız */}
          <div className="bg-indigo-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between mb-2">
              <span>Mevcut Hız</span>
              <TrendingUp size={22} />
            </div>
            <div className="text-4xl font-bold">{currentSpeed}</div>
            <div className="text-indigo-100 text-sm">kelime/dakika</div>
          </div>

          {/* Gelişim */}
          <div className="bg-green-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between mb-2">
              <span>Gelişim</span>
              <Award size={22} />
            </div>
            <div className="text-4xl font-bold">+{improvement}</div>
            <div className="text-green-100 text-sm">
              ({improvementPercent}% artış)
            </div>
          </div>

          {/* Quiz */}
          <div className="bg-purple-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between mb-2">
              <span>Quiz Başarısı</span>
              <CheckCircle size={22} />
            </div>
            <div className="text-4xl font-bold">%{latestQuiz.accuracy}</div>
            <div className="text-purple-100 text-sm">
              {latestQuiz.correctAnswers}/{latestQuiz.totalQuestions} doğru
            </div>
          </div>

          {/* Toplam Test */}
          <div className="bg-orange-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between mb-2">
              <span>Toplam Test</span>
              <BarChart3 size={22} />
            </div>
            <div className="text-4xl font-bold">{readingHistory.length}</div>
            <div className="text-orange-100 text-sm">hız testi</div>
          </div>
        </div>

        {/* Hız geçmişi veya mesaj */}
        {hasHistory ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex gap-2 items-center">
              <TrendingUp className="text-indigo-600" /> Okuma Hızı Gelişimi
            </h2>
            {readingHistory.map((item, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>{item.test}</span>
                  <span className="font-semibold text-indigo-600">
                    {item.speed} kelime/dk
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-indigo-500 h-3 rounded-full"
                    style={{ width: `${(item.speed / 400) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
            <Clock className="mx-auto text-blue-600 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Henüz Test Yapmadınız
            </h3>
            <p className="text-gray-600 mb-4">
              Okuma hızınızı ölçmek için ilk testinizi yapın!
            </p>
            <button
              onClick={() => setCurrentPage("test")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Hız Testine Git →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// =========================
// Uygulama (sayfa yönlendirme)
// =========================
const App = () => {
  const [currentPage, setCurrentPage] = useState("progress");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Şimdilik varsayılan

  if (!isLoggedIn) return <div>Giriş yapınız...</div>;

  if (currentPage === "progress") return <ProgressPage setCurrentPage={setCurrentPage} />;
  // Diğer sayfalar buraya eklenecek
  return <div>Dashboard</div>;
};

export default App;
