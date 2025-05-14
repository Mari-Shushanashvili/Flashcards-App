import React from 'react';
import PracticeView from './components/PracticeView';
import AnswerDisplay from './components/AnswerDisplay';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1>Flashcard Learner</h1>
      <PracticeView />
      <hr style={{ margin: '20px 0' }} /> {}
      <AnswerDisplay />
    </div>
  );
};

export default App;
