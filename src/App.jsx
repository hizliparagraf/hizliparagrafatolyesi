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

return (
<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
<header className="bg-white shadow-sm p-4">
<div className="max-w-7xl mx-auto flex justify-between items-center">
<Logo />
<button
onClick={() => { setIsLoggedIn(true); setCurrentPage('dashboard'); }}
className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
>
Giriş Yap
</button>
</div>
</header>
<div className="max-w-7xl mx-auto px-4 py-20 text-center">
<h1 className="text-5xl font-bold mb-6">
Okuma Hızını <span className="text-indigo-600">2 Katına</span> Çıkar
</h1>
<p className="text-xl text-gray-600 mb-8">8 haftalık interaktif program</p>
<button
onClick={() => { setIsLoggedIn(true); setCurrentPage('dashboard'); }}
className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700"
>
Hemen Başla
</button>
</div>
</div>
);
};

export default ReadingPlatform;
