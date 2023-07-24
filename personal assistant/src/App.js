
import React, { useEffect, useState } from 'react';
import './style.css';

function App() {
  const [isFirstMessage, setIsFirstMessage] = useState(true);

  useEffect(() => {
    document.getElementById('user-input').addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        sendMessage();
      }
    });

    document.getElementById('user-input').addEventListener('input', function (event) {
      const userInput = event.target.value;
      // You can perform any real-time processing on the user input here if needed.
    });
  }, []);

  async function appendMessage(sender, message, isUser = false) {
    const chatLog = document.getElementById('chat-log');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isUser ? 'user' : 'bot');
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  async function botResponse(userInput) {
    try {
      const response = await fetch('http://127.0.0.1:5000/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: userInput }),
        // body: userInput 
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return 'Oops, something went wrong. Please try again.';
    }
  }

  async function processUserInput(userInput) {
    try {
      const botReply = await botResponse(userInput);
      appendMessage('Assistant', botReply);
    } catch (error) {
      console.error('Error processing user input:', error);
    }
  }

  function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() !== '') {
      appendMessage('You', userInput, true);
      processUserInput(userInput);
      document.getElementById('user-input').value = '';
    }
  }

  function startSpeechToText() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Speech recognition started...');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('user-input').value = transcript;
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended.');
    };

    recognition.start();
  }

  function handleInputClick() {
    if (isFirstMessage) {
      setIsFirstMessage(false);
      const greetingMessage = "Hi! Welcome, How can I assist you today?";
      appendMessage('Assistant', greetingMessage);
      processUserInput(greetingMessage);
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Personal Assistant</h2>
      </div>
      <div className="chat-log" id="chat-log">
        {/* Chat messages will be displayed here */}
      </div>
      <div className="user-input">
        <input type="text" id="user-input" placeholder="Type your message..." onClick={handleInputClick} />
        <button onClick={sendMessage} className="enter-button">
          <i className="fa fa-paper-plane" aria-hidden="true"></i>
        </button>
        <button id="speech-to-text-btn" onClick={startSpeechToText} className="speech-button">
          <i className="fa fa-microphone" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
}

export default App;