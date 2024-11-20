import React, { useState } from 'react';
import { fetchWikipedia } from '../api/wikipediaApi';

export default function WikipediaFunction({ setMessages, setCurrentFunction }) {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = async () => {
    try {
      const content = await fetchWikipedia(keyword);
      if (content === "Sorry, I couldn't find that information.") {
        // If Wikipedia doesn't have the information, use Google AI
        const response = await fetch('http://localhost:5000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: keyword }),
        });
        const data = await response.json();
        setMessages(prev => [...prev, { from: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { from: 'bot', text: content }]);
      }
    } catch (error) {
      console.error('Error fetching Wikipedia data:', error);
      setMessages(prev => [...prev, { from: 'bot', text: 'Error fetching data. Please try again.' }]);
    }
    setCurrentFunction(null);
  };

  return (
    <div>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Enter keyword for Wikipedia search"
      />
      <button onClick={handleSubmit}>Search</button>
      <button onClick={() => setCurrentFunction(null)}>Exit</button>
    </div>
  );
}