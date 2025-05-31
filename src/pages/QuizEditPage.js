import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getQuiz } from '../api/quizApi';
import { addQuestion, getQuestions, deleteQuestion } from '../api/questionApi';
import { addOption } from '../api/optionApi';

const QuizEditPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([{ text: '', isCorrect: false }]);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const q = await getQuiz(id);
        const qs = await getQuestions(id); // cargar preguntas
        setQuiz(q);
        setQuestions(qs);
      } catch (err) {
        console.log("Fallo al cargar quiz", err.message);
        setError('Failed to load quiz');
      }
    };
    loadQuiz();
  }, [id]);
  

  const handleOptionChange = (index, field, value) => {
    const updated = [...options];
    if (field === 'isCorrect') {
      updated.forEach((opt, i) => (updated[i].isCorrect = false)); // one correct
      updated[index].isCorrect = value.target.checked;
    } else {
      updated[index][field] = value.target.value;
    }
    setOptions(updated);
  };

  const addNewOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!questionText.trim() || options.some((opt) => !opt.text.trim())) {
      setError('All fields must be filled.');
      return;
    }

    try {
      const question = await addQuestion({ quizId: id, text: questionText });
      for (const opt of options) {
        await addOption({
          questionId: question._id,
          text: opt.text,
          isCorrect: opt.isCorrect,
        });
      }
      setQuestions([...questions, question]);
      setQuestionText('');
      setOptions([{ text: '', isCorrect: false }]);
      setSuccess('Question added!');
    } catch (err) {
      console.log("Fallo al agregar pregunta", err.message);
      setError('Failed to add question.');
    }
  };

  if (!quiz) return <div className="container mt-4">Loading quiz...</div>;

  return (
    <div className="container mt-4">
      <h2>Edit Quiz: {quiz.title}</h2>
      <p>{quiz.description}</p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleAddQuestion}>
        <div className="form-group mt-3">
          <label htmlFor="form-control">Question Text</label>
          <input
            type="text"
            className="form-control"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />
        </div>

        <h5 className="mt-3">Options:</h5>
        {options.map((opt, idx) => (
          <div key={opt.text} className="mb-3">
            <input
              type="text"
              className="form-control mb-1"
              placeholder={`Option ${idx + 1}`}
              value={opt.text}
              onChange={(e) => handleOptionChange(idx, 'text', e)}
              required
            />
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={opt.isCorrect}
                onChange={(e) => handleOptionChange(idx, 'isCorrect', e)}
              />
              <label htmlFor="form-check-label" className="form-check-label">Correct answer</label>
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={addNewOption}>
          + Add Option
        </button>

        <br />
        <button type="submit" className="btn btn-success mt-3">Add Question</button>
      </form>

      {questions.length > 0 && (
  <div className="mt-5">
    <h4>Questions Added:</h4>
    {questions.map((q) => (
      <div key={q._id} className="card mb-3">
        <div className="card-body">
          <h5>{q.text}</h5>
          <ul className="list-group">
            {q.options?.map((opt) => (
              <li key={opt._id} className="list-group-item d-flex justify-content-between align-items-center">
                {opt.text}
                {opt.isCorrect && <span className="badge bg-success">Correct</span>}
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <button
              className="btn btn-danger btn-sm me-2"
              onClick={async () => {
                if (window.confirm('¿Eliminar esta pregunta?')) {
                  try {
                    await deleteQuestion(q._id);
                    setQuestions(questions.filter((item) => item._id !== q._id));
                  } catch (err) {
                    console.log("No se pudo eliminar", err.message)
                    alert('No se pudo eliminar');
                  }
                }
              }}
            >
              Eliminar
            </button>
            {/* Botón para editar pregunta podría ir aquí */}
          </div>
        </div>
      </div>
    ))}
  </div>
)}


<button className="btn btn-outline-primary mt-4" onClick={() => window.location.href = '/'}>
  Back to Home
</button>

    </div>
  );
};

export default QuizEditPage;
