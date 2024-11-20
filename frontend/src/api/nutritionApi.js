import axios from 'axios';

const API_URL = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
const API_KEY = '60f0736abdb11bb951bdeb4cf660a8a6';
const API_ID = '355ea952';

export const fetchNutrition = async (food) => {
  try {
    const response = await axios.post(
      API_URL,
      { query: food },
      {
        headers: {
          'x-app-id': API_ID,
          'x-app-key': API_KEY,
        },
      }
    );

    if (response.data.foods && response.data.foods.length > 0) {
      const foodInfo = response.data.foods[0];
      return {
        calories: foodInfo.nf_calories,
        protein: foodInfo.nf_protein,
        carbs: foodInfo.nf_total_carbohydrate,
        fat: foodInfo.nf_total_fat,
      };
    } else {
      throw new Error('No food information found');
    }
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    throw error;
  }
};