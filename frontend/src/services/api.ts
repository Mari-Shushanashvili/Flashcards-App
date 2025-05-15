import axios from 'axios';
import { Flashcard, AnswerDifficulty, PracticeSession, ProgressStats } from '../types';

const API_BASE_URL = 'http://13.49.244.119:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export async function fetchPracticeCards(): Promise<PracticeSession> {
  console.log('[apiClient] Fetching practice cards from:', `${API_BASE_URL}/practice`);
  const response = await apiClient.get('/practice');
  return response.data;
}

export async function submitAnswer(
  cardFront: string,
  cardBack: string,
  difficulty: AnswerDifficulty
): Promise<void> {
  console.log('[apiClient] Submitting answer to:', `${API_BASE_URL}/update`);
  await apiClient.post('/update', { cardFront, cardBack, difficulty });
}

export async function fetchHint(card: Flashcard): Promise<string> {
  console.log('[apiClient] Fetching hint from:', `${API_BASE_URL}/hint`);
  const response = await apiClient.get('/hint', {
    params: { cardFront: card.front, cardBack: card.back },
  });
  return response.data.hint;
}

export async function fetchProgress(): Promise<ProgressStats> {
  console.log('[apiClient] Fetching progress from:', `${API_BASE_URL}/progress`);
  const response = await apiClient.get('/progress');
  return response.data;
}

export async function advanceDay(): Promise<{ currentDay: number }> {
  console.log('[apiClient] Advancing day via:', `${API_BASE_URL}/day/next`);
  const response = await apiClient.post('/day/next');
  return response.data;
}

export async function fetchLatestAnswer(): Promise<{ latestAnswer: string | null }> {
  console.log('[apiClient] Fetching latest answer from:', `${API_BASE_URL}/get-latest-answer`);
  const response = await apiClient.get('/get-latest-answer');
  return response.data;
}