const apiKey = '17e03eec5b04e7a493e233ac2f834848';

export const fetchWeather = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error fetching weather data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};