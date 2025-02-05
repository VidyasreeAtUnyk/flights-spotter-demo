import axios from 'axios';

const API_KEY = 'eHPoMGs4AymshlJM1LIFnv2JCHhMp1COW3wjsnkARlTpEOmVTt';
const BASE_URL = 'https://sky-scrapper.p.rapidapi.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
  },
});

export const getData = async (endpoint, params) => {
    try {
      const response = await apiClient.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
};