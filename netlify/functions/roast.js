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
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: `You are a brutally honest senior developer. Roast this resume in a funny but helpful way. Point out weaknesses, missing things, and give real advice. Resume: ${resume}`
          }
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