import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getQuiz } from '../api/quizApi';
import { getQuestions } from '../api/questionApi';
import { submitQuizAnswers } from '../api/answerApi';

const QuizPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

useEffect(() => {
  const fetchQuiz = async () => {
    try {
      const qz = await getQuiz(id);
      const qs = await getQuestions(id);
      console.log('getQuestions returned:', qs); // ✅ DEBUG
      setQuiz(qz);
      setQuestions(Array.isArray(qs) ? qs : []); // ✅ FIX: protect from bad values
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar el quiz');
    }
  };
  fetchQuiz();
}, [id]);


  const handleAnswerChange = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const unanswered = questions.filter(q => !answers[q._id]);
    if (unanswered.length > 0) {
      setError('Debes contestar todas las preguntas antes de enviar.');
      return;
    }

    try {
      const payload = Object.entries(answers).map(([question, selectedOption]) => ({
        question,
        selectedOption,
      }));
      const result = await submitQuizAnswers(id, payload);
      alert(`¡Quiz enviado! Tu puntuación es: ${result.score}`);
      console.log('Respuesta del backend:', result);
      setSubmitted(true);
    } catch (err) {
      console.error('Error al enviar respuestas:', err.message);
      setError('Error al enviar respuestas');
    }
  };

  if (!quiz || questions.length === 0) return <div className="container mt-5">Cargando...</div>;

  return (
    <div className="container mt-4">
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>
      {error && <div className="alert alert-danger">{error}</div>}

      {submitted ? (
        <div className="alert alert-success">¡Gracias por participar!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {questions.map((q) => (
            <div key={q._id} className="mb-4">
              <h5>{q.text}</h5>
              {q.options && q.options.length > 0 ? (
                q.options.map((opt) => (
                  <div className="form-check" key={opt._id}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={q._id}
                      value={opt._id}
                      checked={answers[q._id] === opt._id}
                      onChange={() => handleAnswerChange(q._id, opt._id)}
                    />
                    <label className="form-check-label">{opt.text}</label>
                  </div>
                ))
              ) : (
                <p className="text-muted">No hay opciones para esta pregunta.</p>
              )}
            </div>
          ))}
          <button type="submit" className="btn btn-primary">Enviar respuestas</button>
        </form>
      )}
    </div>
  );
};

export default QuizPage;

