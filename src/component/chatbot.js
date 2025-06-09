import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! Ask me anything.' }
    ]);
    const [input, setInput] = useState('');
    const [editIndex, setEditIndex] = useState(null); // Track message being edited

    const sendMessage = async () => {
        if (!input.trim()) return;

        let updatedMessages = [...messages];

        // If editing a message
        if (editIndex !== null) {
            updatedMessages[editIndex] = { sender: 'user', text: input };
            setEditIndex(null);
        } else {
            updatedMessages.push({ sender: 'user', text: input });
        }

        setMessages(updatedMessages);
        setInput('');

        try {
            const res = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input })
            });
            const data = await res.json();

            setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Server error.' }]);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <span>{msg.text}</span>
                        {msg.sender === 'user' && (
                            <button
                                className="edit-button"
                                onClick={() => {
                                    setInput(msg.text);
                                    setEditIndex(index);
                                }}
                            >
                                ✏️ Edit
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage}>
                    {editIndex !== null ? "Update" : "Send"}
                </button>
            </div>
        </div>
    );
};

export default ChatBot;
