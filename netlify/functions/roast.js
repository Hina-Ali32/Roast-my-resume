exports.handler = async (event) => {
  try {
    const { resume } = JSON.parse(event.body);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
           content: `You are a brutally honest senior developer reviewing a resume. Give feedback in exactly this format:

🔥 ROAST (3 brutal funny points about what's wrong)
💡 REAL ADVICE (3 specific actionable things to fix)
⭐ VERDICT (one punchy sentence summary)

Be specific, funny, and honest. No long paragraphs. Resume: ${resume}`
        ]
      })
    });

    const data = await response.json();
    console.log("Groq response:", JSON.stringify(data));

    const roast = data?.choices?.[0]?.message?.content || JSON.stringify(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ roast })
    };

  } catch (error) {
    console.log("Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};