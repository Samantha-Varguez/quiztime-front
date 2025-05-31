import React from 'react';
import { Link } from 'react-router-dom';
import { deleteQuiz } from '../api/quizApi';
import PropTypes from 'prop-types';

const QuizCard = ({ quiz, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm('Estas seguro de que quieres borrar este quiz?')) {
      await deleteQuiz(quiz._id);
      onDelete(quiz._id); // tell parent to update list
      alert('Quiz eliminado');
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{quiz.title}</h5>
        <p className="card-text">{quiz.description}</p>
        <Link to={`/quizzes/${quiz._id}`} className="btn btn-outline-primary me-2">
          Tomar Quiz
        </Link>
        <button onClick={handleDelete} className="btn btn-outline-danger">Borrar</button>
      </div>
    </div>
  );
};

QuizCard.propTypes = {
  quiz: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default QuizCard;

