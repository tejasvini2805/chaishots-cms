import axios from 'axios';

// Connect to our backend running on port 3000
export const api = axios.create({
  baseURL: 'http://localhost:3000', 
});

// Helper to make dates look nice
export const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString();
};