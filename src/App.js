import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateQuizPage from './pages/CreateQuizPage';
import QuizPage from './pages/QuizPage';
import HomePage from './pages/HomePage';
import QuizEditPage from './pages/QuizEditPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create" element={<CreateQuizPage />} />
        <Route path="/quizzes/:id" element={<QuizPage />} />
        <Route path="/quizzes/:id/edit" element={<QuizEditPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
