import axios from 'axios';

const YOUTUBE_API_URL = 'https://youtube-search-and-download.p.rapidapi.com/search';
const API_KEY = '7b5318c0b2msh9f2be9eda9d7755p160a30jsnd4fd2413b7d6';

export const fetchVideos = async (query) => {
  try {
    const response = await axios.get(YOUTUBE_API_URL, {
      headers: {
        'x-rapidapi-host': 'youtube-search-and-download.p.rapidapi.com',
        'x-rapidapi-key': API_KEY,
      },
      params: {
        query,
        type: 'v',
        maxResults: 5,
      },
    });

    return response.data.contents.map(item => ({
      title: item.video.title,
      videoId: item.video.videoId
    }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};