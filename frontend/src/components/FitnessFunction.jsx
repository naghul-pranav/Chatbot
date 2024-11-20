import React, { useState } from 'react';
import { fetchExercises } from '../api/exerciseApi';
import { fetchVideos } from '../api/videoApi';
import { fetchNutrition } from '../api/nutritionApi';

export default function FitnessFunction({ setMessages, setCurrentFunction }) {
  const [mode, setMode] = useState('select');
  const [input, setInput] = useState('');

  const handleModeSelect = (selectedMode) => {
    if (selectedMode === '4') {
      setCurrentFunction(null);
      return;
    }
    setMode(selectedMode);
    setMessages(prev => [...prev, { 
      from: 'bot', 
      text: selectedMode === '1' ? 'Displaying exercises...' : 
            selectedMode === '2' ? 'Enter keywords for searching the required video:' :
            'Enter name of the food:'
    }]);
  };

  const handleSubmit = async () => {
    try {
      if (mode === '1') {
        const exercises = await fetchExercises();
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: 'Here are some exercises:',
          content: (
            <div className="exercise-list">
              {exercises.map((exercise, index) => (
                <div key={index} className="exercise-item">
                  <h3>{exercise.name}</h3>
                  <img src={exercise.gifUrl} alt={exercise.name} className="exercise-gif" />
                </div>
              ))}
            </div>
          )
        }]);
      } else if (mode === '2') {
        const videos = await fetchVideos(input);
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: 'Here are some fitness videos:',
          content: (
            <div className="video-list">
              {videos.map((video, index) => (
                <div key={index} className="video-item">
                  <h3>{video.title}</h3>
                  <iframe
                    width="280"
                    height="157"
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          )
        }]);
      } else if (mode === '3') {
        const nutrition = await fetchNutrition(input);
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: `Nutrition info for ${input}:`,
          content: (
            <div className="nutrition-info">
              <p>Calories: {nutrition.calories} kcal</p>
              <p>Protein: {nutrition.protein}g</p>
              <p>Carbs: {nutrition.carbs}g</p>
              <p>Fat: {nutrition.fat}g</p>
            </div>
          )
        }]);
      }
    } catch (error) {
      console.error('Error in fitness function:', error);
      setMessages(prev => [...prev, { from: 'bot', text: 'Error fetching fitness data. Please try again.' }]);
    }
    setMode('select');
    setInput('');
  };

  if (mode === 'select') {
    return (
      <div className="fitness-options">
        <button onClick={() => handleModeSelect('1')} className="fitness-option">1. Display Exercises Visually</button>
        <button onClick={() => handleModeSelect('2')} className="fitness-option">2. Fetch Youtube Video for Fitness</button>
        <button onClick={() => handleModeSelect('3')} className="fitness-option">3. Nutrient Proportion of Food</button>
        <button onClick={() => handleModeSelect('4')} className="fitness-option">4. Exit</button>
      </div>
    );
  }

  return (
    <div className="fitness-input">
      {mode !== '1' && (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === '2' ? "Enter video keywords" : "Enter food name"}
          className="fitness-text-input"
        />
      )}
      <button onClick={handleSubmit} className="fitness-submit">Submit</button>
    </div>
  );
}