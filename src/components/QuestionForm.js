import React, { useState } from 'react';
import { addQuestion } from '../api/questionApi';

const QuestionForm = ({ quizId }) => {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addQuestion(quizId, text);
      setText('');
      alert('Question added successfully');
    } catch (err) {
      console.error('Error adding question:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Question</label>
        <input
          type="text"
          className="form-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Add Question</button>
    </form>
  );
};

export default QuestionForm;
