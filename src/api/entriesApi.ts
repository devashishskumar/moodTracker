import axios from 'axios';

const API_URL = 'http://localhost:4000/api/entries';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getEntries = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeaders() });
  return res.data;
};

export const getEntriesByDate = async (date: string) => {
  const res = await axios.get(API_URL, { 
    params: { date },
    headers: getAuthHeaders()
  });
  return res.data;
};

export const addEntry = async (entry: any) => {
  const res = await axios.post(API_URL, entry, { headers: getAuthHeaders() });
  return res.data;
};

export const updateEntry = async (id: string, updates: any) => {
  const res = await axios.put(`${API_URL}/${id}`, updates, { headers: getAuthHeaders() });
  return res.data;
};

export const deleteEntry = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  return res.data;
};