import axios from 'axios';

const API_URL = 'https://exercisedb.p.rapidapi.com/exercises';
const API_KEY = '1ff9fcb189msh69de090303e204dp191defjsn62cb0f9c8cc3'; 

export const fetchExercises = async (limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}?limit=${limit}`, {
      headers: {
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
        'x-rapidapi-key': API_KEY,
      },
    });
    return response.data.map(exercise => ({
      name: exercise.name,
      gifUrl: exercise.gifUrl
    }));
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error; 
  }
};