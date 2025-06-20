import React, { useState } from "react";

function App() {
  const [instructionFile, setInstructionFile] = useState(null);
  const [draftFile, setDraftFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const PASSWORD = "Frey123"; // 🔑 change this to your chosen password

  const handleLogin = () => {
    if (password === PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password.");
    }
  };

  const handleCompare = async () => {
    if (!instructionFile || !draftFile) {
      alert("Please upload both files.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("instruction", instructionFile);
    formData.append("draft", draftFile);

    try {
      const response = await fetch("https://77a78304-e5dc-4c57-a153-2a61642f0862-00-1mqxmta06stx0.riker.replit.dev/api/compare", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResults(data.results || []);
      console.log("Received data:", data);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while comparing documents.");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>🔒 Enter Password</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} style={{ marginLeft: "0.5rem" }}>
          Unlock
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>LC Comparator</h2>

      <div>
        <label>
          Upload Instruction:
          <input type="file" onChange={(e) => setInstructionFile(e.target.files[0])} />
        </label>
      </div>

      <div>
        <label>
          Upload Draft:
          <input type="file" onChange={(e) => setDraftFile(e.target.files[0])} />
        </label>
      </div>

      <button onClick={handleCompare} disabled={loading}>
        {loading ? "Comparing..." : "Compare"}
      </button>

      {results.length > 0 && (
        <table border="1" cellPadding="8" style={{ marginTop: "2rem" }}>
          <thead>
            <tr>
              <th>Field</th>
              <th>Instruction</th>
              <th>Draft</th>
              <th>Match</th>
              <th>Confidence</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <tr key={index}>
                <td>{item.field}</td>
                <td>{item.instruction_value}</td>
                <td>{item.draft_value}</td>
                <td style={{ textAlign: "center" }}>{item.match ? "✅" : "❌"}</td>
                <td style={{ textAlign: "center" }}>{item.confidence}</td>
                <td>{item.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
