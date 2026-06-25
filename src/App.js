import { useState } from "react";

function App() {
  const [resume, setResume] = useState("");
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoast = async () => {
    if (!resume) {
      setError("Please paste your resume or upload a file first!");
      return;
    }
    setError("");
    setLoading(true);
    setRoast("");

    try {
      const response = await fetch("/.netlify/functions/roast", {
        method: "POST",
        body: JSON.stringify({ resume })
      });
      const data = await response.json();
      setRoast(data.roast || data.error || "No response received");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };
const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = btoa(
          new Uint8Array(event.target.result)
            .reduce((data, byte) => data + String.fromCharCode(byte), "")
        );
        setResume(`PDF:${base64}`);
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResume(event.target.result);
      };
      reader.readAsText(file);
    }
  };
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4 py-10">

      <h1 className="text-3xl md:text-5xl font-bold text-orange-500 mb-2 text-center">
        🔥 Roast My Resume
      </h1>

      <p className="text-gray-400 text-base md:text-xl mb-2 text-center px-2">
        Paste your resume and get brutal honest AI feedback
      </p>

      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-5 mt-4">

        <textarea
          className="w-full h-44 bg-gray-800 text-white rounded-xl p-4 text-base resize-none outline-none border border-gray-700 focus:border-orange-500 transition"
          placeholder="Paste your resume text here..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <div className="mt-3 flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
          <span className="text-gray-400 text-sm">
            {resume ? "File loaded ✅" : "Or upload resume (.txt or .pdf)"}
          </span>
          <label className="cursor-pointer">
            <div className="bg-orange-500 hover:bg-orange-600 transition p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <input
              type="file"
              accept=".txt,.pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        <p className="text-gray-600 text-xs mt-2 text-center">
          ⚠️ Do not upload resumes with sensitive info like ID numbers or bank details.
        </p>

        {error && (
          <div className="mt-3 bg-red-900 border border-red-500 rounded-xl px-4 py-3">
            <p className="text-red-400 text-base font-semibold">{error}</p>
          </div>
        )}

        <button
          className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition text-lg"
          onClick={handleRoast}
        >
          {loading ? "Roasting... 🔥" : "Roast It 🔥"}
        </button>

        {roast && (
          <div className="mt-6 bg-gray-800 border border-orange-500 rounded-xl p-4">
            <h3 className="text-orange-500 font-bold text-lg mb-3">
              Here is your roast 🔥
            </h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
              {roast}
            </p>
          </div>
        )}

      </div>

      <p className="mt-6 text-gray-500 text-sm tracking-wide">
        Roast My Resume · Powered by AI · Built by Hina
      </p>

    </div>
  );
}

export default App;