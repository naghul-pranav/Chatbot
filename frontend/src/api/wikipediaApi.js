import axios from 'axios';

export const fetchWikipedia = async (keyword) => {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&explaintext=true&titles=${encodeURIComponent(keyword)}&origin=*`;

  try {
    const response = await axios.get(url);
    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const content = pages[pageId].extract;

    if (content) {
      return content;
    } else {
      return "Sorry, I couldn't find that information.";
    }
  } catch (error) {
    console.error('Error fetching Wikipedia data:', error);
    throw error;
  }
};