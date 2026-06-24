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
      setRoast(data.roast);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4 py-10">

      <h1 className="text-5xl font-bold text-orange-500 mb-2">
        🔥 Roast My Resume
      </h1>

      <p className="text-gray-400 text-xl mb-8">
        Paste your resume and get brutal honest AI feedback
      </p>

      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-2xl p-6">

        <textarea
          className="w-full h-48 bg-gray-800 text-white rounded-xl p-4 text-base resize-none outline-none border border-gray-700 focus:border-orange-500 transition"
          placeholder="Paste your resume here..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <div className="mt-3 flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
          <span className="text-gray-400 text-sm">
            {resume ? "File loaded ✅" : "Upload your resume (.txt)"}
          </span>
          <label className="cursor-pointer">
            <div className="bg-orange-500 hover:bg-orange-600 transition p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <input
              type="file"
              accept=".txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  setResume(event.target.result);
                };
                reader.readAsText(file);
              }}
            />
          </label>
        </div>

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
            <h3 className="text-orange-500 font-bold text-lg mb-2">
              Here is your roast 🔥
            </h3>
            <p className="text-gray-300 leading-relaxed">{roast}</p>
          </div>
        )}

      </div>

      <p className="mt-6 text-gray-600 text-sm">
        Built with React + Claude AI
      </p>

    </div>
  );
}

export default App;