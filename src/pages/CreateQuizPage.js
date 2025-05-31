import React, { useState } from 'react';
import { createQuiz } from '../api/quizApi';
import { addQuestion } from '../api/questionApi';
import { addOption } from '../api/optionApi';
import { useNavigate } from 'react-router-dom';

const CreateQuizPage = () => {
  const [quizData, setQuizData] = useState({ title: '', description: '' });
  const [quizId] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([{ text: '', isCorrect: false }]);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleQuizChange = (e) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const newQuiz = await createQuiz(quizData);
      console.log('Quiz response:', newQuiz);
      navigate(`/quizzes/${newQuiz._id}/edit`);
      console.log('Set quiz ID:', newQuiz._id);
      

      setSuccess('Quiz creado!');
    } catch (err) {
      console.log("Fallo al crear quiz", err.message);
      setError('Fallo al crear quiz.');
    }
  };

  const handleQuestionChange = (e) => {
    setQuestionText(e.target.value);
  };

  const handleOptionChange = (index, field, value) => {
    const updated = [...options];
    if (field === 'isCorrect') {
      updated.forEach((opt, i) => (updated[i].isCorrect = false)); // only one correct
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
    if (!questionText.trim() || options.some((opt) => !opt.text.trim())) {
      return setError('Llena todos los campos.');
    }
    try {
      const question = await addQuestion({ quizId, text: questionText });

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
      setSuccess('Pregunta añadida!');
      setError('');
    } catch (err) {
      console.log("Fallo al agregar pregunta", err.message);
      setError('Fallo al agregar pregunta.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Crea Quiz</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {quizId === null && (
        <form onSubmit={handleCreateQuiz}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input type="text" name="title" className="form-control" onChange={handleQuizChange} required />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="description">Description:</label>
            <textarea name="description" className="form-control" onChange={handleQuizChange} />
          </div>
          <button type="submit" className="btn btn-primary mt-3">Crea Quiz</button>
        </form>
      )} 
      {quizId && (
        <div className="mt-4">
          <h4>Agrega pregunta</h4>
          <form onSubmit={handleAddQuestion}>
            <div className="form-group">
              <label htmlFor="form-control">Texto de pregunta:</label>
              <input
                type="text"
                className="form-control"
                value={questionText}
                onChange={handleQuestionChange}
                required
              />
            </div>

            <h6 className="mt-3">Opciones:</h6>
            {options.map((opt) => (
              <div key={opt.text} className="mb-2">
                <input
                  type="text"
                  className="form-control mb-1"
                  placeholder={`Option ${index + 1}`}
                  value={opt.text}
                  onChange={(e) => handleOptionChange(index, 'text', e)}
                  required
                />
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={opt.isCorrect}
                    onChange={(e) => handleOptionChange(index, 'isCorrect', e)}
                  />
                  <label htmlFor="form-check-label" className="form-check-label">Respuesta correcta</label>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={addNewOption}>
              + Add Option
            </button>
            <br />
            <button type="submit" className="btn btn-success mt-3">Agrega pregunta</button>
          </form>

          <hr />
          <h5 className="mt-4">Preguntas añadidas:</h5>
          <ul className="list-group mt-2">
            {questions.map((q) => (
              <li key={q._id} className="list-group-item">{q.text}</li>
            ))}
          </ul>
        </div> 
      )}
    </div>
  );
};

export default CreateQuizPage;
