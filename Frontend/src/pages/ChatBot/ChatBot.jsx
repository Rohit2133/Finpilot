import React, { useState } from "react";
import "./Chatbot.css";
import { askFinPilot } from "../../api/backend";

const Assistant = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setShowOutput(true);

    const aiResponse = await askFinPilot(query);
    setResponse(aiResponse);

    setQuery("");
    setLoading(false);
  };

  return (
    <div className="assistant-container">
      <h2>Your Financial Consultant</h2>
      <p>Ask your financial questions or record your voice query.</p>

      {/* Input */}
      <form className="assistant-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your query here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Submit</button>
        <button type="button" className="mic-btn">🎤</button>
      </form>

      {/* Output */}
      {showOutput && (
        <div className="assistant-output">
          <h3>Assistant’s Response</h3>

          <div className="assistant-response-box">
            {loading ? (
              <p><i>Thinking...</i></p>
            ) : (
              <div
                className="assistant-text"
                dangerouslySetInnerHTML={{
                  __html: response
                    .replace(/\n\n/g, "<br/><br/>")
                    .replace(/\n/g, "<br/>")
                }}
              ></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Assistant;
