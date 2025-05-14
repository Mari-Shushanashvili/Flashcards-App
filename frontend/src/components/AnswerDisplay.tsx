import React, { useState, useEffect } from 'react';
import { fetchLatestAnswer } from '../services/api';

interface AnswerDisplayProps {}

const AnswerDisplay: React.FC<AnswerDisplayProps> = () => {
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAnswer = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchLatestAnswer();
        setAnswer(data.latestAnswer);
      } catch (err) {
        console.error('Error fetching latest answer:', err);
        setError('Failed to load the answer. Please try again later.');
        setAnswer(null);
      } finally {
        setIsLoading(false);
      }
    };
    getAnswer();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <p>Loading answer...</p>;
    }

    if (error) {
      return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    if (answer !== null && answer.trim() !== '') {
      return (
        <p>
          Latest Answer: <span id="answer">{answer}</span> {}
        </p>
      );
    }

    return <p>No answer available at the moment.</p>;
  };

  return (
    <div className="answer-display-container">
      <h2>Live Answer from Backend</h2>
      {renderContent()}
    </div>
  );
};

export default AnswerDisplay;