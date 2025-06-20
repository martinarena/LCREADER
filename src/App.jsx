import React, { useState } from "react";

function App() {
  const [instructionFile, setInstructionFile] = useState(null);
  const [draftFile, setDraftFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    console.log("Compare button clicked");

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

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned unexpected response (not JSON).");
      }

      const data = await response.json();
      console.log("Received data:", data);
      setResults(data.results || []);
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while comparing documents.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>LC Comparator</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Upload Instruction:
          <input
            type="file"
            onChange={(e) => setInstructionFile(e.target.files[0])}
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Upload Draft:
          <input
            type="file"
            onChange={(e) => setDraftFile(e.target.files[0])}
          />
        </label>
      </div>

      <button onClick={handleCompare} disabled={loading}>
        {loading ? "Comparing..." : "Compare"}
      </button>

      {results.length > 0 && (
        <table border="1" cellPadding="8" style={{ marginTop: "2rem", width: "100%" }}>
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
            {results.map((r, i) => (
              <tr key={i}>
                <td>{r.field}</td>
                <td>{r.instruction_value}</td>
                <td>{r.draft_value}</td>
                <td>{r.match ? "✅" : "❌"}</td>
                <td>{r.confidence}</td>
                <td>{r.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
