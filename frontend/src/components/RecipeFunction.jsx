import React, { useState } from 'react';
import { fetchRecipes } from '../api/recipeApi';

export default function RecipeFunction({ setMessages, setCurrentFunction }) {
  const [mode, setMode] = useState('select');
  const [ingredients, setIngredients] = useState('');

  const handleModeSelect = (selectedMode) => {
    if (selectedMode === '3') {
      setCurrentFunction(null);
      return;
    }
    setMode(selectedMode);
    setMessages(prev => [...prev, { from: 'bot', text: selectedMode === '1' ? 'Enter the ingredients:' : 'Name the Recipe:' }]);
  };

  const handleSubmit = async () => {
    try {
      const recipes = await fetchRecipes(mode === '1' ? ingredients : 'recipe ' + ingredients);
      if (recipes && recipes.hits && recipes.hits.length > 0) {
        const recipeList = recipes.hits.map(hit => hit.recipe.label).join(', ');
        setMessages(prev => [...prev, { from: 'bot', text: `Here are some recipes: ${recipeList}` }]);
      } else {
        setMessages(prev => [...prev, { from: 'bot', text: 'No recipes found. Please try again.' }]);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setMessages(prev => [...prev, { from: 'bot', text: 'Error fetching recipes. Please try again.' }]);
    }
    setMode('select');
    setIngredients('');
  };

  if (mode === 'select') {
    return (
      <div>
        <button onClick={() => handleModeSelect('1')}>1. Suggest a Recipe</button>
        <button onClick={() => handleModeSelect('2')}>2. General Recipe Chatbot</button>
        <button onClick={() => handleModeSelect('3')}>3. Exit</button>
      </div>
    );
  }

  return (
    <div>
      <input
        type="text"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder={mode === '1' ? "Enter ingredients" : "Enter recipe name"}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}