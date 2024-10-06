import  { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './styles.css';
import getSessionId from './utils/helper';
import ChatHistoryItem from './types/ChatHistory';

const socket = io('http://localhost:3002', {
  autoConnect: false,
});
const sessionId = getSessionId();

const App = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    socket.connect();
    socket.emit('registerSession', { sessionId });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('newQuestion', (question) => {
      addMessage(`Chatbot: ${question}`);
    });

    socket.on('chatHistory', (history: ChatHistoryItem[]) => {
      setMessages([]);
      console.log('chatHistory', history);
      history.forEach(({ question, answer }) => {
        addMessage(`Chatbot: ${question}`);
        if (answer) addMessage(`You: ${answer}`);
      });
    });

    return () => {
      socket.off('connect');
      socket.off('newQuestion');
      socket.off('chatHistory');
    };
  }, []);


  const addMessage = (message: string) => setMessages((m) => [...m, message]);

  const handleSend = () => {
    if (userInput.trim()) {
      addMessage(`You: ${userInput}`);
      socket.emit('userAnswer', { sessionId, answer: userInput });
      setUserInput('');
    }
  };

  const handleClear = () => {
    socket.emit('clearHistory', { sessionId });
    setMessages([]);
  };

  console.log('messages', messages);
  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg:string, index) =>
          msg.includes('Chatbot') ? (
            <div key={index} className="chatbot-message">
              {msg}
            </div>
          ) : (
            <div key={index} className="user-message">
              {msg}
            </div>
          )
        )}
      </div>
      <div>
        <input
          type="text"
          value={userInput}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your answer..."
        />
        <button className="send-btn" onClick={handleSend}>
          Send
        </button>
        <button className="clear-btn" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default App;
