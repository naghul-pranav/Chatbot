import React, { useState, useEffect, useRef } from 'react';
import RecipeFunction from './RecipeFunction';
import WeatherFunction from './WeatherFunction';
import FitnessFunction from './FitnessFunction';
import WikipediaFunction from './WikipediaFunction';
import './Chat.css';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentFunction, setCurrentFunction] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    if (input.toLowerCase().includes('recipe') || input.toLowerCase().includes('cook')) {
      setCurrentFunction('recipe');
    } else if (input.toLowerCase().includes('weather') || input.toLowerCase().includes('climate')) {
      setCurrentFunction('weather');
    } else if (input.toLowerCase().includes('fitness') || input.toLowerCase().includes('exercise')) {
      setCurrentFunction('fitness');
    } else if (input.toLowerCase().includes('wikipedia')) {
      setCurrentFunction('wikipedia');
    } else {
      try {
        const response = await fetch('http://localhost:5000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input }),
        });
        const data = await response.json();
        setMessages(prevMessages => [...prevMessages, { from: 'bot', text: data.reply }]);
      } catch (error) {
        console.error('Error:', error);
        setMessages(prevMessages => [...prevMessages, { from: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
      }
    }
  };

  return (
    <div className="chat-container">
      <h1>Chatbot</h1>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.from}`}>
            <p>{msg.text}</p>
            {msg.content && (
              <div className="message-content">
                {React.isValidElement(msg.content) ? msg.content : JSON.stringify(msg.content)}
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="chat-text-input"
        />
        <button onClick={handleSend} className="chat-send-button">Send</button>
      </div>
      {currentFunction === 'recipe' && <RecipeFunction setMessages={setMessages} setCurrentFunction={setCurrentFunction} />}
      {currentFunction === 'weather' && <WeatherFunction setMessages={setMessages} setCurrentFunction={setCurrentFunction} />}
      {currentFunction === 'fitness' && <FitnessFunction setMessages={setMessages} setCurrentFunction={setCurrentFunction} />}
      {currentFunction === 'wikipedia' && <WikipediaFunction setMessages={setMessages} setCurrentFunction={setCurrentFunction} />}
    </div>
  );
}