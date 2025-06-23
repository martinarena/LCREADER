import React, { useState } from "react";

function App() {
  const [instructionFile, setInstructionFile] = useState(null);
  const [draftFile, setDraftFile] = useState(null);
  const [results, setResults] = useState([]);
  const [fields, setFields] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const PASSWORD = "Frey123";
  const BACKEND_URL = "https://77a78304-e5dc-4c57-a153-2a61642f0862-00-1mqxmta06stx0.riker.replit.dev"; // ✅ update if changed

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
      const response = await fetch(`${BACKEND_URL}/api/compare`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Received data:", data);
      setResults(data.results || []);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while comparing documents.");
    } finally {
      setLoading(false);
    }
  };

  const handleExtractFields = async () => {
    if (!instructionFile) {
      alert("Please upload the instruction file first.");
      return;
    }

    const formData = new FormData();
    formData.append("instruction", instructionFile);

    try {
      const response = await fetch(`${BACKEND_URL}/api/fields`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("🔎 Extracted fields:", data);
      setFields(data.fields || {});
    } catch (error) {
      console.error("Field extraction error:", error);
      alert("An error occurred while extracting fields.");
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

      <button onClick={handleExtractFields} style={{ marginLeft: "1rem" }}>
        Extract Instruction Fields
      </button>

      {fields && (
        <div style={{ marginTop: "2rem" }}>
          <h4>📋 Instruction Fields</h4>
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Field Code</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(fields).map(([code, value]) => (
                <tr key={code}>
                  <td>{code}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
