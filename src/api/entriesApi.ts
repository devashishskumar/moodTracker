import axios from 'axios';

const API_URL = 'http://localhost:4000/api/entries';

export const getEntries = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getEntriesByDate = async (date: string) => {
  const res = await axios.get(API_URL, { params: { date } });
  return res.data;
};

export const addEntry = async (entry: any) => {
  const res = await axios.post(API_URL, entry);
  return res.data;
};

export const updateEntry = async (id: string, updates: any) => {
  const res = await axios.put(`${API_URL}/${id}`, updates);
  return res.data;
};

export const deleteEntry = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};