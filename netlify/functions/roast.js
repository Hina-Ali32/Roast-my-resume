exports.handler = async (event) => {
  try {
    let { resume } = JSON.parse(event.body);

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
           content: `You are a senior software engineer and tech hiring manager at a top company with 15 years of experience hiring and rejecting thousands of candidates. You are known for giving the most brutally honest and genuinely helpful resume feedback in the industry.

Analyze this resume carefully and respond in EXACTLY this format — no extra text, no introduction, no preamble:

🔥 ROAST:
- [Pick the single biggest red flag that would get this resume rejected in 10 seconds]
- [Call out any generic buzzwords, empty claims, or anything that every other candidate also writes]
- [Point out what is completely missing that companies actually look for]

💡 REAL ADVICE:
- [Rewrite their summary section — give them an exact example of how it should sound]
- [Tell them exactly what to add to their projects section to make it impressive — numbers, impact, results]
- [Tell them one skill or certification they should add RIGHT NOW based on what you see in their resume]

⚠️ WATCH OUT:
- [One common mistake they are making that most candidates never realize until they get rejected]
- [Tell them what a recruiter thinks in the first 10 seconds of seeing this resume]

⭐ VERDICT:
[Be direct — would you interview this person or not, what is their biggest strength, and what is the ONE thing they must fix before applying anywhere]

Rules: Every bullet must be specific to THIS resume, not generic advice. Maximum 2 to 3 sentences per point. Be harsh but genuinely helpful — your goal is to help them get hired. Resume: ${resume}`
        ]
      })
    });

    const data = await response.json();
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