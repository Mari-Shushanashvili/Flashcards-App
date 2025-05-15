import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import { fetchLatestAnswer } from '../services/api';

interface AnswerDisplayProps {}

const AnswerDisplay: React.FC<AnswerDisplayProps> = () => {
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[AnswerDisplay] useEffect triggered.');
    fetch('http://13.49.244.119:3001/api/get-latest-answer')
      .then(response => {
        console.log('[AnswerDisplay] Direct fetch - response status:', response.status);
        if (!response.ok) {
          throw new Error(`Direct fetch - Network response was not ok: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('[AnswerDisplay] Direct fetch - success data:', data);
        setAnswer(data.latestAnswer);
        setIsLoading(false);
        setError(null);
      })
      .catch(error => {
        console.error('[AnswerDisplay] Direct fetch - error caught:', error);
        if (error instanceof Error) {
            console.error('[AnswerDisplay] Error name:', error.name);
            console.error('[AnswerDisplay] Error message:', error.message);
        }
        setError('Failed to load the answer. Please try again later.');
        setIsLoading(false);
        setAnswer(null);
      });

    // Original Axios-based getAnswer function (commented I'm using direct fetch now)
    /*
    const getAnswer = async () => {
      setIsLoading(true);
      setError(null);
      console.log('[AnswerDisplay] Attempting to fetch latest answer (Axios)...');
      try {
        const data = await fetchLatestAnswer(); // This would call the function from api.ts
        console.log('[AnswerDisplay] Successfully fetched data (Axios):', data);
        setAnswer(data.latestAnswer);
      } catch (err: any) {
        console.error('[AnswerDisplay] Error occurred in getAnswer (Axios):', err);

        if (axios.isAxiosError(err)) {
          console.error('[AnswerDisplay] Axios error details:', {
            message: err.message,
            name: err.name,
            code: err.code,
            config_url: err.config?.url,
            config_method: err.config?.method,
            request_exists: err.request ? 'Yes' : 'No',
            response_status: err.response?.status,
            response_data: err.response?.data,
          });
        }
        setError('Failed to load the answer. Please try again later.');
        setAnswer(null);
      } finally {
        setIsLoading(false);
      }
    };
    getAnswer();
    */
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
          Latest Answer: <span id="answer">{answer}</span>
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