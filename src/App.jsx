import axios from "axios";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  FaGithub,
  FaInstagram,
  FaMailBulk,
  FaRegCopyright,
} from "react-icons/fa";
import { motion } from "framer-motion";

import "./style.css";
import { FaLinkedin } from "react-icons/fa6";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateAns = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setMessages([...messages, { text: question, type: "user" }]);
    setQuestion("");

    try {
      const apiUrl = import.meta.env.VITE_GEMINAI_API;
      const response = await axios.post(apiUrl, {
        contents: [{ parts: [{ text: question }] }],
      });
      const answer = response.data.candidates[0].content.parts[0].text;

      setMessages((prev) => [...prev, { text: answer, type: "bot" }]);
    } catch (err) {
      setError("Failed to generate answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="chat-container">
        <h1>TATTVABOT</h1>

        <div className="chat-box">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className={`message ${msg.type}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.type === "bot" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </motion.div>
          ))}
          {loading && <div className="message bot">Typing...</div>}
        </div>

        <div className="input-container">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything..."
          />
          <motion.button
            onClick={generateAns}
            disabled={loading}
            whileTap={{ scale: 0.9 }}
          >
            Send
          </motion.button>
        </div>

        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="social-icons">
        <a href="https://www.instagram.com/akshay.45__/" target="_blank">
          <FaInstagram className="icons" />
        </a>
        <a href="https://github.com/akshaykocharekar" target="_blank">
          <FaGithub className="icons" />
        </a>
        <a
          href="https://www.linkedin.com/in/akshay-kocharekar-859829321"
          target="_blank"
        >
          <FaLinkedin className="icons" />
        </a>
      </div>
    </>
  );
};

export default App;
