import React, { useEffect, useState } from 'react';
import QuizCard from '../components/QuizCard';
import { getQuizzes } from '../api/quizApi';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = async () => {
    try {
      const res = await getQuizzes();
      setQuizzes(res.data);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = (id) => {
    setQuizzes(quizzes.filter(q => q._id !== id));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Available Quizzes</h2>
        <Link to="/create" className="btn btn-primary">Crea nuevo Quiz</Link>
      </div>
      {quizzes.map((quiz) => (
        <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default HomePage;


